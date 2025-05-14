
// Re-export the toast function from sonner
import { toast as sonnerToast } from "sonner";

// Export the toast API
export const toast = sonnerToast;

// This file no longer tries to import useToast from toast.tsx
