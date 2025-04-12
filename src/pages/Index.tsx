
import { AppHero } from "@/components/layout/AppHero";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AppShowcase } from "@/components/showcase/AppShowcase";
import { UserMenu } from "@/components/UserMenu";
import { PageHeader } from "@/components/layout/PageHeader";
import { memo } from "react";

// Memoize the content component to prevent unnecessary re-renders
const IndexContent = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-8"
    >
      <AppHero />
      <AppShowcase />
    </motion.div>
  );
});

IndexContent.displayName = 'IndexContent';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-x-hidden">
      <div
        className={cn(
          "container mx-auto px-4 pt-12 pb-4 md:py-6 space-y-6 md:space-y-8 safe-top",
          isMobile && "pb-20"
        )}
      >
        <div className="flex justify-between items-center">
          <PageHeader />
          <UserMenu />
        </div>

        <IndexContent />
      </div>
    </div>
  );
}

export default Index;
