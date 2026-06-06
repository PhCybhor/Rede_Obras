import { useState, type MouseEvent } from "react";
import { ArrowRight, CheckCircle, Play, X } from "lucide-react";
import { HERO_HIGHLIGHTS, HERO_STATS, IMAGES } from "../../constantes/constantes";

interface VideoModalProps {
  onClose: () => void;
}

function VideoModal({ onClose }: VideoModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Demonstração da plataforma"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      {}
      <div
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        style={{
          background: "#0A1628",
          borderRadius: "16px",
          padding: "24px",
          width: "min(700px, 90vw)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              color: "white",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            Demonstração da Plataforma
          </h3>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {}
        <div
          style={{
            background: "rgba(27,86,240,0.1)",
            borderRadius: "12px",
            aspectRatio: "16/9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(27,86,240,0.2)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <Play size={48} style={{ color: "#1B56F0", marginBottom: "12px" }} />
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "rgba(255,255,255,0.5)",
                fontSize: "14px",
              }}
            >
              Vídeo de demonstração em breve
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section
      id="inicio"
      aria-label="Seção principal"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#0A1628",
      }}
    >
      {}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${IMAGES.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
        }}
      />

      {}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(10,22,40,0.97) 0%, rgba(10,22,40,0.75) 60%, rgba(27,86,240,0.15) 100%)",
        }}
      />

      {}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "15%",
          right: "8%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(27,86,240,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {}
      <div
        className="hero-grid"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "120px 24px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px",
          alignItems: "center",
        }}
      >
        {}
        <div>
          {}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(27,86,240,0.15)",
              border: "1px solid rgba(27,86,240,0.3)",
              borderRadius: "100px",
              padding: "6px 16px",
              marginBottom: "28px",
            }}
          >
            <div
              aria-hidden="true"
              style={{ width: "6px", height: "6px", background: "#1B56F0", borderRadius: "50%" }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#7BA7F5",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Plataforma líder em gestão de obras
            </span>
          </div>

          {}
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              marginBottom: "24px",
            }}
          >
            Conecte sua{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F59E0B, #F97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              construtora
            </span>{" "}
            às melhores oportunidades
          </h1>

          {}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              marginBottom: "36px",
              maxWidth: "500px",
            }}
          >
            A RedesObras conecta construtoras, fornecedores e profissionais da construção civil em
            uma rede inteligente de negócios e oportunidades.
          </p>

          {}
          <ul
            aria-label="Vantagens"
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "40px",
            }}
          >
            {HERO_HIGHLIGHTS.map((highlight) => (
              <li key={highlight} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle
                  size={16}
                  aria-hidden="true"
                  style={{ color: "#22C55E", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {highlight}
                </span>
              </li>
            ))}
          </ul>

          {}
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
            {}
            <a
              href="#contato"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                color: "white",
                padding: "14px 28px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #1B56F0, #0A3AB4)",
                boxShadow: "0 8px 24px rgba(27,86,240,0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,86,240,0.5)";
              }}
              onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,86,240,0.4)";
              }}
            >
              Começar gratuitamente
              <ArrowRight size={16} aria-hidden="true" />
            </a>

            {}
            <button
              onClick={() => setVideoOpen(true)}
              aria-label="Assistir à demonstração"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: "white",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "14px 0",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: "42px",
                  height: "42px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <Play size={14} fill="white" />
              </div>
              Ver demonstração
            </button>
          </div>
        </div>

        {}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              padding: "32px",
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
                background: "linear-gradient(90deg, #1B56F0, #F59E0B)",
              }}
            />

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "20px",
              }}
            >
              Resultados em números
            </p>

            {}
            <dl
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
            >
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "32px",
                      fontWeight: 800,
                      color: stat.color,
                      lineHeight: 1,
                      marginBottom: "4px",
                    }}
                  >
                    {stat.value}
                  </dt>
                  <dd
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {}
            <div
              aria-hidden="true"
              style={{
                width: "44px",
                height: "44px",
                background: "rgba(34,197,94,0.15)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#22C55E",
                  borderRadius: "50%",
                  boxShadow: "0 0 8px #22C55E",
                }}
              />
            </div>

            <div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "white",
                  marginBottom: "2px",
                }}
              >
                47 novos contratos hoje
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                Rede ativa em tempo real
              </p>
            </div>
          </div>
        </div>
      </div>

      {}
      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}

      {}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
