

import { useState, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { useScrolled } from "../../hooks/hooks";
import { NAV_LINKS } from "../../constantes/constantes";

function Logo() {
  return (
    <a
      href="#inicio"
      aria-label="Ir para o início"
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
    >
      {}
      <div
        style={{
          width: "38px",
          height: "38px",
          background: "linear-gradient(135deg, #1B56F0, #0A3AB4)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(27,86,240,0.4)",
          flexShrink: 0,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 2L18 7V13L10 18L2 13V7L10 2Z" stroke="white" strokeWidth="1.5" fill="none" />
          <circle cx="10" cy="10" r="2.5" fill="white" />
        </svg>
      </div>

      {}
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "20px",
          fontWeight: 700,
          color: "white",
          letterSpacing: "-0.3px",
        }}
      >
        Redes<span style={{ color: "#F59E0B" }}>Obras</span>
      </span>
    </a>
  );
}

export function Navbar() {
  const scrolled = useScrolled(20);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav
      role="navigation"
      aria-label="Menu principal"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
        background: scrolled ? "rgba(10, 22, 40, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
      }}
    >
      {}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
          }}
        >
          <Logo />

          {}
          <div
            className="nav-desktop"
            style={{ display: "flex", alignItems: "center", gap: "36px" }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.75)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
              >
                {link.label}
              </a>
            ))}
          </div>

          {}
          <div
            className="nav-desktop"
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
          >
            {}
            <a
              href="#contato"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "white",
                padding: "8px 18px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
              }}
              onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              }}
            >
              Entrar
            </a>

            {}
            <a
              href="#contato"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "white",
                padding: "8px 20px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #1B56F0, #0A3AB4)",
                boxShadow: "0 4px 12px rgba(27,86,240,0.35)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Cadastrar grátis
            </a>
          </div>

          {}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMenuOpen((prev: boolean) => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            style={{
              background: "none",
              border: "none",
              color: "white",
              padding: "8px",
              display: "none", 
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {}
      {menuOpen && (
        <div
          className="nav-mobile-drawer"
          style={{
            background: "rgba(10, 22, 40, 0.98)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "16px 24px 24px",
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={handleLinkClick}
              style={{
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.8)",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {link.label}
            </a>
          ))}

          <a
            href="#contato"
            onClick={handleLinkClick}
            style={{
              display: "block",
              marginTop: "20px",
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "white",
              padding: "12px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1B56F0, #0A3AB4)",
            }}
          >
            Cadastrar grátis
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
        @media (min-width: 901px) {
          .nav-mobile-toggle { display: none !important; }
          .nav-mobile-drawer { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

