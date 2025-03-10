import React from "react";
import { format, subDays, isSameDay } from "date-fns";
import { Calendar, Flame, Trophy, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StreakHistoryProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  streakData?: {
    currentStreak: number;
    longestStreak: number;
    streakStartDate: Date;
    completedDates: Date[];
    milestones: {
      date: Date;
      days: number;
      type: string;
    }[];
  };
}

const StreakHistory: React.FC<StreakHistoryProps> = ({
  open = false,
  onOpenChange = () => {},
  streakData = {
    currentStreak: 5,
    longestStreak: 12,
    streakStartDate: subDays(new Date(), 5),
    completedDates: [
      subDays(new Date(), 5),
      subDays(new Date(), 4),
      subDays(new Date(), 3),
      subDays(new Date(), 2),
      subDays(new Date(), 1),
    ],
    milestones: [
      {
        date: subDays(new Date(), 7),
        days: 7,
        type: "weekly",
      },
    ],
  },
}) => {
  // Generate last 30 days for calendar view
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const isCompleted = streakData.completedDates.some((d) =>
      isSameDay(d, date),
    );
    const milestone = streakData.milestones.find((m) =>
      isSameDay(m.date, date),
    );
    return { date, isCompleted, milestone };
  });

  // Group days by week for calendar view
  const weeks = [];
  for (let i = 0; i < last30Days.length; i += 7) {
    weeks.push(last30Days.slice(i, i + 7));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Your Streak History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Streak stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="p-3 rounded-full bg-amber-100 mb-2">
                  <Flame className="h-6 w-6 text-amber-600" />
                </div>
                <p className="text-2xl font-bold">{streakData.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="p-3 rounded-full bg-yellow-100 mb-2">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold">{streakData.longestStreak}</p>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar view */}
          <div className="space-y-2">
            <h3 className="font-medium">Last 30 Days</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 text-center text-xs font-medium bg-gray-50 border-b">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, i) => (
                    <div key={i} className="py-2">
                      {day}
                    </div>
                  ),
                )}
              </div>
              <div className="divide-y">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7">
                    {week.map((day, dayIndex) => {
                      const isToday = isSameDay(day.date, new Date());
                      return (
                        <div
                          key={dayIndex}
                          className={`h-14 p-1 border-r last:border-r-0 relative ${isToday ? "bg-blue-50" : ""}`}
                        >
                          <div className="text-xs text-right mb-1">
                            {format(day.date, "d")}
                          </div>
                          {day.isCompleted && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Flame className="h-4 w-4 text-green-600" />
                              </div>
                            </div>
                          )}
                          {day.milestone && (
                            <div className="absolute bottom-1 right-1">
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                {day.milestone.days}d
                              </Badge>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-3">
            <h3 className="font-medium">Your Achievements</h3>
            <div className="space-y-2">
              {streakData.milestones.length > 0 ? (
                streakData.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="p-2 rounded-full bg-yellow-100">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">{milestone.days}-Day Streak</p>
                      <p className="text-xs text-muted-foreground">
                        Achieved on {format(milestone.date, "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Keep going to earn milestone badges!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StreakHistory;
