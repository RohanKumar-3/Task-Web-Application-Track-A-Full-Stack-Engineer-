import type { Metadata } from 'next';
import { ToastProvider } from '@/components/Toast';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Manage your tasks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}