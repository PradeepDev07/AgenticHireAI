import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

function fileFilter(req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowed = [".pdf", ".txt"];
  if (!allowed.includes(extension)) {
    return cb(new Error("Only PDF and TXT resumes are allowed"));
  }
  cb(null, true);
}

export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
