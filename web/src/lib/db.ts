import { createHash, randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { LEGAL_VERSIONS } from "./legal";
import { log } from "./logger";

export type Locale = "nl" | "fr" | "en";
export type Gender = "woman" | "man" | "other";
export type GenderSought = "women" | "men" | "everyone";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  gender: Gender;
  genderSought: GenderSought;
  dateOfBirth: string;
  locale: Locale;
  emailVerified: boolean;
  createdAt: string;
  firstName?: string;
};

export type ConsentRecord = {
  id: string;
  userId: string;
  termsVersion: string;
  privacyVersion: string;
  marketing: boolean;
  timestamp: string;
  ipHash: string | null;
  userAgentHash: string | null;
};

export type TokenRecord = {
  token: string;
  userId: string;
  type: "email_verify" | "password_reset";
  expiresAt: string;
  usedAt: string | null;
};

export type SessionRecord = {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: string;
  revokedAt: string | null;
};

type Store = {
  users: UserRecord[];
  consents: ConsentRecord[];
  tokens: TokenRecord[];
  sessions: SessionRecord[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

let memory: Store | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function emptyStore(): Store {
  return { users: [], consents: [], tokens: [], sessions: [] };
}

async function loadStore(): Promise<Store> {
  if (memory) return memory;
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    memory = JSON.parse(raw) as Store;
  } catch {
    memory = emptyStore();
  }
  return memory;
}

function persist(store: Store) {
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  });
  return writeQueue;
}

export function hashPii(value: string | null | undefined): string | null {
  if (!value) return null;
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | undefined> {
  const store = await loadStore();
  const normalized = email.trim().toLowerCase();
  return store.users.find((u) => u.email === normalized);
}

export async function findUserById(
  id: string,
): Promise<UserRecord | undefined> {
  const store = await loadStore();
  return store.users.find((u) => u.id === id);
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
  gender: Gender;
  genderSought: GenderSought;
  dateOfBirth: string;
  locale: Locale;
  marketing: boolean;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<{ user: UserRecord; consent: ConsentRecord }> {
  const store = await loadStore();
  const email = input.email.trim().toLowerCase();
  if (store.users.some((u) => u.email === email)) {
    throw Object.assign(new Error("Email already registered"), {
      code: "email_taken",
    });
  }
  const user: UserRecord = {
    id: randomUUID(),
    email,
    passwordHash: input.passwordHash,
    gender: input.gender,
    genderSought: input.genderSought,
    dateOfBirth: input.dateOfBirth,
    locale: input.locale,
    emailVerified: false,
    createdAt: new Date().toISOString(),
  };
  const consent: ConsentRecord = {
    id: randomUUID(),
    userId: user.id,
    termsVersion: LEGAL_VERSIONS.terms,
    privacyVersion: LEGAL_VERSIONS.privacy,
    marketing: Boolean(input.marketing),
    timestamp: new Date().toISOString(),
    ipHash: hashPii(input.ip),
    userAgentHash: hashPii(input.userAgent),
  };
  store.users.push(user);
  store.consents.push(consent);
  await persist(store);
  log.info("user_registered", {
    userId: user.id,
    locale: user.locale,
    marketing: consent.marketing,
    termsVersion: consent.termsVersion,
    privacyVersion: consent.privacyVersion,
  });
  return { user, consent };
}

export async function updateUserPassword(
  userId: string,
  passwordHash: string,
): Promise<void> {
  const store = await loadStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) throw new Error("user_not_found");
  user.passwordHash = passwordHash;
  await persist(store);
}

export async function markEmailVerified(userId: string): Promise<void> {
  const store = await loadStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) throw new Error("user_not_found");
  user.emailVerified = true;
  await persist(store);
}

export async function createToken(
  userId: string,
  type: TokenRecord["type"],
  ttlMs: number,
): Promise<TokenRecord> {
  const store = await loadStore();
  const record: TokenRecord = {
    token: randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, ""),
    userId,
    type,
    expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    usedAt: null,
  };
  store.tokens.push(record);
  await persist(store);
  return record;
}

export async function consumeToken(
  token: string,
  type: TokenRecord["type"],
): Promise<TokenRecord | null> {
  const store = await loadStore();
  const record = store.tokens.find(
    (t) => t.token === token && t.type === type && !t.usedAt,
  );
  if (!record) return null;
  if (new Date(record.expiresAt).getTime() < Date.now()) return null;
  record.usedAt = new Date().toISOString();
  await persist(store);
  return record;
}

export async function createSession(
  userId: string,
  ttlMs = 1000 * 60 * 60 * 24 * 30,
): Promise<SessionRecord> {
  const store = await loadStore();
  const session: SessionRecord = {
    id: randomUUID(),
    userId,
    refreshToken: randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, ""),
    expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    revokedAt: null,
  };
  store.sessions.push(session);
  await persist(store);
  return session;
}

export async function revokeSessionByRefresh(
  refreshToken: string,
): Promise<void> {
  const store = await loadStore();
  const session = store.sessions.find(
    (s) => s.refreshToken === refreshToken && !s.revokedAt,
  );
  if (session) {
    session.revokedAt = new Date().toISOString();
    await persist(store);
  }
}

export async function revokeAllSessionsForUser(userId: string): Promise<void> {
  const store = await loadStore();
  let changed = false;
  for (const s of store.sessions) {
    if (s.userId === userId && !s.revokedAt) {
      s.revokedAt = new Date().toISOString();
      changed = true;
    }
  }
  if (changed) await persist(store);
}

export async function listConsentsForUser(
  userId: string,
): Promise<ConsentRecord[]> {
  const store = await loadStore();
  return store.consents.filter((c) => c.userId === userId);
}
