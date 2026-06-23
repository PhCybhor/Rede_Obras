import React, { useState, useEffect, useRef } from 'react';
import { ToolsIcon, SearchIcon, BoxIcon, FileIcon } from '../components/Icons';
import { api } from '../services/api';
import logo from '../assets/logo.png';

export default function LandingPage({ onNavigate }) {
  // Toast notifications state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Pre-registration form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'contratante',
    interest: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameRef = useRef(null);

  const handleBlockedClick = (roleName) => {
    setToastMessage(`${roleName}`);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Form Validation & Formatting logic
  const validate = (values) => {
    const e = {};
    if (!values.name || values.name.trim().length < 2) e.name = 'Informe seu nome (mín. 2 caracteres)';
    
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email || !emailRe.test(values.email)) e.email = 'E-mail inválido';
    
    if (values.role && !['contratante', 'prestador'].includes(values.role)) e.role = 'Selecione um papel válido';
    
    const phoneRe = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (values.phone && !phoneRe.test(values.phone)) {
        e.phone = 'Telefone inválido (ex: (xx) xxxxx-xxxx)';
    }
    return e;
  };

  const formatPhoneValue = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (e) => {
    const value = e.target.name === 'phone' ? formatPhoneValue(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const validation = validate(form);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'info', message: 'Enviando pré-cadastro...' });

    try {
      await api.preSignup(form);
      setStatus({ type: 'success', message: 'Pré-cadastro enviado com sucesso! Garantimos seu lugar na fila.' });
      setForm({ name: '', email: '', phone: '', role: 'contratante', interest: '' });
      setErrors({});
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Erro ao enviar pré-cadastro' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', position: 'relative' }}>
      {/* Toast Notification Container */}
      {showToast && (
        <div className="toast-container">
          <div className="toast">
            <span style={{ fontSize: '1.2rem' }}>🔒</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--accent)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>Acesso Restrito</span>
              <span>{toastMessage} <strong style={{ color: 'var(--accent)' }}>(em breve)</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="landing-navbar glass-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logo} alt="REDEOBRAS" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
        </div>
        <button 
          onClick={() => onNavigate('login', { initialTab: 'login' })}
          className="btn btn-outline-primary"
        >
          Entrar no Sistema
        </button>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="hero-grid">
          {/* Hero Copy (Left Column) */}
          <div className="hero-copy">
            <span className="hero-tag">A evolução digital da construção civil</span>
            <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 3.5vw, 3.5rem)', margin: '12px 0 20px', lineHeight: '1.15' }}>
              Conectando quem <span style={{ color: 'var(--primary)', textShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}>constrói</span> com quem precisa de <span style={{ color: 'var(--accent)', textShadow: '0 0 15px rgba(249, 115, 22, 0.3)' }}>obras</span>.
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
              Encontre os melhores profissionais de forma inteligente, gerencie materiais de construção e assine contratos digitais seguros em um único lugar.
            </p>

            {/* List of site features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)' }}>🧠</div>
                <span style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-primary)' }}><strong>Match Inteligente:</strong> Inteligência Artificial localizando profissionais ideais.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--accent)' }}>📦</div>
                <span style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-primary)' }}><strong>Gestão de Materiais:</strong> Solicite e aprove insumos direto pelo painel.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>✍️</div>
                <span style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-primary)' }}><strong>Contratos Seguros:</strong> Formalize propostas com segurança jurídica.</span>
              </div>
            </div>

            {/* System login locked buttons */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '28px' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.5px' }}>Acesso ao Sistema (Em homologação)</span>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => handleBlockedClick('Sou Contratante')}
                  className="btn btn-blocked"
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  <span>🔒</span> Sou Contratante
                </button>
                <button 
                  onClick={() => handleBlockedClick('Quero Trabalhar')}
                  className="btn btn-blocked"
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  <span>🔒</span> Quero Trabalhar
                </button>
              </div>
            </div>
          </div>

          {/* Hero Form Card (Right Column) */}
          <div className="hero-form">
            <div className="pre-signup-card glass-card" style={{ padding: '36px', boxShadow: 'var(--shadow-xl)' }}>
              <div className="pre-signup-header" style={{ marginBottom: '24px', textLeft: 'left' }}>
                <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--primary)', marginBottom: '10px', fontSize: '0.75rem' }}>Lista de Espera Ativa</span>
                <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--text-primary)' }}>Acesso Prioritário</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Cadastre seus dados para receber o convite exclusivo no lançamento oficial.</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Name */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <span className="input-label">Nome Completo</span>
                    <input
                      ref={nameRef}
                      className={`form-control ${errors.name ? 'error' : ''}`}
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex: Carlos Silva"
                      required
                    />
                    {errors.name && <span className="error-text" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{errors.name}</span>}
                  </div>

                  {/* Email & Phone grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <span className="input-label">Endereço de E-mail</span>
                      <input
                        className={`form-control ${errors.email ? 'error' : ''}`}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Ex: carlos@email.com"
                        required
                      />
                      {errors.email && <span className="error-text" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{errors.email}</span>}
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <span className="input-label">Celular / WhatsApp</span>
                      <input
                        className={`form-control ${errors.phone ? 'error' : ''}`}
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="(xx) xxxxx-xxxx"
                        maxLength="15"
                      />
                      {errors.phone && <span className="error-text" style={{ fontSize: '0.8rem', marginTop: '4px' }}>{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <span className="input-label">Perfil de Cadastro</span>
                    <select
                      name="role"
                      className="form-control"
                      value={form.role}
                      onChange={handleChange}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="contratante">Contratante (Quero realizar obras)</option>
                      <option value="prestador">Prestador de Serviço (Quero trabalhar)</option>
                    </select>
                  </div>

                  {/* Optional Interest Textarea */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <span className="input-label">O que você mais deseja desse site? <span style={{ color: 'var(--text-light)', fontWeight: 'normal' }}>(Opcional)</span></span>
                    <textarea
                      className="form-control"
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Ex: Encontrar pedreiros qualificados, acompanhar orçamentos..."
                      style={{ minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`btn ${form.role === 'prestador' ? 'btn-accent' : 'btn-primary'}`}
                    disabled={isSubmitting}
                    style={{ width: '100%', marginTop: '10px', padding: '14px', fontSize: '1rem', fontWeight: 800, borderRadius: 'var(--radius-md)', boxShadow: form.role === 'prestador' ? 'var(--shadow-glow-accent)' : 'var(--shadow-glow)' }}
                  >
                    {isSubmitting ? 'Enviando...' : 'Garantir Acesso Prioritário'}
                  </button>
                </div>

                {status && (
                  <p
                    className={`status-message ${status.type === 'success' ? 'status-success' : status.type === 'error' ? 'status-error' : ''}`}
                    role="status"
                    aria-live="polite"
                    style={{ marginTop: '16px', textAlign: 'center', fontWeight: 600, padding: '10px', borderRadius: 'var(--radius-sm)', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: status.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.85rem' }}
                  >
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, marginBottom: '50px' }}>
          O que faz a <span style={{ color: 'var(--primary)' }}>REDE</span><span style={{ color: 'var(--accent)' }}>OBRAS</span> única?
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          
          <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '65px', height: '65px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '20px', border: '1px solid rgba(59, 130, 246, 0.25)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)' }}>
              <SearchIcon size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px' }}>IA de Match Perfeito</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Escreva em linguagem natural o que você precisa ("preciso consertar vazamento no banheiro") e nossa IA fará a análise mapeando os profissionais ideias disponíveis na hora.
            </p>
          </div>

          <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '65px', height: '65px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '20px', border: '1px solid rgba(249, 115, 22, 0.25)', boxShadow: '0 0 15px rgba(249, 115, 22, 0.1)' }}>
              <BoxIcon size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px' }}>Solicitação de Materiais</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              O prestador solicita os materiais necessários direto pelo painel de serviço. O contratante revisa a quantidade, valores sugeridos e aprova ou recusa com um clique.
            </p>
          </div>

          <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '65px', height: '65px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.25)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.1)' }}>
              <FileIcon size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '12px' }}>Contratos & Propostas</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Caso não encontre profissionais livres de imediato, publique uma proposta. Prestadores qualificados fazem orçamentos e você aceita o que melhor cabe no seu bolso.
            </p>
          </div>

        </div>
      </section>

      {/* Project Status Section */}
      <section style={{ padding: '40px 40px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', padding: '40px', background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <span className="hero-tag" style={{ border: 'none', background: 'rgba(249, 115, 22, 0.1)', color: 'var(--accent)', marginBottom: '16px' }}>Status do Projeto</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-primary)' }}>Projeto REDEOBRAS</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
              Estamos construindo a mais robusta plataforma de conectividade para o setor de construção civil. 
              Ao realizar o pré-cadastro, você garante prioridade absoluta e benefícios especiais no lançamento oficial da plataforma.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
            <span style={{ display: 'inline-block', width: 'fit-content', padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase' }}>Lançamento em breve</span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>Conexão rápida entre obra e serviço</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Nosso Match inteligente com IA, painel de solicitação de materiais e o gerador de contratos digitais seguros estão em fase de homologação final.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '40px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem', background: 'rgba(0, 0, 0, 0.2)' }}>
        <p>© 2026 REDEOBRAS. Todos os direitos reservados. Projeto inovador de Conectividade na Construção.</p>
      </footer>
    </div>
  );
}
