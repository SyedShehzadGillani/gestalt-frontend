import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

interface OnboardingSeed {
  firstName?: string;
  lastName?: string;
  role?: string;
  department?: string;
  location?: string;
  notes?: string;
  quadrantLabels?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { seed } = (await req.json().catch(() => ({ seed: {} }))) as { seed: OnboardingSeed };

    const system = `You are generating a structured onboarding model for a role inside a healthcare/clinic context. 
Return ONLY JSON. No markdown fences. Fields should be brief phrases.
Sections: PERSONAL, PATIENT, STAFF, KNOWLEDGE.
Each section contains an array of items with { id, label, value }.
Also suggest 24 short single-word or short-phrase terms per section in a suggestions array.
`;

    const user = `Seed:
${JSON.stringify(seed, null, 2)}

Return JSON with shape:
{
  "sections": {
    "PERSONAL": { "title": "Personal", "items": [{"id":"p1","label":"Trait","value":"detail"}] },
    "PATIENT": { "title": "Patient", "items": [] },
    "STAFF": { "title": "Staff", "items": [] },
    "KNOWLEDGE": { "title": "Knowledge", "items": [] }
  },
  "suggestions": {
    "PERSONAL": ["word", ...],
    "PATIENT": ["word", ...],
    "STAFF": ["word", ...],
    "KNOWLEDGE": ["word", ...]
  }
}`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content ?? "";

    let model: any;
    try {
      model = JSON.parse(text);
    } catch (e) {
      // Fallback minimal model
      model = {
        sections: {
          PERSONAL: { title: "Personal", items: [ { id: "p1", label: "Strength", value: seed.role || "Team Player" } ] },
          PATIENT: { title: "Patient", items: [ { id: "pa1", label: "Care", value: "Empathetic" } ] },
          STAFF: { title: "Staff", items: [ { id: "s1", label: "Collab", value: "Cross-functional" } ] },
          KNOWLEDGE: { title: "Knowledge", items: [ { id: "k1", label: "Systems", value: seed.department || "EMR Basics" } ] },
        },
        suggestions: {
          PERSONAL: ["reliable","punctual","detail-oriented","adaptable"],
          PATIENT: ["bedsidemanner","safety","comfort","communication"],
          STAFF: ["handoff","coverage","shift","escalation"],
          KNOWLEDGE: ["EMR","compliance","HIPAA","triage"],
        }
      };
    }

    return new Response(JSON.stringify({ model }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("generate-onboarding error", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
