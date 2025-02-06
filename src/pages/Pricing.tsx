
import { AppHeader } from "@/components/layout/AppHeader";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { TestimonialList } from "@/components/testimonials/TestimonialList";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Pricing = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className={cn(
        "container py-8 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        isMobile && "pb-24"
      )}>
        <AppHeader />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20">
            <PricingTiers />
            <TestimonialList />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
