

import { useState, type ChangeEvent, type FocusEvent, type MouseEvent } from "react";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { CTA_FORM_FIELDS, CTA_PERKS, IMAGES } from "../../constantes/constantes";

interface LeadFormState {
  nome: string;
  email: string;
  cnpj: string;
  telefone: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  cnpj?: string;
  telefone?: string;
}

const INITIAL_FORM_STATE: LeadFormState = { nome: "", email: "", cnpj: "", telefone: "" };

const FIELD_KEYS: Record<string, keyof LeadFormState> = {
  "Nome completo": "nome",
  "E-mail corporativo": "email",
  "CNPJ da empresa": "cnpj",
  "Telefone (WhatsApp)": "telefone",
};

function validarFormulario(data: LeadFormState): FormErrors {
  const erros: FormErrors = {};

  if (!data.nome || data.nome.trim().length < 3) {
    erros.nome = "Nome deve ter pelo menos 3 caracteres.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    erros.email = "Informe um e-mail válido.";
  }

  const cnpjLimpo = data.cnpj.replace(/\D/g, "");
  if (!cnpjLimpo || cnpjLimpo.length !== 14) {
    erros.cnpj = "CNPJ deve ter 14 dígitos (ex: 00.000.000/0001-00).";
  }

  const telLimpo = data.telefone.replace(/\D/g, "");
  if (!telLimpo || telLimpo.length < 10 || telLimpo.length > 11) {
    erros.telefone = "Informe um telefone válido com DDD.";
  }

  return erros;
}

function LeadForm() {
  const [formData, setFormData] = useState<LeadFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof LeadFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const errosValidacao = validarFormulario(formData);
    if (Object.keys(errosValidacao).length > 0) {
      setErrors(errosValidacao);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {

        let msg = "Falha ao enviar cadastro. Tente novamente.";
        try {
          const body = await response.json();
          if (typeof body?.message === "string") msg = body.message;
        } catch {

        }
        throw new Error(msg);
      }

      setSubmitted(true);
    } catch (err) {

      setSubmitError(
        err instanceof Error ? err.message : "Erro inesperado. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div role="alert" aria-live="polite" style={{ textAlign: "center", padding: "32px 0" }}>
        <CheckCircle size={48} aria-hidden="true" style={{ color: "#22C55E", marginBottom: "16px" }} />
        <h3
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            color: "white",
            marginBottom: "8px",
          }}
        >
          Cadastro realizado!
        </h3>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
          Entraremos em contato em até 24 horas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "20px",
          fontWeight: 700,
          color: "white",
          marginBottom: "24px",
        }}
      >
        Crie sua conta grátis
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {CTA_FORM_FIELDS.map((field) => {
          const key = FIELD_KEYS[field.label];
          const erro = errors[key];
          return (
            <div key={field.label}>
              <label
                htmlFor={`field-${key}`}
                style={{
                  display: "block",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {field.label}
              </label>
              <input
                id={`field-${key}`}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[key]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value)}
                required
                aria-invalid={!!erro}
                aria-describedby={erro ? `erro-${key}` : undefined}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.06)",
                  border: `1px solid ${erro ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: "10px",
                  padding: "12px 14px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "white",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e: FocusEvent<HTMLInputElement>) =>
                  (e.currentTarget.style.borderColor = erro ? "rgba(239,68,68,0.8)" : "rgba(27,86,240,0.6)")
                }
                onBlur={(e: FocusEvent<HTMLInputElement>) =>
                  (e.currentTarget.style.borderColor = erro ? "rgba(239,68,68,0.6)" : "rgba(255,255,255,0.12)")
                }
              />
              {erro && (
                <p
                  id={`erro-${key}`}
                  role="alert"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "4px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    color: "#EF4444",
                  }}
                >
                  <AlertCircle size={12} aria-hidden="true" />
                  {erro}
                </p>
              )}
            </div>
          );
        })}

        {submitError && (
          <p
            role="alert"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 14px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "#EF4444",
            }}
          >
            <AlertCircle size={14} aria-hidden="true" />
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            color: "white",
            background: loading ? "rgba(27,86,240,0.5)" : "linear-gradient(135deg, #1B56F0, #0A3AB4)",
            border: "none",
            borderRadius: "10px",
            padding: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "4px",
            boxShadow: "0 8px 24px rgba(27,86,240,0.4)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
            if (!loading) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,86,240,0.5)";
            }
          }}
          onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(27,86,240,0.4)";
          }}
        >
          {loading ? "Enviando..." : "Começar agora — é grátis"}
          {!loading && <ArrowRight size={16} aria-hidden="true" />}
        </button>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: "rgba(255,255,255,0.35)",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Ao criar sua conta, você concorda com nossos{" "}
          <a href="/termos-de-uso" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "underline" }}>
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="/politica-de-privacidade" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "underline" }}>
            Política de Privacidade
          </a>
          .
        </p>
      </div>
    </form>
  );
}

export function SecaoChamadaAcao() {
  return (
    <section id="contato" aria-labelledby="cta-heading" style={{ padding: "80px 24px", background: "#F8FAFF" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="cta-inner"
          style={{
            background: "linear-gradient(135deg, #0A1628 0%, #0F2347 60%, #1B3A6E 100%)",
            borderRadius: "24px",
            padding: "clamp(40px, 6vw, 72px)",
            position: "relative",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: "48px",
            alignItems: "center",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${IMAGES.blueprint})`,
              backgroundSize: "cover",
              backgroundPosition: "center right",
              opacity: 0.06,
              borderRadius: "24px",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-80px",
              right: "300px",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(27,86,240,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-60px",
              left: "200px",
              width: "250px",
              height: "250px",
              background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "inline-block",
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: "100px",
                padding: "6px 16px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#F59E0B",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Oferta limitada — 30 dias grátis
              </span>
            </div>

            <h2
              id="cta-heading"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.1,
                letterSpacing: "-1px",
                marginBottom: "20px",
              }}
            >
              Pronto para acelerar seus resultados na construção civil?
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.7,
                marginBottom: "28px",
              }}
            >
              Junte-se a mais de 12.000 empresas que já estão transformando seus negócios com a RedesObras.
              Comece gratuitamente hoje.
            </p>

            <ul aria-label="Benefícios do período gratuito" style={{ listStyle: "none" }}>
              {CTA_PERKS.map((perk) => (
                <li key={perk} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <CheckCircle size={16} aria-hidden="true" style={{ color: "#22C55E", flexShrink: 0 }} />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.7)",
                      fontWeight: 500,
                    }}
                  >
                    {perk}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="cta-form-card"
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
            }}
          >
            <LeadForm />
          </div>
        </div>
      </div>

      <style>{`
        .cta-form-card {
          padding: 32px;
        }
        @media (max-width: 860px) {
          .cta-inner { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cta-inner {
            padding: 32px 16px !important;
            gap: 32px !important;
          }
          .cta-form-card {
            padding: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
