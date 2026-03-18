'use client';
import { useState } from 'react';
import styles from '@/styles/EditTaskModal.module.css';

interface Props {
  task: { id: number; title: string };
  onSave: (id: number, title: string) => void;
  onClose: () => void;
}

export default function EditTaskModal({ task, onSave, onClose }: Props) {
  const [title, setTitle] = useState(task.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(task.id, title);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Edit Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className={styles.input}
          />
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}