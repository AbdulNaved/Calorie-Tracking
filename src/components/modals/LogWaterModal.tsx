import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Droplet } from "lucide-react";

interface LogWaterModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (amount: number) => void;
}

const LogWaterModal = ({
  open = true,
  onOpenChange,
  onSave,
}: LogWaterModalProps) => {
  const [waterAmount, setWaterAmount] = useState<number>(250); // Default to 250ml

  const handleSliderChange = (value: number[]) => {
    setWaterAmount(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setWaterAmount(value);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(waterAmount);
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-50">
          <Droplet className="mr-2 h-4 w-4 text-blue-500" />
          Log Water
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Log Water Intake
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="flex items-center justify-center">
            <Droplet className="h-16 w-16 text-blue-500" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="water-amount" className="text-sm font-medium">
                Amount (ml):
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  id="water-amount"
                  type="number"
                  value={waterAmount}
                  onChange={handleInputChange}
                  className="w-20 text-right"
                  min={0}
                  max={2000}
                />
                <span className="text-sm">ml</span>
              </div>
            </div>

            <Slider
              value={[waterAmount]}
              min={0}
              max={2000}
              step={50}
              onValueChange={handleSliderChange}
              className="py-4"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>0 ml</span>
              <span>500 ml</span>
              <span>1000 ml</span>
              <span>1500 ml</span>
              <span>2000 ml</span>
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                Staying hydrated is essential for your health. The recommended
                daily water intake is about 2000-3000 ml.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Water Intake
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogWaterModal;
