import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function MealHistoryStoryboard() {
  // Sample meal history with captured images
  const mealHistory = [
    {
      id: "1",
      name: "Breakfast",
      time: "8:30 AM",
      calories: 450,
      capturedImageUrl:
        "https://images.unsplash.com/photo-1533089860892-a9b9ac6cd6b4?w=300&q=80",
      category: "breakfast",
      items: [
        { name: "Avocado Toast", calories: 220 },
        { name: "Scrambled Eggs", calories: 140 },
        { name: "Orange Juice", calories: 90 },
      ],
    },
    {
      id: "2",
      name: "Lunch",
      time: "12:45 PM",
      calories: 680,
      capturedImageUrl:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
      category: "lunch",
      items: [
        { name: "Grilled Chicken Salad", calories: 350 },
        { name: "Whole Grain Bread", calories: 120 },
        { name: "Apple", calories: 80 },
        { name: "Yogurt", calories: 130 },
      ],
    },
    {
      id: "3",
      name: "Dinner",
      time: "7:15 PM",
      calories: 820,
      capturedImageUrl:
        "https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&q=80",
      category: "dinner",
      items: [
        { name: "Salmon Fillet", calories: 350 },
        { name: "Brown Rice", calories: 220 },
        { name: "Steamed Vegetables", calories: 120 },
        { name: "Olive Oil", calories: 130 },
      ],
    },
  ];

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
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Today's Meal History</h2>

      <div className="space-y-4">
        {mealHistory.map((meal) => (
          <Card
            key={meal.id}
            className="overflow-hidden transition-all hover:shadow-lg"
          >
            <div className="relative">
              {meal.capturedImageUrl && (
                <img
                  src={meal.capturedImageUrl}
                  alt={meal.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <Badge
                className={`absolute top-2 right-2 ${getCategoryColor(meal.category)}`}
                variant="outline"
              >
                {meal.category}
              </Badge>
            </div>

            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{meal.name}</h3>
                <span className="text-sm text-gray-500">{meal.time}</span>
              </div>

              <div className="text-sm font-medium mb-3">
                Total: {meal.calories} calories
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-500 uppercase">
                  Items
                </h4>
                <ul className="text-sm space-y-1">
                  {meal.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="text-gray-600">{item.calories} cal</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Daily Summary</h3>
        <div className="flex justify-between text-sm">
          <span>Total Calories:</span>
          <span className="font-bold">
            {mealHistory.reduce((sum, meal) => sum + meal.calories, 0)} cal
          </span>
        </div>
      </div>
    </div>
  );
}
