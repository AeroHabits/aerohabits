
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1222] via-[#1A1F35] to-[#090B18] opacity-95" />
      
      {/* Primary accent element - large elegant gold sphere */}
      <motion.div 
        className="absolute top-1/4 left-1/3 w-[900px] h-[900px] bg-[#D4AF37] rounded-full mix-blend-soft-light filter blur-[150px] opacity-20"
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
      
      {/* Secondary gold accent - smaller complementary element */}
      <motion.div 
        className="absolute bottom-20 -right-40 w-[700px] h-[700px] bg-[#B8860B] rounded-full mix-blend-soft-light filter blur-[120px] opacity-15"
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
        className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-[#001D6E] rounded-full mix-blend-soft-light filter blur-[140px] opacity-20"
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
      
      {/* Deep purple accent for rich contrast */}
      <motion.div 
        className="absolute top-3/4 left-1/4 w-[600px] h-[600px] bg-[#3D0066] rounded-full mix-blend-soft-light filter blur-[100px] opacity-15"
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Premium vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 opacity-70" />
      
      {/* Subtle pattern overlay with golden texture */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNEMjg2MTQiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptLTJ6TTAgMGg2MHY2MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
      
      {/* Radial gradient for centered focal point */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30 opacity-60" />
    </div>
  );
}
