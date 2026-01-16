import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface OfferBadgeProps {
  text: string;
  highlight: string;
  link: string;
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
}

export function OfferBadge({ 
  text, 
  highlight, 
  link, 
  position = "bottom-right" 
}: OfferBadgeProps) {
  const positionClasses = {
    "top-right": "top-24 sm:top-28 lg:top-32 right-4 sm:right-6 lg:right-8",
    "bottom-right": "bottom-8 sm:bottom-12 lg:bottom-16 right-4 sm:right-6 lg:right-8",
    "top-left": "top-24 sm:top-28 lg:top-32 left-4 sm:left-6 lg:left-8",
    "bottom-left": "bottom-8 sm:bottom-12 lg:bottom-16 left-4 sm:left-6 lg:left-8",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, type: "spring" }}
      className={`absolute ${positionClasses[position]} z-20 hidden md:block`}
    >
      <Link
        to={link}
        className="group block"
      >
        <motion.div
          animate={{ 
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all" />
          
          {/* Badge card */}
          <div className="relative bg-card border-2 border-primary/50 rounded-2xl p-4 sm:p-5 shadow-xl max-w-[200px] sm:max-w-[220px] group-hover:border-primary group-hover:shadow-2xl transition-all">
            {/* Pulse indicator */}
            <div className="absolute -top-1.5 -right-1.5">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-primary-foreground" />
                </span>
              </span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                {text}
              </p>
              <p className="text-sm sm:text-base font-bold text-foreground leading-tight">
                {highlight}
              </p>
              <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all pt-1">
                <span>Claim Now</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}