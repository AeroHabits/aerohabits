
import { motion } from "framer-motion";

interface PageHeaderProps {
  title?: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: -20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      transition={{
        duration: 0.3
      }} 
      className="mb-8"
    >
      {title ? (
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-gray-400">{description}</p>}
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          {/* Subtle background with softer colors */}
          <motion.div 
            className="absolute -inset-1 rounded-lg blur-xl bg-gradient-to-r from-blue-400/10 via-indigo-300/10 to-cyan-300/10 opacity-70"
            animate={{
              background: [
                "linear-gradient(to right, rgba(96, 165, 250, 0.1), rgba(129, 140, 248, 0.1), rgba(34, 211, 238, 0.1))",
                "linear-gradient(to right, rgba(34, 211, 238, 0.1), rgba(96, 165, 250, 0.1), rgba(129, 140, 248, 0.1))",
                "linear-gradient(to right, rgba(129, 140, 248, 0.1), rgba(34, 211, 238, 0.1), rgba(96, 165, 250, 0.1))"
              ]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          
          {/* AEROHABITS text with calm styling */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight relative">
            {/* Main text with subtle gradient */}
            <motion.span 
              className="text-blue-50/90 relative inline-block"
              animate={{ 
                textShadow: [
                  "0 0 2px rgba(255, 255, 255, 0.2)",
                  "0 0 3px rgba(186, 230, 253, 0.3)",
                  "0 0 2px rgba(255, 255, 255, 0.2)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              AEROHABITS
            </motion.span>
          </h1>
        </div>
      )}
    </motion.div>
  );
}
