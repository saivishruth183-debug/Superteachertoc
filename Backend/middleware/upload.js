import multer from "multer";
import path from "path";
import fs from "fs";

const pdfSizeLimit = 4 * 1024 * 1024;
const storage = process.env.VERCEL
  ? multer.memoryStorage()
  : (() => {
      const uploadDir = path.join(process.cwd(), "uploads", "grades");
      fs.mkdirSync(uploadDir, { recursive: true });

      return multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
          const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
          cb(null, `${Date.now()}-${safeName}`);
        },
      });
    })();

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    const error = new Error("Only PDF files are allowed");
    error.code = "INVALID_FILE_TYPE";
    return cb(error);
  }
  cb(null, true);
};

export const maxPdfSize = pdfSizeLimit;

export const uploadPdf = multer({
  storage,
  fileFilter,
  limits: { fileSize: pdfSizeLimit },
});