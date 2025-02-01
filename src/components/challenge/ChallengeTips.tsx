import { motion } from "framer-motion";

interface ChallengeTipsProps {
  tips: string[];
  isHovered: boolean;
}

export function ChallengeTips({ tips, isHovered }: ChallengeTipsProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <motion.div 
      initial={{ height: "0px", opacity: 0 }}
      animate={{ height: isHovered ? "auto" : "0px", opacity: isHovered ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="mt-4 space-y-2 bg-blue-50/50 p-3 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-700">Tips for Success:</h4>
        <ul className="text-sm text-blue-600/80 space-y-1">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}