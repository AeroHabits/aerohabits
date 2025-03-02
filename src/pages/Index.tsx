
import { AppHero } from "@/components/layout/AppHero";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AppShowcase } from "@/components/showcase/AppShowcase";
import { UserMenu } from "@/components/UserMenu";
import { PageHeader } from "@/components/layout/PageHeader";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
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

        <div className="space-y-8">
          <AppHero />
          <AppShowcase />
        </div>
      </div>
    </div>
  );
}

export default Index;
