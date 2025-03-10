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
import ActivityDebugPanel from "./dashboard/ActivityDebugPanel";
import StreakTracker from "./streak/StreakTracker";
import StreakHistory from "./streak/StreakHistory";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useTaskCompletion } from "@/hooks/useTaskCompletion";
import { useAuth } from "@/context/AuthContext";
import { logMeal, logWater, saveUserGoals, logTaskCompletion } from "@/lib/db";
import { getStreakData, updateStreak } from "@/lib/streak";

const Home: React.FC = () => {
  const [showLogMealModal, setShowLogMealModal] = useState(false);
  const [showLogWaterModal, setShowLogWaterModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showStreakHistory, setShowStreakHistory] = useState(false);
  const [streakData, setStreakData] = useState<any>(null);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [calorieGoal, setCalorieGoal] = useState({
    current: 1250,
    target: 2000,
  });
  const [nutritionGoals, setNutritionGoals] = useState([
    {
      name: "Protein",
      current: 65,
      target: 120,
      unit: "g",
      color: "bg-blue-500",
    },
    {
      name: "Carbs",
      current: 180,
      target: 250,
      unit: "g",
      color: "bg-green-500",
    },
    {
      name: "Fat",
      current: 45,
      target: 65,
      unit: "g",
      color: "bg-yellow-500",
    },
  ]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Use the task completion hook to track daily tasks and show notifications
  const { markTaskCompleted, incompleteTasks } = useTaskCompletion();

  // Load streak data and set up goal reminders
  useEffect(() => {
    if (user) {
      const loadStreakData = async () => {
        const data = await getStreakData(user.id);
        if (data) {
          setStreakData(data);

          // Check if completed today
          const today = new Date().toISOString().split("T")[0];
          setTodayCompleted(data.last_completed_date === today);

          // If not completed, set up reminders
          if (data.last_completed_date !== today) {
            // Set up goal reminders at different times
            const currentHour = new Date().getHours();

            // Morning reminder
            if (currentHour >= 9 && currentHour < 12) {
              setTimeout(() => {
                toast({
                  title: "Morning Goal Reminder",
                  description:
                    "Start your day right by logging your breakfast and staying on track with your streak!",
                  variant: "default",
                });
              }, 60000); // Show after 1 minute
            }

            // Afternoon reminder
            else if (currentHour >= 12 && currentHour < 18) {
              setTimeout(() => {
                toast({
                  title: "Afternoon Check-in",
                  description:
                    "Don't forget to log your meals today to maintain your streak progress!",
                  variant: "default",
                });
              }, 60000); // Show after 1 minute
            }

            // Evening reminder
            else if (currentHour >= 18 && currentHour < 22) {
              setTimeout(() => {
                toast({
                  title: "Evening Reminder",
                  description:
                    "Complete your daily tracking before the day ends to keep your streak going!",
                  variant: "default",
                });
              }, 60000); // Show after 1 minute
            }
          }
        }
      };

      loadStreakData();
    }
  }, [user, toast]);

  // Handle meal logging completion
  const handleMealLogged = async (meal: any) => {
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
        imageUrl: meal?.imageUrl || null,
      });

      // Log task completion
      logTaskCompletion(
        user.id,
        mealType,
        `Log ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
      );

      // Update streak if needed
      const updatedStreakData = await updateStreak(user.id, true);
      if (updatedStreakData) {
        setStreakData(updatedStreakData);
        setTodayCompleted(true);
      }
    }
  };

  // Handle water logging completion
  const handleWaterLogged = async (amount: number) => {
    markTaskCompleted("water");

    // Save to database
    if (user) {
      logWater(user.id, {
        amount,
        unit: "ml",
      });

      // Log task completion
      logTaskCompletion(user.id, "water", "Log Water Intake");

      // Update streak if needed
      const updatedStreakData = await updateStreak(user.id, true);
      if (updatedStreakData) {
        setStreakData(updatedStreakData);
        setTodayCompleted(true);
      }
    }
  };

  // Handle goals setting
  const handleGoalsSaved = (goals: any) => {
    if (user) {
      saveUserGoals(user.id, goals);

      // Show notification
      toast({
        title: "Goals Updated",
        description: "Your nutrition goals have been updated successfully!",
        variant: "default",
      });

      // Update UI with new goals
      setCalorieGoal(goals.calorieGoal);
      setNutritionGoals([
        {
          name: "Protein",
          current: nutritionGoals[0].current,
          target: goals.proteinGoal,
          unit: "g",
          color: "bg-blue-500",
        },
        {
          name: "Carbs",
          current: nutritionGoals[1].current,
          target: goals.carbsGoal,
          unit: "g",
          color: "bg-green-500",
        },
        {
          name: "Fat",
          current: nutritionGoals[2].current,
          target: goals.fatGoal,
          unit: "g",
          color: "bg-yellow-500",
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onSettingsClick={() => setShowGoalsModal(true)} />

      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8 animate-fade-in overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 pb-20 auto-rows-auto">
          {/* Left column - Summary cards */}
          <div className="md:col-span-1 lg:col-span-4 space-y-4 md:space-y-6 animate-slide-in-left order-2 lg:order-1 h-auto">
            <CalorieSummaryCard
              consumedCalories={calorieGoal.current}
              goalCalories={calorieGoal.target}
              remainingCalories={calorieGoal.target - calorieGoal.current}
            />

            <RecentMealsCard />

            <GoalsProgressCard
              calorieGoal={calorieGoal}
              nutritionGoals={nutritionGoals}
            />

            {/* Streak tracker */}
            <StreakTracker
              currentStreak={streakData?.current_streak || 0}
              longestStreak={streakData?.longest_streak || 0}
              todayCompleted={todayCompleted}
              onViewHistory={() => setShowStreakHistory(true)}
            />
          </div>

          {/* Right column - Charts and detailed info */}
          <div className="md:col-span-1 lg:col-span-8 space-y-4 md:space-y-6 animate-slide-in-right order-1 lg:order-2 h-auto">
            <ProgressChartsCard />

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 mb-6 lg:mb-0">
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-2 md:gap-4 animate-scale-in justify-center sm:justify-start">
                <Button
                  onClick={() => setShowLogMealModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors hover-lift stagger-1 flex-1 sm:flex-none justify-center"
                >
                  <span>Log a Meal</span>
                </Button>

                <Button
                  onClick={() => setShowLogWaterModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors hover-lift stagger-2 flex-1 sm:flex-none justify-center"
                >
                  <span>Log Water</span>
                </Button>

                <Button
                  onClick={() => setShowNutritionModal(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors hover-lift stagger-3 flex-1 sm:flex-none justify-center"
                >
                  <span className="hidden md:inline">
                    View Nutrition Details
                  </span>
                  <span className="md:hidden">Nutrition</span>
                </Button>

                <Button
                  onClick={() => setShowGoalsModal(true)}
                  variant="outline"
                  className="flex items-center gap-2 px-3 py-2 text-sm md:text-base md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex-1 sm:flex-none justify-center hover-lift stagger-4"
                >
                  <span>Set Goals</span>
                </Button>
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

      {/* Debug panel for database activities */}
      <ActivityDebugPanel />

      {/* Streak history modal */}
      <StreakHistory
        open={showStreakHistory}
        onOpenChange={setShowStreakHistory}
        streakData={{
          currentStreak: streakData?.current_streak || 0,
          longestStreak: streakData?.longest_streak || 0,
          streakStartDate: streakData?.streak_start_date
            ? new Date(streakData.streak_start_date)
            : new Date(),
          completedDates: (streakData?.completed_dates || []).map(
            (d: string) => new Date(d),
          ),
          milestones: (streakData?.milestones || []).map((m: any) => ({
            date: new Date(m.date),
            days: m.days,
            type: m.type,
          })),
        }}
      />
    </div>
  );
};

export default Home;
