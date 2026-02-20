import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Eye, Code2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Highlight, themes } from "prism-react-renderer";

interface CodePreviewPanelProps {
  code: string;
  componentName?: string;
}

export function CodePreviewPanel({ code, componentName = "Component" }: CodePreviewPanelProps) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };


  // Sanitize text for safe HTML display
  const sanitizeForHTML = (text: string): string => {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  // Better code processing for preview
  const iframeContent = useMemo(() => {
    try {
      let processedCode = code.trim();
      
      // Decode unicode escape sequences (AI sometimes returns \u003c for <)
      processedCode = processedCode.replace(/\\u003c/gi, '<').replace(/\\u003e/gi, '>');
      processedCode = processedCode.replace(/\\u0022/gi, '"').replace(/\\u0027/gi, "'");
      
      // Remove code block markers if present
      processedCode = processedCode.replace(/^```(?:tsx|ts|jsx|js)?\s*/gm, "");
      processedCode = processedCode.replace(/```\s*$/gm, "");
      processedCode = processedCode.trim();

      // Remove directives/imports that will break iframe execution
      processedCode = processedCode.replace(/^["']use client["'];?\s*$/gm, "");
      processedCode = processedCode.replace(/^\s*import .*?;?\s*$/gm, "");
      processedCode = processedCode.replace(/^\s*export\s+\{[\s\S]*?\};\s*$/gm, "");

      // Extract component name BEFORE removing exports
      let extractedName = componentName || "Component";

      // Try to find component name from various patterns
      const defaultFunctionMatch = processedCode.match(/export\s+default\s+function\s+(\w+)/);
      const functionMatch = processedCode.match(/function\s+(\w+)\s*\(/);
      const constArrowMatch = processedCode.match(/(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])*=>/);
      const constFunctionMatch = processedCode.match(/(?:const|let|var)\s+(\w+)\s*=\s*function/);
      
      if (defaultFunctionMatch) {
        extractedName = defaultFunctionMatch[1];
      } else if (functionMatch) {
        extractedName = functionMatch[1];
      } else if (constArrowMatch) {
        extractedName = constArrowMatch[1];
      } else if (constFunctionMatch) {
        extractedName = constFunctionMatch[1];
      }
      
      // Remove exports but keep the function
      processedCode = processedCode.replace(/export\s+default\s+/g, "");
      processedCode = processedCode.replace(/^export\s+/gm, "");
      
      // Remove TypeScript-specific syntax more carefully
      // Remove interface/type declarations
      processedCode = processedCode.replace(/^(interface|type)\s+\w+[^{]*\{[^}]*\}\s*;?\s*/gm, "");
      
      // Remove React.FC and similar type annotations
      processedCode = processedCode.replace(/:\s*React\.(FC|FunctionComponent|ComponentType)(<[^>]*>)?/g, "");
      
      // Remove simple type annotations from const/let/var declarations
      processedCode = processedCode.replace(/(const|let|var)\s+(\w+)\s*:\s*[^=]+\s*=/g, "$1 $2 =");
      
      // Remove type annotations from function parameters more carefully
      // Handle (param: Type) and (param: Type, param2: Type)
      processedCode = processedCode.replace(/\(([^)]*)\)/g, (match, params) => {
        if (!params.includes(':')) return match;
        const cleanedParams = params.split(',').map((p: string) => {
          const trimmed = p.trim();
          // Handle destructuring { prop }: Type
          if (trimmed.startsWith('{')) {
            const destructMatch = trimmed.match(/(\{[^}]+\})\s*:\s*.*/);
            return destructMatch ? destructMatch[1] : trimmed.split(':')[0].trim();
          }
          // Handle normal param: Type
          return trimmed.split(':')[0].trim();
        }).join(', ');
        return `(${cleanedParams})`;
      });
      
      // Remove generic type parameters from function calls like useState<Type>
      processedCode = processedCode.replace(/(useState|useRef|useMemo|useCallback|useReducer|createContext)<[^>]+>/g, "$1");
      
      // Create render script
      const renderScript = `
(function() {
  try {
    const { useState, useEffect, useRef, useMemo, useCallback, useContext, createContext, useReducer, Fragment } = React;

    ${processedCode}

    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Preview root element not found');

    // Render with a default child so components like "Button" are visible in preview
    const element = React.createElement(${extractedName}, null, 'Preview');

    if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
      const root = ReactDOM.createRoot(rootElement);
      root.render(element);
    } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
      ReactDOM.render(element, rootElement);
    } else {
      throw new Error('ReactDOM render API not available');
    }

    window.__PREVIEW_RENDERED__ = true;
  } catch (error) {
    window.__PREVIEW_ERROR__ = error;
    const rootElement = document.getElementById('root');
    if (rootElement) {
      var errorText = error && (error.stack || error.message) ? (error.stack || error.message) : String(error);
      var safeError = errorText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      rootElement.innerHTML = '<div style="padding: 2rem; color: #dc2626; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; white-space: pre-wrap; background: #fee2e2; border-radius: 0.75rem; margin: 1rem; max-width: 100%;"><h3 style="margin-bottom: 0.75rem; font-size: 14px;">Error rendering component</h3><pre style="overflow-x: auto; font-size: 12px; line-height: 1.5;">' + safeError + '</pre></div>';
    }
    console.error('Component render error:', error);
  }
})();
      `;

      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; width: 100%; }
    body {
      background: hsl(120, 25%, 98%);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #root {
      width: 100%;
      max-width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 1s linear infinite; }
  </style>
</head>
<body>
  <div id="root">
    <div style="padding: 2rem; text-align: center; color: #666;">
      <div class="animate-spin" style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top-color: #10b981; border-radius: 50%; margin: 0 auto 1rem;"></div>
      <p>Loading component...</p>
    </div>
  </div>

  <script id="preview-babel" type="text/babel" data-presets="env,react">
    ${renderScript}
  </script>

  <script>
    // Ensure Babel actually runs (some environments don't auto-transform)
    try {
      if (window.Babel && typeof window.Babel.transformScriptTags === 'function') {
        window.Babel.transformScriptTags();
      }
    } catch (e) {}

    // Avoid infinite "Loading..." if scripts fail to execute
    setTimeout(function () {
      try {
        if (!window.__PREVIEW_RENDERED__ && !window.__PREVIEW_ERROR__) {
          var root = document.getElementById('root');
          if (root) {
            root.innerHTML = '<div style="padding: 1.5rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; line-height: 1.5; color: #111827; background: #f3f4f6; border-radius: 0.75rem;">Preview did not render. Click <b>Refresh</b> or check the <b>Code</b> tab.</div>';
          }
        }
      } catch (e) {}
    }, 3000);
  </script>
</body>
</html>`;
    } catch (error) {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      padding: 2rem;
      font-family: monospace;
      background: #fee2e2;
      color: #dc2626;
    }
    pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <h2>Error processing code:</h2>
  <pre>${error instanceof Error ? error.message : String(error)}</pre>
  <h3 style="margin-top: 1rem;">Original code:</h3>
  <pre>${code.substring(0, 1000)}${code.length > 1000 ? '...' : ''}</pre>
</body>
</html>`;
    }
  }, [code, componentName]);

  return (
    <div className="flex flex-col h-full bg-card overflow-hidden border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-2 md:px-4 py-2 md:py-3 bg-muted/50 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="flex gap-1 md:gap-1.5 shrink-0">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500" />
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs md:text-sm font-medium text-foreground truncate">{componentName}</span>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 md:h-8 px-2 md:px-3 text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            {copied ? (
              <Check className="h-3 w-3 md:h-4 md:w-4" />
            ) : (
              <Copy className="h-3 w-3 md:h-4 md:w-4" />
            )}
            <span className="ml-1 md:ml-2 text-xs hidden sm:inline">Copy</span>
          </Button>
          
          {activeView === "preview" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewKey((k) => k + 1)}
              className="h-7 md:h-8 px-2 md:px-3 text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          )}
          
          <div className="flex items-center bg-secondary rounded-lg p-0.5 md:p-1 ml-1 md:ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView("preview")}
              className={`h-6 md:h-7 px-2 md:px-3 text-xs rounded-md transition-all ${
                activeView === "preview"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView("code")}
              className={`h-6 md:h-7 px-2 md:px-3 text-xs rounded-md transition-all ${
                activeView === "code"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 md:mr-1.5" />
              <span className="hidden sm:inline">Code</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          {activeView === "preview" ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full bg-background"
            >
              <iframe
                key={previewKey}
                srcDoc={iframeContent}
                className="w-full h-full border-0"
                title="Component Preview"
                sandbox="allow-scripts"
                style={{ background: "transparent" }}
                loading="eager"
              />
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-auto bg-muted/30"
            >
              <Highlight
                theme={themes.nightOwl}
                code={code}
                language="tsx"
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className={`${className} p-2 md:p-4 text-xs md:text-sm leading-relaxed`}
                    style={{ ...style, background: "transparent" }}
                  >
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        <span className="inline-block w-8 md:w-10 text-muted-foreground text-right mr-2 md:mr-4 select-none text-xs">
                          {i + 1}
                        </span>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
