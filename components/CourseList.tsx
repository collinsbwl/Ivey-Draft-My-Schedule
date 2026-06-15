"use client";

import { Course, DAY_SHORT, Day } from "@/lib/types";
import { formatTimeStr } from "@/lib/time";
import styles from "./CourseList.module.css";

interface CourseListProps {
  courses: Course[];
  onRemove: (id: string) => void;
  conflictingIds: Set<string>;
}

function formatDays(days: Day[]): string {
  return days.map((d) => DAY_SHORT[d]).join(" ");
}

export default function CourseList({ courses, onRemove, conflictingIds }: CourseListProps) {
  if (courses.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.iconCol}></th>
            <th>Course</th>
            <th>Course No.</th>
            <th>Room</th>
            <th>Instructor</th>
            <th>Days/Times</th>
            <th className={styles.removeCol}>Remove</th>
            <th className={styles.warnCol}></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>
                <span
                  className={styles.tag}
                  style={{ color: course.color ?? "#7c3aed" }}
                >
                  🏷
                </span>
              </td>
              <td>{course.name}</td>
              <td>{course.classNbr ?? course.courseNumber ?? "—"}</td>
              <td>{course.location ?? "—"}</td>
              <td>{course.instructor ?? "—"}</td>
              <td className={styles.noWrap}>
                {formatDays(course.days)}
                <br />
                <span className={styles.timeRange}>
                  {formatTimeStr(course.start)} – {formatTimeStr(course.end)}
                </span>
              </td>
              <td>
                <button
                  className={styles.removeBtn}
                  onClick={() => onRemove(course.id)}
                  aria-label={`Remove ${course.name}`}
                >
                  ✕
                </button>
              </td>
              <td className={styles.warnCol}>
                {conflictingIds.has(course.id) && (
                  <span className={styles.warnIcon} title="Schedule conflict">⚠️</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
