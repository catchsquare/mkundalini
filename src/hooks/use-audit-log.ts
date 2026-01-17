import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type AuditAction = 
  | "create" 
  | "update" 
  | "delete" 
  | "publish" 
  | "unpublish" 
  | "status_change"
  | "role_change"
  | "login"
  | "logout";

export type EntityType = 
  | "patient" 
  | "appointment" 
  | "invoice" 
  | "payment" 
  | "inventory_item"
  | "lead"
  | "page"
  | "page_section"
  | "blog_post"
  | "testimonial"
  | "gallery_item"
  | "navigation_item"
  | "profile"
  | "setting"
  | "offer"
  | "team_member";

interface AuditLogParams {
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

export function useAuditLog() {
  const { user, profile } = useAuth();

  const logAction = async ({
    action,
    entityType,
    entityId,
    oldValues,
    newValues,
  }: AuditLogParams) => {
    try {
      await supabase.from("audit_logs").insert({
        action,
        entity_type: entityType,
        entity_id: entityId,
        user_id: user?.id,
        user_email: profile?.email || user?.email,
        old_values: oldValues || null,
        new_values: newValues || null,
      });
    } catch (error) {
      console.error("Failed to log audit action:", error);
    }
  };

  return { logAction };
}
