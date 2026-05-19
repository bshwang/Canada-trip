"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

export const STORAGE_PREFIX = "canada-trip-edit-v1::";

export function storageKey(name: string) {
  return STORAGE_PREFIX + name;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Generic editable list: seeded from defaults on first load, then user-owned in localStorage.
// IMPORTANT: once a key is touched in localStorage, defaults no longer apply (so deletions stick).
export function useEditableList<T extends { id: string }>(
  name: string,
  defaults: T[],
) {
  const key = storageKey(name);
  const [items, setItems] = useState<T[]>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          setItems(defaults);
        }
      } else {
        // Seed from defaults on first run
        setItems(defaults);
        localStorage.setItem(key, JSON.stringify(defaults));
      }
    } catch {
      setItems(defaults);
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {}
  }, [items, loaded, key]);

  const add = useCallback((partial: Omit<T, "id">) => {
    setItems((prev) => [...prev, { ...(partial as object), id: uid() } as T]);
  }, []);

  const update = useCallback((id: string, patch: Partial<T>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const reset = useCallback(() => {
    setItems(defaults);
    try {
      localStorage.setItem(key, JSON.stringify(defaults));
    } catch {}
  }, [defaults, key]);

  const move = useCallback((id: string, dir: -1 | 1) => {
    setItems((prev) => {
      const i = prev.findIndex((it) => it.id === id);
      if (i < 0) return prev;
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }, []);

  return { items, loaded, add, update, remove, reset, move, setItems };
}

// Editable record (key→value object), e.g. food by city.
export function useEditableMap<V>(
  name: string,
  defaults: Record<string, V>,
) {
  const key = storageKey(name);
  const [data, setData] = useState<Record<string, V>>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        setData(JSON.parse(raw));
      } else {
        setData(defaults);
        localStorage.setItem(key, JSON.stringify(defaults));
      }
    } catch {
      setData(defaults);
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  }, [data, loaded, key]);

  const setBucket = useCallback((bucketKey: string, value: V) => {
    setData((prev) => ({ ...prev, [bucketKey]: value }));
  }, []);

  const removeBucket = useCallback((bucketKey: string) => {
    setData((prev) => {
      const { [bucketKey]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const reset = useCallback(() => {
    setData(defaults);
    try {
      localStorage.setItem(key, JSON.stringify(defaults));
    } catch {}
  }, [defaults, key]);

  return { data, loaded, setBucket, removeBucket, reset, setData };
}

// Stable id from index+content for default items that lack ids in YAML.
export function withSeedIds<T extends object>(items: T[], prefix: string): (T & { id: string })[] {
  return items.map((it, i) => ({ ...it, id: `${prefix}-${i}` }));
}
