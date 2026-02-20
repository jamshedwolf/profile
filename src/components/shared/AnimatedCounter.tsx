import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, suffix = "+", duration = 2 }: AnimatedCounterProps) {
  const [count, setCount] = useState(1);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            // Count from 1 to value
            const current = Math.floor(1 + (easeOutQuart * (value - 1)));
            setCount(current);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };
          animate();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, duration]);

  return (
    <motion.p 
      ref={ref}
      className="text-2xl md:text-3xl font-bold gradient-text"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: count >= 1 ? 1 : 0.8, opacity: count >= 1 ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {count}{suffix}
    </motion.p>
  );
}

