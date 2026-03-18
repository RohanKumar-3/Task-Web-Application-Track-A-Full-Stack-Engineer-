'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, createTask, deleteTask, toggleTask, updateTask, logoutUser } from '@/services/api';
import { useToast } from '@/components/Toast';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import EditTaskModal from '@/components/EditTaskModal';
import styles from '@/styles/Dashboard.module.css';

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingTask, setEditingTask] = useState<any>(null);
  const { showToast } = useToast();
  const router = useRouter();

  const fetchTasks = async (reset = false) => {
    try {
      setLoading(true);
      const data = await getTasks({
        page: reset ? 1 : page,
        limit: 10,
        search,
        status: statusFilter,
      });
      if (reset) {
        setTasks(data.tasks);
        setPage(2);
      } else {
        setTasks(prev => [...prev, ...data.tasks]);
        setPage(page + 1);
      }
      setHasMore(data.pagination.page < data.pagination.pages);
    } catch (error) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(true);
  }, [search, statusFilter]);

  const handleAdd = async (title: string) => {
    try {
      await createTask(title);
      showToast('Task added', 'success');
      fetchTasks(true);
    } catch {
      showToast('Failed to add task', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      showToast('Task deleted', 'success');
    } catch {
      showToast('Failed to delete task', 'error');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updated = await toggleTask(id);
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
      showToast('Status updated', 'success');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleUpdate = async (id: number, title: string) => {
    try {
      const updated = await updateTask(id, title);
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
      showToast('Task updated', 'success');
      setEditingTask(null);
    } catch {
      showToast('Failed to update task', 'error');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <div className={styles.container}>
      {/* New top bar */}
      <div className={styles.topBar}>📱 Task App</div>

      <div className={styles.header}>
        <h1>📋 My Tasks</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className={styles.filterSelect}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      <TaskForm onAdd={handleAdd} />

      <div className={styles.taskList}>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onEdit={() => setEditingTask(task)}
          />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => fetchTasks()}
          disabled={loading}
          className={styles.loadMore}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={handleUpdate}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}