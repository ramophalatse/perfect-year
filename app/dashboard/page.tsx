import GoalsList from '@/app/components/GoalsList';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <section>
          <GoalsList />
        </section>
        
        {/* Additional dashboard sections can be added here */}
      </div>
    </div>
  );
} 