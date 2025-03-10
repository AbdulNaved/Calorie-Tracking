import React, { useState } from "react";
import StreakTracker from "@/components/streak/StreakTracker";
import StreakHistory from "@/components/streak/StreakHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StreakFeatureStoryboard() {
  const [showHistory, setShowHistory] = useState(false);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(5);

  const handleCompleteDay = () => {
    setTodayCompleted(true);
    setCurrentStreak((prev) => prev + 1);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Streak Feature Demo</h1>

      <div className="space-y-6">
        <StreakTracker
          currentStreak={currentStreak}
          longestStreak={12}
          todayCompleted={todayCompleted}
          onViewHistory={() => setShowHistory(true)}
        />

        <Card>
          <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleCompleteDay}
              disabled={todayCompleted}
              className="w-full"
            >
              {todayCompleted
                ? "Day Already Completed"
                : "Complete Today's Goal"}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setTodayCompleted(false);
                setCurrentStreak(5);
              }}
              className="w-full"
            >
              Reset Demo
            </Button>
          </CardContent>
        </Card>
      </div>

      <StreakHistory
        open={showHistory}
        onOpenChange={setShowHistory}
        streakData={{
          currentStreak: currentStreak,
          longestStreak: 12,
          streakStartDate: new Date(
            new Date().setDate(new Date().getDate() - currentStreak),
          ),
          completedDates: Array.from({ length: currentStreak }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (currentStreak - i));
            return date;
          }),
          milestones: [
            {
              date: new Date(new Date().setDate(new Date().getDate() - 7)),
              days: 7,
              type: "weekly",
            },
          ],
        }}
      />
    </div>
  );
}
