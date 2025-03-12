
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SubmitButtonProps {
  onClick?: (e: React.FormEvent) => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative pt-2"
    >
      <Button 
        type="submit"
        onClick={onClick}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden rounded-lg"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></span>
        <span className="relative flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 animate-pulse" />
          Create Habit
        </span>
      </Button>
    </motion.div>
  );
};
