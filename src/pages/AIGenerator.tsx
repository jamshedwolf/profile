import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Loader2, Sparkles, Plus, Search, 
  MessageSquare, Grid3X3, ChevronRight, X,
  Image, Upload, FileCode, Layout, Check,
  Eye, Heart, ChevronDown, ChevronUp, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { CodePreviewPanel } from "@/components/ai/CodePreviewPanel";
import { componentTemplates, categories } from "@/data/componentTemplates";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  code?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// Mock data for community templates
const mockCreators = [
  { name: "Alex Dev", avatar: "AD" },
  { name: "Sarah Code", avatar: "SC" },
  { name: "Mike Builder", avatar: "MB" },
  { name: "Emma Design", avatar: "ED" },
  { name: "John Creator", avatar: "JC" },
];

const getRandomCreator = () => mockCreators[Math.floor(Math.random() * mockCreators.length)];
const getRandomViews = () => Math.floor(Math.random() * 5000) + 500;
const getRandomLikes = () => Math.floor(Math.random() * 800) + 50;

export default function AIGenerator() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [componentName, setComponentName] = useState("Component");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarView, setSidebarView] = useState<"chats" | "library">("library");
  const [showFavorites, setShowFavorites] = useState(true);
  const [showCommunity, setShowCommunity] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredTemplates = componentTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setGeneratedCode("");
    setComponentName("Component");
    setSidebarView("chats");
  };

  const extractCode = (content: string): string | null => {
    const codeMatch = content.match(/```(?:tsx|jsx|typescript|javascript)?\s*([\s\S]*?)```/);
    return codeMatch ? codeMatch[1].trim() : null;
  };

  const extractComponentName = (code: string): string => {
    const match = code.match(/(?:export\s+default\s+function|function|const)\s+(\w+)/);
    return match ? match[1] : "GeneratedComponent";
  };

  const handleSelectTemplate = (template: typeof componentTemplates[0]) => {
    setGeneratedCode(template.code);
    setComponentName(template.name.replace(/\s+/g, ''));
    
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: template.name,
      messages: [
        {
          id: "1",
          role: "assistant",
          content: `Here's the **${template.name}** component! You can customize it by describing what changes you'd like.`,
          code: template.code
        }
      ],
      createdAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setSidebarView("chats");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
        messages: [],
        createdAt: new Date()
      };
      setSessions(prev => [newSession, ...prev]);
      currentSessionId = newSession.id;
      setActiveSessionId(currentSessionId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setSessions(prev => prev.map(s => 
      s.id === currentSessionId 
        ? { ...s, messages: [...s.messages, userMessage], title: s.messages.length === 0 ? input.slice(0, 30) + (input.length > 30 ? "..." : "") : s.title }
        : s
    ));
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-generate-ui", {
        body: { prompt: userMessage.content },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data || !data.code) {
        throw new Error("No response from AI service");
      }

      const code = extractCode(data.code);
      
      if (code) {
        setGeneratedCode(code);
        setComponentName(extractComponentName(code));
      }
      
      // Extract the description part (everything before the code block)
      const descriptionMatch = data.code.match(/^([\s\S]*?)```/);
      const description = descriptionMatch 
        ? descriptionMatch[1].trim() 
        : "I've generated your component! Check the preview on the right.";
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: description || "I've generated your component! Check the preview on the right. Let me know if you'd like any changes.",
        code: code || undefined,
      };

      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages: [...s.messages, assistantMessage] }
          : s
      ));
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate UI. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't generate that component. Please try again with a different description.",
      };
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, messages: [...s.messages, errorMessage] }
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setGeneratedCode("");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-background text-foreground overflow-hidden relative">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden p-2 border-b border-border flex items-center justify-between bg-card z-40 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold">AI Generator</h2>
        <div className="w-10" />
      </div>

      {/* Left Sidebar - V0.dev Style */}
      <div className={cn(
        "border-r border-border flex flex-col bg-card transition-all duration-300",
        sidebarOpen ? "w-full md:w-64 translate-x-0" : "w-0 -translate-x-full md:translate-x-0",
        "fixed md:relative z-50 md:z-auto h-full md:h-auto",
        "shadow-lg md:shadow-none"
      )}>
        {/* Mobile Close Button */}
        <div className="md:hidden p-2 border-b border-border flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-border">
          <Button 
            onClick={createNewSession} 
            className="w-full gap-2"
            variant="default"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <Search className="h-4 w-4" />
              Q Search
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <Grid3X3 className="h-4 w-4" />
              Projects
            </button>
            <button 
              onClick={() => setSidebarView("chats")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                sidebarView === "chats" 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              Recent Chats
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <FileCode className="h-4 w-4" />
              Design Systems
            </button>
            <button 
              onClick={() => setSidebarView("library")}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                sidebarView === "library" 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Layout className="h-4 w-4" />
              Templates
            </button>
          </nav>

          {/* Favorites Section */}
          <div className="mt-6">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Favorites</span>
              {showFavorites ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
            {showFavorites && (
              <div className="mt-2 space-y-1">
                {sessions.slice(0, 5).map(session => (
                  <div
                    key={session.id}
                    className={cn(
                      "group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                      activeSessionId === session.id 
                        ? "bg-secondary text-foreground" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    onClick={() => {
                      setActiveSessionId(session.id);
                      const messagesWithCode = session.messages.filter(m => m.code);
                      const lastCode = messagesWithCode.length > 0 
                        ? messagesWithCode[messagesWithCode.length - 1].code 
                        : undefined;
                      if (lastCode) {
                        setGeneratedCode(lastCode);
                        setComponentName(extractComponentName(lastCode));
                      }
                    }}
                  >
                    <MessageSquare className="h-3 w-3 shrink-0" />
                    <span className="flex-1 truncate">{session.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - V0.dev Style */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!activeSessionId || messages.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-12">
              {/* Main Prompt Section */}
              <div className="text-center mb-8 md:mb-12 px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-foreground">
                  What do you want to create?
                </h1>
                
                {/* Input Field */}
                <div className="relative max-w-2xl mx-auto mb-4 md:mb-6">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask V0 to build..."
                    className="w-full h-12 md:h-14 pl-4 md:pl-6 pr-12 md:pr-14 text-base md:text-lg bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-secondary border border-border rounded-lg text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-primary" />
                      V0 Pro
                    </div>
                  </div>
                </div>

                {/* Upgrade Message */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
                  <span>Upgrade to Team to unlock all of V0's features and more credits.</span>
                  <Button variant="link" className="p-0 h-auto font-semibold">
                    Upgrade Plan
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8 md:mb-16">
                  <Button 
                    variant="outline" 
                    className="hover:bg-secondary"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Clone a Screenshot
                  </Button>
                  <Button 
                    variant="outline" 
                    className="hover:bg-secondary"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import from Figma
                  </Button>
                  <Button 
                    variant="outline" 
                    className="hover:bg-secondary"
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    Upload a Project
                  </Button>
                  <Button 
                    variant="outline" 
                    className="hover:bg-secondary"
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    Landing Page
                  </Button>
                </div>
              </div>

              {/* From the Community Section */}
              <div className="mb-8 px-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-2">
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-1">From the Community</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">Explore what the community is building with V0.</p>
                  </div>
                  <Button variant="link" className="text-xs md:text-sm">
                    Browse All
                  </Button>
                </div>

                {/* Community Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {componentTemplates.slice(0, 12).map((template, index) => {
                    const creator = getRandomCreator();
                    const views = getRandomViews();
                    const likes = getRandomLikes();
                    const isFree = Math.random() > 0.3;

                    return (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelectTemplate(template)}
                        className="group cursor-pointer rounded-xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 card-shadow"
                      >
                        {/* Thumbnail */}
                        <div className="aspect-video gradient-bg-soft flex items-center justify-center text-6xl border-b border-border">
                          {template.thumbnail}
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-1">
                            {template.name}
                          </h3>
                          
                          {/* Creator & Stats */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                  {creator.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{creator.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {(views / 1000).toFixed(1)}K
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {likes}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Free/Credit Badge */}
                        <div className="px-4 pb-4">
                          {isFree ? (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded">
                              Free
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-accent/20 text-accent rounded">
                              1 Credit
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-8">
                  <Button 
                    variant="outline" 
                    className="hover:bg-secondary"
                  >
                    Load More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat View */
          <div className="flex-1 flex flex-col lg:flex-row">
            <div className="flex-1 flex flex-col lg:max-w-2xl">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
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
                              : "bg-card border border-border text-foreground"
                          )}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="max-w-[85%] rounded-2xl p-4 bg-card border border-border">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Generating your component...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-background/50">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe the component you want to create..."
                    className="min-h-[60px] max-h-[120px] resize-none text-sm bg-card border-border text-foreground placeholder:text-muted-foreground"
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
                    className="shrink-0 h-[60px] w-14 rounded-xl"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="flex-1 border-t lg:border-t-0 lg:border-l border-border">
              {generatedCode ? (
                <CodePreviewPanel 
                  code={generatedCode} 
                  componentName={componentName}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-muted/20">
                  <div className="text-center text-muted-foreground p-8">
                    <div className="text-6xl mb-4">🎨</div>
                    <p className="font-medium text-foreground">Preview will appear here</p>
                    <p className="text-sm mt-2">Select a template or describe what you want to create</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
