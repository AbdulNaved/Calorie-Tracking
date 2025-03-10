import React, { useState, useEffect } from "react";
import Header from "./dashboard/Header";
import CalorieSummaryCard from "./dashboard/CalorieSummaryCard";
import RecentMealsCard from "./dashboard/RecentMealsCard";
import GoalsProgressCard from "./dashboard/GoalsProgressCard";
import ProgressChartsCard from "./dashboard/ProgressChartsCard";
import QuickActionButtons from "./dashboard/QuickActionButtons";
import LogMealModal from "./modals/LogMealModal";
import LogWaterModal from "./modals/LogWaterModal";
import NutritionDetailsModal from "./modals/NutritionDetailsModal";
import GoalsSettingModal from "./modals/GoalsSettingModal";
import { Toaster } from "@/components/ui/toaster";
import { useTaskCompletion } from "@/hooks/useTaskCompletion";
import { useAuth } from "@/context/AuthContext";
import { logMeal, logWater, saveUserGoals, logTaskCompletion } from "@/lib/db";

const Home: React.FC = () => {
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const [showLogWaterModal, setShowLogWaterModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const { user } = useAuth();

  // Use the task completion hook to track daily tasks and show notifications
  const { markTaskCompleted, incompleteTasks } = useTaskCompletion();

  // Handle meal logging completion
  const handleMealLogged = (meal: any) => {
    // Determine which meal to mark based on time of day
    const hour = new Date().getHours();
    let mealType = "dinner";

    if (hour < 11) {
      mealType = "breakfast";
      markTaskCompleted("breakfast");
    } else if (hour < 16) {
      mealType = "lunch";
      markTaskCompleted("lunch");
    } else {
      markTaskCompleted("dinner");
    }

    // Calculate total calories
    const totalCalories =
      meal?.items?.reduce((sum, item) => sum + item.calories, 0) || 0;

    // Save to database
    if (user) {
      logMeal(user.id, {
        mealType: meal?.mealType || mealType,
        items: meal?.items || [],
        totalCalories,
      });

      // Log task completion
      logTaskCompletion(
        user.id,
        mealType,
        `Log ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
      );
    }
  };

  // Handle water logging completion
  const handleWaterLogged = (amount: number) => {
    markTaskCompleted("water");

    // Save to database
    if (user) {
      logWater(user.id, {
        amount,
        unit: "ml",
      });

      // Log task completion
      logTaskCompletion(user.id, "water", "Log Water Intake");
    }
  };

  // Handle goals setting
  const handleGoalsSaved = (goals: any) => {
    if (user) {
      saveUserGoals(user.id, goals);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onSettingsClick={() => setShowGoalsModal(true)} />

      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left column - Summary cards */}
          <div className="md:col-span-1 lg:col-span-4 space-y-4 md:space-y-6">
            <CalorieSummaryCard
              consumedCalories={1250}
              goalCalories={2000}
              remainingCalories={750}
            />

            <RecentMealsCard />

            <GoalsProgressCard />
          </div>

          {/* Right column - Charts and detailed info */}
          <div className="md:col-span-1 lg:col-span-8 space-y-4 md:space-y-6">
            <ProgressChartsCard />

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-2 md:gap-4">
                <button
                  onClick={() => setShowLogMealModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <span>Log a Meal</span>
                </button>

                <button
                  onClick={() => setShowLogWaterModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <span>Log Water</span>
                </button>

                <button
                  onClick={() => setShowNutritionModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <span>View Nutrition Details</span>
                </button>

                <button
                  onClick={() => setShowGoalsModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>Set Goals</span>
                </button>
              </div>
            </div>

            {incompleteTasks.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-3 md:p-4 rounded-lg">
                <h3 className="font-medium text-amber-800 mb-2">
                  Daily Tasks Reminder
                </h3>
                <p className="text-xs md:text-sm text-amber-700 mb-2 md:mb-3">
                  You have {incompleteTasks.length} incomplete tasks today. Keep
                  up your progress!
                </p>
                <div className="flex flex-wrap gap-2">
                  {incompleteTasks.map((task) => (
                    <span
                      key={task.id}
                      className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full"
                    >
                      {task.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <QuickActionButtons
        onLogMeal={() => setShowLogMealModal(true)}
        onLogWater={() => setShowLogWaterModal(true)}
        onViewNutrition={() => setShowNutritionModal(true)}
      />

      {/* Modals */}
      <LogMealModal
        open={showLogMealModal}
        onOpenChange={setShowLogMealModal}
        onSave={(meal) => {
          setShowLogMealModal(false);
          handleMealLogged(meal);
        }}
      />

      <LogWaterModal
        open={showLogWaterModal}
        onOpenChange={setShowLogWaterModal}
        onSave={(amount) => {
          setShowLogWaterModal(false);
          handleWaterLogged(amount);
        }}
      />

      <NutritionDetailsModal
        open={showNutritionModal}
        onOpenChange={setShowNutritionModal}
      />

      <GoalsSettingModal
        open={showGoalsModal}
        onOpenChange={setShowGoalsModal}
        onSave={handleGoalsSaved}
      />

      {/* Toast notifications container */}
      <Toaster />
    </div>
  );
};

export default Home;
