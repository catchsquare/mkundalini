import { motion } from "framer-motion";
import logoImage from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
  animate?: boolean;
}

export function AnimatedLogo({ 
  className, 
  size = "md", 
  showGlow = true,
  animate = true 
}: AnimatedLogoProps) {
  const sizeClasses = {
    sm: "h-9 sm:h-10",
    md: "h-10 sm:h-11 lg:h-12",
    lg: "h-16 sm:h-20 lg:h-24",
  };

  return (
    <motion.div
      className={cn("relative", className)}
      initial={animate ? { scale: 0.9, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Glow effect */}
      {showGlow && (
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* Logo image */}
      <motion.img
        src={logoImage}
        alt="Kundalini Dental Clinic"
        className={cn(
          "relative z-10 w-auto object-contain drop-shadow-lg",
          sizeClasses[size]
        )}
        whileHover={{
          scale: 1.05,
          filter: "drop-shadow(0 0 12px hsl(var(--primary) / 0.5))",
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
