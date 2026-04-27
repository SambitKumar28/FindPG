import multer from "multer";

const storage = multer.memoryStorage(); // 🔥 store in buffer

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;