import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Move, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImagePositionerProps {
  imageUrl: string;
  initialPosition?: string;
  onPositionChange: (position: string) => void;
  disabled?: boolean;
}

export function ImagePositioner({
  imageUrl,
  initialPosition = "center",
  onPositionChange,
  disabled = false,
}: ImagePositionerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [showInstructions, setShowInstructions] = useState(true);

  // Parse initial position
  useEffect(() => {
    if (initialPosition && initialPosition.includes("%")) {
      const match = initialPosition.match(/(\d+)%\s*(\d+)%/);
      if (match) {
        setPosition({ x: parseInt(match[1]), y: parseInt(match[2]) });
      }
    } else if (initialPosition === "center") {
      setPosition({ x: 50, y: 50 });
    } else if (initialPosition === "top") {
      setPosition({ x: 50, y: 20 });
    } else if (initialPosition === "bottom") {
      setPosition({ x: 50, y: 80 });
    }
  }, [initialPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    setShowInstructions(false);
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      const positionString = `${position.x}% ${position.y}%`;
      onPositionChange(positionString);
    }
  }, [isDragging, position, onPositionChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    setPosition({ x: Math.round(x), y: Math.round(y) });
  }, [isDragging]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    setShowInstructions(false);
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    
    setPosition({ x: Math.round(x), y: Math.round(y) });
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      const positionString = `${position.x}% ${position.y}%`;
      onPositionChange(positionString);
    }
  }, [isDragging, position, onPositionChange]);

  const resetPosition = () => {
    setPosition({ x: 50, y: 50 });
    onPositionChange("50% 50%");
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        const positionString = `${position.x}% ${position.y}%`;
        onPositionChange(positionString);
      }
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchend", handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isDragging, position, onPositionChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Adjust Image Position</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={resetPosition}
          disabled={disabled}
          className="h-8 text-xs"
        >
          <RotateCcw className="h-3 w-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Preview Card Simulation */}
      <div className="rounded-xl border-2 border-dashed border-primary/30 bg-muted/30 p-3">
        <p className="text-xs text-muted-foreground mb-2 text-center">
          This shows how your image will appear in the project card
        </p>
        
        {/* Simulated Card Preview */}
        <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-border shadow-sm mx-auto max-w-[280px]">
          <img
            src={imageUrl}
            alt="Card preview"
            className="w-full h-full object-cover"
            style={{ objectPosition: `${position.x}% ${position.y}%` }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/80 to-transparent p-2">
            <div className="h-2 w-20 bg-foreground/20 rounded mb-1"></div>
            <div className="h-1.5 w-32 bg-foreground/10 rounded"></div>
          </div>
        </div>
      </div>

      {/* Full Image with Drag Handle */}
      <div
        ref={containerRef}
        className={cn(
          "relative rounded-lg overflow-hidden border-2 cursor-crosshair select-none transition-all",
          isDragging ? "border-primary shadow-lg shadow-primary/20" : "border-border",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Full Image */}
        <img
          src={imageUrl}
          alt="Position selector"
          className="w-full h-auto max-h-[300px] object-contain pointer-events-none"
          draggable={false}
        />

        {/* Focal Point Indicator */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: isDragging ? 1.2 : 1,
          }}
        >
          {/* Outer Ring */}
          <div className={cn(
            "w-16 h-16 rounded-full border-2 transition-colors",
            isDragging ? "border-primary bg-primary/10" : "border-primary/60 bg-primary/5"
          )}>
            {/* Crosshair Lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/60 -translate-x-1/2" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/60 -translate-y-1/2" />
            
            {/* Center Dot */}
            <div className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2 shadow-lg" />
          </div>
        </motion.div>

        {/* Viewport Overlay - shows what will be visible */}
        <div
          className="absolute border-2 border-white/50 rounded pointer-events-none shadow-lg"
          style={{
            width: "60%",
            height: "37.5%", // 16:10 aspect ratio relative to width
            left: `${Math.max(0, Math.min(40, position.x - 30))}%`,
            top: `${Math.max(0, Math.min(62.5, position.y - 18.75))}%`,
          }}
        >
          <div className="absolute inset-0 border border-primary/30" />
        </div>

        {/* Instructions Overlay */}
        {showInstructions && !disabled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-2 text-center p-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Move className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">Click & drag to set focal point</p>
              <p className="text-xs text-muted-foreground">Choose which part of your image shows in the preview</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Position Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Position: {position.x}% horizontal, {position.y}% vertical</span>
        {isDragging && (
          <span className="text-primary font-medium flex items-center gap-1">
            <Move className="h-3 w-3" /> Dragging...
          </span>
        )}
      </div>
    </div>
  );
}
