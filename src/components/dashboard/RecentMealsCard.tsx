import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface MealItem {
  id: string;
  name: string;
  time: string;
  calories: number;
  imageUrl?: string;
  category: "breakfast" | "lunch" | "dinner" | "snack";
  capturedImageUrl?: string;
}

interface RecentMealsCardProps {
  meals?: MealItem[];
  title?: string;
}

const RecentMealsCard = ({
  meals = [
    {
      id: "1",
      name: "Avocado Toast",
      time: "8:30 AM",
      calories: 320,
      imageUrl:
        "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=200&q=80",
      category: "breakfast",
    },
    {
      id: "2",
      name: "Grilled Chicken Salad",
      time: "12:45 PM",
      calories: 420,
      imageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80",
      category: "lunch",
    },
    {
      id: "3",
      name: "Protein Smoothie",
      time: "3:15 PM",
      calories: 210,
      imageUrl:
        "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=200&q=80",
      category: "snack",
    },
  ],
  title = "Recent Meals",
}: RecentMealsCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "breakfast":
        return "bg-yellow-100 text-yellow-800";
      case "lunch":
        return "bg-green-100 text-green-800";
      case "dinner":
        return "bg-blue-100 text-blue-800";
      case "snack":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full h-full min-h-[200px] bg-white overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 max-h-[240px] h-[240px] overflow-y-auto pr-2 -mx-2 px-2">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50 transition-colors flex-wrap sm:flex-nowrap gap-y-2"
            >
              <Avatar className="h-12 w-12 rounded-md">
                {meal.capturedImageUrl ? (
                  <AvatarImage
                    src={meal.capturedImageUrl}
                    alt={meal.name}
                    className="object-cover"
                  />
                ) : meal.imageUrl ? (
                  <AvatarImage src={meal.imageUrl} alt={meal.name} />
                ) : (
                  <AvatarFallback className="rounded-md bg-primary/10">
                    {meal.name.substring(0, 2)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {meal.name}
                </p>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{meal.time}</span>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1 ml-auto sm:ml-0">
                <span className="text-sm font-semibold">
                  {meal.calories} cal
                </span>
                <Badge
                  className={`text-xs ${getCategoryColor(meal.category)}`}
                  variant="outline"
                >
                  {meal.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        {meals.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[200px] text-center">
            <p className="text-gray-500 mb-2">No meals logged today</p>
            <p className="text-sm text-gray-400">
              Your recent meals will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentMealsCard;
