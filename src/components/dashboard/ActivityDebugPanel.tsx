import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const ActivityDebugPanel = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const loadActivities = () => {
    try {
      const storedActivities = JSON.parse(
        localStorage.getItem("userActivities") || "[]",
      );
      setActivities(storedActivities);
    } catch (error) {
      console.error("Error loading activities:", error);
      setActivities([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadActivities();
    }
  }, [isOpen]);

  const getActivityColor = (type: string) => {
    switch (type) {
      case "meal_logged":
        return "bg-green-100 text-green-800";
      case "water_logged":
        return "bg-blue-100 text-blue-800";
      case "goal_set":
        return "bg-purple-100 text-purple-800";
      case "task_completed":
        return "bg-amber-100 text-amber-800";
      case "login":
      case "signup":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-20 right-4 z-50 bg-white shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <Database className="h-4 w-4 mr-2" />
        Debug DB
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-4 z-50 w-[350px] max-h-[500px] overflow-hidden shadow-xl">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">
          Database Activity Log
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={loadActivities}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[450px] overflow-y-auto">
        {activities.length > 0 ? (
          <div className="divide-y">
            {activities.map((activity, index) => (
              <div key={index} className="p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-1">
                  <Badge
                    variant="outline"
                    className={getActivityColor(activity.activity_type)}
                  >
                    {activity.activity_type}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatDate(activity.created_at)}
                  </span>
                </div>
                <div className="text-xs mt-1">
                  <span className="font-medium">User ID:</span>{" "}
                  {activity.user_id}
                </div>
                {activity.details && (
                  <div className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(activity.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-gray-500">
            No activities recorded yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityDebugPanel;
