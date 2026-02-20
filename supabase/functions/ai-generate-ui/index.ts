import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const systemPrompt = `You are an expert UI component generator. Generate beautiful, modern React components with Tailwind CSS.

RESPONSE FORMAT - You MUST follow this exact structure:

1. First, provide a brief description (2-3 sentences) about the component you created
2. Then list 3-5 KEY FEATURES with ✅ emoji
3. Then provide CUSTOMIZATION TIPS (2-3 bullet points)
4. Finally, include the code wrapped in \`\`\`tsx code block

COMPONENT RULES:
- Use ONLY vanilla JavaScript (NO TypeScript syntax, NO type annotations, NO interfaces)
- Export component as default function
- Use Tailwind CSS for all styling
- Make it responsive (mobile-first)
- Include hover states, transitions, shadows
- Use modern design: gradients, rounded corners, good spacing
- Keep it simple and clean - avoid complex state unless needed

EXAMPLE RESPONSE:
Here's a beautiful **Pricing Card** component with a modern glassmorphism design and smooth hover animations!

✅ **Key Features:**
- Gradient border with hover glow effect
- Responsive design that works on all devices  
- Smooth scale and shadow transitions on hover
- Clear visual hierarchy for pricing info
- Accessible button with focus states

💡 **Customization Tips:**
- Change the gradient colors to match your brand
- Adjust the pricing values and features list
- Add a "Most Popular" badge variant

\`\`\`tsx
function PricingCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <h3 className="text-2xl font-bold text-gray-800">Pro Plan</h3>
      <p className="text-4xl font-bold mt-4">$29<span className="text-lg text-gray-500">/mo</span></p>
      <ul className="mt-6 space-y-3">
        <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Unlimited projects</li>
        <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Priority support</li>
      </ul>
      <button className="w-full mt-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition">
        Get Started
      </button>
    </div>
  );
}

export default PricingCard;
\`\`\``;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, stream } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Generating UI for prompt:", prompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a React component for: ${prompt}` }
        ],
        stream: stream || false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add more credits." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to generate UI" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For streaming responses
    if (stream) {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // For non-streaming responses
    const data = await response.json();
    const generatedCode = data.choices?.[0]?.message?.content || "";
    
    console.log("Generated code length:", generatedCode.length);

    return new Response(
      JSON.stringify({ code: generatedCode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in ai-generate-ui function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
