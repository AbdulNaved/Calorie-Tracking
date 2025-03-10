import React, { useState } from "react";
import { Camera, Upload, Search, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
}

interface LogMealModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (meal: {
    items: FoodItem[];
    mealType: string;
    time: string;
  }) => void;
}

const defaultFoodItems: FoodItem[] = [
  {
    name: "Grilled Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    portion: "100g",
  },
  {
    name: "Brown Rice",
    calories: 112,
    protein: 2.6,
    carbs: 23.5,
    fat: 0.9,
    portion: "100g",
  },
  {
    name: "Broccoli",
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fat: 0.6,
    portion: "100g",
  },
];

const LogMealModal: React.FC<LogMealModalProps> = ({
  open = true,
  onOpenChange = () => {},
  onSave = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("camera");
  const [recognizedItems, setRecognizedItems] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
  const [mealType, setMealType] = useState("breakfast");
  const [isCapturing, setIsCapturing] = useState(false);

  // Mock function to simulate AI recognition
  const handleCapture = () => {
    setIsCapturing(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setRecognizedItems(defaultFoodItems);
      setIsCapturing(false);
    }, 1500);
  };

  const handleAddItem = (item: FoodItem) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  const handleSave = () => {
    onSave({
      items: selectedItems,
      mealType,
      time: new Date().toISOString(),
    });
    onOpenChange(false);
  };

  // Filter food items based on search query
  const filteredFoodItems = defaultFoodItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Log Meal</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <Select value={mealType} onValueChange={setMealType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera size={18} />
              <span>Camera</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Search size={18} />
              <span>Manual Entry</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 h-64">
              {isCapturing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-500">Analyzing your food...</p>
                </motion.div>
              ) : recognizedItems.length > 0 ? (
                <div className="w-full">
                  <h3 className="font-medium mb-2">Recognized Items:</h3>
                  <ul className="space-y-2 max-h-40 overflow-y-auto">
                    {recognizedItems.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-100 rounded"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.calories} kcal ({item.portion})
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddItem(item)}
                          disabled={selectedItems.some(
                            (i) => i.name === item.name,
                          )}
                        >
                          {selectedItems.some((i) => i.name === item.name) ? (
                            <Check size={16} />
                          ) : (
                            <Plus size={16} />
                          )}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <Camera size={48} className="text-gray-400 mb-4" />
                  <p className="text-center text-gray-500 mb-4">
                    Take a photo of your meal for AI recognition
                  </p>
                  <Button onClick={handleCapture}>
                    <Camera size={16} className="mr-2" />
                    Capture Food
                  </Button>
                </>
              )}
            </div>

            {recognizedItems.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setRecognizedItems([]);
                }}
              >
                Take Another Photo
              </Button>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Search for food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {filteredFoodItems.length > 0 ? (
                    <ul className="divide-y">
                      {filteredFoodItems.map((item, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-3 hover:bg-gray-50"
                        >
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.calories} kcal ({item.portion})
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddItem(item)}
                            disabled={selectedItems.some(
                              (i) => i.name === item.name,
                            )}
                          >
                            {selectedItems.some((i) => i.name === item.name) ? (
                              <Check size={16} />
                            ) : (
                              <Plus size={16} />
                            )}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No food items found. Try a different search term.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Selected Items:</h3>
          {selectedItems.length > 0 ? (
            <ul className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
              {selectedItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="text-sm text-gray-500 flex gap-2">
                      <span>{item.calories} kcal</span>
                      <span>•</span>
                      <span>P: {item.protein}g</span>
                      <span>•</span>
                      <span>C: {item.carbs}g</span>
                      <span>•</span>
                      <span>F: {item.fat}g</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-4 border border-dashed rounded-lg text-gray-500">
              No items selected yet. Use the camera or search to add food items.
            </div>
          )}

          {selectedItems.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">
                Total Calories:{" "}
                {selectedItems.reduce((sum, item) => sum + item.calories, 0)}{" "}
                kcal
              </p>
              <div className="flex gap-4 text-sm mt-1">
                <p>
                  Protein:{" "}
                  {selectedItems.reduce((sum, item) => sum + item.protein, 0)}g
                </p>
                <p>
                  Carbs:{" "}
                  {selectedItems.reduce((sum, item) => sum + item.carbs, 0)}g
                </p>
                <p>
                  Fat: {selectedItems.reduce((sum, item) => sum + item.fat, 0)}g
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedItems.length === 0}>
            Save Meal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogMealModal;
