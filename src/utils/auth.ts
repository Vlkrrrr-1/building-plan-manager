import { STORAGE_KEYS } from "../constants/storage";

export function getCurrentUserId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.currentUserId);
}

export function requireUserId(): string {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");
  return userId;
}

export function setCurrentUserId(userId: string): void {
  localStorage.setItem(STORAGE_KEYS.currentUserId, userId);
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.currentUserId);
}
