/*
=====================================================
GLOBAL TOAST CONTEXT
✔ Single toast instance
✔ Auto close
✔ No duplication
✔ Reusable everywhere
=====================================================
*/

import { createContext, useContext, useState, useCallback } from "react";
import Toast from "../components/common/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  // show toast globally
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* GLOBAL FIXED TOAST */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={closeToast} />
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
