import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  }
});

export async function POST(req: Request) {
  try {
    // 1. Verify the user is logged in
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // 3. Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Generate unique filename and setup S3 params
    const folderName = session.user.role === "CUSTOMER" ? 'rent-vastra-reviews' : 'rent-vastra-outfits';
    const extension = file.name.split('.').pop();
    const uniqueFileName = `${folderName}/${crypto.randomUUID()}-${Date.now()}.${extension}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME || "look-on-rent-images-934646501835";

    // 5. Upload to S3
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // 6. Return the secure URL from S3
    const secureUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${uniqueFileName}`;
    return NextResponse.json({ url: secureUrl });

  } catch (error: any) {
    console.error("S3 Upload Error:", error);
    return NextResponse.json(
      { error: `Failed to process the upload to AWS S3. Details: ${error.message}` },
      { status: 500 }
    );
  }
}
