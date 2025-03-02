
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
      {/* Professional background with subtle gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white opacity-95" />
      
      {/* Primary accent element - subtle gray sphere */}
      <motion.div 
        className="absolute top-1/4 left-1/3 w-[900px] h-[900px] bg-gray-200 rounded-full mix-blend-multiply filter blur-[150px] opacity-30"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      />
      
      {/* Secondary accent - smaller complementary element */}
      <motion.div 
        className="absolute bottom-20 -right-40 w-[700px] h-[700px] bg-gray-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: `translateY(${scrollY * -0.03}px)`,
        }}
      />
      
      {/* Subtle blue accent for depth and contrast */}
      <motion.div 
        className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gray-100 rounded-full mix-blend-multiply filter blur-[140px] opacity-25"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transform: `translateY(${scrollY * -0.04}px)`,
        }}
      />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTk5OTkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptLTJ6TTAgMGg2MHY2MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
    </div>
  );
}
