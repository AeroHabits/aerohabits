
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function PricingHeader() {
  return (
    <motion.div 
      className="text-center mb-12 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 text-transparent bg-clip-text">
        Choose Your Premium Plan
      </h2>
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
        <p className="text-xl md:text-2xl text-muted-foreground">
          72-hour free trial, then unlock full access with our premium plans
        </p>
        <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
      </div>
    </motion.div>
  );
}
