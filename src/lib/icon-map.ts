import {
  Heart, Shield, Eye, HandHeart, Microscope, BadgeCheck, Clock, Award,
  GraduationCap, Globe, Languages, MessageCircle, Phone, Video, Mail,
  Users, Sparkles, FileText, Calendar, HeartPulse, Stethoscope, MapPin,
  Building, Check, CheckCircle2, CheckCircle, DollarSign, Calculator,
  Plane, Hotel, Smartphone, AlertTriangle, ArrowRight, Star, Send,
  HelpCircle, RefreshCw, Lock, ScrollText, Quote, XCircle,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Heart, Shield, Eye, HandHeart, Microscope, BadgeCheck, Clock, Award,
  GraduationCap, Globe, Languages, MessageCircle, Phone, Video, Mail,
  Users, Sparkles, FileText, Calendar, HeartPulse, Stethoscope, MapPin,
  Building, Check, CheckCircle2, CheckCircle, DollarSign, Calculator,
  Plane, Hotel, Smartphone, AlertTriangle, ArrowRight, Star, Send,
  HelpCircle, RefreshCw, Lock, ScrollText, Quote, XCircle,
};

export function getIcon(name: string | null | undefined, fallback: LucideIcon = Sparkles): LucideIcon {
  if (!name) return fallback;
  return ICONS[name] || ICONS[name.charAt(0).toUpperCase() + name.slice(1)] || fallback;
}
