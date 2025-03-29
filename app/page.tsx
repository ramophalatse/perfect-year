import Navigation from './components/Navigation';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">Perfect Year</h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Plan, track, and achieve your goals with our comprehensive year planning tool
            </p>
            <div className="mt-6 flex gap-4">
              <Link 
                href="/login" 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Get Started
              </Link>
              <Link 
                href="/dashboard" 
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
              >
                Explore Features
              </Link>
            </div>
            
            <div className="mt-16 grid md:grid-cols-3 gap-8 w-full">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className="text-blue-500 dark:text-blue-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Goal Setting</h3>
                <p className="text-gray-600 dark:text-gray-400">Create specific, measurable goals with deadlines to keep you on track throughout the year.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className="text-blue-500 dark:text-blue-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Calendar View</h3>
                <p className="text-gray-600 dark:text-gray-400">Visualize your year with a comprehensive calendar showing all your goals and tasks.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                <div className="text-blue-500 dark:text-blue-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Progress Tracking</h3>
                <p className="text-gray-600 dark:text-gray-400">Monitor your achievements with intuitive progress bars and completion statistics.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 