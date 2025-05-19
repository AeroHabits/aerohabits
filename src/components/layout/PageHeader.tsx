
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
    >
      {title ? (
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-gray-400">{description}</p>}
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          {/* More subtle background effect */}
          <motion.div 
            className="absolute -inset-1 rounded-lg blur-xl bg-gradient-to-r from-indigo-800/5 via-blue-800/5 to-purple-800/5 opacity-60"
            animate={{
              background: [
                "linear-gradient(to right, rgba(79, 70, 229, 0.05), rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
                "linear-gradient(to right, rgba(147, 51, 234, 0.05), rgba(79, 70, 229, 0.05), rgba(59, 130, 246, 0.05))",
                "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05), rgba(79, 70, 229, 0.05))"
              ]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          
          {/* AEROHABITS text with refined styling */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight relative">
            {/* Main text with subtle effect */}
            <motion.span 
              className="text-white/90 relative inline-block"
              animate={{ 
                textShadow: [
                  "0 0 1px rgba(255, 255, 255, 0.1)",
                  "0 0 2px rgba(186, 230, 253, 0.2)",
                  "0 0 1px rgba(255, 255, 255, 0.1)"
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
