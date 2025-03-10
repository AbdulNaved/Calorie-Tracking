import { supabase } from "./supabase";

// User activity types
export type ActivityType =
  | "meal_logged"
  | "water_logged"
  | "goal_set"
  | "login"
  | "signup"
  | "task_completed"
  | "streak_updated"
  | "streak_milestone"
  | "streak_freeze_used"
  | "streak_reset";

export interface UserActivity {
  id?: string;
  user_id: string;
  activity_type: ActivityType;
  details?: any;
  created_at?: string;
}

export interface MealLogData {
  mealType: string;
  items: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  totalCalories: number;
  imageUrl?: string | null;
}

export interface WaterLogData {
  amount: number;
  unit: string;
}

export interface GoalData {
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
}

// Save user activity to database
export const saveUserActivity = async (activity: UserActivity) => {
  try {
    // For demo purposes, we'll just log to console and store in localStorage
    console.log("Saving user activity:", activity);

    // Get existing activities or initialize empty array
    const existingActivities = JSON.parse(
      localStorage.getItem("userActivities") || "[]",
    );

    // Add timestamp if not provided
    const activityWithTimestamp = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      created_at: activity.created_at || new Date().toISOString(),
    };

    // Add to local storage
    localStorage.setItem(
      "userActivities",
      JSON.stringify([...existingActivities, activityWithTimestamp]),
    );

    // In a real app, we would save to Supabase
    // Uncomment when Supabase is properly connected
    /*
    const { data, error } = await supabase
      .from('user_activities')
      .insert(activity);
      
    if (error) throw error;
    return data;
    */

    // Show a console message to help with debugging
    console.log("Activity saved successfully!", activityWithTimestamp);
    console.log("All activities:", [
      ...existingActivities,
      activityWithTimestamp,
    ]);

    return activityWithTimestamp;
  } catch (error) {
    console.error("Error saving user activity:", error);
    return null;
  }
};

// Get user activities
export const getUserActivities = async (userId: string) => {
  try {
    // For demo purposes, we'll just get from localStorage
    const allActivities = JSON.parse(
      localStorage.getItem("userActivities") || "[]",
    );
    const userActivities = allActivities.filter(
      (activity) => activity.user_id === userId,
    );

    // In a real app, we would get from Supabase
    // Uncomment when Supabase is properly connected
    /*
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
    */

    return userActivities;
  } catch (error) {
    console.error("Error getting user activities:", error);
    return [];
  }
};

// Log a meal
export const logMeal = async (userId: string, mealData: MealLogData) => {
  return saveUserActivity({
    user_id: userId,
    activity_type: "meal_logged",
    details: mealData,
  });
};

// Log water intake
export const logWater = async (userId: string, waterData: WaterLogData) => {
  return saveUserActivity({
    user_id: userId,
    activity_type: "water_logged",
    details: waterData,
  });
};

// Save user goals
export const saveUserGoals = async (userId: string, goalData: GoalData) => {
  return saveUserActivity({
    user_id: userId,
    activity_type: "goal_set",
    details: goalData,
  });
};

// Log task completion
export const logTaskCompletion = async (
  userId: string,
  taskId: string,
  taskName: string,
) => {
  return saveUserActivity({
    user_id: userId,
    activity_type: "task_completed",
    details: { taskId, taskName },
  });
};
