import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import { ItemsProvider } from '@/context/Items';
import { getItems } from '@/util/osrs-items';

import Nav from '@/components/Nav';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OSRS Items',
  description: 'Old School RuneScape Items',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const items = await getItems();

  return (
    <html lang="en" data-theme="dracula">
      <body className={inter.className}>
        <ItemsProvider items={items}>
          <Nav />
          {children}
        </ItemsProvider>
      </body>
    </html>
  );
}
