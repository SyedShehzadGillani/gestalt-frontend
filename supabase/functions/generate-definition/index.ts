import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

interface GenerateRequest {
  word: string;
  quadrant: string;
  positionName: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { word, quadrant, positionName } = (await req.json()) as GenerateRequest;

    if (!word || !quadrant || !positionName) {
      return new Response(JSON.stringify({ error: "Missing required fields: word, quadrant, positionName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const quadrantContext: Record<string, string> = {
      PERSONAL: "personal traits and character qualities",
      PATIENT: "patient interaction and care behaviors",
      STAFF: "teamwork and staff collaboration",
      KNOWLEDGE: "technical skills and professional knowledge",
    };

    const systemPrompt = `You are an expert at defining workplace expectations for healthcare roles. 
Generate a concise definition and a role-specific expectation for workplace criteria.
Return ONLY valid JSON with no markdown fences.`;

    const userPrompt = `For the role "${positionName}" in a healthcare setting:

The word/characteristic "${word}" is being added to the "${quadrant}" quadrant, which focuses on ${quadrantContext[quadrant] || "general workplace behaviors"}.

Generate:
1. A brief definition (1-2 sentences) of what "${word}" means in this context
2. A specific expectation (1-2 sentences) of how someone in the "${positionName}" role should demonstrate "${word}"

Return JSON:
{
  "definition": "...",
  "expectation": "..."
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "";

    let result: { definition: string; expectation: string };
    try {
      result = JSON.parse(text);
    } catch {
      // Fallback if parsing fails
      result = {
        definition: `${word} refers to a key quality for the ${positionName} role.`,
        expectation: `Demonstrates ${word.toLowerCase()} consistently in daily responsibilities.`,
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("generate-definition error", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
