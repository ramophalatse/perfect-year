'use client';

import Link from 'next/link';
import { ArrowRightIcon, PencilIcon } from '@heroicons/react/24/outline';

// Define the Category type here since importing from Prisma client may cause issues
type Category = {
  id: string;
  name: string;
  description: string | null;
  isPreset: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  futureVisions?: any[];
  goals?: any[];
};

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const numVisions = category.futureVisions?.length || 0;
  const numGoals = category.goals?.length || 0;
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {category.name}
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
          Priority {category.priority || 'Unset'}
        </span>
      </div>
      
      <p className="text-gray-500 dark:text-gray-400 mb-4 h-12 overflow-hidden text-ellipsis">
        {category.description || 'No description yet'}
      </p>
      
      <div className="flex justify-between mb-4">
        <div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {numVisions} Vision{numVisions !== 1 ? 's' : ''}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {numGoals} Goal{numGoals !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <Link
          href={`/plan/categories/${category.id}`}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
        >
          View Category
          <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
        
        <Link
          href={`/plan/categories/${category.id}/edit`}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <PencilIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
} 