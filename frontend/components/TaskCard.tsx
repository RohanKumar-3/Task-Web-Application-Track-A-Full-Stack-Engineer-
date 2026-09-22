'use client';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import styles from '@/styles/TaskCard.module.css';

interface Task {
  id: number;
  title: string;
  status: 'pending' | 'done';
}

interface Props {
  task: Task;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: () => void;
}

export default function TaskCard({ task, onDelete, onToggle, onEdit }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <input
          type="checkbox"
          checked={task.status === 'done'}
          onChange={() => onToggle(task.id)}
          className={styles.checkbox}
        />
        <span className={task.status === 'done' ? styles.done : ''}>
          {task.title}
        </span>
      </div>
      <div className={styles.actions}>
        <button onClick={onEdit} className={styles.editBtn}>
          <PencilIcon width={18} height={18} />
        </button>
        <button onClick={() => onDelete(task.id)} className={styles.deleteBtn}>
          <TrashIcon width={18} height={18} />
        </button>
      </div>
    </div>
  );
}