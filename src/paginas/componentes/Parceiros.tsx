

import type { MouseEvent } from "react";
import { PARTNERS } from "../../constantes/constantes";

export function Partners() {
  return (
    <section
      aria-label="Empresas parceiras"
      style={{
        background: "white",
        padding: "48px 24px",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "#9CA3AF",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "32px",
          }}
        >
          Empresas que confiam na RedesObras
        </p>

        {}
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "40px",
          }}
        >
          {PARTNERS.map((partner) => (
            <li
              key={partner.name}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#C0C6D4",
                letterSpacing: "-0.2px",
                transition: "color 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e: MouseEvent<HTMLDivElement>) => (e.currentTarget.style.color = "#0A1628")}
              onMouseLeave={(e: MouseEvent<HTMLDivElement>) => (e.currentTarget.style.color = "#C0C6D4")}
            >
              {partner.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
