import { Cpu, Database, KeyRound, LayoutDashboard, Network } from "lucide-react";

/** Exploded-architecture layers, bottom to top. */
export const enterpriseLayers = [
  { label: "Integrations", icon: Network },
  { label: "Data & migration", icon: Database },
  { label: "AI & automation", icon: Cpu },
  { label: "Applications & portals", icon: LayoutDashboard },
];

/** Which enterprise layer each service highlights. */
export const enterpriseFocus: Record<string, number> = {
  "integration-modernization": 0,
  "ai-automation": 2,
  "custom-software": 3,
};

export const platformLayers = [
  { label: "Identity & access", icon: KeyRound },
  { label: "Data layer", icon: Database },
  { label: "AI services", icon: Cpu },
  { label: "Integrations", icon: Network },
];
