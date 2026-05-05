import { useState } from "react";
import { Bot, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantPanelProps {
  industry?: string;
  position?: string;
  onSuggestionApply: (suggestions: { tags?: string[]; coreValue?: { word: string; definition: string; expectation: string } }) => void;
}

export function AIAssistantPanel({ industry, position, onSuggestionApply }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi! I'm here to help you build the perfect position profile${position ? ` for ${position}` : ""}${industry ? ` in the ${industry} industry` : ""}. 

I can help you:
• Define core values and expectations
• Suggest criteria for each quadrant (Personal, Patient, Staff, Knowledge)
• Customize scoring based on your company culture

What would you like to start with?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (this would call the actual AI endpoint)
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: `Based on your request, here are my suggestions for the ${position || "position"}:

**Core Value: TRUST**
- Definition: Firm belief in the reliability, truth, ability, or strength of someone or something.
- Expectation: Mastery of the role demonstrated by consistent wisdom, innovation, and team-centered behaviors.

**Suggested Criteria:**
• Personal: Reliable, Punctual, Detail-oriented, Professional
• Patient: Empathetic, Communicative, Patient-focused, Safety-conscious
• Staff: Collaborative, Supportive, Team-player, Mentoring
• Knowledge: Technical proficiency, Continuous learning, Protocol adherence

Would you like me to apply these suggestions or refine them further?`,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <div className="flex flex-col h-full border-l border-border bg-card/50">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-chart-primary to-chart-primary/80">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Position Assistant</h3>
          <p className="text-xs text-muted-foreground">Powered by AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "p-3 rounded-lg text-sm",
              msg.role === "assistant"
                ? "bg-muted/50 text-foreground"
                : "bg-chart-primary/20 text-foreground ml-8"
            )}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            AI is thinking...
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleQuickAction("Suggest core values for this position")}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Core Values
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleQuickAction("Generate criteria for all quadrants")}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            All Criteria
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => handleQuickAction("Help me customize for healthcare")}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Healthcare
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask AI for help..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="resize-none min-h-[60px]"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-chart-primary hover:bg-chart-primary/90 text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
