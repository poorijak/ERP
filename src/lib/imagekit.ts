import Imagekit from "imagekit";
import sharp from "sharp";

const imagekit = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export const uploadToImagekit = async (file: File, label: string) => {
  try {
    // cheack file
    if (!file) {
      return {
        message: "No file provied",
      };
    }

    // cheack file size

    if (file.size > 5 * 1024 * 1024) {
      return {
        message: "File size exceeds 5MB limit",
      };
    }

    // Read File Butter
    const buffer = await file.arrayBuffer();

    const processedImageBuffer = await sharp(Buffer.from(buffer))
      .webp({
        quality: 80,
        lossless: false,
        effort: 4,
      })
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    const result = await imagekit.upload({
      file: processedImageBuffer,
      fileName: `${label}_${Date.now()}_${file.name}`, // product_110625_profile.jpg
      folder: `/${label}`, // /product
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    console.error("Error uploading image to imagekit ", error);
    return {
      message: "Fail to upload image",
    };
  }
};

export const deleteFromImageKit = async (FileId: string) => {
  try {
    if (!FileId) {
      return {
        message: "No file id",
      };
    }

    await imagekit.deleteFile(FileId);
  } catch (error) {
    console.error("Error deleting image from imagekit", error);
    return {
      message: "Failed to delete image",
    };
  }
};
