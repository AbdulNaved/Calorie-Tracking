import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

interface NutritionGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface GoalsProgressCardProps {
  calorieGoal?: {
    current: number;
    target: number;
  };
  nutritionGoals?: NutritionGoal[];
}

const GoalsProgressCard: React.FC<GoalsProgressCardProps> = ({
  calorieGoal = { current: 1450, target: 2000 },
  nutritionGoals = [
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
  ],
}) => {
  const calculatePercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const caloriePercentage = calculatePercentage(
    calorieGoal.current,
    calorieGoal.target,
  );

  return (
    <Card className="w-full h-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span>Goals Progress</span>
          <Badge variant="outline" className="ml-2">
            {caloriePercentage}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Calories</span>
            <span>
              {calorieGoal.current} / {calorieGoal.target} kcal
            </span>
          </div>
          <Progress value={caloriePercentage} className="h-2" />
        </div>

        <div className="space-y-3 pt-2">
          {nutritionGoals.map((goal, index) => {
            const percentage = calculatePercentage(goal.current, goal.target);
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{goal.name}</span>
                  <span>
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${goal.color} h-full rounded-full`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsProgressCard;
