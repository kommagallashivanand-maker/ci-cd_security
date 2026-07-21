import { Toaster } from "react-hot-toast";

import "./Toast.css";

/**
 * ToastProvider
 *
 * Mounts the toast notification container. Render this once near
 * the root of the app (see `main.jsx`). Trigger toasts from anywhere
 * using the exported `showToast` helper - no prop drilling or
 * context required.
 *
 * @example
 * // main.jsx
 * <ToastProvider />
 * <App />
 *
 * // anywhere else
 * import { showToast } from "@/components/ui/Toast";
 * showToast.success("Ticket created");
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        className: "toast",
        success: { className: "toast toast--success" },
        error: { className: "toast toast--error" },
      }}
    />
  );
}

export default ToastProvider;
