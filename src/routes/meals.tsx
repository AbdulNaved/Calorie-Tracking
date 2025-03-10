import React from "react";
import Header from "@/components/dashboard/Header";
import RecentMealsCard from "@/components/dashboard/RecentMealsCard";
import LogMealModal from "@/components/modals/LogMealModal";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Plus } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

const Meals: React.FC = () => {
  const [showLogMealModal, setShowLogMealModal] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meals</h1>
          <Button
            onClick={() => setShowLogMealModal(true)}
            className="gap-2 bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="h-4 w-4" />
            Log New Meal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecentMealsCard title="Breakfast" />
          <RecentMealsCard title="Lunch" />
          <RecentMealsCard title="Dinner" />
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Meals</h2>
          <RecentMealsCard />
        </div>
      </main>

      {/* Modals */}
      <LogMealModal
        open={showLogMealModal}
        onOpenChange={setShowLogMealModal}
        onSave={(meal) => {
          setShowLogMealModal(false);
          // Handle meal logging
        }}
      />

      <Toaster />
    </div>
  );
};

export default Meals;
