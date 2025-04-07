
import { toast as sonnerToast } from "sonner";

// Wrapper functions for Sonner toast with consistent API
export const toast = {
  info: (message: string, options?: any) => sonnerToast.info(message, options),
  success: (message: string, options?: any) => sonnerToast.success(message, options),
  warning: (message: string, options?: any) => sonnerToast.warning(message, options),
  error: (message: string, options?: any) => sonnerToast.error(message, options)
};
