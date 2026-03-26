import multer from "multer";

const storage = multer.memoryStorage();

export const uploadAvatar = multer({ storage });