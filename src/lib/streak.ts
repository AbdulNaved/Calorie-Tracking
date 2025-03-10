import { supabase } from "./supabase";
import { saveUserActivity } from "./db";

// Streak data type
export interface StreakData {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  streak_start_date: string;
  completed_dates: string[];
  last_completed_date: string;
  milestones: Array<{
    date: string;
    days: number;
    type: string;
  }>;
}

// Initialize streak for a user
export const initializeStreak = async (userId: string) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const streakData: StreakData = {
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      streak_start_date: today,
      completed_dates: [],
      last_completed_date: "",
      milestones: [],
    };

    // For demo purposes, store in localStorage
    localStorage.setItem(`streak_${userId}`, JSON.stringify(streakData));

    // In a real app, we would save to Supabase
    /*
    const { data, error } = await supabase
      .from('user_streaks')
      .insert(streakData);
      
    if (error) throw error;
    */

    return streakData;
  } catch (error) {
    console.error("Error initializing streak:", error);
    return null;
  }
};

// Get streak data for a user
export const getStreakData = async (
  userId: string,
): Promise<StreakData | null> => {
  try {
    // For demo purposes, get from localStorage
    const streakDataStr = localStorage.getItem(`streak_${userId}`);

    if (!streakDataStr) {
      // Initialize if not exists
      return await initializeStreak(userId);
    }

    return JSON.parse(streakDataStr);

    // In a real app, we would get from Supabase
    /*
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return await initializeStreak(userId);
      }
      throw error;
    }
    
    return data;
    */
  } catch (error) {
    console.error("Error getting streak data:", error);
    return null;
  }
};

// Update streak for a user
export const updateStreak = async (userId: string, goalMet: boolean = true) => {
  try {
    // Get current streak data
    const streakData = await getStreakData(userId);
    if (!streakData) throw new Error("Streak data not found");

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Check if already completed today
    if (streakData.last_completed_date === today) {
      return streakData; // Already updated today
    }

    let newStreakData = { ...streakData };

    if (goalMet) {
      // Add today to completed dates if not already there
      if (!newStreakData.completed_dates.includes(today)) {
        newStreakData.completed_dates.push(today);
      }

      // Update last completed date
      newStreakData.last_completed_date = today;

      // Check if streak continues or starts new
      if (
        newStreakData.last_completed_date === yesterdayStr ||
        newStreakData.current_streak === 0
      ) {
        // Streak continues or starts
        newStreakData.current_streak += 1;

        // Update longest streak if needed
        if (newStreakData.current_streak > newStreakData.longest_streak) {
          newStreakData.longest_streak = newStreakData.current_streak;
        }

        // Check for milestones
        const milestoneDays = [7, 30, 60, 100, 365];
        if (milestoneDays.includes(newStreakData.current_streak)) {
          newStreakData.milestones.push({
            date: today,
            days: newStreakData.current_streak,
            type: newStreakData.current_streak >= 100 ? "major" : "minor",
          });

          // Log milestone achievement
          await saveUserActivity({
            user_id: userId,
            activity_type: "streak_milestone",
            details: { days: newStreakData.current_streak },
          });
        }
      }
    } else {
      // Streak broken - check if we should use streak freeze
      const hasStreakFreeze = true; // This would be determined by user's available streak freezes

      if (hasStreakFreeze && newStreakData.current_streak > 0) {
        // Use streak freeze - streak continues but no day added
        // In a real app, you would decrement the user's available streak freezes
        await saveUserActivity({
          user_id: userId,
          activity_type: "streak_freeze_used",
          details: { current_streak: newStreakData.current_streak },
        });
      } else {
        // Reset streak
        newStreakData.current_streak = 0;
        newStreakData.streak_start_date = today;

        // Log streak reset
        await saveUserActivity({
          user_id: userId,
          activity_type: "streak_reset",
          details: { previous_streak: streakData.current_streak },
        });
      }
    }

    // Save updated streak data
    localStorage.setItem(`streak_${userId}`, JSON.stringify(newStreakData));

    // In a real app, we would update in Supabase
    /*
    const { data, error } = await supabase
      .from('user_streaks')
      .update(newStreakData)
      .eq('user_id', userId);
      
    if (error) throw error;
    */

    return newStreakData;
  } catch (error) {
    console.error("Error updating streak:", error);
    return null;
  }
};

// Check if user has met daily goals
export const checkDailyGoals = async (userId: string) => {
  try {
    // This would check if the user has met their daily goals
    // For demo purposes, we'll just return true
    const goalsMet = true;

    // Update streak based on goals
    return await updateStreak(userId, goalsMet);
  } catch (error) {
    console.error("Error checking daily goals:", error);
    return null;
  }
};
