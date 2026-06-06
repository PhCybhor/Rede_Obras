

import type { MouseEvent } from "react";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "../../constantes/constantes";
import type { Testimonial } from "../../tipos/tipos";
import { SectionBadge } from "./Funcionalidades";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

function TestimonialCard({ testimonial: t }: TestimonialCardProps) {
  return (
    <article
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "28px",
        transition: "background 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e: MouseEvent<HTMLElement>) => {
        const el = e.currentTarget;
        el.style.background = "rgba(255,255,255,0.07)";
        el.style.borderColor = "rgba(255,255,255,0.14)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e: MouseEvent<HTMLElement>) => {
        const el = e.currentTarget;
        el.style.background = "rgba(255,255,255,0.04)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.transform = "translateY(0)";
      }}
    >
      {}
      <Quote
        aria-hidden="true"
        size={20}
        style={{ color: "rgba(27,86,240,0.4)", marginBottom: "16px" }}
      />

      {}
      <div
        aria-label={`Avaliação: ${t.rating} de 5 estrelas`}
        style={{ display: "flex", gap: "3px", marginBottom: "16px" }}
      >
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} size={14} aria-hidden="true" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
        ))}
      </div>

      {}
      <blockquote
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.7,
          marginBottom: "24px",
          fontStyle: "normal",
        }}
      >
        "{t.text}"
      </blockquote>

      {}
      <footer style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {}
        <div
          aria-hidden="true"
          style={{
            width: "40px",
            height: "40px",
            background: `linear-gradient(135deg, ${t.color}33, ${t.color}22)`,
            border: `1px solid ${t.color}44`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: t.color,
            }}
          >
            {t.avatar}
          </span>
        </div>

        <cite style={{ fontStyle: "normal" }}>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.3,
            }}
          >
            {t.name}
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            {t.role}
          </p>
        </cite>
      </footer>
    </article>
  );
}

export function Testimonials() {
  return (
    <section
      id="depoimentos"
      aria-labelledby="testimonials-heading"
      style={{
        padding: "100px 24px",
        background: "#0A1628",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, rgba(27,86,240,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        {}
        <header style={{ textAlign: "center", marginBottom: "60px" }}>
          <SectionBadge
            label="Depoimentos"
            color="#7BA7F5"
            bg="rgba(27,86,240,0.15)"
            border="1px solid rgba(27,86,240,0.3)"
          />

          <h2
            id="testimonials-heading"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            O que nossos clientes dizem
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "17px",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Mais de 12.000 empresas já transformaram seus resultados com a RedesObras.
          </p>
        </header>

        {}
        <div
          className="testimonials-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}
        >
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
