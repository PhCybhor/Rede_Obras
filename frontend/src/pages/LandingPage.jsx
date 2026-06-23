import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, BoxIcon, FileIcon } from '../components/Icons';
import { api } from '../services/api';
import logo from '../assets/logo.png';

// Chevron SVG for FAQ
const ChevronDown = () => (
  <svg className="faq-chevron" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default function LandingPage({ onNavigate }) {
  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  // FAQ
  const [openFaq, setOpenFaq] = useState(null);

  // Pre-registration form
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
  const formRef = useRef(null);

  // Scroll reveal
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  // Toast handler
  const handleBlockedClick = (roleName) => {
    setToastMessage(`${roleName}`);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Close mobile menu on anchor click
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to form
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Form logic
  const validate = (values) => {
    const e = {};
    if (!values.name || values.name.trim().length < 2) e.name = 'Informe seu nome (mín. 2 caracteres)';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email || !emailRe.test(values.email)) e.email = 'E-mail inválido';
    if (values.role && !['contratante', 'prestador'].includes(values.role)) e.role = 'Selecione um papel válido';
    const phoneRe = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (values.phone && !phoneRe.test(values.phone)) e.phone = 'Telefone inválido (ex: (xx) xxxxx-xxxx)';
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
      setStatus({ type: 'success', message: '✅ Pré-cadastro enviado com sucesso! Você garantiu seu lugar na fila.' });
      setForm({ name: '', email: '', phone: '', role: 'contratante', interest: '' });
      setErrors({});
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Erro ao enviar pré-cadastro' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQ data
  const faqs = [
    {
      q: 'O que é a REDEOBRAS?',
      a: 'A REDEOBRAS é uma plataforma digital que conecta contratantes (pessoas que precisam de serviços de construção) com prestadores de serviço qualificados, utilizando inteligência artificial para garantir o melhor match entre profissional e demanda.'
    },
    {
      q: 'Como funciona o Match com IA?',
      a: 'Você descreve em linguagem natural o que precisa (ex: "preciso consertar um vazamento no banheiro") e nossa inteligência artificial analisa sua demanda, mapeando automaticamente os profissionais mais qualificados e disponíveis na sua região.'
    },
    {
      q: 'O pré-cadastro é gratuito?',
      a: 'Sim! O pré-cadastro é 100% gratuito e sem compromisso. Ao se cadastrar, você garante acesso prioritário e benefícios exclusivos quando a plataforma for lançada oficialmente.'
    },
    {
      q: 'Quando a plataforma será lançada?',
      a: 'Estamos em fase final de homologação. O lançamento oficial está previsto para breve. Ao realizar o pré-cadastro, você será notificado por e-mail assim que a plataforma estiver disponível.'
    },
    {
      q: 'Os contratos digitais têm validade jurídica?',
      a: 'Sim. Todos os contratos gerados pela plataforma seguem as normas da legislação brasileira para contratos digitais, garantindo segurança jurídica para ambas as partes envolvidas.'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', position: 'relative' }}>
      {/* Toast */}
      {showToast && (
        <div className="toast-container">
          <div className="toast">
            <span style={{ fontSize: '1.2rem' }}>🔒</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'var(--accent)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Acesso Restrito</span>
              <span>{toastMessage} <strong style={{ color: 'var(--accent)' }}>(em breve)</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ===== NAVBAR ===== */}
      <nav className="landing-navbar glass-navbar">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logo} alt="REDEOBRAS" />
        </div>

        <ul className="nav-links">
          <li><a onClick={(e) => handleNavClick(e, 'features')}>Funcionalidades</a></li>
          <li><a onClick={(e) => handleNavClick(e, 'faq')}>Perguntas</a></li>
          <li><a onClick={(e) => handleNavClick(e, 'pre-registro')}>Pré-Registro</a></li>
        </ul>

        <div className="nav-right">
          <button
            onClick={() => onNavigate('login', { initialTab: 'login' })}
            className="btn btn-outline-primary"
            style={{ fontSize: '0.88rem', padding: '9px 20px' }}
          >
            Entrar no Sistema
          </button>
          <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a onClick={(e) => handleNavClick(e, 'features')}>Funcionalidades</a>
        <a onClick={(e) => handleNavClick(e, 'faq')}>Perguntas Frequentes</a>
        <a onClick={(e) => handleNavClick(e, 'pre-registro')}>Pré-Registro</a>
        <button
          onClick={() => { setMenuOpen(false); onNavigate('login', { initialTab: 'login' }); }}
          className="btn btn-outline-primary"
          style={{ marginTop: '12px' }}
        >
          Entrar no Sistema
        </button>
      </div>

      {/* ===== HERO ===== */}
      <header className="landing-hero">
        <div className="hero-grid">
          {/* Left Column */}
          <div className="hero-copy">
            <span className="hero-tag">🚀 Plataforma em Pré-Lançamento</span>

            <h1 className="hero-title">
              Conectando quem{' '}
              <span className="highlight-primary">constrói</span>{' '}
              com quem precisa de{' '}
              <span className="highlight-accent">obras</span>.
            </h1>

            <p className="hero-subtitle">
              Encontre profissionais com IA, gerencie materiais e formalize contratos digitais seguros — tudo em um único lugar.
            </p>

            {/* Feature badges */}
            <div className="hero-features">
              <div className="feature-badge">
                <div className="badge-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--primary-light)' }}>🧠</div>
                <span>Match com IA</span>
              </div>
              <div className="feature-badge">
                <div className="badge-icon" style={{ background: 'rgba(249, 115, 22, 0.12)', color: 'var(--accent)' }}>📦</div>
                <span>Gestão de Materiais</span>
              </div>
              <div className="feature-badge">
                <div className="badge-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)' }}>✍️</div>
                <span>Contratos Seguros</span>
              </div>
            </div>

            {/* Locked Buttons */}
            <div className="locked-section">
              <span className="locked-label">Acesso ao sistema (em homologação)</span>
              <div className="locked-buttons">
                <button onClick={() => handleBlockedClick('Sou Contratante')} className="btn btn-blocked">
                  <span>🔒</span> Sou Contratante
                </button>
                <button onClick={() => handleBlockedClick('Quero Trabalhar')} className="btn btn-blocked">
                  <span>🔒</span> Quero Trabalhar
                </button>
              </div>
            </div>
          </div>

          {/* Right Column — Form */}
          <div className="hero-form-wrapper" ref={formRef} id="pre-registro">
            <div className="hero-form-card">
              <div className="form-header">
                <span className="badge">✨ Lista de Espera Ativa</span>
                <h2>Acesso Prioritário</h2>
                <p>Cadastre-se para receber o convite exclusivo no lançamento oficial.</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-fields">
                  {/* Name */}
                  <div className="input-group">
                    <span className="input-label">Nome Completo</span>
                    <input
                      className={`form-control ${errors.name ? 'error' : ''}`}
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex: Carlos Silva"
                      required
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div className="input-group">
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
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="input-group">
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
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  {/* Role */}
                  <div className="input-group">
                    <span className="input-label">Perfil de Cadastro</span>
                    <select
                      name="role"
                      className="form-control"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value="contratante">Contratante (Quero realizar obras)</option>
                      <option value="prestador">Prestador de Serviço (Quero trabalhar)</option>
                    </select>
                  </div>

                  {/* Interest */}
                  <div className="input-group">
                    <span className="input-label">
                      O que você mais deseja? <span style={{ color: 'var(--text-light)', fontWeight: 'normal' }}>(Opcional)</span>
                    </span>
                    <textarea
                      className="form-control"
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Ex: Encontrar pedreiros qualificados na minha região..."
                      style={{ minHeight: '72px', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-cta-shimmer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : '🚀 Garantir Acesso Prioritário'}
                  </button>
                </div>

                {status && (
                  <p
                    role="status"
                    aria-live="polite"
                    style={{
                      marginTop: '16px',
                      textAlign: 'center',
                      fontWeight: 600,
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      background: status.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      border: status.type === 'success' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                      fontSize: '0.88rem',
                      color: status.type === 'success' ? 'var(--success)' : 'var(--danger)'
                    }}
                  >
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* ===== STATS ===== */}
      <section className="stats-section reveal-section" ref={addRevealRef}>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number primary">500+</div>
            <div className="stat-label">Pré-cadastros realizados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number accent">3</div>
            <div className="stat-label">Recursos com IA integrada</div>
          </div>
          <div className="stat-card">
            <div className="stat-number success">100%</div>
            <div className="stat-label">Contratos com segurança jurídica</div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section reveal-section" ref={addRevealRef} id="features">
        <div className="section-header">
          <span className="section-tag">Funcionalidades</span>
          <h2 className="section-title">
            O que faz a <span style={{ color: 'var(--primary-light)' }}>REDE</span><span style={{ color: 'var(--accent)' }}>OBRAS</span> única?
          </h2>
          <p className="section-subtitle">
            Tecnologia de ponta aplicada à construção civil. Três pilares que transformam a maneira de encontrar, contratar e gerenciar serviços.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card" style={{ '--card-accent': 'rgba(59, 130, 246, 0.4)' }}>
            <div className="feature-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: 'var(--primary-light)' }}>
              <SearchIcon size={30} />
            </div>
            <h3>IA de Match Perfeito</h3>
            <p>Descreva em linguagem natural o que precisa e nossa IA mapeia os profissionais ideais disponíveis na sua região em segundos.</p>
          </div>

          <div className="feature-card" style={{ '--card-accent': 'rgba(249, 115, 22, 0.4)' }}>
            <div className="feature-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)', color: 'var(--accent)' }}>
              <BoxIcon size={30} />
            </div>
            <h3>Gestão de Materiais</h3>
            <p>O prestador solicita insumos pelo painel. O contratante revisa quantidade, valores e aprova ou recusa com um clique.</p>
          </div>

          <div className="feature-card" style={{ '--card-accent': 'rgba(16, 185, 129, 0.4)' }}>
            <div className="feature-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
              <FileIcon size={30} />
            </div>
            <h3>Contratos Digitais</h3>
            <p>Formalize propostas com segurança jurídica. Publique demandas, receba orçamentos e aceite o que melhor cabe no seu bolso.</p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="faq-section reveal-section" ref={addRevealRef} id="faq">
        <div className="section-header">
          <span className="section-tag">Perguntas Frequentes</span>
          <h2 className="section-title">Tire suas dúvidas</h2>
          <p className="section-subtitle">
            As respostas para as perguntas mais comuns sobre a REDEOBRAS.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <ChevronDown />
              </button>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="cta-section reveal-section" ref={addRevealRef}>
        <div className="cta-content">
          <h2>
            Não fique de fora da <span style={{ color: 'var(--accent)' }}>revolução</span> da construção civil
          </h2>
          <p>
            Garanta seu acesso prioritário agora e seja um dos primeiros a usar a plataforma mais inovadora do setor.
          </p>
          <button className="btn-cta-shimmer" onClick={scrollToForm}>
            ↑ Quero Garantir Meu Acesso
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="REDEOBRAS" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
            <p>
              A plataforma inteligente que conecta contratantes a profissionais de construção civil.
              Conecte. Contrate. Construa.
            </p>
          </div>

          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li onClick={(e) => handleNavClick(e, 'features')}>Funcionalidades</li>
              <li onClick={(e) => handleNavClick(e, 'faq')}>Perguntas Frequentes</li>
              <li onClick={(e) => handleNavClick(e, 'pre-registro')}>Pré-Registro</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li>📧 contato@redeobras.com.br</li>
              <li>📍 Brasil</li>
              <li>🕐 Em breve: suporte 24h</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 REDEOBRAS. Todos os direitos reservados. Plataforma inovadora de conectividade na construção civil.</p>
        </div>
      </footer>
    </div>
  );
}
