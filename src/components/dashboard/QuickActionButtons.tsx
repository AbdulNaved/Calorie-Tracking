import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { UtensilsCrossed, Droplets, PieChart, Plus } from "lucide-react";

interface QuickActionButtonsProps {
  onLogMeal?: () => void;
  onLogWater?: () => void;
  onViewNutrition?: () => void;
}

const QuickActionButtons = ({
  onLogMeal = () => {},
  onLogWater = () => {},
  onViewNutrition = () => {},
}: QuickActionButtonsProps) => {
  const [openMealModal, setOpenMealModal] = useState(true);
  const [openWaterModal, setOpenWaterModal] = useState(true);
  const [openNutritionModal, setOpenNutritionModal] = useState(true);

  return (
    <div className="w-full h-[60px] md:h-[70px] bg-background flex items-center justify-center px-4 py-2 shadow-sm border-t fixed bottom-0 left-0 right-0 z-20 backdrop-blur-sm bg-white/90">
      <div className="max-w-4xl w-full flex items-center justify-between gap-2 md:gap-4">
        <Dialog open={openMealModal} onOpenChange={setOpenMealModal}>
          <DialogTrigger asChild>
            <Button
              onClick={onLogMeal}
              className="flex-1 gap-1 md:gap-2 text-xs md:text-sm bg-green-500 hover:bg-green-600 text-white px-2 md:px-4 hover-scale"
            >
              <UtensilsCrossed className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden xs:inline">Log Meal</span>
              <span className="xs:hidden">Meal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-[700px] overflow-y-auto">
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Log Meal</h2>
              <p>Meal logging interface would appear here</p>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openWaterModal} onOpenChange={setOpenWaterModal}>
          <DialogTrigger asChild>
            <Button
              onClick={onLogWater}
              className="flex-1 gap-1 md:gap-2 text-xs md:text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 md:px-4 hover-scale"
            >
              <Droplets className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden xs:inline">Log Water</span>
              <span className="xs:hidden">Water</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Log Water Intake
              </h2>
              <p>Water logging interface would appear here</p>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openNutritionModal} onOpenChange={setOpenNutritionModal}>
          <DialogTrigger asChild>
            <Button
              onClick={onViewNutrition}
              className="flex-1 gap-1 md:gap-2 text-xs md:text-sm bg-purple-500 hover:bg-purple-600 text-white px-2 md:px-4 hover-scale"
            >
              <PieChart className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden xs:inline">Nutrition Details</span>
              <span className="xs:hidden">Nutrition</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] h-[90vh] sm:h-[600px] overflow-y-auto">
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Nutrition Details
              </h2>
              <p>Detailed nutrition information would appear here</p>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          className="rounded-full h-10 w-10 md:h-12 md:w-12 p-0 flex items-center justify-center flex-shrink-0 animate-pulse"
        >
          <Plus className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
    </div>
  );
};

export default QuickActionButtons;
