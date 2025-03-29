'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import CategoryCard from './components/CategoryCard';
import AddCategoryModal from './components/AddCategoryModal';
import CategoryPriorityList from './components/CategoryPriorityList';
import { PlusIcon, AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';

// Local type definition
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

// Preset categories based on requirements
const presetCategories = [
  'Health', 'Personal', 'Travel', 'Home', 'Relationships', 
  'Partner', 'Family', 'Friends', 'Business', 'Hobbies', 
  'Wealth', 'Finance', 'Investments', 'Time', 'Learning', 
  'Society', 'Mental Health', 'Physical Health', 'Spiritual Health', 
  'Reputation', 'Career', 'Network', 'Community Service', 
  'Contribution', 'Productivity'
];

export default function PlanPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrioritizingMode, setIsPrioritizingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const handleAddCategory = async (category: Partial<Category>) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      if (res.ok) {
        const newCategory = await res.json();
        setCategories([...categories, newCategory]);
        setIsAddModalOpen(false);
      } else {
        const error = await res.json();
        console.error('Failed to add category:', error.error);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  
  const handleUpdatePriorities = async (updatedCategories: Category[]) => {
    // Update all categories with new priority values
    try {
      // We would batch update in a real app, but for now we'll just update the state
      setCategories(updatedCategories);
      setIsPrioritizingMode(false);
      
      // In a real app, we would also update the backend
      // This would be a batch update API call
    } catch (error) {
      console.error('Error updating priorities:', error);
    }
  };
  
  return (
    <>
      <Navigation />
      <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Perfect Year Plan</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsPrioritizingMode(!isPrioritizingMode)}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
              >
                <AdjustmentsVerticalIcon className="h-5 w-5 mr-2" />
                {isPrioritizingMode ? 'Exit Prioritizing' : 'Prioritize Areas'}
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Category
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : isPrioritizingMode ? (
            <CategoryPriorityList 
              categories={categories} 
              onSave={handleUpdatePriorities} 
              onCancel={() => setIsPrioritizingMode(false)} 
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                />
              ))}
              
              {categories.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-gray-900 rounded-lg shadow text-center">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Categories Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Create categories to organize your goals and life areas
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Category
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      {isAddModalOpen && (
        <AddCategoryModal
          presetCategories={presetCategories}
          onAdd={handleAddCategory}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </>
  );
} 