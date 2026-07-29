import { Course } from "./types";

const STORAGE_KEY = "course-scheduler:drafts";

export interface Draft {
  id: string;
  name: string;
  savedAt: string;
  courses: Course[];
}

function readAll(): Draft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(drafts: Draft[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function listDrafts(): Draft[] {
  return readAll().sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function saveDraft(name: string, courses: Course[]): Draft[] {
  const draft: Draft = {
    id: crypto.randomUUID(),
    name,
    savedAt: new Date().toISOString(),
    courses,
  };
  const next = [...readAll(), draft];
  writeAll(next);
  return next;
}

export function deleteDraft(id: string): Draft[] {
  const next = readAll().filter((d) => d.id !== id);
  writeAll(next);
  return next;
}
