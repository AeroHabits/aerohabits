
import { motion } from "framer-motion";
import { HeroTitle } from "./HeroTitle";
import { AnimatedUnderline } from "./AnimatedUnderline";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function AppHero() {
  return (
    <section className="relative py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-8">
            {/* Hero title and content */}
            <div className="space-y-6">
              <HeroTitle />
              <AnimatedUnderline />
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg md:text-xl leading-relaxed text-blue-100/70 max-w-[600px] mx-auto md:mx-0"
              >
                Track your custom habits, build consistency, and achieve your highest potential through our sophisticated habit tracking system designed for professionals.
              </motion.p>
            </div>
            
            {/* CTA buttons - enhanced with more engaging styles */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link to="/habits">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative"
                >
                  <Button 
                    size="lg" 
                    variant="premium"
                    className="group relative overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-all duration-300 w-full sm:w-auto"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center">
                      Get Started <Sparkles className="ml-1 h-4 w-4 text-indigo-200 animate-pulse" /> <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/challenges">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative"
                >
                  <Button 
                    variant="glass" 
                    size="lg" 
                    className="group relative overflow-hidden hover:shadow-purple-500/10 transition-all duration-300 w-full sm:w-auto"
                  >
                    <span className="relative flex items-center">
                      Explore Challenges
                      <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div 
            className="flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative w-full max-w-[400px] aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-1">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-xl backdrop-blur-sm"></div>
              <img 
                src="/placeholder.svg" 
                alt="Habit tracking dashboard preview" 
                className="rounded-xl w-full h-full object-cover relative z-10"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20 rounded-xl z-20 pointer-events-none"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
