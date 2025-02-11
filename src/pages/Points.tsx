
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Star, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { PointsGuide } from "@/components/badges/PointsGuide";

export default function Points() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
            Badges & Points Guide
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Learn how to earn points and unlock achievements on your journey to building better habits
          </p>
        </motion.div>

        <div className="space-y-8">
          <PointsGuide />
        </div>
      </div>
    </div>
  );
}
