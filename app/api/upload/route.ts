import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config is automatically picked up from process.env.CLOUDINARY_URL
cloudinary.config({
  secure: true
});

export async function POST(req: Request) {
  try {
    // 1. Verify the user is logged in (Customers, Vendors, and Admins can upload)
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

    // 4. Upload to Cloudinary using a stream
    const folderName = session.user.role === "CUSTOMER" ? 'rent-vastra-reviews' : 'rent-vastra-outfits';
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // End the stream with the buffer
      uploadStream.end(buffer);
    });

    // 5. Return the secure URL from Cloudinary
    return NextResponse.json({ url: uploadResult.secure_url });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to process the upload to Cloudinary." },
      { status: 500 }
    );
  }
}
