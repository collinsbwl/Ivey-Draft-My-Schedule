"use client";

import { useEffect, useMemo, useState } from "react";
import coursesData from "@/data/courses.json";
import { Course, CourseGroup, Day, DAYS } from "@/lib/types";
import { getConflictingIds } from "@/lib/time";
import { Draft, deleteDraft, listDrafts, saveDraft } from "@/lib/drafts";
import BuildDraftPanel from "@/components/BuildDraftPanel";
import DraftsPanel from "@/components/DraftsPanel";
import SemesterGrids from "@/components/SemesterGrids";
import CourseList from "@/components/CourseList";
import styles from "./page.module.css";

const ALL_COURSE_GROUPS = coursesData.courses as unknown as CourseGroup[];

export default function Home() {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [activeDays, setActiveDays] = useState<Set<Day>>(new Set(DAYS));
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    setDrafts(listDrafts());
  }, []);

  const handleSaveDraft = (name: string) => {
    saveDraft(name, selectedCourses);
    setDrafts(listDrafts());
  };

  const handleLoadDraft = (id: string) => {
    const draft = drafts.find((d) => d.id === id);
    if (draft) setSelectedCourses(draft.courses);
  };

  const handleDeleteDraft = (id: string) => {
    deleteDraft(id);
    setDrafts(listDrafts());
  };

  const scheduledGroupIds = useMemo(
    () => new Set(selectedCourses.map((c) => c.courseGroupId)),
    [selectedCourses]
  );

  const addCourse = (course: Course) => {
    setSelectedCourses((prev) =>
      prev.some((c) => c.id === course.id) ? prev : [...prev, course]
    );
  };

  const removeCourse = (id: string) => {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleDay = (day: Day) => {
    setActiveDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const conflictingIds = useMemo(() => getConflictingIds(selectedCourses), [selectedCourses]);

  return (
    <main className={styles.main}>
      <BuildDraftPanel
        courseGroups={ALL_COURSE_GROUPS}
        scheduledGroupIds={scheduledGroupIds}
        activeDays={activeDays}
        onAdd={addCourse}
        onToggleDay={toggleDay}
      />
      <DraftsPanel
        drafts={drafts}
        canSave={selectedCourses.length > 0}
        onSave={handleSaveDraft}
        onLoad={handleLoadDraft}
        onDelete={handleDeleteDraft}
      />
      <SemesterGrids courses={selectedCourses} conflictingIds={conflictingIds} />
      <CourseList courses={selectedCourses} onRemove={removeCourse} conflictingIds={conflictingIds} />
    </main>
  );
}
