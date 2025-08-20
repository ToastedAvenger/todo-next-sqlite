import type { ReactNode } from 'react';
import './globals.css';
import ThemeToggleClient from '../components/ThemeToggle';

export const metadata = {
  title: 'To-Do',
  description: 'Per-user to-do list with Next.js and SQLite',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="container">
          <div className="header">
            <div className="row">
              <div className="brand">To‑Do</div>
            </div>
            <ThemeToggleClient />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
