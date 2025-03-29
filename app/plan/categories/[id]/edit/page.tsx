'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type Category = {
  id: string;
  name: string;
  description: string | null;
  isPreset: boolean;
  priority: number;
};

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(0);
  const [isPreset, setIsPreset] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCategory(data);
          setName(data.name);
          setDescription(data.description || '');
          setPriority(data.priority);
          setIsPreset(data.isPreset);
        } else {
          setError('Failed to fetch category');
        }
      } catch (error) {
        setError('Error fetching category');
        console.error('Error fetching category:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategory();
  }, [id]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description: description || null,
          priority,
        }),
      });
      
      if (res.ok) {
        router.push(`/plan/categories/${id}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update category');
      }
    } catch (error) {
      setError('Error updating category');
      console.error('Error updating category:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!category || category.isPreset) return;
    
    if (!confirm('Are you sure you want to delete this category? This will also delete all associated future visions and goals.')) {
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        router.push('/plan');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete category');
      }
    } catch (error) {
      setError('Error deleting category');
      console.error('Error deleting category:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </main>
      </>
    );
  }
  
  if (!category) {
    return (
      <>
        <Navigation />
        <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Category not found
              </h1>
              <Link
                href="/plan"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Plan
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }
  
  return (
    <>
      <Navigation />
      <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link
              href={`/plan/categories/${id}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Category
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Edit Category
              </h1>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                    disabled={isPreset}
                  />
                  {isPreset && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Preset categories cannot be renamed
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="mb-6">
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Priority (1-10)
                  </label>
                  <input
                    type="number"
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(parseInt(e.target.value))}
                    min={1}
                    max={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="submit"
                    disabled={isSaving || (isPreset && name !== category.name)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  {!isPreset && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isSaving}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Delete Category
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 