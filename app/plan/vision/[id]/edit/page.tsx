'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

type FutureVision = {
  id: string;
  description: string;
  year: number;
  yearEndReflection: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
};

export default function EditVisionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id: visionId } = params;
  
  const [vision, setVision] = useState<FutureVision | null>(null);
  const [year, setYear] = useState(new Date().getFullYear() + 1);
  const [description, setDescription] = useState('');
  const [yearEndReflection, setYearEndReflection] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchVision = async () => {
      try {
        const res = await fetch(`/api/future-visions/${visionId}`);
        if (res.ok) {
          const data = await res.json();
          setVision(data);
          setYear(data.year);
          setDescription(data.description);
          setYearEndReflection(data.yearEndReflection || '');
        } else {
          setError('Failed to fetch vision');
        }
      } catch (error) {
        setError('Error fetching vision');
        console.error('Error fetching vision:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVision();
  }, [visionId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Vision description is required');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      const res = await fetch(`/api/future-visions/${visionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          year,
          yearEndReflection: yearEndReflection || null,
        }),
      });
      
      if (res.ok) {
        router.push(`/plan/categories/${vision?.categoryId}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update vision');
      }
    } catch (error) {
      setError('Error updating vision');
      console.error('Error updating vision:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vision?')) {
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      
      const res = await fetch(`/api/future-visions/${visionId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        router.push(`/plan/categories/${vision?.categoryId}`);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete vision');
      }
    } catch (error) {
      setError('Error deleting vision');
      console.error('Error deleting vision:', error);
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
  
  if (!vision) {
    return (
      <>
        <Navigation />
        <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Vision not found
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
              href={`/plan/categories/${vision.categoryId}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to {vision.category.name}
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Edit Future Vision
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Update your vision for {vision.category.name}
              </p>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Year
                  </label>
                  <input
                    type="number"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Vision Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label
                    htmlFor="yearEndReflection"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Year-End Reflection (Optional)
                  </label>
                  <textarea
                    id="yearEndReflection"
                    value={yearEndReflection}
                    onChange={(e) => setYearEndReflection(e.target.value)}
                    rows={6}
                    placeholder="At the end of the year, reflect on how reality compared to your vision."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Delete Vision
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 