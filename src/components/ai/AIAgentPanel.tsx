import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Copy, Check, Code2, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  code?: string;
}

interface AIAgentPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAgentPanel({ isOpen, onClose }: AIAgentPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const extractCode = (content: string): string | null => {
    const codeMatch = content.match(/```(?:tsx|jsx|typescript|javascript)?\s*([\s\S]*?)```/);
    return codeMatch ? codeMatch[1].trim() : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-generate-ui", {
        body: { prompt: userMessage.content },
      });

      if (error) {
        throw new Error(error.message);
      }

      const code = extractCode(data.code);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: code 
          ? "Here's your generated component! You can preview it or copy the code."
          : data.code,
        code: code || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate UI",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't generate that component. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const examplePrompts = [
    "A modern pricing card with hover effects",
    "A testimonial section with avatars",
    "A feature grid with icons",
    "A hero section with gradient background",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">AI UI Generator</h2>
                  <p className="text-xs text-muted-foreground">Describe what you want to build</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-foreground">What would you like to create?</h3>
                    <p className="text-sm text-muted-foreground">
                      Describe a UI component and I'll generate the React code for you.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Try these examples</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {examplePrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => setInput(prompt)}
                          className="px-3 py-1.5 text-xs rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl p-4",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {message.code && (
                      <div className="mt-3 space-y-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setShowPreview(
                              showPreview === message.id ? null : message.id
                            )}
                            className="gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {showPreview === message.id ? "Hide" : "Preview"}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCopy(message.code!, message.id)}
                            className="gap-1.5"
                          >
                            {copiedId === message.id ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copiedId === message.id ? "Copied" : "Copy"}
                          </Button>
                        </div>
                        
                        {showPreview === message.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2"
                          >
                            <div className="rounded-lg border border-border overflow-hidden">
                              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border">
                                <Code2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground font-mono">Component.tsx</span>
                              </div>
                              <pre className="p-4 overflow-x-auto bg-muted/30 text-xs">
                                <code className="text-foreground whitespace-pre-wrap break-words">
                                  {message.code}
                                </code>
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="max-w-[85%] rounded-2xl p-4 bg-card border border-border">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Generating component...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the component you want..."
                  className="min-h-[60px] max-h-[120px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="shrink-0 h-[60px] w-[60px]"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Press Enter to send, Shift+Enter for new line
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
