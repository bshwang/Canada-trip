"use client";
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from "firebase/auth";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
import { isSupported as analyticsSupported, getAnalytics } from "firebase/analytics";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let _app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

export function isFirebaseConfigured(): boolean {
  return !!(config.apiKey && config.projectId && config.appId);
}

function getApp(): FirebaseApp {
  if (_app) return _app;
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase config missing — NEXT_PUBLIC_FIREBASE_* env vars not set");
  }
  _app = getApps()[0] ?? initializeApp(config);
  return _app;
}

export function getDb(): Firestore {
  if (_db) return _db;
  const app = getApp();
  _db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
  return _db;
}

export function getAuthClient(): Auth {
  if (_auth) return _auth;
  const app = getApp();
  _auth = getAuth(app);
  return _auth;
}

export async function signInWithGoogle(): Promise<User | null> {
  const auth = getAuthClient();
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

export async function signOut(): Promise<void> {
  const auth = getAuthClient();
  await fbSignOut(auth);
}

export function watchAuth(cb: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured()) {
    cb(null);
    return () => {};
  }
  const auth = getAuthClient();
  return onAuthStateChanged(auth, cb);
}

let _analyticsInitialized = false;
export async function initAnalytics(): Promise<void> {
  if (_analyticsInitialized) return;
  if (!config.measurementId) return;
  if (!isFirebaseConfigured()) return;
  if (typeof window === "undefined") return;
  try {
    if (await analyticsSupported()) {
      getAnalytics(getApp());
      _analyticsInitialized = true;
    }
  } catch {}
}
