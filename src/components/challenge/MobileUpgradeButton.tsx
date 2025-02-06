
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function MobileUpgradeButton() {
  return (
    <motion.div 
      className="md:hidden fixed bottom-4 left-4 right-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button 
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold shadow-lg"
        onClick={() => toast.info("Premium features coming soon!")}
      >
        Upgrade to Premium
      </Button>
    </motion.div>
  );
}
