import { Course } from "@/lib/types";
import TimeGrid from "./TimeGrid";
import styles from "./SemesterGrids.module.css";

interface SemesterGridsProps {
  courses: Course[];
  conflictingIds: Set<string>;
}

export default function SemesterGrids({ courses, conflictingIds }: SemesterGridsProps) {
  const fall = courses.filter((c) => c.semester === "Fall" || c.semester === "Both");
  const winter = courses.filter((c) => c.semester === "Winter" || c.semester === "Both");

  return (
    <div className={styles.row}>
      <TimeGrid title="Fall Session" courses={fall} conflictingIds={conflictingIds} />
      <TimeGrid title="Winter Session" courses={winter} conflictingIds={conflictingIds} />
    </div>
  );
}
