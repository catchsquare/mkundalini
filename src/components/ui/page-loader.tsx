import { motion } from "framer-motion";
import logoImage from "@/assets/logo.png";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export function PageLoader({ 
  className, 
  text = "Loading...",
  fullScreen = true 
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-background",
        fullScreen ? "fixed inset-0 z-[100]" : "w-full h-full min-h-[200px]",
        className
      )}
    >
      {/* Animated logo container */}
      <div className="relative">
        {/* Outer pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          style={{ margin: "-20px" }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        
        {/* Inner pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/40"
          style={{ margin: "-12px" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.3,
          }}
        />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Logo with breathing animation */}
        <motion.img
          src={logoImage}
          alt="Loading"
          className="relative z-10 h-20 w-auto object-contain drop-shadow-xl"
          animate={{
            scale: [1, 1.08, 1],
            filter: [
              "drop-shadow(0 0 8px hsl(var(--primary) / 0.3))",
              "drop-shadow(0 0 20px hsl(var(--primary) / 0.6))",
              "drop-shadow(0 0 8px hsl(var(--primary) / 0.3))",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Rotating chakra dots */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ margin: "-30px" }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary"
              style={{
                transform: `rotate(${i * (360 / 7)}deg) translateY(-40px)`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Loading text */}
      <motion.p
        className="mt-8 text-sm font-medium text-muted-foreground"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.p>
    </div>
  );
}
