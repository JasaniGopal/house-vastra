import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    // 1. Verify the user is a VENDOR or ADMIN
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
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

    // 4. Create the uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", "outfits");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err: any) {
      if (err.code !== "EEXIST") throw err;
    }

    // 5. Generate a unique, safe filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Extract extension (e.g., .jpg, .png)
    const ext = path.extname(file.name) || ".jpg";
    const filename = `outfit-${uniqueSuffix}${ext}`;
    
    // 6. Save the file to the disk
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // 7. Return the public URL path
    const fileUrl = `/uploads/outfits/${filename}`;
    
    return NextResponse.json({ url: fileUrl });

  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Failed to process the upload on the server." },
      { status: 500 }
    );
  }
}
