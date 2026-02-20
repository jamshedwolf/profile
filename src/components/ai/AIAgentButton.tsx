import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIAgentPanel } from "./AIAgentPanel";

export function AIAgentButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="rounded-full relative group"
        aria-label="Open AI Agent"
      >
        <Sparkles className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
      </Button>
      
      <AIAgentPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
