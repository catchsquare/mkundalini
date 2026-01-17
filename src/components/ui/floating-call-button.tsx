import { Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useGlobalSettings } from "@/hooks/use-global-settings";

export function FloatingCallButton() {
  const { settings } = useGlobalSettings();
  
  // Format phone for display (remove country code prefix if present)
  const displayPhone = settings.phone || "+977-9802808008";
  const callPhone = displayPhone.replace(/-/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.4, type: "spring" }}
      className="fixed bottom-6 left-6 z-50"
    >
      <a
        href={`tel:${callPhone}`}
        className="group flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Call us now"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping bg-primary/40 opacity-75" style={{ animationDuration: '2s' }} />
        
        {/* Button content */}
        <div className="relative flex items-center gap-2 sm:gap-3 py-3 px-4 sm:py-3.5 sm:px-5">
          <div className="relative">
            <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          
          {/* Text - hidden on very small screens */}
          <div className="hidden sm:block text-left">
            <div className="text-[10px] uppercase tracking-wider opacity-80 font-medium">
              Call Now
            </div>
            <div className="text-sm font-bold leading-tight">
              {displayPhone}
            </div>
          </div>
        </div>
      </a>
      
      {/* Tooltip for mobile */}
      <div className="sm:hidden absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        Call to Book
      </div>
    </motion.div>
  );
}
