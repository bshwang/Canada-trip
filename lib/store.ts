"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import { useAuth } from "./auth";

const CACHE_PREFIX = "canada-trip-cache-v2::";

function cacheKey(key: string) {
  return CACHE_PREFIX + key;
}

function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(cacheKey(key));
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(cacheKey(key), JSON.stringify(value));
  } catch {}
}

export type SyncStatus = "offline" | "synced" | "syncing" | "error";

interface UseTripDataReturn<T> {
  value: T;
  setValue: (next: T | ((prev: T) => T)) => void;
  loaded: boolean;
  status: SyncStatus;
}

/**
 * Unified data hook.
 * - If user signed in & Firebase configured: subscribes to Firestore doc users/{uid}/state/{key},
 *   writes propagated to Firestore (debounced 600ms), localStorage kept as cache.
 * - Otherwise: pure localStorage with defaults seed on first run.
 */
export function useTripData<T>(key: string, defaults: T): UseTripDataReturn<T> {
  const { user, configured } = useAuth();
  const uid = user?.uid;

  const [value, setValueState] = useState<T>(() => {
    const cached = readCache<T>(key);
    return cached !== null ? cached : defaults;
  });
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<SyncStatus>("offline");

  // Whether the current value originated from a remote snapshot (suppress write-back).
  const remoteRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  // Seed localStorage on first run when no cache exists.
  useEffect(() => {
    const cached = readCache<T>(key);
    if (cached === null) {
      writeCache(key, defaults);
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Subscribe to Firestore when authenticated.
  useEffect(() => {
    if (!configured || !uid) {
      setStatus("offline");
      return;
    }
    setStatus("syncing");
    const db = getDb();
    const ref = doc(db, "users", uid, "state", key);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data && Object.prototype.hasOwnProperty.call(data, "value")) {
            remoteRef.current = true;
            setValueState(data.value as T);
            writeCache(key, data.value as T);
          }
        } else {
          // First-time signed-in user: upload current local value as initial doc.
          setDoc(ref, {
            value: valueRef.current,
            updatedAt: serverTimestamp(),
          }).catch(() => setStatus("error"));
        }
        setStatus("synced");
      },
      () => setStatus("error"),
    );
    return () => {
      unsub();
    };
  }, [configured, uid, key]);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const v =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        writeCache(key, v);
        return v;
      });
    },
    [key],
  );

  // Push local changes to Firestore (debounced).
  useEffect(() => {
    if (!loaded) return;
    if (!configured || !uid) return;
    if (remoteRef.current) {
      remoteRef.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setStatus("syncing");
    debounceRef.current = setTimeout(async () => {
      try {
        const db = getDb();
        const ref = doc(db, "users", uid, "state", key);
        await setDoc(ref, {
          value: valueRef.current,
          updatedAt: serverTimestamp(),
        });
        setStatus("synced");
      } catch {
        setStatus("error");
      }
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, loaded, configured, uid, key]);

  return { value, setValue, loaded, status };
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// List helpers — same API as old useEditableList but built on useTripData.
export function useTripList<T extends { id: string }>(
  key: string,
  defaults: T[],
) {
  const { value: items, setValue, loaded, status } = useTripData<T[]>(key, defaults);

  const add = useCallback(
    (partial: Omit<T, "id">) => {
      setValue((prev) => [...prev, { ...(partial as object), id: uid() } as T]);
    },
    [setValue],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      setValue((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    },
    [setValue],
  );

  const remove = useCallback(
    (id: string) => {
      setValue((prev) => prev.filter((it) => it.id !== id));
    },
    [setValue],
  );

  const reset = useCallback(() => {
    setValue(defaults);
  }, [setValue, defaults]);

  const move = useCallback(
    (id: string, dir: -1 | 1) => {
      setValue((prev) => {
        const i = prev.findIndex((it) => it.id === id);
        if (i < 0) return prev;
        const j = i + dir;
        if (j < 0 || j >= prev.length) return prev;
        const next = [...prev];
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
    },
    [setValue],
  );

  return { items, setItems: setValue, add, update, remove, reset, move, loaded, status };
}

export function useTripMap<V>(key: string, defaults: Record<string, V>) {
  const { value: data, setValue, loaded, status } = useTripData<Record<string, V>>(key, defaults);

  const setBucket = useCallback(
    (bucketKey: string, value: V) => {
      setValue((prev) => ({ ...prev, [bucketKey]: value }));
    },
    [setValue],
  );

  const removeBucket = useCallback(
    (bucketKey: string) => {
      setValue((prev) => {
        const { [bucketKey]: _, ...rest } = prev;
        return rest;
      });
    },
    [setValue],
  );

  const reset = useCallback(() => {
    setValue(defaults);
  }, [setValue, defaults]);

  return { data, setData: setValue, setBucket, removeBucket, reset, loaded, status };
}

export function withSeedIds<T extends object>(
  items: T[],
  prefix: string,
): (T & { id: string })[] {
  return items.map((it, i) => ({ ...it, id: `${prefix}-${i}` }));
}
