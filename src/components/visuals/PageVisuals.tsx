import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Factory,
  FileText,
  GraduationCap,
  HeartPulse,
  KeyRound,
  Landmark,
  LockKeyhole,
  MessageSquareText,
  ScrollText,
  Send,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ProductMockup } from "@/components/ProductMockup";
import { LifecycleBadge } from "@/components/ui/Badges";
import type { CategoryIcon as IconKey, LifecycleStatus, Product } from "@/content/types";
import { ProductVignette } from "@/components/home/hero/ProductVignette";
import { vignetteBySlug } from "@/components/home/hero/vignette-map";
import { cn } from "@/lib/cn";
import { Stage3D } from "./Stage3D";

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Centres a square of `pct`% container width without using `translate` (reserved for depth). */
const centered = (pct: number, z: number): CSSProperties =>
  v({ width: `${pct}%`, aspectRatio: "1", left: "50%", top: "50%", marginLeft: `-${pct / 2}%`, marginTop: `-${pct / 2}%`, "--z": `${z}px` });

/* -------------------------------------------------------------------------- */
/* Deck — fanned 3D cards (catalogue, resources)                              */
/* -------------------------------------------------------------------------- */
export function DeckVisual({ cards }: { cards: { title: string; sub: string; icon?: IconKey; lifecycle?: LifecycleStatus; lines?: number }[] }) {
  const n = cards.length;
  return (
    <Stage3D className="aspect-[5/4] max-w-[540px]" base={{ rx: 16, ry: -16 }}>
      <div aria-hidden className="z3d absolute inset-[6%] rounded-[32px] bg-grid opacity-70 [mask-image:radial-gradient(circle,black,transparent_70%)]" style={v({ "--z": "-80px" })} />
      {cards.map((c, i) => (
        <div key={c.title} className="deck-card" style={v({ "--i": i, "--n": n })}>
          <div className={cn("deal-in rounded-[18px] p-4", i === n - 1 ? "card-glow shadow-[var(--shadow-lift)]" : "glass")} style={v({ "--delay": `${120 + i * 110}ms` })}>
            <div className="flex items-center gap-2.5">
              <span className={cn("flex size-9 items-center justify-center rounded-xl", i === n - 1 ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
                {c.icon ? <CategoryIcon icon={c.icon} className="size-4" /> : <FileText aria-hidden className="size-4" strokeWidth={1.7} />}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-midnight">{c.title}</span>
                <span className="block truncate text-[0.68rem] text-muted">{c.sub}</span>
              </span>
            </div>
            <div className="mt-3.5 space-y-1.5">
              {Array.from({ length: c.lines ?? 2 }, (_, k) => (
                <span key={k} className="block h-1.5 rounded-full bg-line" style={{ width: `${88 - k * 22}%` }} />
              ))}
            </div>
            {c.lifecycle && (
              <div className="mt-3.5">
                <LifecycleBadge status={c.lifecycle} className="scale-90 origin-left" />
              </div>
            )}
          </div>
        </div>
      ))}
    </Stage3D>
  );
}

/* -------------------------------------------------------------------------- */
/* Layer stack — exploded architecture (technology, enterprise)               */
/* -------------------------------------------------------------------------- */
export function LayerStackVisual({
  layers,
  tone = "dark",
  focus,
}: {
  layers: { label: string; icon: LucideIcon }[];
  tone?: "dark" | "light";
  focus?: number;
}) {
  const n = layers.length;
  return (
    <Stage3D className="aspect-square max-w-[520px]" base={{ rx: 4, ry: -6 }} range={{ x: 10, y: 6 }}>
      <div className="iso">
        <div className="z3d absolute inset-[4%] rounded-full border border-dashed border-electric/25 spin-slow" style={v({ "--z": "-30px" })} />
        {layers.map((l, i) => (
          <div
            key={l.label}
            className={cn(
              "plate flex items-end border p-4",
              tone === "dark" ? "glass-dark text-white" : "glass text-midnight",
              focus === i && "is-focus",
            )}
            style={v({ "--i": i, "--cycle": `${n * 2}s`, "--step": "2s" })}
          >
            <span className="flex items-center gap-2">
              <span className={cn("flex size-8 items-center justify-center rounded-lg", tone === "dark" ? "bg-white/10 text-cyan" : "bg-primary/10 text-primary")}>
                <l.icon aria-hidden className="size-4" strokeWidth={1.7} />
              </span>
              <span className="text-[0.78rem] font-semibold tracking-wide">{l.label}</span>
            </span>
            <span aria-hidden className={cn("absolute top-3 right-3 font-mono text-[0.6rem]", tone === "dark" ? "text-white/40" : "text-muted")}>
              L{i + 1}
            </span>
          </div>
        ))}
        {[-18, 0, 18].map((dx, k) => (
          <span key={dx} className="beam" style={v({ "--h": `${(n - 1) * 54 + 20}px`, marginLeft: `${dx}%`, "--delay": `${k * 0.6}s` })} />
        ))}
      </div>
    </Stage3D>
  );
}

/* -------------------------------------------------------------------------- */
/* Category monolith                                                          */
/* -------------------------------------------------------------------------- */
export function CategoryVisual({ icon, products }: { icon: IconKey; products: { slug: string; name: string }[] }) {
  const kind = products[0] ? vignetteBySlug[products[0].slug] : undefined;
  const satellites = [
    { left: "4%", top: "14%", z: 70 },
    { left: "66%", top: "6%", z: 40 },
    { left: "70%", top: "70%", z: 100 },
  ];
  return (
    <Stage3D className="aspect-[5/4] max-w-[540px]" base={{ rx: 14, ry: -18 }}>
      <div className="z3d absolute rounded-full border border-dashed border-primary/25 spin-slow" style={centered(70, -40)} />
      <div className="z3d absolute rounded-full border border-dotted border-gold/40 spin-slow-rev" style={centered(88, -70)} />
      <div className="p3d absolute top-1/2 left-1/2 size-[42%] -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            className={cn("z3d absolute inset-0 rounded-[28px]", k === 2 ? "glass-dark flex items-center justify-center" : "glass opacity-80")}
            style={v({ "--z": `${k * 36}px` })}
          >
            {k === 2 && (
              <>
                <div aria-hidden className="bg-grid-dark absolute inset-0 rounded-[inherit] opacity-50" />
                <CategoryIcon icon={icon} className="relative size-[42%] text-cyan" />
                <span className="absolute -top-1.5 -right-1.5 size-4 rounded-full border-[3px] border-white bg-gold" />
              </>
            )}
          </div>
        ))}
      </div>
      {products.slice(0, satellites.length).map((p, i) => (
        <div key={p.slug} className="p3d absolute" style={{ left: satellites[i].left, top: satellites[i].top }}>
          <div className="z3d" style={v({ "--z": `${satellites[i].z}px` })}>
            <div className="float3d glass rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-midnight" style={v({ "--dur": `${6 + i}s`, "--delay": `${-i * 1.4}s` })}>
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-cyan align-middle" />
              {p.name}
            </div>
          </div>
        </div>
      ))}
      {kind && (
        <div className="p3d absolute bottom-[2%] left-[2%] w-[48%]">
          <div className="z3d" style={v({ "--z": "120px" })}>
            <div className="float3d glass rounded-2xl p-2" style={v({ "--dur": "8s" })}>
              <ProductVignette kind={kind} />
            </div>
          </div>
        </div>
      )}
    </Stage3D>
  );
}

/* -------------------------------------------------------------------------- */
/* Product hero — concept UI in 3D with popped-out layers                     */
/* -------------------------------------------------------------------------- */
export function ProductHeroVisual({ product }: { product: Product }) {
  const kind = vignetteBySlug[product.slug];
  const [t1, t2] = product.mockup.tiles;
  return (
    <Stage3D className="aspect-[6/5] max-w-[600px]" base={{ rx: 8, ry: -16 }}>
      <div className="z3d absolute inset-x-[4%] top-[6%]" style={v({ "--z": "0px" })}>
        <ProductMockup product={product} />
      </div>
      {t1 && (
        <div className="p3d absolute top-[20%] -left-[9%] w-[30%]">
          <div className="z3d" style={v({ "--z": "90px" })}>
            <div className="float3d card-glow rounded-2xl p-3 shadow-[var(--shadow-lift)]" style={v({ "--dur": "7s" })}>
              <p className="truncate text-[0.62rem] text-muted">{t1.label}</p>
              <p className="mt-0.5 text-lg font-semibold whitespace-nowrap text-midnight tabular-nums">{t1.value}</p>
            </div>
          </div>
        </div>
      )}
      {t2 && (
        <div className="p3d absolute top-[54%] -right-[7%] w-[28%]">
          <div className="z3d" style={v({ "--z": "60px" })}>
            <div className="float3d glass rounded-2xl p-3" style={v({ "--dur": "8.5s", "--delay": "-2s" })}>
              <p className="truncate text-[0.62rem] text-muted">{t2.label}</p>
              <p className="mt-0.5 text-lg font-semibold whitespace-nowrap text-midnight tabular-nums">{t2.value}</p>
            </div>
          </div>
        </div>
      )}
      {kind && (
        <div className="p3d absolute -bottom-[2%] -left-[8%] w-[46%]">
          <div className="z3d" style={v({ "--z": "130px" })}>
            <div className="float3d glass rounded-2xl p-2" style={v({ "--dur": "9s", "--delay": "-3s" })}>
              <ProductVignette kind={kind} />
            </div>
          </div>
        </div>
      )}
    </Stage3D>
  );
}

/* -------------------------------------------------------------------------- */
/* Shield — layered security                                                  */
/* -------------------------------------------------------------------------- */
const SHIELD = "M50 4 L92 18 V48 C92 74 72 90 50 98 C28 90 8 74 8 48 V18 Z";

export function ShieldVisual() {
  const chips = [
    { label: "MFA for admins", Icon: KeyRound, left: "0%", top: "16%", z: 90 },
    { label: "Audit trail", Icon: ScrollText, left: "66%", top: "8%", z: 60 },
    { label: "Least privilege", Icon: LockKeyhole, left: "64%", top: "74%", z: 110 },
  ];
  return (
    <Stage3D className="aspect-[5/4] max-w-[520px]" base={{ rx: 10, ry: -18 }}>
      <div className="z3d absolute rounded-full border border-dashed border-primary/25 spin-slow" style={centered(78, -60)} />
      <div className="p3d absolute top-1/2 left-1/2 h-[80%] w-[52%] -translate-x-1/2 -translate-y-1/2">
        {[
          { z: 0, fill: "#E8EEFC", stroke: "#BFD0F7" },
          { z: 28, fill: "#D8F1F7", stroke: "#8AD4E6" },
          { z: 56, fill: "#101A2D", stroke: "#315FD5" },
        ].map((s, k) => (
          <svg key={k} viewBox="0 0 100 102" className="z3d absolute inset-0 size-full drop-shadow-[0_18px_30px_rgb(16_26_45/0.25)]" style={v({ "--z": `${s.z}px`, scale: `${1.24 - k * 0.12}` })}>
            <path d={SHIELD} fill={s.fill} stroke={s.stroke} strokeWidth="1.5" />
          </svg>
        ))}
        <div className="z3d absolute inset-0" style={v({ "--z": "57px" })}>
          <span className="shield-scan absolute inset-x-[18%] h-0.5 rounded-full bg-cyan shadow-[0_0_14px_3px_rgb(53_185_214/0.8)]" />
        </div>
        <div className="z3d absolute inset-0 flex items-center justify-center" style={v({ "--z": "110px" })}>
          <span className="float3d flex size-16 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_20px_40px_-14px_rgb(49_95_213/0.6)]" style={v({ "--dur": "6s" })}>
            <ShieldCheck aria-hidden className="size-8" strokeWidth={1.7} />
          </span>
        </div>
      </div>
      {chips.map(({ label, Icon, left, top, z }, i) => (
        <div key={label} className="p3d absolute" style={{ left, top }}>
          <div className="z3d" style={v({ "--z": `${z}px` })}>
            <div className="float3d glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-midnight" style={v({ "--dur": `${6.5 + i}s`, "--delay": `${-i * 1.7}s` })}>
              <Icon aria-hidden className="size-3.5 text-primary" />
              {label}
            </div>
          </div>
        </div>
      ))}
    </Stage3D>
  );
}

/* -------------------------------------------------------------------------- */
/* Brand orbit — about                                                        */
/* -------------------------------------------------------------------------- */
export function BrandOrbitVisual({ values }: { values: string[] }) {
  const spots = [
    { left: "2%", top: "12%", z: 80 },
    { left: "70%", top: "4%", z: 50 },
    { left: "72%", top: "76%", z: 110 },
    { left: "0%", top: "70%", z: 60 },
  ];
  return (
    <Stage3D className="aspect-[5/4] max-w-[540px]" base={{ rx: 12, ry: -14 }}>
      {[
        { size: 52, z: -20, color: "border-primary/35", cls: "spin-slow", dot: "bg-electric" },
        { size: 70, z: -50, color: "border-cyan/35", cls: "spin-slow-rev", dot: "bg-cyan" },
        { size: 88, z: -80, color: "border-gold/40", cls: "spin-slow", dot: "bg-gold" },
      ].map((r) => (
        <div key={r.size} className={cn("z3d absolute rounded-full border", r.color, r.cls)} style={centered(r.size, r.z)}>
          <span className={cn("absolute -top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full shadow-[0_0_12px_2px_currentColor]", r.dot)} />
        </div>
      ))}
      <div className="z3d absolute rounded-full bg-electric/20 blur-3xl" style={centered(40, 40)} />
      <div className="p3d absolute top-1/2 left-1/2 w-[40%] -translate-x-1/2 -translate-y-1/2">
        <div className="z3d" style={v({ "--z": "120px" })}>
          <div className="float3d" style={v({ "--dur": "7s" })}>
            <Image src="/brand/medhavya-mark.png" alt="" width={218} height={192} className="w-full drop-shadow-[0_24px_30px_rgb(16_26_45/0.35)]" />
          </div>
        </div>
      </div>
      {values.slice(0, spots.length).map((val, i) => (
        <div key={val} className="p3d absolute" style={{ left: spots[i].left, top: spots[i].top }}>
          <div className="z3d" style={v({ "--z": `${spots[i].z}px` })}>
            <div className="float3d glass rounded-full px-3.5 py-1.5 text-xs font-semibold text-midnight" style={v({ "--dur": `${6 + i}s`, "--delay": `${-i * 1.3}s` })}>
              {val}
            </div>
          </div>
        </div>
      ))}
    </Stage3D>
  );
}

/* -------------------------------------------------------------------------- */
/* Conversation — contact & demo                                              */
/* -------------------------------------------------------------------------- */
export function ConversationVisual({ mode = "contact" }: { mode?: "contact" | "demo" }) {
  return (
    <Stage3D className="aspect-[5/4] max-w-[520px]" base={{ rx: 12, ry: -16 }}>
      <svg viewBox="0 0 100 80" className="z3d absolute inset-0 size-full" style={v({ "--z": "-20px" })}>
        <path d="M14 30 C40 30 40 52 64 50 S86 26 88 20" fill="none" stroke="#315FD5" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
      </svg>
      <Floating left="2%" top="8%" w="54%" z={60} dur={7}>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageSquareText aria-hidden className="size-4" />
            </span>
            <span className="text-xs font-semibold text-midnight">{mode === "demo" ? "Demo request" : "Your enquiry"}</span>
          </div>
          <div className="mt-3 space-y-1.5">
            <span className="block h-1.5 w-[90%] rounded-full bg-line" />
            <span className="block h-1.5 w-[70%] rounded-full bg-line" />
            <span className="block h-1.5 w-[50%] rounded-full bg-line" />
          </div>
        </div>
      </Floating>
      <Floating left="50%" top="26%" w="46%" z={110} dur={8.5} delay={-2}>
        <div className="card-glow rounded-2xl p-3.5 shadow-[var(--shadow-lift)]">
          <div className="flex items-center gap-2 text-xs font-semibold text-midnight">
            <CalendarDays aria-hidden className="size-4 text-primary" /> Pick a time
          </div>
          <div className="mt-2.5 grid grid-cols-7 gap-1">
            {Array.from({ length: 21 }, (_, k) => (
              <span key={k} className={cn("aspect-square rounded-[4px]", k === 11 ? "cal-pick bg-primary" : k % 7 > 4 ? "bg-canvas" : "bg-line/80")} />
            ))}
          </div>
        </div>
      </Floating>
      <Floating left="10%" top="60%" w="50%" z={80} dur={7.5} delay={-4}>
        <div className="glass-dark rounded-2xl p-3.5 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 aria-hidden className="size-4 text-cyan" /> Reply by email
          </div>
          <div className="typing mt-2.5 flex gap-1">
            <span className="size-1.5 rounded-full bg-white" />
            <span className="size-1.5 rounded-full bg-white" />
            <span className="size-1.5 rounded-full bg-white" />
          </div>
        </div>
      </Floating>
      <div className="z3d absolute inset-0" style={v({ "--z": "150px" })}>
        <span className="plane-fly absolute flex size-9 items-center justify-center rounded-full bg-white text-primary shadow-[var(--shadow-lift)]">
          <Send aria-hidden className="size-4" />
        </span>
      </div>
    </Stage3D>
  );
}

function Floating({ left, top, w, z, dur, delay = 0, children }: { left: string; top: string; w: string; z: number; dur: number; delay?: number; children: ReactNode }) {
  return (
    <div className="p3d absolute" style={{ left, top, width: w }}>
      <div className="z3d" style={v({ "--z": `${z}px` })}>
        <div className="float3d" style={v({ "--dur": `${dur}s`, "--delay": `${delay}s` })}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mosaic — industries & solutions                                            */
/* -------------------------------------------------------------------------- */
const mosaicIcons: { Icon: LucideIcon; label: string }[] = [
  { Icon: Sprout, label: "Agriculture" },
  { Icon: HeartPulse, label: "Healthcare" },
  { Icon: GraduationCap, label: "Education" },
  { Icon: Store, label: "Retail" },
  { Icon: Truck, label: "Logistics" },
  { Icon: Factory, label: "Manufacturing" },
  { Icon: Landmark, label: "Finance" },
  { Icon: ShieldCheck, label: "Governance" },
];

export function MosaicVisual() {
  const cells = [0, 1, 2, 3, -1, 4, 5, 6, 7];
  return (
    <Stage3D className="aspect-square max-w-[500px]" base={{ rx: 4, ry: -6 }} range={{ x: 10, y: 6 }}>
      <div className="iso">
        <div className="absolute top-1/2 left-1/2 grid w-[78%] -translate-x-1/2 -translate-y-1/2 grid-cols-3 gap-3 p3d">
          {cells.map((c, k) => {
            const d = Math.floor(k / 3) + (k % 3);
            if (c === -1) {
              return (
                <div key="core" className="tile glass-dark flex aspect-square items-center justify-center rounded-2xl" style={v({ "--d": d })}>
                  <Image src="/brand/medhavya-mark.png" alt="" width={218} height={192} className="w-[58%]" />
                </div>
              );
            }
            const { Icon, label } = mosaicIcons[c];
            return (
              <div key={label} className="tile glass flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl text-primary" style={v({ "--d": d })}>
                <Icon aria-hidden className="size-[34%]" strokeWidth={1.5} />
                <span className="text-[0.6rem] font-semibold text-midnight">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Stage3D>
  );
}
