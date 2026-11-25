/**
 * Deep-space backdrop for dark heroes: midnight gradient, soft blue / violet / gold nebula light and a
 * fixed field of tiny stars (seeded, so server and client render the same markup). Purely decorative.
 */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const stars = (() => {
  const r = rng(20261125);
  return Array.from({ length: 150 }, () => ({
    x: +(r() * 100).toFixed(2),
    y: +(r() * 100).toFixed(2),
    r: +(0.4 + r() * 1.1).toFixed(2),
    o: +(0.25 + r() * 0.65).toFixed(2),
    c: r() < 0.18 ? "#ffd58a" : r() < 0.4 ? "#9fd8ff" : "#ffffff",
  }));
})();

export function Starfield() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_50%,#14224a_0%,#0b1430_45%,#070d20_100%)]" />
      <div className="absolute top-[-10%] right-[2%] size-[38rem] rounded-full bg-primary/25 blur-[140px]" />
      <div className="absolute right-[18%] bottom-[-18%] size-[30rem] rounded-full bg-violet-600/20 blur-[140px]" />
      <div className="absolute top-[28%] right-[-6%] size-[22rem] rounded-full bg-amber-400/15 blur-[130px]" />
      <svg className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r / 10} fill={s.c} opacity={s.o} />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070d20] to-transparent" />
    </div>
  );
}
