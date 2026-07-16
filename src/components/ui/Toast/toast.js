import toast from "react-hot-toast";

/**
 * showToast
 *
 * Thin, semantic wrapper around react-hot-toast so the rest of the
 * app depends on our own API instead of a third-party import.
 *
 * @property {(message: string) => void} success
 * @property {(message: string) => void} error
 * @property {(message: string) => void} info
 */
export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast(message),
};
