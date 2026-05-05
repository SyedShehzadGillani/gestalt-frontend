import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import {
  LogIn,
  LogOut,
  Shield,
  UserPlus,
  UserMinus,
  UserX,
  UserCheck,
  Key,
  Settings,
  ShieldCheck,
  ShieldOff,
  Activity,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface ActivityLog {
  id: string;
  user_email: string;
  user_name: string | null;
  action_type: string;
  action_description: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

const actionConfig: Record<string, { icon: typeof Activity; color: string; bgColor: string }> = {
  login: { icon: LogIn, color: "text-green-500", bgColor: "bg-green-500/10" },
  logout: { icon: LogOut, color: "text-gray-500", bgColor: "bg-gray-500/10" },
  permission_change: { icon: Shield, color: "text-[hsl(var(--hq-accent))]", bgColor: "bg-[hsl(var(--hq-accent))]/10" },
  role_change: { icon: Shield, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  member_invited: { icon: UserPlus, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  member_suspended: { icon: UserX, color: "text-red-500", bgColor: "bg-red-500/10" },
  member_reactivated: { icon: UserCheck, color: "text-green-500", bgColor: "bg-green-500/10" },
  member_removed: { icon: UserMinus, color: "text-red-500", bgColor: "bg-red-500/10" },
  password_reset: { icon: Key, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  settings_updated: { icon: Settings, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  "2fa_enabled": { icon: ShieldCheck, color: "text-green-500", bgColor: "bg-green-500/10" },
  "2fa_disabled": { icon: ShieldOff, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
};

export default function ActivityLogCard() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setLogs(data as ActivityLog[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("activity_logs_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
        },
        (payload) => {
          setLogs((prev) => [payload.new as ActivityLog, ...prev].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getActionConfig = (actionType: string) => {
    return actionConfig[actionType] || { icon: Activity, color: "text-muted-foreground", bgColor: "bg-muted" };
  };

  return (
    <Card className="rounded-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="w-5 h-5 text-[hsl(var(--hq-accent))]" />
          Activity Log
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-none h-8 w-8"
          onClick={fetchLogs}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {loading && logs.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Loading activity...
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Activity className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No activity recorded yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {logs.map((log) => {
                const config = getActionConfig(log.action_type);
                const Icon = config.icon;
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className={`p-2 ${config.bgColor} shrink-0 mt-0.5`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">
                        <span className="font-medium">{log.user_name || log.user_email}</span>{" "}
                        <span className="text-muted-foreground">{log.action_description}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="rounded-none text-xs px-1.5 py-0"
                        >
                          {log.action_type.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
