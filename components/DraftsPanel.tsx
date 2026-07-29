"use client";

import { useState } from "react";
import { Draft } from "@/lib/drafts";
import styles from "./DraftsPanel.module.css";

interface DraftsPanelProps {
  drafts: Draft[];
  canSave: boolean;
  onSave: (name: string) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatSavedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DraftsPanel({
  drafts,
  canSave,
  onSave,
  onLoad,
  onDelete,
}: DraftsPanelProps) {
  const [name, setName] = useState("");

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setName("");
  };

  return (
    <section className={styles.panel}>
      <h2 className={styles.heading}>Saved Drafts</h2>

      <div className={styles.saveRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Name this draft…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
        <button
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={!canSave || !name.trim()}
        >
          Save Draft
        </button>
      </div>
      {!canSave && (
        <p className={styles.hint}>Add a course to your schedule before saving a draft.</p>
      )}

      {drafts.length > 0 && (
        <ul className={styles.list}>
          {drafts.map((draft) => (
            <li key={draft.id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{draft.name}</span>
                <span className={styles.itemMeta}>
                  {draft.courses.length} course{draft.courses.length === 1 ? "" : "s"} · saved{" "}
                  {formatSavedAt(draft.savedAt)}
                </span>
              </div>
              <div className={styles.itemActions}>
                <button className={styles.loadBtn} onClick={() => onLoad(draft.id)}>
                  Load
                </button>
                <button className={styles.deleteBtn} onClick={() => onDelete(draft.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
