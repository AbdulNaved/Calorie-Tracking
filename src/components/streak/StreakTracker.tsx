import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Calendar, Trophy, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { saveUserActivity } from "@/lib/db";

interface StreakTrackerProps {
  currentStreak?: number;
  longestStreak?: number;
  todayCompleted?: boolean;
  onViewHistory?: () => void;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({
  currentStreak = 0,
  longestStreak = 0,
  todayCompleted = false,
  onViewHistory = () => {},
}) => {
  const { user } = useAuth();
  const [showAnimation, setShowAnimation] = useState(false);
  const [streakLevel, setStreakLevel] = useState<"bronze" | "silver" | "gold">(
    "bronze",
  );
  const [progress, setProgress] = useState(0);

  // Determine streak level based on current streak
  useEffect(() => {
    if (currentStreak >= 8) {
      setStreakLevel("gold");
    } else if (currentStreak >= 4) {
      setStreakLevel("silver");
    } else {
      setStreakLevel("bronze");
    }

    // Calculate progress for the next level
    if (currentStreak < 4) {
      setProgress((currentStreak / 4) * 100);
    } else if (currentStreak < 8) {
      setProgress(((currentStreak - 4) / 4) * 100);
    } else {
      setProgress(100);
    }
  }, [currentStreak]);

  // Show animation when todayCompleted changes to true
  useEffect(() => {
    if (todayCompleted) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);

      // Log streak activity to database
      if (user) {
        saveUserActivity({
          user_id: user.id,
          activity_type: "streak_updated",
          details: { currentStreak, longestStreak, completed: true },
        });
      }
    }
  }, [todayCompleted, currentStreak, longestStreak, user]);

  const getStreakColor = () => {
    switch (streakLevel) {
      case "gold":
        return "text-yellow-500";
      case "silver":
        return "text-slate-400";
      default:
        return "text-amber-600";
    }
  };

  const getStreakBg = () => {
    switch (streakLevel) {
      case "gold":
        return "bg-yellow-100";
      case "silver":
        return "bg-slate-100";
      default:
        return "bg-amber-100";
    }
  };

  const getStreakIcon = () => {
    switch (streakLevel) {
      case "gold":
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "silver":
        return <Flame className="h-5 w-5 text-slate-400" />;
      default:
        return <Flame className="h-5 w-5 text-amber-600" />;
    }
  };

  const getNextMilestone = () => {
    if (currentStreak < 4) {
      return {
        days: 4 - currentStreak,
        level: "Silver",
      };
    } else if (currentStreak < 8) {
      return {
        days: 8 - currentStreak,
        level: "Gold",
      };
    } else if (currentStreak < 30) {
      return {
        days: 30 - currentStreak,
        level: "Monthly Badge",
      };
    } else {
      return {
        days: 100 - currentStreak,
        level: "Century Badge",
      };
    }
  };

  const nextMilestone = getNextMilestone();

  return (
    <Card className="w-full min-h-[200px] bg-white overflow-hidden relative hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            Your Streak
            {currentStreak > 0 && (
              <Badge
                variant="outline"
                className={`${getStreakBg()} border-0 gap-1 flex items-center`}
              >
                {getStreakIcon()}
                {currentStreak} day{currentStreak !== 1 ? "s" : ""}
              </Badge>
            )}
          </span>
          {longestStreak > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              Best: {longestStreak} days
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Streak animation */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/5 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1.2, y: 0 }}
                exit={{ scale: 0.5, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.div
                  className={`text-4xl ${getStreakColor()}`}
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.2, 1.2, 1.2, 1],
                  }}
                  transition={{ duration: 1, repeat: 1 }}
                >
                  🔥
                </motion.div>
                <motion.p
                  className="font-bold text-lg mt-2"
                  animate={{ opacity: [0, 1] }}
                  transition={{ delay: 0.3 }}
                >
                  Streak Updated!
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {/* Current streak level */}
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${getStreakBg()}`}>
              {streakLevel === "gold" ? (
                <Trophy className="h-6 w-6 text-yellow-500" />
              ) : streakLevel === "silver" ? (
                <Flame className="h-6 w-6 text-slate-400" />
              ) : (
                <Flame className="h-6 w-6 text-amber-600" />
              )}
            </div>
            <div>
              <p className="font-medium">
                {streakLevel === "gold"
                  ? "Gold Streak"
                  : streakLevel === "silver"
                    ? "Silver Streak"
                    : "Bronze Streak"}
              </p>
              <p className="text-sm text-muted-foreground">
                {streakLevel === "gold"
                  ? "You're on fire! Keep going!"
                  : streakLevel === "silver"
                    ? "Great consistency! Almost to gold!"
                    : "Good start! Keep the momentum going!"}
              </p>
            </div>
          </div>

          {/* Progress to next level */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 animate-fade-in"
              style={{ transition: "width 1s ease-in-out" }}
            />
            <p className="text-xs text-muted-foreground">
              {nextMilestone.days} more day{nextMilestone.days !== 1 ? "s" : ""}{" "}
              until {nextMilestone.level}
            </p>
          </div>

          {/* Streak freeze option */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Streak Freeze</p>
                <p className="text-xs text-muted-foreground">
                  Protects your streak if you miss a day
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-blue-100 border-0 text-blue-700"
            >
              1 Available
            </Badge>
          </div>

          {/* View history button */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 hover-lift"
            onClick={onViewHistory}
          >
            <Calendar className="h-4 w-4" />
            View Streak History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakTracker;
