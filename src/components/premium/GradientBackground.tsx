
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function GradientBackground() {
  const [scrollY, setScrollY] = useState(0);

  // Update scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep rich background with premium feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E] via-[#16213E] to-[#0F0F1A] opacity-95" />
      
      {/* Gold primary accent elements */}
      <motion.div 
        className="absolute top-0 left-1/4 w-[800px] h-[500px] bg-[#D4AF37] rounded-full mix-blend-soft-light filter blur-[120px] opacity-30"
        animate={{
          x: [0, 20, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          transform: `translateY(${scrollY * 0.08}px)`,
        }}
      />
      
      {/* Secondary gold accent */}
      <motion.div 
        className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-[#B8860B] rounded-full mix-blend-soft-light filter blur-[100px] opacity-20"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
        style={{
          transform: `translateY(${scrollY * -0.05}px)`,
        }}
      />
      
      {/* Soft gold ambient accent */}
      <motion.div 
        className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-[#E6C200] rounded-full mix-blend-soft-light filter blur-[120px] opacity-10"
        animate={{
          x: [0, -10, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          transform: `translateY(${scrollY * -0.03}px)`,
        }}
      />
      
      {/* Dark rich blue accent */}
      <motion.div 
        className="absolute top-3/4 left-1/4 w-[400px] h-[400px] bg-[#003366] rounded-full mix-blend-soft-light filter blur-[80px] opacity-30"
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Premium subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/40 opacity-60" />
      
      {/* Subtle pattern overlay for depth */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkQ3MDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptLTJ6TTAgMGg2MHY2MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
    </div>
  );
}
