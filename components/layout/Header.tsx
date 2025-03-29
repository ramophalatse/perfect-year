'use client';

import Link from 'next/link';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-2xl text-primary dark:text-primary-light">
            Perfect Year
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/workflow" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors">
              Workflow
            </Link>
            <Link href="/workspace" className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors">
              Workspace
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/login" passHref>
            <Button variant="primary" size="md">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
} 