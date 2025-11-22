import { nanoid } from "nanoid";
import { initDB, type UserDocType } from "../db/rxdb";

export async function loginByName(name: string): Promise<UserDocType> {
  const database = await initDB();

  const existingDoc = await database.users
    .findOne({
      selector: { name },
    })
    .exec();

  if (existingDoc) {
    return existingDoc.toJSON() as UserDocType;
  }

  const newUser: UserDocType = {
    id: nanoid(),
    name,
    createdAt: new Date().toISOString(),
  };

  await database.users.insert(newUser);
  return newUser;
}
