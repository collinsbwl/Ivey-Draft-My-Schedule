export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

export type Semester = "Fall" | "Winter" | "Both";

export const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const DAY_LABELS: Record<Day, string> = {
  Mon: "Mon",
  Tue: "Tues",
  Wed: "Wed",
  Thu: "Thurs",
  Fri: "Fri",
};

export const DAY_SHORT: Record<Day, string> = {
  Mon: "M",
  Tue: "Tu",
  Wed: "W",
  Thu: "Th",
  Fri: "F",
};

export interface Section {
  id: string;
  section: string;
  days: Day[];
  start: string;
  end: string;
  instructor?: string;
  location?: string;
  classNbr?: string;
  credits?: number;
  deliveryType?: string;
}

export interface CourseGroup {
  id: string;
  name: string;
  courseNumber?: string;
  semester: Semester;
  color?: string;
  sections: Section[];
}

export interface Course {
  id: string;
  courseGroupId: string;
  name: string;
  courseNumber?: string;
  semester: Semester;
  days: Day[];
  start: string;
  end: string;
  color?: string;
  section?: string;
  instructor?: string;
  location?: string;
  classNbr?: string;
  credits?: number;
  deliveryType?: string;
}
