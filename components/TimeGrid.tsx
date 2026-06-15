import { Course, Day, DAYS, DAY_LABELS } from "@/lib/types";
import { buildSlots, timeToSlotIndex } from "@/lib/time";
import styles from "./TimeGrid.module.css";

interface TimeGridProps {
  title: string;
  courses: Course[];
  conflictingIds: Set<string>;
}

// All 10-min slots (for exact block placement)
const allSlots = buildSlots();
// Only 30-min boundaries (for visible labels + gridlines)
const labelSlots = allSlots.filter((s) => s.minutes % 30 === 0);

export default function TimeGrid({
  title,
  courses,
  conflictingIds,
}: TimeGridProps) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>
      <div
        className={styles.grid}
        style={{
          gridTemplateColumns: "80px repeat(5, 1fr)",
          gridTemplateRows: `auto repeat(${allSlots.length}, 5px)`,
        }}
      >
        {/* Header row */}
        <div className={`${styles.headerCell} ${styles.timeHeader}`}>Time</div>
        {DAYS.map((day) => (
          <div key={day} className={styles.headerCell}>
            {DAY_LABELS[day]}
          </div>
        ))}

        {/* Time labels — one per 30-min boundary, each spanning 3 rows */}
        {labelSlots.map((slot) => (
          <div
            key={`label-${slot.index}`}
            className={styles.timeLabel}
            style={{
              gridColumn: 1,
              gridRow: `${slot.index + 2} / ${slot.index + 8}`,
            }}
          >
            {slot.label}
          </div>
        ))}

        {/* Background cells — one per 30-min boundary per day, each spanning 3 rows */}
        {labelSlots.map((slot) =>
          DAYS.map((_, dayIdx) => (
            <div
              key={`cell-${slot.index}-${dayIdx}`}
              className={styles.cell}
              style={{
                gridColumn: dayIdx + 2,
                gridRow: `${slot.index + 2} / ${slot.index + 8}`,
              }}
            />
          )),
        )}

        {/* Course blocks — placed with exact 10-min row precision */}
        {courses.flatMap((course) =>
          course.days.map((day: Day) => {
            const dayIdx = DAYS.indexOf(day);
            if (dayIdx === -1) return null;
            const startRow = timeToSlotIndex(course.start) + 2;
            const endRow = timeToSlotIndex(course.end) + 2;
            const hasConflict = conflictingIds.has(course.id);
            return (
              <div
                key={`${course.id}-${day}`}
                className={`${styles.block} ${hasConflict ? styles.conflict : ""}`}
                title={course.name}
                style={{
                  gridColumn: dayIdx + 2,
                  gridRow: `${startRow} / ${endRow}`,
                  backgroundColor: course.color ?? "#7c3aed",
                }}
              >
                {hasConflict && <span className={styles.warningIcon}>⚠️</span>}
                <span className={styles.blockName}>{course.name}</span>
                <span className={styles.blockTime}>
                  {course.start}–{course.end}
                </span>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
