import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  LineChart,
  BarChart,
  PieChart,
  Activity,
  Calendar,
} from "lucide-react";

interface ProgressChartsCardProps {
  dailyData?: {
    dates: string[];
    calories: number[];
    protein: number[];
    carbs: number[];
    fat: number[];
  };
  weeklyData?: {
    weeks: string[];
    averageCalories: number[];
    averageProtein: number[];
    averageCarbs: number[];
    averageFat: number[];
  };
}

const ProgressChartsCard: React.FC<ProgressChartsCardProps> = ({
  dailyData = {
    dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    calories: [1800, 2100, 1950, 2200, 1700, 2300, 2000],
    protein: [120, 140, 110, 130, 100, 150, 125],
    carbs: [200, 230, 190, 250, 180, 270, 210],
    fat: [60, 70, 65, 75, 55, 80, 70],
  },
  weeklyData = {
    weeks: ["Week 1", "Week 2", "Week 3", "Week 4"],
    averageCalories: [1900, 2050, 2100, 1950],
    averageProtein: [115, 125, 130, 120],
    averageCarbs: [210, 230, 240, 220],
    averageFat: [65, 70, 72, 68],
  },
}) => {
  return (
    <Card className="w-full max-w-[750px] h-[400px] bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Progress Charts</CardTitle>
          <div className="flex space-x-2">
            <button className="p-1 rounded-md hover:bg-gray-100">
              <Calendar className="h-5 w-5 text-gray-500" />
            </button>
            <button className="p-1 rounded-md hover:bg-gray-100">
              <Activity className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="daily" className="text-sm">
              <LineChart className="h-4 w-4 mr-2" />
              Daily Trends
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-sm">
              <BarChart className="h-4 w-4 mr-2" />
              Weekly Averages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="h-[280px]">
            <div className="flex flex-col h-full">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <span className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                    Calories
                  </span>
                  <span className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    Protein
                  </span>
                  <span className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    Carbs
                  </span>
                  <span className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    Fat
                  </span>
                </div>
                <select className="text-xs border rounded px-2 py-1">
                  <option>Last 7 days</option>
                  <option>Last 14 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>

              {/* Placeholder for actual chart - would use a library like recharts in real implementation */}
              <div className="flex-1 bg-gray-50 rounded-lg p-4 flex items-center justify-center relative">
                <div className="absolute inset-0 p-6">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-[10px] text-gray-500">
                    <span>2500</span>
                    <span>2000</span>
                    <span>1500</span>
                    <span>1000</span>
                    <span>500</span>
                    <span>0</span>
                  </div>

                  {/* X-axis labels */}
                  <div className="absolute left-10 right-0 bottom-0 h-5 flex justify-between text-[10px] text-gray-500">
                    {dailyData.dates.map((date, index) => (
                      <span key={index}>{date}</span>
                    ))}
                  </div>

                  {/* Chart visualization placeholder */}
                  <div className="absolute left-10 right-0 top-0 bottom-5 flex items-end">
                    {dailyData.calories.map((cal, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center justify-end h-full"
                      >
                        <div
                          className="w-1 bg-blue-500 rounded-t"
                          style={{ height: `${(cal / 2500) * 100}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  Interactive chart with hover details
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="h-[280px]">
            <div className="flex flex-col h-full">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <span className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                    Avg. Calories
                  </span>
                  <span className="flex items-center text-xs">
                    <div className="w-3 h-3 rounded-full bg-teal-500 mr-1"></div>
                    Macros Distribution
                  </span>
                </div>
                <select className="text-xs border rounded px-2 py-1">
                  <option>Last 4 weeks</option>
                  <option>Last 8 weeks</option>
                  <option>Last 12 weeks</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                {/* Bar chart placeholder */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center relative">
                  <div className="absolute inset-0 p-6">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-[10px] text-gray-500">
                      <span>2500</span>
                      <span>2000</span>
                      <span>1500</span>
                      <span>1000</span>
                      <span>500</span>
                      <span>0</span>
                    </div>

                    {/* X-axis labels */}
                    <div className="absolute left-10 right-0 bottom-0 h-5 flex justify-between text-[10px] text-gray-500">
                      {weeklyData.weeks.map((week, index) => (
                        <span key={index}>{week}</span>
                      ))}
                    </div>

                    {/* Chart visualization placeholder */}
                    <div className="absolute left-10 right-0 top-0 bottom-5 flex items-end">
                      {weeklyData.averageCalories.map((cal, index) => (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center justify-end h-full"
                        >
                          <div
                            className="w-4 bg-purple-500 rounded-t"
                            style={{ height: `${(cal / 2500) * 100}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Weekly Averages</div>
                </div>

                {/* Pie chart placeholder */}
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center relative">
                  <div className="relative w-32 h-32 rounded-full border-8 border-teal-500 overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-500 transform origin-bottom-left rotate-0"></div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-yellow-500 transform origin-top-left rotate-0"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-red-500 transform origin-top-right rotate-0"></div>
                    <div className="absolute w-16 h-16 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                  <div className="absolute bottom-2 w-full text-center text-xs text-gray-400">
                    Macros Distribution
                  </div>
                  <div className="absolute right-4 top-4 flex flex-col space-y-1 text-[10px]">
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      Protein 25%
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                      Carbs 50%
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      Fat 25%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressChartsCard;
