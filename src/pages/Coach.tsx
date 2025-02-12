
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AiCoach } from "@/components/coach/AiCoach";
import { UserMenu } from "@/components/UserMenu";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function Coach() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <ProtectedRoute>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "container mx-auto px-4 py-6 md:py-8 space-y-8",
            isMobile && "pb-24"
          )}
        >
          <div className="flex justify-between items-center">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
            >
              AEROHABITS
            </motion.h1>
            <UserMenu />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AiCoach />
          </motion.div>
        </motion.div>
      </ProtectedRoute>
    </div>
  );
}
