import type { RxDocument } from "rxdb";
import { initDB, type ImageDocType } from "../db/rxdb";
import { nanoid } from "nanoid";

export async function addImage(
  userId: string,
  name: string,
  imageData: string
): Promise<ImageDocType> {
  const db = await initDB();

  const newImage: ImageDocType = {
    id: nanoid(),
    userId,
    name,
    imageData,
    createdAt: new Date().toISOString(),
  };

  await db.images.insert(newImage);
  return newImage;
}

export async function getImagesByUser(
  userId: string
): Promise<RxDocument<ImageDocType>[]> {
  const db = await initDB();

  const images = await db.images
    .find({
      selector: { userId },
      sort: [{ createdAt: "desc" }],
    })
    .exec();

  return images;
}

export async function deleteImage(imageId: string): Promise<void> {
  const db = await initDB();

  const image = await db.images.findOne({ selector: { id: imageId } }).exec();
  if (image) {
    await image.remove();
  }
}
