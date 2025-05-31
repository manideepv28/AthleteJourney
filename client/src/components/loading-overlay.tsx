import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message = "Loading..." }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 flex items-center space-x-3 shadow-xl">
        <Loader2 className="h-6 w-6 animate-spin text-athletic-orange" />
        <span className="text-gray-900 dark:text-white font-medium">{message}</span>
      </div>
    </div>
  );
}
