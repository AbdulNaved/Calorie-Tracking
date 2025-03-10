import React from "react";
import LogMealModal from "@/components/modals/LogMealModal";

export default function LogMealWithCameraStoryboard() {
  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <LogMealModal open={true} onOpenChange={() => {}} onSave={() => {}} />
    </div>
  );
}
