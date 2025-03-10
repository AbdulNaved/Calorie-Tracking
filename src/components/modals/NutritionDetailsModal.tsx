import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, PieChart, Activity, Droplets, Apple } from "lucide-react";

interface NutritionDetailsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const NutritionDetailsModal = ({
  open = true,
  onOpenChange = () => {},
}: NutritionDetailsModalProps) => {
  // Show motivational notification when modal opens
  React.useEffect(() => {
    if (open) {
      const motivationalMessages = [
        "Great job tracking your nutrition! You're on your way to a healthier you.",
        "Remember, consistency is key to reaching your health goals!",
        "Small changes in your diet can lead to big results over time.",
        "You're making informed choices about your nutrition - that's something to be proud of!",
      ];

      const randomMessage =
        motivationalMessages[
          Math.floor(Math.random() * motivationalMessages.length)
        ];

      // Add a slight delay for better UX
      const timer = setTimeout(() => {
        const toast = document.createElement("div");
        toast.className =
          "fixed bottom-4 right-4 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg shadow-lg z-50 animate-fadeIn";
        toast.innerHTML = `
          <div class="flex items-start gap-3">
            <div class="text-green-500 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            </div>
            <div>
              <p class="font-medium mb-1">Nutrition Insight</p>
              <p class="text-sm">${randomMessage}</p>
            </div>
          </div>
        `;
        document.body.appendChild(toast);

        // Add animation
        setTimeout(() => {
          toast.classList.add("animate-bounce");
          setTimeout(() => toast.classList.remove("animate-bounce"), 1000);
        }, 500);

        // Remove after 5 seconds
        setTimeout(() => {
          toast.classList.add("animate-fadeOut");
          setTimeout(() => toast.remove(), 500);
        }, 5000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Nutrition Details
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="macros" className="w-full mt-4">
          <TabsList className="w-full flex justify-between mb-6">
            <TabsTrigger value="macros" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Macronutrients
            </TabsTrigger>
            <TabsTrigger value="micros" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Micronutrients
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Meal History
            </TabsTrigger>
          </TabsList>

          {/* Macronutrients Tab */}
          <TabsContent value="macros" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MacroCard
                title="Protein"
                value={65}
                total={120}
                unit="g"
                color="bg-blue-500"
              />
              <MacroCard
                title="Carbs"
                value={180}
                total={250}
                unit="g"
                color="bg-green-500"
              />
              <MacroCard
                title="Fat"
                value={45}
                total={80}
                unit="g"
                color="bg-yellow-500"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daily Macronutrient Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  {/* Placeholder for chart */}
                  <div className="text-center">
                    <PieChart className="h-16 w-16 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">
                      Macronutrient Distribution Chart
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Calorie Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <NutritionItem
                      label="Protein"
                      value="260 kcal"
                      percentage={25}
                      color="bg-blue-500"
                    />
                    <NutritionItem
                      label="Carbs"
                      value="720 kcal"
                      percentage={55}
                      color="bg-green-500"
                    />
                    <NutritionItem
                      label="Fat"
                      value="405 kcal"
                      percentage={20}
                      color="bg-yellow-500"
                    />
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Carbohydrate Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <NutritionItem
                      label="Fiber"
                      value="28g"
                      percentage={15}
                      color="bg-amber-700"
                    />
                    <NutritionItem
                      label="Sugar"
                      value="45g"
                      percentage={25}
                      color="bg-red-500"
                    />
                    <NutritionItem
                      label="Other Carbs"
                      value="107g"
                      percentage={60}
                      color="bg-purple-500"
                    />
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Micronutrients Tab */}
          <TabsContent value="micros" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    Vitamins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <NutritionItem
                      label="Vitamin A"
                      value="850 mcg"
                      percentage={85}
                      color="bg-orange-500"
                    />
                    <NutritionItem
                      label="Vitamin C"
                      value="75 mg"
                      percentage={95}
                      color="bg-yellow-400"
                    />
                    <NutritionItem
                      label="Vitamin D"
                      value="15 mcg"
                      percentage={75}
                      color="bg-yellow-600"
                    />
                    <NutritionItem
                      label="Vitamin E"
                      value="12 mg"
                      percentage={65}
                      color="bg-green-400"
                    />
                    <NutritionItem
                      label="Vitamin K"
                      value="90 mcg"
                      percentage={80}
                      color="bg-green-600"
                    />
                    <NutritionItem
                      label="B Vitamins"
                      value="Various"
                      percentage={90}
                      color="bg-blue-400"
                    />
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    Minerals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <NutritionItem
                      label="Calcium"
                      value="1000 mg"
                      percentage={80}
                      color="bg-gray-400"
                    />
                    <NutritionItem
                      label="Iron"
                      value="12 mg"
                      percentage={65}
                      color="bg-red-800"
                    />
                    <NutritionItem
                      label="Magnesium"
                      value="320 mg"
                      percentage={75}
                      color="bg-purple-400"
                    />
                    <NutritionItem
                      label="Potassium"
                      value="3500 mg"
                      percentage={85}
                      color="bg-yellow-500"
                    />
                    <NutritionItem
                      label="Zinc"
                      value="10 mg"
                      percentage={90}
                      color="bg-gray-600"
                    />
                    <NutritionItem
                      label="Sodium"
                      value="1800 mg"
                      percentage={70}
                      color="bg-blue-300"
                    />
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daily Micronutrient Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  {/* Placeholder for chart */}
                  <div className="text-center">
                    <Activity className="h-16 w-16 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">
                      Micronutrient Progress Chart
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meal History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <MealHistoryItem
                    time="7:30 AM"
                    title="Breakfast"
                    items={["Oatmeal with berries", "Greek yogurt", "Coffee"]}
                    calories={420}
                  />
                  <MealHistoryItem
                    time="10:30 AM"
                    title="Morning Snack"
                    items={["Apple", "Handful of almonds"]}
                    calories={180}
                  />
                  <MealHistoryItem
                    time="1:00 PM"
                    title="Lunch"
                    items={[
                      "Grilled chicken salad",
                      "Whole grain bread",
                      "Sparkling water",
                    ]}
                    calories={550}
                  />
                  <MealHistoryItem
                    time="4:00 PM"
                    title="Afternoon Snack"
                    items={["Protein shake", "Banana"]}
                    calories={250}
                  />
                  <MealHistoryItem
                    time="7:00 PM"
                    title="Dinner"
                    items={[
                      "Salmon",
                      "Quinoa",
                      "Roasted vegetables",
                      "Glass of wine",
                    ]}
                    calories={680}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Calorie Intake</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-md">
                  {/* Placeholder for chart */}
                  <div className="text-center">
                    <BarChart className="h-16 w-16 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">
                      Weekly Calorie Intake Chart
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface MacroCardProps {
  title: string;
  value: number;
  total: number;
  unit: string;
  color: string;
}

const MacroCard = ({ title, value, total, unit, color }: MacroCardProps) => {
  const percentage = Math.round((value / total) * 100);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex justify-between mb-2">
          <span className="text-2xl font-bold">
            {value}
            {unit}
          </span>
          <span className="text-gray-500">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`${color} h-2.5 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          of {total}
          {unit} goal
        </p>
      </CardContent>
    </Card>
  );
};

interface NutritionItemProps {
  label: string;
  value: string;
  percentage: number;
  color: string;
}

const NutritionItem = ({
  label,
  value,
  percentage,
  color,
}: NutritionItemProps) => {
  return (
    <li className="flex items-center">
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-gray-500">{value}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`${color} h-1.5 rounded-full`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </li>
  );
};

interface MealHistoryItemProps {
  time: string;
  title: string;
  items: string[];
  calories: number;
}

const MealHistoryItem = ({
  time,
  title,
  items,
  calories,
}: MealHistoryItemProps) => {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-sm text-gray-500">{time}</span>
          <h4 className="font-medium">{title}</h4>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium">{calories} kcal</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center gap-1"
          >
            <Apple className="h-3 w-3 text-gray-500" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionDetailsModal;
