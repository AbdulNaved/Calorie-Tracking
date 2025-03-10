import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Cog, Target } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const formSchema = z.object({
  calorieGoal: z
    .number()
    .min(500, {
      message: "Calorie goal must be at least 500",
    })
    .max(5000, {
      message: "Calorie goal must not exceed 5000",
    }),
  proteinGoal: z
    .number()
    .min(0, {
      message: "Protein goal must be at least 0g",
    })
    .max(300, {
      message: "Protein goal must not exceed 300g",
    }),
  carbsGoal: z
    .number()
    .min(0, {
      message: "Carbs goal must be at least 0g",
    })
    .max(500, {
      message: "Carbs goal must not exceed 500g",
    }),
  fatGoal: z
    .number()
    .min(0, {
      message: "Fat goal must be at least 0g",
    })
    .max(200, {
      message: "Fat goal must not exceed 200g",
    }),
});

type FormValues = z.infer<typeof formSchema>;

interface GoalsSettingModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (values: FormValues) => void;
  defaultValues?: Partial<FormValues>;
}

const GoalsSettingModal = ({
  open = true,
  onOpenChange,
  onSave,
  defaultValues = {
    calorieGoal: 2000,
    proteinGoal: 120,
    carbsGoal: 200,
    fatGoal: 65,
  },
}: GoalsSettingModalProps) => {
  const [isOpen, setIsOpen] = useState(open);

  // Update isOpen when open prop changes
  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as FormValues,
  });

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const onSubmit = (values: FormValues) => {
    onSave?.(values);
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Only render DialogTrigger if not controlled externally */}
      {!onOpenChange && (
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-white hover-lift">
            <Cog className="mr-2 h-4 w-4" />
            Set Goals
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" />
            Set Nutrition Goals
          </DialogTitle>
          <DialogDescription>
            Customize your daily nutrition targets to match your health and
            fitness goals.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="calorieGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Calorie Goal</FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <Slider
                        min={500}
                        max={5000}
                        step={50}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="flex-1"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-20"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Set your daily calorie intake target
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proteinGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protein Goal (g)</FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <Slider
                        min={0}
                        max={300}
                        step={5}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="flex-1"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-20"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Recommended: 0.8-1.6g per kg of body weight
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carbsGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carbohydrates Goal (g)</FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <Slider
                        min={0}
                        max={500}
                        step={10}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="flex-1"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-20"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Typically 45-65% of total daily calories
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fatGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fat Goal (g)</FormLabel>
                  <div className="flex items-center gap-4">
                    <FormControl>
                      <Slider
                        min={0}
                        max={200}
                        step={5}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="flex-1"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-20"
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Typically 20-35% of total daily calories
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Goals</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalsSettingModal;
