

import { UserPlus } from "lucide-react";
import { STEPS, IMAGES } from "../../constantes/constantes";
import type { Step } from "../../tipos/tipos";
import { SectionBadge } from "./Funcionalidades";

interface StepItemProps {
  step: Step;

  isLast: boolean;
}

function StepItem({ step, isLast }: StepItemProps) {
  const Icon = step.icon;

  return (
    <li
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: isLast ? 0 : "32px",
      }}
    >
      {}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {}
        <div
          aria-hidden="true"
          style={{
            width: "48px",
            height: "48px",
            background: `${step.color}22`,
            border: `2px solid ${step.color}33`,
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={20} style={{ color: step.color }} />
        </div>

        {}
        {!isLast && (
          <div
            aria-hidden="true"
            style={{
              width: "1px",
              flex: 1,
              marginTop: "8px",
              background: "linear-gradient(to bottom, rgba(0,0,0,0.08), transparent)",
              minHeight: "20px",
            }}
          />
        )}
      </div>

      {}
      <div style={{ paddingTop: "10px" }}>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: step.color,
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          Passo {step.number}
        </p>
        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "17px",
            fontWeight: 700,
            color: "#0A1628",
            marginBottom: "6px",
            letterSpacing: "-0.2px",
          }}
        >
          {step.title}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: "#6B7280",
            lineHeight: 1.6,
          }}
        >
          {step.description}
        </p>
      </div>
    </li>
  );
}

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="how-it-works-heading"
      style={{ padding: "100px 24px", background: "white" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          className="how-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
        >
          {}
          <div style={{ position: "relative" }}>
            {}
            <div
              style={{
                borderRadius: "20px",
                overflow: "hidden",
                aspectRatio: "4/5",
                background: "#0A1628",
              }}
            >
              <img
                src={IMAGES.engineer}
                alt="Engenheira em obra de construção civil"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
              />
            </div>

            {}
            <div
              aria-label="Estatística: obras concluídas"
              style={{
                position: "absolute",
                bottom: "-24px",
                right: "-24px",
                background: "white",
                borderRadius: "16px",
                padding: "20px 24px",
                boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
                border: "1px solid rgba(0,0,0,0.06)",
                minWidth: "190px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "#0A1628",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                +3.200
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  color: "#6B7280",
                  fontWeight: 500,
                }}
              >
                obras concluídas este mês
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}
              >
                <div
                  aria-hidden="true"
                  style={{ width: "6px", height: "6px", background: "#22C55E", borderRadius: "50%" }}
                />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    color: "#22C55E",
                    fontWeight: 600,
                  }}
                >
                  +24% vs mês anterior
                </span>
              </div>
            </div>

            {}
            <div
              aria-label="Notificação: nova empresa cadastrada"
              style={{
                position: "absolute",
                top: "24px",
                left: "-20px",
                background: "white",
                borderRadius: "12px",
                padding: "12px 16px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "rgba(27,86,240,0.1)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <UserPlus size={16} style={{ color: "#1B56F0" }} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#0A1628",
                    }}
                  >
                    Nova empresa
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      color: "#6B7280",
                    }}
                  >
                    Acabou de se cadastrar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {}
          <div>
            <SectionBadge label="Como funciona" />

            <h2
              id="how-it-works-heading"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(26px, 3.5vw, 40px)",
                fontWeight: 800,
                color: "#0A1628",
                letterSpacing: "-0.8px",
                lineHeight: 1.15,
                marginBottom: "16px",
              }}
            >
              Simples, rápido e{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #1B56F0, #0A3AB4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                seguro
              </span>
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                color: "#6B7280",
                lineHeight: 1.6,
                marginBottom: "40px",
              }}
            >
              Em 4 passos simples, sua empresa estará conectada ao maior ecossistema de
              construção civil do Brasil.
            </p>

            {}
            <ol aria-label="Passos do processo">
              {STEPS.map((step, index) => (
                <StepItem
                  key={step.number}
                  step={step}
                  isLast={index === STEPS.length - 1}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .how-grid {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
        }
      `}</style>
    </section>
  );
}
