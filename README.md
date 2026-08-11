# Ivey Draft My Schedule

A course scheduling tool for Ivey HBA2 students to plan and visualize their Fall and Winter timetables.

### Why

Ivey kept sending out new versions of the course schedule and manually tracking different sections times and conflicts in Excel was tiring. I Bbuilt this tool to visually build out my timetable based on the most recent course lists and spot conflicts instantly instead of cross-checking spreadsheet rows by hand.

### Features

- **Course search & selection** — searchable dropdown across all HBA2 electives with per-section details (time, room, instructor, class number)
- **Visual timetable** — side-by-side Fall and Winter session grids with 10-minute slot precision
- **Conflict detection** — real-time overlap detection flags conflicting courses with a warning indicator on the affected blocks
- **Saved drafts** — save named snapshots of your schedule to the browser's local storage, then reload or delete them later
- **Responsive layout** — grids stack vertically on smaller screens
- **Course Data** — All course data lives in [`data/courses.json`](data/courses.json). Each course has a list of sections with days, times, room, and instructor.

### Project Structure

```
app/           # Next.js app router pages and global styles
components/    # UI components (TimeGrid, BuildDraftPanel, CourseList, SemesterGrids, DraftsPanel)
data/          # courses.json — all course and section data
lib/           # Shared utilities (types, time/slot helpers, conflict detection, drafts)
```
