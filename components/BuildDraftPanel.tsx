"use client";

import { useState } from "react";
import Select, { SingleValue } from "react-select";
import {
  CourseGroup,
  Course,
  Section,
  Day,
  Semester,
  DAYS,
  DAY_LABELS,
  DAY_SHORT,
} from "@/lib/types";
import { formatTimeStr } from "@/lib/time";
import styles from "./BuildDraftPanel.module.css";

interface Option {
  value: string;
  label: string;
}

interface BuildDraftPanelProps {
  courseGroups: CourseGroup[];
  scheduledGroupIds: Set<string>;
  activeDays: Set<Day>;
  onAdd: (course: Course) => void;
  onToggleDay: (day: Day) => void;
}

function sectionLabel(s: Section): string {
  const days = s.days.map((d: Day) => DAY_SHORT[d]).join(" ");
  const instructor = s.instructor ? ` (${s.instructor})` : "";
  return `Section ${s.section} — ${days}, ${formatTimeStr(s.start)}–${formatTimeStr(s.end)} (${s.location ?? "TBA"}) - ${s.term}${instructor}`;
}

export default function BuildDraftPanel({
  courseGroups,
  scheduledGroupIds,
  activeDays,
  onAdd,
  onToggleDay,
}: BuildDraftPanelProps) {
  const [pendingGroup, setPendingGroup] = useState<CourseGroup | null>(null);
  const [activeSemesters, setActiveSemesters] = useState<Set<Semester>>(
    new Set<Semester>(["Fall", "Winter"])
  );

  const toggleSemester = (sem: Semester) => {
    setActiveSemesters((prev) => {
      const next = new Set(prev);
      if (next.has(sem)) {
        if (next.size > 1) next.delete(sem);
      } else {
        next.add(sem);
      }
      return next;
    });
    setPendingGroup(null);
  };

  const courseOptions: Option[] = courseGroups
    .filter((g) =>
      g.sections.some(
        (s) =>
          activeSemesters.has(s.term) &&
          s.days.some((d: Day) => activeDays.has(d))
      )
    )
    .map((g) => ({ value: g.id, label: g.name }));

  const sectionOptions: Option[] = (pendingGroup?.sections ?? [])
    .filter((s) => activeSemesters.has(s.term))
    .map((s) => ({
      value: s.id,
      label: sectionLabel(s),
    }));

  const handleCourseChange = (opt: SingleValue<Option>) => {
    const group = courseGroups.find((g) => g.id === opt?.value) ?? null;
    setPendingGroup(group);
  };

  const handleSectionChange = (opt: SingleValue<Option>) => {
    if (!opt || !pendingGroup) return;
    const sec = pendingGroup.sections.find((s) => s.id === opt.value);
    if (!sec) return;

    const course: Course = {
      id: sec.id,
      courseGroupId: pendingGroup.id,
      name: pendingGroup.name,
      courseNumber: pendingGroup.courseNumber,
      semester: sec.term,
      color: pendingGroup.color,
      days: sec.days,
      start: sec.start,
      end: sec.end,
      section: sec.section,
      instructor: sec.instructor,
      location: sec.location,
      classNbr: sec.classNbr,
      credits: sec.credits,
      deliveryType: sec.deliveryType,
    };
    onAdd(course);
    setPendingGroup(null);
  };

  return (
    <section className={styles.panel}>
      <h1 className={styles.heading}>
        <span className={styles.icon} aria-hidden>
          📅
        </span>
        Collin&apos;s Ivey Draft My Schedule
      </h1>

      <div className={styles.controls}>
        <div className={styles.selectRow}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="course-select">
              Select Course:
            </label>
            <Select
              instanceId="course-select"
              inputId="course-select"
              options={courseOptions}
              value={
                pendingGroup
                  ? { value: pendingGroup.id, label: pendingGroup.name }
                  : null
              }
              onChange={handleCourseChange}
              placeholder="Search a course by name..."
              classNamePrefix="course-select"
              className={styles.select}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="section-select">
              Select Section:
            </label>
            <Select
              instanceId="section-select"
              inputId="section-select"
              options={sectionOptions}
              value={null}
              onChange={handleSectionChange}
              isDisabled={!pendingGroup}
              placeholder={
                pendingGroup ? "Pick a section…" : "Select a course first"
              }
              classNamePrefix="section-select"
              className={styles.select}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
            />
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Day of Class:</span>
          <div className={styles.days}>
            {DAYS.map((day) => (
              <label key={day} className={styles.dayItem}>
                <input
                  type="checkbox"
                  checked={activeDays.has(day)}
                  onChange={() => onToggleDay(day)}
                />
                {DAY_LABELS[day]}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Semester:</span>
          <div className={styles.days}>
            {(["Fall", "Winter"] as Semester[]).map((sem) => (
              <label key={sem} className={styles.dayItem}>
                <input
                  type="checkbox"
                  checked={activeSemesters.has(sem)}
                  onChange={() => toggleSemester(sem)}
                />
                {sem}
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
