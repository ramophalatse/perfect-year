'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Define partial Category type for adding new categories
type PartialCategory = {
  name: string;
  description: string;
  isPreset: boolean;
  priority: number;
};

interface AddCategoryModalProps {
  presetCategories: string[];
  onAdd: (category: PartialCategory) => void;
  onClose: () => void;
}

export default function AddCategoryModal({ 
  presetCategories, 
  onAdd, 
  onClose 
}: AddCategoryModalProps) {
  const [formMode, setFormMode] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<number>(1);
  
  const handleAdd = () => {
    const name = formMode === 'preset' ? selectedPreset : customName;
    
    if (!name) {
      // Show validation error - would use a better UI in production
      alert('Please provide a category name');
      return;
    }
    
    onAdd({
      name,
      description,
      isPreset: formMode === 'preset',
      priority,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Life Category
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4">
          {/* Form Mode Selection */}
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
            <button
              className={`flex-1 py-2 ${
                formMode === 'preset'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
              onClick={() => setFormMode('preset')}
            >
              Preset Category
            </button>
            <button
              className={`flex-1 py-2 ${
                formMode === 'custom'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
              onClick={() => setFormMode('custom')}
            >
              Custom Category
            </button>
          </div>
          
          {/* Preset Selection */}
          {formMode === 'preset' && (
            <div className="mb-4">
              <label 
                htmlFor="preset-select" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Select a Category
              </label>
              <select
                id="preset-select"
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a category</option>
                {presetCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Custom Category Name */}
          {formMode === 'custom' && (
            <div className="mb-4">
              <label 
                htmlFor="custom-name" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category Name
              </label>
              <input
                type="text"
                id="custom-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Creative Projects"
              />
            </div>
          )}
          
          {/* Description */}
          <div className="mb-4">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Describe what this life area means to you"
            />
          </div>
          
          {/* Priority */}
          <div className="mb-6">
            <label 
              htmlFor="priority" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Priority Level (1-10)
            </label>
            <input
              type="number"
              id="priority"
              min={1}
              max={10}
              value={priority}
              onChange={(e) => setPriority(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Higher number = higher priority
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 