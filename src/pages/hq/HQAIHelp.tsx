import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Sparkles,
  Building2,
  DollarSign,
  Clock,
  Mail,
  Tag,
  History,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import gestaltLogo from "@/assets/gestalt-logo.svg";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ContextData {
  type: "agencies" | "tickets" | "revenue" | "none";
  data?: any;
}

const suggestedQueries = [
  "Show agencies with past due payments",
  "Summarize this week's support tickets",
  "Which features are most requested?",
  "Draft a response for ticket #TKT-0042",
  "Find agencies that might churn",
];

const mockResponses: Record<string, { response: string; context: ContextData }> = {
  "show agencies with past due payments": {
    response: `I found **2 agencies** with past due payments:

| Agency | Plan | Amount Due | Days Overdue |
|--------|------|------------|--------------|
| Elevate Agency | Pro | $97 | 12 days |
| Momentum Agency | Pro | $194 | 45 days |

Would you like me to:
1. Send payment reminder emails?
2. Review their payment history?
3. Apply a grace period extension?`,
    context: {
      type: "agencies",
      data: [
        { name: "Elevate Agency", plan: "Pro", status: "Past Due", amount: "$97", days: 12 },
        { name: "Momentum Agency", plan: "Pro", status: "Past Due", amount: "$194", days: 45 },
      ],
    },
  },
  "show me agencies that haven't logged in for 2 weeks": {
    response: `I found **4 agencies** with no login activity in the past 14 days:

| Agency | Plan | Last Login | MRR |
|--------|------|------------|-----|
| Nova Creative | Pro | 18 days ago | $97 |
| Blueprint Co | Free | 21 days ago | $0 |
| Momentum Agency | Pro | 45 days ago | $97 |
| StartUp Studio | Free | 16 days ago | $0 |

Would you like me to:
1. Draft a re-engagement email?
2. Create a retention coupon?
3. Show their activity history?`,
    context: {
      type: "agencies",
      data: [
        { name: "Nova Creative", plan: "Pro", lastLogin: "18 days ago", mrr: "$97" },
        { name: "Blueprint Co", plan: "Free", lastLogin: "21 days ago", mrr: "$0" },
        { name: "Momentum Agency", plan: "Pro", lastLogin: "45 days ago", mrr: "$97" },
        { name: "StartUp Studio", plan: "Free", lastLogin: "16 days ago", mrr: "$0" },
      ],
    },
  },
  "summarize this week's support tickets": {
    response: `**Support Ticket Summary - This Week**

📊 **Overview:**
- Total tickets: **17**
- Resolved: **12** (71%)
- Open: **3**
- Pending: **2**

🔥 **Critical Issues:**
- 1 account access issue (resolved in 2h)
- 1 data sync problem (in progress)

📈 **Top Categories:**
1. Account/Login (5 tickets)
2. Feature Requests (4 tickets)
3. Billing Questions (3 tickets)
4. How-to Questions (5 tickets)

**Avg. Response Time:** 4.2 hours
**Satisfaction Score:** 4.6/5.0

Would you like details on any specific category?`,
    context: {
      type: "tickets",
      data: {
        total: 17,
        resolved: 12,
        open: 3,
        pending: 2,
        avgResponse: "4.2 hours",
        satisfaction: "4.6/5.0",
      },
    },
  },
  "which features are most requested?": {
    response: `**Top Feature Requests (Last 30 Days)**

| Feature | Requests | Priority |
|---------|----------|----------|
| PDF Export for Reports | 23 | High |
| Slack Integration | 18 | Medium |
| Custom Branding Colors | 15 | Medium |
| API Webhooks | 12 | High |
| Mobile App | 11 | Low |
| Bulk Client Import | 9 | Medium |

**Insights:**
- PDF Export has been requested 3x more than last month
- 8 Enterprise customers requesting API webhooks
- Mobile app requests coming mainly from Free tier

Would you like me to:
1. Create a feature request report?
2. Draft responses for requesters?
3. Prioritize for the roadmap?`,
    context: {
      type: "none",
    },
  },
  "draft a response for ticket #tkt-0042": {
    response: `**Draft Response for Ticket #TKT-0042**

*Subject: Re: How do I add team members?*

---

Hi Amy,

Thanks for reaching out! Adding team members is easy:

1. Go to **Settings → Team Management**
2. Click **"Invite Team Member"**
3. Enter their email address
4. Select their role (Admin, Editor, or Viewer)
5. Click **Send Invitation**

Your StartUp Studio account on the Free plan includes **1 team member**. To add more, you'd need to upgrade to Pro ($97/mo) which includes up to **5 team members**.

Would you like me to apply a 20% discount for your first month on Pro?

Best,
GESTALT Support

---

Would you like me to:
1. Send this response?
2. Edit the message?
3. Offer a specific coupon?`,
    context: {
      type: "tickets",
      data: {
        ticketId: "TKT-0042",
        subject: "How do I add team members?",
        from: "Amy Lee",
        agency: "StartUp Studio",
        plan: "Free",
        status: "Pending",
      },
    },
  },
  "find agencies that might churn": {
    response: `**Churn Risk Analysis**

I've identified **6 agencies** at risk of churning based on:
- Login frequency decline
- Feature usage drop
- Support ticket sentiment
- Payment issues

| Agency | Risk Level | Signals | MRR at Risk |
|--------|------------|---------|-------------|
| Momentum Agency | 🔴 Critical | No login 45d, past due | $97 |
| Elevate Agency | 🔴 Critical | Past due 12d, -60% usage | $97 |
| Nova Creative | 🟠 High | No login 18d, trial ending | $0 |
| Blueprint Co | 🟡 Medium | No login 21d | $0 |
| Create Studio | 🟡 Medium | -40% feature usage | $97 |
| StartUp Studio | 🟡 Medium | No login 16d | $0 |

**Total MRR at Risk:** $291

**Recommended Actions:**
1. Personal outreach to Critical agencies
2. Re-engagement campaign for High risk
3. Feature education for Medium risk

Want me to draft outreach messages?`,
    context: {
      type: "agencies",
      data: [
        { name: "Momentum Agency", risk: "Critical", mrr: "$97" },
        { name: "Elevate Agency", risk: "Critical", mrr: "$97" },
        { name: "Nova Creative", risk: "High", mrr: "$0" },
        { name: "Blueprint Co", risk: "Medium", mrr: "$0" },
        { name: "Create Studio", risk: "Medium", mrr: "$97" },
        { name: "StartUp Studio", risk: "Medium", mrr: "$0" },
      ],
    },
  },
};

function getResponse(query: string): { response: string; context: ContextData } {
  const normalizedQuery = query.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(mockResponses)) {
    if (normalizedQuery.includes(key) || key.includes(normalizedQuery.slice(0, 20))) {
      return value;
    }
  }
  
  // Default response
  return {
    response: `I understand you're asking about "${query}". Let me help you with that.

Based on the current platform data, I can assist you with:
- Agency management and analytics
- Support ticket handling
- Revenue and billing insights
- Feature usage statistics
- User engagement metrics

Could you please provide more specific details about what you'd like to know?`,
    context: { type: "none" },
  };
}

export default function HQAIHelp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [contextData, setContextData] = useState<ContextData>({ type: "none" });
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (query?: string) => {
    const messageText = query || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const { response, context } = getResponse(messageText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setContextData(context);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderContextPanel = () => {
    if (contextData.type === "none" || !contextData.data) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <div className="w-16 h-16 rounded-none bg-[hsl(var(--hq-accent))]/10 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[hsl(var(--hq-accent))]" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Context Panel</h3>
          <p className="text-sm text-muted-foreground">
            Relevant data will appear here based on your conversation
          </p>
        </div>
      );
    }

    if (contextData.type === "agencies" && Array.isArray(contextData.data)) {
      return (
        <div className="p-4 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Related Agencies
          </h3>
          <div className="space-y-3">
            {contextData.data.map((agency: any, index: number) => (
              <Card key={index} className="rounded-none border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{agency.name}</h4>
                    <Badge
                      variant="outline"
                      className={`rounded-none text-xs ${
                        agency.plan === "Enterprise"
                          ? "border-[hsl(var(--hq-accent))] text-[hsl(var(--hq-accent))]"
                          : agency.plan === "Pro"
                          ? "border-blue-500 text-blue-500"
                          : "border-gray-500 text-gray-500"
                      }`}
                    >
                      {agency.plan}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {agency.status && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {agency.status}
                      </div>
                    )}
                    {agency.lastLogin && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {agency.lastLogin}
                      </div>
                    )}
                    {agency.mrr && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {agency.mrr}/mo
                      </div>
                    )}
                    {agency.risk && (
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {agency.risk} Risk
                      </div>
                    )}
                    {agency.amount && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {agency.amount} due
                      </div>
                    )}
                    {agency.days && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {agency.days} days overdue
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="pt-4 space-y-2">
            <Button variant="outline" className="w-full rounded-none justify-start gap-2">
              <Mail className="w-4 h-4" />
              Draft Email Campaign
            </Button>
            <Button variant="outline" className="w-full rounded-none justify-start gap-2">
              <Tag className="w-4 h-4" />
              Create Retention Coupon
            </Button>
            <Button variant="outline" className="w-full rounded-none justify-start gap-2">
              <History className="w-4 h-4" />
              View Activity Logs
            </Button>
          </div>
        </div>
      );
    }

    if (contextData.type === "tickets") {
      const data = contextData.data;
      if (data.ticketId) {
        return (
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Ticket Details
            </h3>
            <Card className="rounded-none border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ticket ID</span>
                  <span className="font-mono text-sm">{data.ticketId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subject</span>
                  <span className="text-sm">{data.subject}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">From</span>
                  <span className="text-sm">{data.from}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Agency</span>
                  <span className="text-sm">{data.agency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <Badge variant="outline" className="rounded-none">
                    {data.plan}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="rounded-none bg-yellow-500/20 text-yellow-500">
                    {data.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <div className="pt-2 space-y-2">
              <Button className="w-full rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90">
                Send Response
              </Button>
              <Button variant="outline" className="w-full rounded-none">
                View Full Ticket
              </Button>
            </div>
          </div>
        );
      }
      return (
        <div className="p-4 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Ticket Summary
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="rounded-none border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{data.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">{data.resolved}</div>
                <div className="text-xs text-muted-foreground">Resolved</div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500">{data.open}</div>
                <div className="text-xs text-muted-foreground">Open</div>
              </CardContent>
            </Card>
            <Card className="rounded-none border-border/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500">{data.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
          </div>
          <Card className="rounded-none border-border/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Response</span>
                <span className="font-medium">{data.avgResponse}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Satisfaction</span>
                <span className="font-medium">{data.satisfaction}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 h-[calc(100vh-2rem)]">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-[hsl(var(--hq-accent))]" />
        <div>
          <h1 className="text-2xl font-semibold">AI Help</h1>
          <p className="text-sm text-muted-foreground">
            Your AI assistant for managing the platform
          </p>
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100%-5rem)]">
        {/* Chat Interface - 60% */}
        <Card className="flex-[6] rounded-none flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-20 h-20 mb-6 flex items-center justify-center bg-[hsl(var(--hq-accent))]/10 p-4">
                  <img
                    src={gestaltLogo}
                    alt="GESTALT"
                    className="w-full h-full"
                    style={{ filter: "brightness(0) saturate(100%) invert(45%) sepia(50%) saturate(500%) hue-rotate(240deg)" }}
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">How can I help you manage the platform?</h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Ask me anything about agencies, support, revenue, or platform health
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                  {suggestedQueries.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="rounded-none justify-start text-left h-auto py-3 px-4 hover:bg-[hsl(var(--hq-accent))]/10 hover:border-[hsl(var(--hq-accent))]/50"
                      onClick={() => handleSend(query)}
                    >
                      <Sparkles className="w-4 h-4 mr-2 shrink-0 text-[hsl(var(--hq-accent))]" />
                      <span className="text-sm">{query}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 ${
                        message.role === "user"
                          ? "bg-[hsl(var(--hq-accent))] text-white"
                          : "bg-card border border-border"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:p-2 [&_th]:border-b [&_th]:border-border [&_td]:p-2 [&_td]:border-b [&_td]:border-border/50">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <span className="text-xs opacity-60 mt-2 block">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-card border border-border p-4">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about agencies, tickets, revenue, features..."
                className="rounded-none flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping}
                className="rounded-none bg-[hsl(var(--hq-accent))] hover:bg-[hsl(var(--hq-accent))]/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {messages.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {suggestedQueries.slice(0, 3).map((query, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="rounded-none text-xs h-7 text-muted-foreground hover:text-foreground"
                    onClick={() => handleSend(query)}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Context Panel - 40% */}
        <Card className="flex-[4] rounded-none overflow-hidden">
          <CardHeader className="border-b border-border py-3">
            <CardTitle className="text-sm font-medium">Context</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100%-3.5rem)]">
            {renderContextPanel()}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
