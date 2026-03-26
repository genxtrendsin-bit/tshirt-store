import multer from "multer";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuidv4 } from "uuid";

/* MULTER MEMORY STORAGE */

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

/* IMAGE UPLOAD WITH SHARP OPTIMIZATION */

export const uploadImage = async (file) => {

  try {

    /* COMPRESS IMAGE */

    const optimizedBuffer = await sharp(file.buffer)
      .resize(1200)
      .jpeg({
        quality: 80,
        progressive: true
      })
      .toBuffer();

    return new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tshirt-store",
          public_id: uuidv4(),
          resource_type: "image"
        },
        (error, result) => {

          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }

        }
      );

      stream.end(optimizedBuffer);

    });

  } catch (error) {

    throw new Error("Image processing failed");

  }

};

export default upload;