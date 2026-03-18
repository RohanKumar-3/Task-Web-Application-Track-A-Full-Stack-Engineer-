'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>📝 Task Management System</h1>
        <p className={styles.tagline}>Note down your tasks, stay organized.</p>
        <div className={styles.buttons}>
          <Link href="/login" className={styles.btnPrimary}>
            Login
          </Link>
          <Link href="/register" className={styles.btnSecondary}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}