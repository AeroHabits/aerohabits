
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";

export const useAuthForm = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleError = (error: any) => {
    const message = error?.message || "An unexpected error occurred. Please try again.";
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
    });
  };

  return {
    isLoading,
    setIsLoading,
    navigate,
    handleError,
    handleSuccess,
    toast
  };
};
