
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function ChallengeHero() {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 p-6 rounded-lg backdrop-blur-sm border border-purple-400/30 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-8 h-8 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">
          Epic Challenges Await!
        </h2>
      </div>
      <p className="text-gray-100">
        Push your limits, achieve greatness, and unlock rewards along the way.
      </p>
    </motion.div>
  );
}
