import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perfect Year',
  description: 'Plan your perfect year',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 