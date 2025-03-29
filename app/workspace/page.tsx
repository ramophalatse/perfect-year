import Header from "@/components/layout/Header";

export default function WorkspacePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Workspace</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your projects, resources, and schedule in one place.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Projects</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Organize your work into projects to better track and complete them.
            </p>
            <div className="mt-4">
              <a 
                href="/workspace/projects" 
                className="text-primary dark:text-primary-light hover:underline"
              >
                View Projects →
              </a>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Notes</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Capture ideas, thoughts, and information in a structured way.
            </p>
            <div className="mt-4">
              <a 
                href="/workspace/notes" 
                className="text-primary dark:text-primary-light hover:underline"
              >
                View Notes →
              </a>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Calendar</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Schedule your time and manage events to stay on track with your goals.
            </p>
            <div className="mt-4">
              <a 
                href="/workspace/calendar" 
                className="text-primary dark:text-primary-light hover:underline"
              >
                View Calendar →
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 