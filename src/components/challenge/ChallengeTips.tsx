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
      <div className="mt-2 space-y-1 bg-blue-50/50 p-2 rounded-lg">
        <h4 className="text-xs font-semibold text-blue-700">Tips:</h4>
        <ul className="text-xs text-blue-600/80 space-y-0.5">
          {tips.slice(0, 3).map((tip, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-blue-400 shrink-0">•</span>
              <span className="line-clamp-1">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}