'use client';
import { useState } from 'react';
import styles from '@/styles/TaskForm.module.css';

interface Props {
  onAdd: (title: string) => void;
}

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Add</button>
    </form>
  );
}