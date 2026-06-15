export const START_HOUR = 8; // 8:00 AM
export const END_HOUR = 21; // 9:00 PM
export const SLOT_MINUTES = 5;

export interface Slot {
  index: number;
  minutes: number; // minutes since midnight
  label: string; // e.g. "7:00 AM"
}

export function formatTimeStr(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return formatLabel(h * 60 + m);
}

function formatLabel(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function buildSlots(): Slot[] {
  const slots: Slot[] = [];
  let index = 0;
  for (let mins = START_HOUR * 60; mins <= END_HOUR * 60; mins += SLOT_MINUTES) {
    slots.push({ index, minutes: mins, label: formatLabel(mins) });
    index += 1;
  }
  return slots;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Slot index (0-based) for a given "HH:MM" time, relative to START_HOUR.
export function timeToSlotIndex(time: string): number {
  return (timeToMinutes(time) - START_HOUR * 60) / SLOT_MINUTES;
}

// Returns a Set of course IDs that conflict with at least one other course.
export function getConflictingIds(courses: { id: string; days: string[]; start: string; end: string }[]): Set<string> {
  const conflicting = new Set<string>();
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const a = courses[i];
      const b = courses[j];
      const sharesDay = a.days.some((d) => b.days.includes(d));
      if (!sharesDay) continue;
      const aStart = timeToMinutes(a.start);
      const aEnd = timeToMinutes(a.end);
      const bStart = timeToMinutes(b.start);
      const bEnd = timeToMinutes(b.end);
      if (aStart < bEnd && bStart < aEnd) {
        conflicting.add(a.id);
        conflicting.add(b.id);
      }
    }
  }
  return conflicting;
}
