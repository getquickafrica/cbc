import { NextResponse } from "next/server";
import crypto from "crypto";
import B2 from "backblaze-b2";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get("pdf");
    const supportFile = formData.get("support");

    if (!pdfFile) {
      return NextResponse.json({ error: "No PDF provided" }, { status: 400 });
    }

    // Generate unique names
    const uniquePdfName = `${crypto.randomBytes(6).toString("hex")}.pdf`;
    const uniqueSupportName = supportFile
      ? `${crypto.randomBytes(6).toString("hex")}-${supportFile.name}`
      : null;

    // Convert files to buffers
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const supportBuffer = supportFile
      ? Buffer.from(await supportFile.arrayBuffer())
      : null;

    // Initialize Backblaze B2 client
    const b2 = new B2({
      applicationKeyId: process.env.BACKBLAZE_KEY_ID,
      applicationKey: process.env.BACKBLAZE_APP_KEY,
    });

    // Authorize and get upload URL
    await b2.authorize();
    const bucketId = process.env.BACKBLAZE_BUCKET_ID;
    const bucketName = process.env.BACKBLAZE_BUCKET;

    // Function to handle upload
    const uploadToB2 = async (buffer, fileName, mimeType) => {
      const { data: uploadData } = await b2.getUploadUrl({ bucketId });

      await b2.uploadFile({
        uploadUrl: uploadData.uploadUrl,
        uploadAuthToken: uploadData.authorizationToken,
        fileName,
        data: buffer,
        mime: mimeType,
      });
    };

    // Upload main PDF
    await uploadToB2(
      pdfBuffer,
      `uploaded_pdf/${uniquePdfName}`,
      "application/pdf"
    );

    // Upload support file (if any)
    if (supportBuffer) {
      await uploadToB2(
        supportBuffer,
        `support_material/${uniqueSupportName}`,
        supportFile.type || "application/octet-stream"
      );
    }

    return NextResponse.json({
      status: "success",
      pdf_name: uniquePdfName,
      support_name: uniqueSupportName,
      pdf_url: `https://f005.backblazeb2.com/file/${bucketName}/uploaded_pdf/${uniquePdfName}`,
      support_url: uniqueSupportName
        ? `https://f005.backblazeb2.com/file/${bucketName}/support_material/${uniqueSupportName}`
        : null,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
