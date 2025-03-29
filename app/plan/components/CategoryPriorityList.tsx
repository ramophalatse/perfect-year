'use client';

import { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

// Define Category type for prioritization
type Category = {
  id: string;
  name: string;
  description: string | null;
  isPreset: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

interface CategoryPriorityListProps {
  categories: Category[];
  onSave: (categories: Category[]) => void;
  onCancel: () => void;
}

export default function CategoryPriorityList({ 
  categories, 
  onSave, 
  onCancel 
}: CategoryPriorityListProps) {
  const [sortedCategories, setSortedCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    // Initialize with categories sorted by current priority
    setSortedCategories([...categories].sort((a, b) => b.priority - a.priority));
  }, [categories]);
  
  const moveCategory = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sortedCategories.length - 1)
    ) {
      return;
    }
    
    const newCategories = [...sortedCategories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [newCategories[index], newCategories[targetIndex]] = 
      [newCategories[targetIndex], newCategories[index]];
    
    setSortedCategories(newCategories);
  };
  
  const handleSave = () => {
    // Assign new priority values based on position in the list
    // Higher index = higher priority (reversed from array index)
    const updatedCategories = sortedCategories.map((category, index) => ({
      ...category,
      priority: sortedCategories.length - index, // Reverse the index for priority
    }));
    
    onSave(updatedCategories);
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Prioritize Your Life Areas
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Drag or use the arrow buttons to rank your categories by importance. Categories at the top will have higher priority.
        </p>
      </div>
      
      <div className="space-y-2 mb-6">
        {sortedCategories.map((category, index) => (
          <div 
            key={category.id}
            className="flex items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-1">
              <h3 className="text-gray-900 dark:text-white font-medium">{category.name}</h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => moveCategory(index, 'up')}
                disabled={index === 0}
                className={`p-1 rounded-md ${
                  index === 0 
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <ArrowUpIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => moveCategory(index, 'down')}
                disabled={index === sortedCategories.length - 1}
                className={`p-1 rounded-md ${
                  index === sortedCategories.length - 1 
                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <ArrowDownIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          Save Priorities
        </button>
      </div>
    </div>
  );
} 