import React from "react";
import Header from "@/components/dashboard/Header";
import ProgressChartsCard from "@/components/dashboard/ProgressChartsCard";
import GoalsProgressCard from "@/components/dashboard/GoalsProgressCard";
import NutritionDetailsModal from "@/components/modals/NutritionDetailsModal";
import { Button } from "@/components/ui/button";
import { PieChart } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

const Progress: React.FC = () => {
  const [showNutritionModal, setShowNutritionModal] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Progress Tracking</h1>
          <Button
            onClick={() => setShowNutritionModal(true)}
            className="gap-2 bg-purple-500 hover:bg-purple-600 text-white"
          >
            <PieChart className="h-4 w-4" />
            Nutrition Details
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <GoalsProgressCard />
          </div>
          <div className="lg:col-span-8">
            <ProgressChartsCard />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Weekly Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Average Daily Calories</p>
                <p className="text-2xl font-bold">1,850 kcal</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Protein Goal Achievement
                </p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Water Intake Consistency
                </p>
                <p className="text-2xl font-bold">92%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4">Achievements</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-md">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-medium">Perfect Week</p>
                  <p className="text-sm text-gray-500">
                    Logged all meals for 7 days straight
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-medium">Hydration Hero</p>
                  <p className="text-sm text-gray-500">
                    Met water goals 5 days in a row
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-md">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                  ✓
                </div>
                <div>
                  <p className="font-medium">Protein Champion</p>
                  <p className="text-sm text-gray-500">
                    Reached protein goals for 10 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <NutritionDetailsModal
        open={showNutritionModal}
        onOpenChange={setShowNutritionModal}
      />

      <Toaster />
    </div>
  );
};

export default Progress;
