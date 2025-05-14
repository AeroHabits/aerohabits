
import { useToast as useShadcnToast } from "@/components/ui/toast";
import { toast as sonnerToast } from "sonner";

// Re-export the Shadcn toast hook
export const useToast = useShadcnToast;

// Re-export a unified toast API that delegates to sonner
export const toast = sonnerToast;
