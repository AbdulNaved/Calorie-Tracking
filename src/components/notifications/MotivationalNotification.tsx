import React from "react";
import { Toast, ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2 } from "lucide-react";

interface MotivationalNotificationProps {
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const motivationalMessages = [
  "You're doing great! Keep going with your nutrition goals today.",
  "Every healthy choice counts. Ready to log your next meal?",
  "Small steps lead to big results. Let's track your progress!",
  "Don't give up now! You're on your way to a healthier you.",
  "Remember why you started. Your future self will thank you!",
  "Consistency is key to success. Let's finish strong today!",
  "You've got this! Just a few more entries to complete your day.",
  "Progress over perfection. Every logged meal is a win!",
  "Your health journey matters. Let's keep the momentum going!",
  "Missing some entries today? No problem - let's get back on track!",
];

export const useMotivationalNotification = () => {
  const { toast } = useToast();

  const showMotivationalNotification = (
    customProps?: MotivationalNotificationProps,
  ) => {
    const randomMessage =
      motivationalMessages[
        Math.floor(Math.random() * motivationalMessages.length)
      ];

    toast({
      title: "Daily Task Reminder",
      description: customProps?.message || randomMessage,
      action: customProps?.action ? (
        <ToastAction
          altText={customProps.action.label}
          onClick={customProps.action.onClick}
        >
          {customProps.action.label}
        </ToastAction>
      ) : (
        <ToastAction altText="Log Now" onClick={() => {}}>
          Log Now
        </ToastAction>
      ),
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    });
  };

  return { showMotivationalNotification };
};

export const MotivationalNotification: React.FC<
  MotivationalNotificationProps
> = ({ message, action }) => {
  return (
    <Toast>
      <div className="flex items-start gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <div className="grid gap-1">
          <div className="font-medium">Daily Task Reminder</div>
          <div className="text-sm text-muted-foreground">
            {message ||
              motivationalMessages[
                Math.floor(Math.random() * motivationalMessages.length)
              ]}
          </div>
        </div>
      </div>
      {action && (
        <ToastAction altText={action.label} onClick={action.onClick}>
          {action.label}
        </ToastAction>
      )}
    </Toast>
  );
};

export default MotivationalNotification;
