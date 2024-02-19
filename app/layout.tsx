import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import Link from 'next/link';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OSRS Items',
  description: 'Old School RuneScape Items',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-900">
      <body className={inter.className + ' p-4'}>
        <Link href="/" className="btn btn-ghost btn-secondary">
          Home
        </Link>
        {children}
      </body>
    </html>
  );
}
