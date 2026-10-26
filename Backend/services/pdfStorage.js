import fs from "fs/promises";
import path from "path";
import ImageKit from "imagekit";

const isVercel = Boolean(process.env.VERCEL);
let imageKit;

const getImageKit = () => {
  const { IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT } = process.env;
  if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
    const error = new Error(
      "PDF storage is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.",
    );
    error.code = "IMAGEKIT_CONFIG_MISSING";
    throw error;
  }

  if (!imageKit) {
    imageKit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    });
  }
  return imageKit;
};

export const savePdf = async (file) => {
  if (!isVercel) {
    return {
      url: `/uploads/grades/${file.filename}`,
      fileId: null,
    };
  }

  const uploaded = await getImageKit().upload({
    file: file.buffer.toString("base64"),
    fileName: file.originalname,
    folder: "/superteacher/grades",
    useUniqueFileName: true,
  });

  return { url: uploaded.url, fileId: uploaded.fileId };
};

export const removePdf = async (pdf) => {
  if (!pdf?.url) return;

  if (pdf.fileId) {
    await getImageKit().deleteFile(pdf.fileId);
    return;
  }

  if (!isVercel && pdf.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), pdf.url.slice(1));
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
};
