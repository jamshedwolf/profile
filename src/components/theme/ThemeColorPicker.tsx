import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { useState } from 'react';
import { useThemeColor, themeColors, ThemeColor } from '@/hooks/use-theme-color';
import { cn } from '@/lib/utils';

export function ThemeColorPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentColor, setThemeColor } = useThemeColor();

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute right-16 top-1/2 -translate-y-1/2"
          >
            <div 
              className="flex items-center gap-2 p-2 rounded-full backdrop-blur-xl border border-border/50"
              style={{ 
                background: `linear-gradient(135deg, hsl(var(--background) / 0.9), hsl(var(--card) / 0.95))`,
                boxShadow: `0 8px 32px ${currentColor.hex}20, 0 0 0 1px ${currentColor.hex}10`
              }}
            >
              {themeColors.map((color, index) => (
                <motion.button
                  key={color.name}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 500 }}
                  onClick={() => {
                    setThemeColor(color);
                    setIsOpen(false);
                  }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "w-8 h-8 rounded-full relative flex items-center justify-center",
                    "transition-all duration-200",
                    currentColor.name === color.name && "ring-2 ring-white/50 ring-offset-2 ring-offset-background"
                  )}
                  style={{ 
                    background: `linear-gradient(135deg, ${color.hex}, ${color.hex}dd)`,
                    boxShadow: currentColor.name === color.name 
                      ? `0 4px 20px ${color.hex}60, 0 0 30px ${color.hex}30`
                      : `0 2px 8px ${color.hex}40`,
                  }}
                  title={color.name}
                >
                  <AnimatePresence>
                    {currentColor.name === color.name && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <Check className="w-4 h-4 text-white drop-shadow-md" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          rotate: isOpen ? 180 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center relative",
          "backdrop-blur-xl border-2 transition-all duration-300",
        )}
        style={{
          background: `linear-gradient(135deg, ${currentColor.hex}30, ${currentColor.hex}50)`,
          borderColor: `${currentColor.hex}60`,
          boxShadow: isOpen 
            ? `0 0 30px ${currentColor.hex}50, 0 0 60px ${currentColor.hex}25, inset 0 0 20px ${currentColor.hex}20`
            : `0 4px 20px ${currentColor.hex}30, inset 0 0 10px ${currentColor.hex}10`,
        }}
      >
        {/* Animated ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 0 0px ${currentColor.hex}40`,
              `0 0 0 8px ${currentColor.hex}00`,
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
        
        <Sparkles 
          className="w-5 h-5 relative z-10" 
          style={{ color: currentColor.hex }}
        />
      </motion.button>
    </div>
  );
}
