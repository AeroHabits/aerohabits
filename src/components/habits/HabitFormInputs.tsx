import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Rocket, CircuitBoard } from "lucide-react";
interface HabitFormInputsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}
export const HabitFormInputs: React.FC<HabitFormInputsProps> = ({
  title,
  setTitle,
  description,
  setDescription
}) => {
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  return <div className="space-y-5">
      <motion.div animate={isTitleFocused ? {
      scale: 1.02
    } : {
      scale: 1
    }} transition={{
      type: "spring",
      stiffness: 300,
      damping: 20
    }} className="relative my-0">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Rocket className="w-5 h-5 text-[#9b87f5]" />
        </div>
        <Input placeholder="Enter your new habit..." value={title} onChange={e => setTitle(e.target.value)} onFocus={() => setIsTitleFocused(true)} onBlur={() => setIsTitleFocused(false)} className="pl-10 bg-[#2A2F3C]/70 border-2 border-[#403E43] focus:border-[#9b87f5] text-white placeholder:text-[#8E9196] text-lg font-medium transition-all duration-300 hover:border-[#9b87f5]/50 focus:ring-2 focus:ring-[#9b87f5]/30 py-6 rounded-md" />
      </motion.div>
      
      <motion.div animate={isDescriptionFocused ? {
      scale: 1.02
    } : {
      scale: 1
    }} transition={{
      type: "spring",
      stiffness: 300,
      damping: 20
    }} className="relative">
        <div className="absolute top-3 left-3 pointer-events-none">
          <CircuitBoard className="w-5 h-5 text-[#9b87f5]" />
        </div>
        <Textarea placeholder="Describe your habit..." value={description} onChange={e => setDescription(e.target.value)} onFocus={() => setIsDescriptionFocused(true)} onBlur={() => setIsDescriptionFocused(false)} className="pl-10 bg-[#2A2F3C]/70 border-2 border-[#403E43] focus:border-[#9b87f5] text-white placeholder:text-[#8E9196] text-base min-h-[100px] transition-all duration-300 hover:border-[#9b87f5]/50 focus:ring-2 focus:ring-[#9b87f5]/30 rounded-md" />
      </motion.div>
    </div>;
};