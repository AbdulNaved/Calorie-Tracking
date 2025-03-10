import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CalorieSummaryCardProps {
  consumedCalories?: number;
  goalCalories?: number;
  remainingCalories?: number;
}

const CalorieSummaryCard: React.FC<CalorieSummaryCardProps> = ({
  consumedCalories = 1250,
  goalCalories = 2000,
  remainingCalories = 750,
}) => {
  // Calculate percentage of goal consumed
  const percentageConsumed = Math.min(
    Math.round((consumedCalories / goalCalories) * 100),
    100,
  );

  return (
    <Card className="w-full h-full min-h-[200px] bg-white overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Daily Calories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-4xl font-bold text-primary animate-scale-in">
            {consumedCalories}
          </div>
          <div className="text-sm text-muted-foreground">
            Goal: <span className="font-medium">{goalCalories}</span>
          </div>
        </div>

        <Progress
          value={percentageConsumed}
          className="h-2 mb-2 animate-fade-in"
          style={{ transition: "width 1s ease-in-out" }}
        />

        <div className="flex justify-between text-sm mt-4 flex-wrap gap-y-2">
          <div>
            <span className="text-muted-foreground">Consumed</span>
            <p className="font-medium">{consumedCalories} kcal</p>
          </div>
          <div>
            <span className="text-muted-foreground">Remaining</span>
            <p className="font-medium">{remainingCalories} kcal</p>
          </div>
        </div>

        <div className="mt-6 p-3 bg-primary/10 rounded-lg hover:bg-primary/15 transition-colors duration-300">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
            <span className="text-sm font-medium">
              {percentageConsumed}% of daily goal consumed
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieSummaryCard;
