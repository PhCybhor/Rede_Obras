

import { useCountUp, useIntersectionOnce } from "../../hooks/hooks";
import { STATS } from "../../constantes/constantes";
import type { Stat } from "../../tipos/tipos";

interface StatCardProps {
  stat: Stat;

  isVisible: boolean;
}

function StatCard({ stat, isVisible }: StatCardProps) {
  const count = useCountUp(stat.value, 1800, isVisible);

  return (
    <div style={{ textAlign: "center", padding: "40px 24px" }}>
      {}
      <p
        aria-label={`${stat.prefix ?? ""}${stat.value.toLocaleString("pt-BR")}${stat.suffix} ${stat.label}`}
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "clamp(40px, 5vw, 56px)",
          fontWeight: 800,
          color: "white",
          lineHeight: 1,
          marginBottom: "8px",
          letterSpacing: "-2px",
        }}
      >
        {stat.prefix ?? ""}
        {count.toLocaleString("pt-BR")}
        {stat.suffix}
      </p>

      {}
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.9)",
          marginBottom: "6px",
        }}
      >
        {stat.label}
      </p>

      {}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.5,
        }}
      >
        {stat.description}
      </p>
    </div>
  );
}

export function Stats() {

  const [sectionRef, isVisible] = useIntersectionOnce<HTMLElement>(0.3);

  return (
    <section
      ref={sectionRef}
      aria-label="Estatísticas da plataforma"
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0F2347 50%, #1B3A6E 100%)",
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, #1B56F0, #F59E0B, #22C55E, #A855F7)",
        }}
      />

      {}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {}
      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
        <div
          className="stats-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {STATS.map((stat, index) => (
            <div key={stat.label} style={{ position: "relative" }}>
              {}
              {index < STATS.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "20%",
                    bottom: "20%",
                    width: "1px",
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
              )}
              <StatCard stat={stat} isVisible={isVisible} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
