import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMotivationalNotification } from "@/components/notifications/MotivationalNotification";
import { useAuth } from "@/context/AuthContext";
import { logTaskCompletion } from "@/lib/db";

interface DailyTask {
  id: string;
  name: string;
  completed: boolean;
  type: "meal" | "water" | "exercise" | "other";
  targetTime?: string; // Optional time when task should be completed
}

export const useTaskCompletion = () => {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([
    {
      id: "breakfast",
      name: "Log Breakfast",
      completed: false,
      type: "meal",
      targetTime: "09:00",
    },
    {
      id: "lunch",
      name: "Log Lunch",
      completed: false,
      type: "meal",
      targetTime: "13:00",
    },
    {
      id: "dinner",
      name: "Log Dinner",
      completed: false,
      type: "meal",
      targetTime: "19:00",
    },
    {
      id: "water",
      name: "Log Water Intake",
      completed: false,
      type: "water",
    },
  ]);

  const { showMotivationalNotification } = useMotivationalNotification();
  const { toast } = useToast();
  const { user } = useAuth();

  // Load saved tasks from localStorage on initial load
  useEffect(() => {
    const savedTasks = localStorage.getItem("dailyTasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Check if it's a new day
        const lastSaved = localStorage.getItem("tasksLastSaved");
        const today = new Date().toDateString();

        if (lastSaved !== today) {
          // It's a new day, reset tasks
          resetDailyTasks();
          localStorage.setItem("tasksLastSaved", today);
        } else {
          // Same day, load saved tasks
          setDailyTasks(parsedTasks);
        }
      } catch (e) {
        console.error("Error parsing saved tasks", e);
      }
    } else {
      // First time, set today as last saved
      localStorage.setItem("tasksLastSaved", new Date().toDateString());
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dailyTasks", JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  // Check task completion status and send notifications
  useEffect(() => {
    // Function to check tasks and send notifications
    const checkTasksAndNotify = () => {
      const now = new Date();
      const currentHour = now.getHours();

      // Check meal tasks based on time
      if (
        currentHour >= 10 &&
        !dailyTasks.find((t) => t.id === "breakfast")?.completed
      ) {
        showMotivationalNotification({
          message:
            "Don't forget to log your breakfast! Starting your day with tracking helps build healthy habits.",
          action: {
            label: "Log Breakfast",
            onClick: () => markTaskCompleted("breakfast"),
          },
        });
      }

      if (
        currentHour >= 14 &&
        !dailyTasks.find((t) => t.id === "lunch")?.completed
      ) {
        showMotivationalNotification({
          message:
            "Lunch tracking reminder! Keep up with your nutrition goals by logging your meal.",
          action: {
            label: "Log Lunch",
            onClick: () => markTaskCompleted("lunch"),
          },
        });
      }

      if (
        currentHour >= 20 &&
        !dailyTasks.find((t) => t.id === "dinner")?.completed
      ) {
        showMotivationalNotification({
          message:
            "Don't forget to log your dinner! Complete your day's nutrition tracking.",
          action: {
            label: "Log Dinner",
            onClick: () => markTaskCompleted("dinner"),
          },
        });
      }

      // Check water intake throughout the day
      if (
        currentHour >= 12 &&
        !dailyTasks.find((t) => t.id === "water")?.completed
      ) {
        showMotivationalNotification({
          message:
            "Staying hydrated is key to your health goals! Don't forget to log your water intake.",
          action: {
            label: "Log Water",
            onClick: () => markTaskCompleted("water"),
          },
        });
      }

      // End of day summary if tasks are incomplete
      if (currentHour >= 21) {
        const incompleteTasks = dailyTasks.filter((task) => !task.completed);
        if (incompleteTasks.length > 0) {
          showMotivationalNotification({
            message: `You have ${incompleteTasks.length} incomplete tasks today. It's not too late to track them!`,
            action: {
              label: "View Tasks",
              onClick: () => console.log("View incomplete tasks"),
            },
          });
        }
      }
    };

    // Initial check
    checkTasksAndNotify();

    // Set up interval to check periodically (every 30 minutes)
    const intervalId = setInterval(checkTasksAndNotify, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dailyTasks]);

  // Mark a task as completed
  const markTaskCompleted = (taskId: string) => {
    const task = dailyTasks.find((t) => t.id === taskId);

    setDailyTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task,
      ),
    );

    // Save to database if user is logged in
    if (user && task) {
      logTaskCompletion(user.id, taskId, task.name);
    }

    // Show confirmation toast
    toast({
      title: "Task Completed",
      description: `Great job! You've completed ${dailyTasks.find((t) => t.id === taskId)?.name}`,
      variant: "default",
    });
  };

  // Reset tasks for a new day
  const resetDailyTasks = () => {
    setDailyTasks((prev) =>
      prev.map((task) => ({ ...task, completed: false })),
    );
    localStorage.setItem("tasksLastSaved", new Date().toDateString());
  };

  return {
    dailyTasks,
    markTaskCompleted,
    resetDailyTasks,
    incompleteTasks: dailyTasks.filter((task) => !task.completed),
  };
};
