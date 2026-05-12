import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Json } from "@/integrations/supabase/types";

export type ActivityActionType = 
  | "login"
  | "logout"
  | "permission_change"
  | "role_change"
  | "member_invited"
  | "member_suspended"
  | "member_reactivated"
  | "member_removed"
  | "password_reset"
  | "settings_updated"
  | "2fa_enabled"
  | "2fa_disabled";

interface LogActivityParams {
  actionType: ActivityActionType;
  description: string;
  metadata?: Json;
}

export function useActivityLog() {
  const { user } = useAuth();

  const logActivity = async ({ actionType, description, metadata = {} }: LogActivityParams) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("activity_logs").insert([{
        user_id: user.id,
        user_email: user.email || "unknown",
        user_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Unknown",
        action_type: actionType,
        action_description: description,
        metadata,
      }]);

      if (error) {
        console.error("Failed to log activity:", error);
      }
    } catch (err) {
      console.error("Error logging activity:", err);
    }
  };

  return { logActivity };
}
