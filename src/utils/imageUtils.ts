import type { ImageDocType } from "../db/rxdb";
import { getImagesByUser } from "../services/imageService";

export async function fetchUserImages(userId: string): Promise<ImageDocType[]> {
  const imagesFromDB = await getImagesByUser(userId);
  return imagesFromDB.map((i) => i.toJSON() as ImageDocType);
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
