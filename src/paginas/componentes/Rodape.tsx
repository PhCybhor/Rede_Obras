

import type { ElementType, MouseEvent } from "react";
import { Linkedin, Instagram, Youtube } from "lucide-react";
import { FOOTER_LINK_GROUPS, FOOTER_CONTACT_ITEMS } from "../../constantes/constantes";

interface SocialButtonProps {

  icon: ElementType;

  label: string;
  href?: string;
}

function SocialButton({ icon: Icon, label, href = "#" }: SocialButtonProps) {
  return (
    <a
      href={href}
      aria-label={`Visitar ${label}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: "36px",
        height: "36px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.45)",
        transition: "background 0.2s, border-color 0.2s, color 0.2s",
      }}
      onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
        const el = e.currentTarget;
        el.style.background = "rgba(27,86,240,0.2)";
        el.style.borderColor = "rgba(27,86,240,0.3)";
        el.style.color = "white";
      }}
      onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
        const el = e.currentTarget;
        el.style.background = "rgba(255,255,255,0.06)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.color = "rgba(255,255,255,0.45)";
      }}
    >
      <Icon size={15} aria-hidden="true" />
    </a>
  );
}

function BrandColumn() {
  return (
    <div>
      {}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #1B56F0, #0A3AB4)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(27,86,240,0.35)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2L18 7V13L10 18L2 13V7L10 2Z" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="10" cy="10" r="2.5" fill="white" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "19px",
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.3px",
          }}
        >
          Redes<span style={{ color: "#F59E0B" }}>Obras</span>
        </span>
      </div>

      {}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.7,
          marginBottom: "24px",
        }}
      >
        A maior plataforma de networking e gestão de negócios para a construção civil brasileira.
      </p>

      {}
      <address
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "24px",
          fontStyle: "normal",
        }}
      >
        {FOOTER_CONTACT_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon
                size={14}
                aria-hidden="true"
                style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </address>

      {}
      <nav aria-label="Redes sociais">
        <div style={{ display: "flex", gap: "10px" }}>
          <SocialButton icon={Linkedin} label="LinkedIn" />
          <SocialButton icon={Instagram} label="Instagram" />
          <SocialButton icon={Youtube} label="YouTube" />
        </div>
      </nav>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: "#060E1C", color: "white" }}>
      {}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "72px 24px 48px" }}>
        <div
          className="footer-main"
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "60px",
            marginBottom: "60px",
          }}
        >
          <BrandColumn />

          {}
          <nav
            aria-label="Links do rodapé"
            className="footer-links"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}
          >
            {FOOTER_LINK_GROUPS.map(({ category, links }) => (
              <div key={category}>
                <h4
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "white",
                    marginBottom: "16px",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  {category}
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href={`/${link.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-")}`}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "14px",
                          color: "rgba(255,255,255,0.4)",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "white")}
                        onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {}
        <hr style={{ height: "1px", background: "rgba(255,255,255,0.07)", border: "none", marginBottom: "28px" }} />

        {}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            © {currentYear} RedesObras. Todos os direitos reservados.
          </p>

          {}
          <div
            aria-label="Status: todos os sistemas operacionais"
            style={{ display: "flex", gap: "6px", alignItems: "center" }}
          >
            <div
              aria-hidden="true"
              style={{
                width: "6px",
                height: "6px",
                background: "#22C55E",
                borderRadius: "50%",
                boxShadow: "0 0 6px #22C55E",
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Todos os sistemas operacionais — uptime 99.9%
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-main { grid-template-columns: 1fr !important; }
          .footer-links { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .footer-links { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
