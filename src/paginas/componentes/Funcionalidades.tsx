

import type { MouseEvent } from "react";
import { FEATURES } from "../../constantes/constantes";
import type { Feature } from "../../tipos/tipos";

interface FeatureCardProps {
  feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <article
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "32px",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e: MouseEvent<HTMLElement>) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 20px 50px rgba(0,0,0,0.08)";
        el.style.borderColor = "rgba(27,86,240,0.15)";
      }}
      onMouseLeave={(e: MouseEvent<HTMLElement>) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        el.style.borderColor = "rgba(0,0,0,0.06)";
      }}
    >
      {}
      <div
        aria-hidden="true"
        style={{
          width: "52px",
          height: "52px",
          background: feature.bg,
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Icon size={24} style={{ color: feature.color }} />
      </div>

      <h3
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          color: "#0A1628",
          marginBottom: "10px",
          letterSpacing: "-0.3px",
        }}
      >
        {feature.title}
      </h3>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          color: "#6B7280",
          lineHeight: 1.65,
        }}
      >
        {feature.description}
      </p>
    </article>
  );
}

interface SectionBadgeProps {
  label: string;

  color?: string;

  bg?: string;

  border?: string;
}

export function SectionBadge({
  label,
  color = "#1B56F0",
  bg = "rgba(27,86,240,0.08)",
  border = "1px solid rgba(27,86,240,0.15)",
}: SectionBadgeProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: bg,
        border,
        borderRadius: "100px",
        padding: "6px 16px",
        marginBottom: "20px",
      }}
    >
      <div
        aria-hidden="true"
        style={{ width: "6px", height: "6px", background: color, borderRadius: "50%" }}
      />
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          color,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function Features() {
  return (
    <section
      id="funcionalidades"
      aria-labelledby="features-heading"
      style={{ padding: "100px 24px", background: "#F8FAFF" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {}
        <header style={{ textAlign: "center", marginBottom: "64px" }}>
          <SectionBadge label="Funcionalidades" />

          <h2
            id="features-heading"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              color: "#0A1628",
              letterSpacing: "-1px",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            Tudo que sua construtora precisa,{" "}
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #1B56F0, #0A3AB4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              em uma plataforma
            </span>
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "17px",
              color: "#6B7280",
              maxWidth: "540px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Ferramentas poderosas para conectar, gerenciar e crescer seu negócio na construção
            civil.
          </p>
        </header>

        {}
        <div
          className="features-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
