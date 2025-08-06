import { useEffect, useState } from "react";
import { AlertDescription } from "@/components/ui/alert";
import { CheckCircle2Icon, AlertCircleIcon, X } from "lucide-react";

interface Sham_AlertProps {
  type: "success" | "error";
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}
const Sham_Alert = ({
  type,
  message,
  visible,
  onClose,
  duration = 4000,
}: Sham_AlertProps) => {
  const [progress, setProgress] = useState(100);
  useEffect(() => {
    if (!visible) return;
    setProgress(100);
    const interval = 100;
    const steps = duration / interval;
    const decrement = 100 / steps;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement;
        if (next <= 0) {
          clearInterval(timer);
          return 0;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [visible, duration]);
  if (!visible) return null;

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <div
        className={`relative  opacity-100 p-3 mt-2 mx-4 rounded-md border-1 ${
          type === "error"
            ? "bg-red-100 text-red-800 border-red-300"
            : "bg-green-100 text-green-800 border-green-300"
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {type === "error" ? (
              <AlertCircleIcon size={20} />
            ) : (
              <CheckCircle2Icon size={20} />
            )}
            <AlertDescription>{message}</AlertDescription>
          </div>
          <button onClick={onClose}>
            <X size={18} className="hover:opacity-50 transition-opacity" />
          </button>
        </div>
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-current rounded transition-all duration-100"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Sham_Alert;
