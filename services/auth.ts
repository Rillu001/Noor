import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import type { SQLiteDatabase } from "expo-sqlite";

const SESSION_KEY = "noor_session_user_id";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

async function hashPassword(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`
  );
}

async function generateSalt(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function getStoredSessionUserId(): Promise<number | null> {
  const value = await SecureStore.getItemAsync(SESSION_KEY);
  if (!value) return null;
  const id = parseInt(value, 10);
  return Number.isFinite(id) ? id : null;
}

async function setSession(userId: number): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, String(userId));
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function getUserById(
  db: SQLiteDatabase,
  id: number
): Promise<AuthUser | null> {
  return db.getFirstAsync<AuthUser>(
    "SELECT id, name, email, created_at FROM users WHERE id = ?",
    [id]
  );
}

export async function registerUser(
  db: SQLiteDatabase,
  name: string,
  email: string,
  password: string
): Promise<AuthUser> {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    throw new Error("Please enter your name.");
  }
  if (!trimmedEmail.includes("@")) {
    throw new Error("Please enter a valid email.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const existing = await db.getFirstAsync<{ id: number }>(
    "SELECT id FROM users WHERE email = ? COLLATE NOCASE",
    [trimmedEmail]
  );
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const salt = await generateSalt();
  const passwordHash = await hashPassword(password, salt);
  const createdAt = new Date().toISOString();

  const result = await db.runAsync(
    `INSERT INTO users (name, email, password_hash, salt, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [trimmedName, trimmedEmail, passwordHash, salt, createdAt]
  );

  const userId = result.lastInsertRowId;
  await setSession(userId);

  const user = await getUserById(db, userId);
  if (!user) {
    throw new Error("Could not create account. Please try again.");
  }
  return user;
}

export async function loginUser(
  db: SQLiteDatabase,
  email: string,
  password: string
): Promise<AuthUser> {
  const trimmedEmail = email.trim().toLowerCase();

  const row = await db.getFirstAsync<{
    id: number;
    name: string;
    email: string;
    created_at: string;
    password_hash: string;
    salt: string;
  }>(
    "SELECT id, name, email, created_at, password_hash, salt FROM users WHERE email = ? COLLATE NOCASE",
    [trimmedEmail]
  );

  if (!row) {
    throw new Error("No account found with this email.");
  }

  const passwordHash = await hashPassword(password, row.salt);
  if (passwordHash !== row.password_hash) {
    throw new Error("Incorrect password.");
  }

  await setSession(row.id);
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    created_at: row.created_at,
  };
}

export async function restoreSession(
  db: SQLiteDatabase
): Promise<AuthUser | null> {
  const userId = await getStoredSessionUserId();
  if (!userId) return null;
  const user = await getUserById(db, userId);
  if (!user) {
    await clearSession();
    return null;
  }
  return user;
}

export async function logoutUser(): Promise<void> {
  await clearSession();
}
