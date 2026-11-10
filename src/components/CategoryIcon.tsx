import { Bot, Building2, GraduationCap, HeartPulse, LineChart, Sprout, Store, Truck, type LucideProps } from "lucide-react";
import type { CategoryIcon as IconKey } from "@/content/types";

const icons = {
  agriculture: Sprout,
  retail: Store,
  ai: Bot,
  finance: LineChart,
  enterprise: Building2,
  education: GraduationCap,
  healthcare: HeartPulse,
  other: Truck,
} satisfies Record<IconKey, unknown>;

export function CategoryIcon({ icon, ...props }: { icon: IconKey } & LucideProps) {
  const Icon = icons[icon];
  return <Icon aria-hidden strokeWidth={1.6} {...props} />;
}
