import Header from "@/components/layout/Header";

export default function WorkflowPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Workflow</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Plan, execute, and track your goals in your journey to success.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Goals Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Goals</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Set meaningful goals and track your progress toward achieving them.
            </p>
            <div className="mt-4">
              <a 
                href="/workflow/goals" 
                className="text-primary dark:text-primary-light hover:underline"
              >
                View Goals →
              </a>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Tasks</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Break down your goals into manageable tasks and track completion.
            </p>
            <div className="mt-4">
              <a 
                href="/workflow/tasks" 
                className="text-primary dark:text-primary-light hover:underline"
              >
                View Tasks →
              </a>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Progress</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Monitor your progress over time with insightful metrics and visualizations.
            </p>
            <div className="mt-4">
              <a 
                href="/workflow/progress" 
                className="text-primary dark:text-primary-light hover:underline"
              >
                View Progress →
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 