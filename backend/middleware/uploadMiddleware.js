const multer = require("multer");
const fs = require("fs");
const path = require("path");

const cloudinary = require("../config/cloudinary");

let storage;

if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET) {
  const { CloudinaryStorage } = require("multer-storage-cloudinary");

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "tiffin-foods",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
  });
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "..", "uploads");
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${Date.now()}-${safeName}`);
    },
  });
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"), false);
    }
  },
});

module.exports = upload;