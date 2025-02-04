import { motion } from "framer-motion";

interface ChallengeMotivationProps {
  motivationText: string | null;
  isHovered: boolean;
}

export function ChallengeMotivation({ motivationText, isHovered }: ChallengeMotivationProps) {
  if (!motivationText) return null;

  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      animate={{ opacity: isHovered ? 1 : 0.8 }}
      className="p-2 bg-primary/5 rounded-lg border border-primary/10"
    >
      <p className="italic text-xs text-primary line-clamp-2">{motivationText}</p>
    </motion.div>
  );
}