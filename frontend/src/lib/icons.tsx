import {
  BookOpen,
  Wallet,
  Calculator,
  FileCheck2,
  Receipt,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Building2,
  Lightbulb,
  LayoutTemplate,
  Code2,
  Smartphone,
  BadgeCheck,
  Gauge,
  Puzzle,
  Award,
  GraduationCap,
  MessagesSquare,
  Users,
  Sparkles,
  Handshake,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

type IconCmp = ComponentType<SVGProps<SVGSVGElement>>;

/** Names the admin can choose from when editing a service. */
export const ICONS: Record<string, IconCmp> = {
  BookOpen,
  Wallet,
  Calculator,
  FileCheck2,
  Receipt,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Building2,
  Lightbulb,
  LayoutTemplate,
  Code2,
  Smartphone,
  BadgeCheck,
  Gauge,
  Puzzle,
  Award,
  GraduationCap,
  MessagesSquare,
  Users,
  Sparkles,
  Handshake,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Cmp = (name && ICONS[name]) || Sparkles;
  return <Cmp className={className} strokeWidth={1.5} aria-hidden />;
}
