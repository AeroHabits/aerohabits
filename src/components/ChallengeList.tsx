
import { ChallengeListContainer } from "./challenge/ChallengeListContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

export function ChallengeList() {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${isMobile ? 'px-2' : 'px-4'}`}
    >
      <ChallengeListContainer />
    </motion.div>
  );
}
