import { useState, useEffect, useCallback } from "react";
type AlertType = "success" | "error";
interface AlertState {
  type: AlertType;
  message: string;
  visible: boolean;
}

export const useAlert = (duration = 4000) => {
  const [alert, setAlert] = useState<AlertState>({
    type: "success",
    message: "",
    visible: false,
  });

  const showAlert = useCallback((type: AlertType, message: string) => {
    setAlert({ type, message, visible: true });
  }, []);
  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => {
        hideAlert();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [alert.visible, duration, hideAlert]);
  return { alert, showAlert, hideAlert };
};
