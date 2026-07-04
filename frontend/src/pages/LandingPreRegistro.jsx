import React, { useState, useEffect, useRef } from 'react';
import { OFFERINGS, FAQ_PREREGISTRO, OFICIAL_URL } from '../data/landingContent';
import { preCadastroApi } from '../services/preCadastroApi';
import logo from '../assets/logo.png';

const ChevronDown = () => (
  <svg className="faq-chevron" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default function LandingPreRegistro() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'contratante',
    interest: '',
    website: '',
    consentimento_lgpd: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupVisible, setSignupVisible] = useState(false);
  const [platformHighlight, setPlatformHighlight] = useState(false);
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [isJourneyScrolling, setIsJourneyScrolling] = useState(false);

  const formRef = useRef(null);
  const signupSectionRef = useRef(null);
  const scrollAnimRef = useRef(null);
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    revealRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = signupSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSignupVisible(true); },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
    document.body.classList.remove('journey-scrolling');
  }, []);

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const easeInOutQuart = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

  const slowScrollTo = (targetY, duration, { onProgress, onComplete } = {}) => {
    if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();
    setIsJourneyScrolling(true);
    setJourneyProgress(0);
    document.body.classList.add('journey-scrolling');

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuart(progress);
      window.scrollTo(0, startY + distance * eased);
      setJourneyProgress(progress);
      onProgress?.(progress);
      if (progress < 1) {
        scrollAnimRef.current = requestAnimationFrame(step);
      } else {
        scrollAnimRef.current = null;
        setIsJourneyScrolling(false);
        setJourneyProgress(0);
        document.body.classList.remove('journey-scrolling');
        onComplete?.();
      }
    };
    scrollAnimRef.current = requestAnimationFrame(step);
  };

  const getCadastroScrollY = () => {
    const el = signupSectionRef.current || document.getElementById('pre-registro');
    if (!el) return window.scrollY;
    return window.scrollY + el.getBoundingClientRect().top - 72;
  };

  const startJourneyToCadastro = (maxDuration = 7500, role = null) => {
    setMenuOpen(false);
    if (isJourneyScrolling) return;
    if (role) setForm((prev) => ({ ...prev, role }));
    setSignupVisible(false);

    const isMobile = window.innerWidth <= 768;
    const targetY = getCadastroScrollY();
    const distance = Math.abs(targetY - window.scrollY);
    const cappedMax = isMobile ? Math.min(maxDuration, 4200) : maxDuration;
    const minDuration = isMobile ? 2600 : 4500;
    const perPixel = isMobile ? 1.4 : 2.8;
    const duration = Math.min(cappedMax, Math.max(minDuration, distance * perPixel));
    const platformEl = document.getElementById('plataforma');

    slowScrollTo(targetY, duration, {
      onProgress: (progress) => {
        if (progress > 0.12 && platformEl) platformEl.classList.add('visible');
        setPlatformHighlight(progress > 0.2 && progress < 0.75);
        if (progress > 0.88) setSignupVisible(true);
      },
      onComplete: () => {
        if (platformEl) platformEl.classList.add('visible');
        setSignupVisible(true);
        setPlatformHighlight(false);
      },
    });
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    if (targetId === 'pre-registro') {
      startJourneyToCadastro(7000);
      return;
    }
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPlatform = () => startJourneyToCadastro(7500);
  const scrollToForm = (role = null) => startJourneyToCadastro(6000, role);

  const validate = (values) => {
    const e = {};
    if (!values.name || values.name.trim().length < 2) e.name = 'Informe seu nome (mín. 2 caracteres)';
    if (values.name && values.name.length > 120) e.name = 'Nome muito longo';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email || !emailRe.test(values.email)) e.email = 'E-mail inválido';
    if (values.role && !['contratante', 'prestador'].includes(values.role)) e.role = 'Selecione um perfil válido';
    const phoneRe = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (values.phone && !phoneRe.test(values.phone)) e.phone = 'Telefone inválido (ex: (xx) xxxxx-xxxx)';
    if (!values.consentimento_lgpd) e.consentimento_lgpd = 'Você precisa aceitar a Política de Privacidade';
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
    const { name, type, checked, value } = e.target;
    const nextValue = name === 'phone'
      ? formatPhoneValue(value)
      : type === 'checkbox'
        ? checked
        : value;
    setForm({ ...form, [name]: nextValue });
    if (errors[name]) setErrors({ ...errors, [name]: null });
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
      await preCadastroApi.submit(form);
      setStatus({ type: 'success', message: 'Pré-cadastro enviado com sucesso! Você garantiu seu lugar na fila.' });
      setForm({ name: '', email: '', phone: '', role: form.role, interest: '', website: '', consentimento_lgpd: false });
      setErrors({});
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Erro ao enviar pré-cadastro' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = FAQ_PREREGISTRO;
  const offerings = OFFERINGS;

  const renderSignupForm = () => (
    <div className="hero-form-card signup-form-card">
      <div className="form-header">
        <span className="badge">✨ Lista de Espera Ativa</span>
        <h2>Acesso Prioritário</h2>
        <p>Cadastre-se para receber o convite exclusivo no lançamento oficial.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot anti-bot — oculto para usuários reais */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input type="text" id="website" name="website" value={form.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
        </div>

        <div className="form-fields">
          <div className="input-group">
            <span className="input-label">Nome Completo</span>
            <input className={`form-control ${errors.name ? 'error' : ''}`} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ex: Carlos Silva" required maxLength={120} />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="input-group">
            <span className="input-label">Endereço de E-mail</span>
            <input className={`form-control ${errors.email ? 'error' : ''}`} type="email" name="email" value={form.email} onChange={handleChange} placeholder="Ex: carlos@email.com" required maxLength={254} />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <span className="input-label">Celular / WhatsApp</span>
            <input className={`form-control ${errors.phone ? 'error' : ''}`} type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="(xx) xxxxx-xxxx" maxLength="15" />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="input-group">
            <span className="input-label">Perfil de Cadastro</span>
            <div className="role-picker" role="radiogroup" aria-label="Perfil de Cadastro">
              <label className={`role-option ${form.role === 'contratante' ? 'active' : ''}`}>
                <input type="radio" name="role" value="contratante" checked={form.role === 'contratante'} onChange={handleChange} />
                <span className="role-option-icon" aria-hidden="true">🏗️</span>
                <span className="role-option-body"><strong>Contratante</strong><small>Quero realizar obras</small></span>
                <span className="role-option-check" aria-hidden="true">✓</span>
              </label>
              <label className={`role-option ${form.role === 'prestador' ? 'active' : ''}`}>
                <input type="radio" name="role" value="prestador" checked={form.role === 'prestador'} onChange={handleChange} />
                <span className="role-option-icon" aria-hidden="true">🔧</span>
                <span className="role-option-body"><strong>Prestador</strong><small>Quero trabalhar</small></span>
                <span className="role-option-check" aria-hidden="true">✓</span>
              </label>
            </div>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          <div className="input-group">
            <span className="input-label">O que você mais deseja? <span style={{ color: 'var(--text-light)', fontWeight: 'normal' }}>(Opcional)</span></span>
            <textarea className="form-control" name="interest" value={form.interest} onChange={handleChange} rows="3" placeholder="Ex: Encontrar pedreiros qualificados na minha região..." style={{ minHeight: '72px', resize: 'vertical' }} maxLength={500} />
          </div>

          <label className={`lgpd-consent ${errors.consentimento_lgpd ? 'error' : ''}`}>
            <input type="checkbox" name="consentimento_lgpd" checked={form.consentimento_lgpd} onChange={handleChange} />
            <span>
              Li e concordo com a coleta dos meus dados para contato sobre o lançamento, conforme a{' '}
              <a href="#privacidade" onClick={(e) => e.preventDefault()}>Política de Privacidade</a>.
            </span>
          </label>
          {errors.consentimento_lgpd && <span className="error-text">{errors.consentimento_lgpd}</span>}

          <button type="submit" className="btn-cta-shimmer" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : '🚀 Garantir Acesso Prioritário'}
          </button>
        </div>

        {status && (
          <p role="status" aria-live="polite" style={{ marginTop: '16px', textAlign: 'center', fontWeight: 600, padding: '12px', borderRadius: 'var(--radius-sm)', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : status.type === 'info' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(239, 68, 68, 0.12)', border: status.type === 'success' ? '1px solid rgba(16, 185, 129, 0.25)' : status.type === 'info' ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)', fontSize: '0.88rem', color: status.type === 'success' ? 'var(--success)' : status.type === 'info' ? 'var(--primary-light)' : 'var(--danger)' }}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  );

  return (
    <div className="landing-page animate-fade-in landing-preregistro">
      {isJourneyScrolling && (
        <div className="journey-progress-bar" aria-hidden="true">
          <div className="journey-progress-fill" style={{ width: `${journeyProgress * 100}%` }} />
        </div>
      )}

      <nav className="landing-navbar glass-navbar">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logo} alt="REDEOBRAS" />
        </div>
        <ul className="nav-links">
          <li><button className="btn btn-explore-top" onClick={scrollToPlatform}>O que oferecemos</button></li>
          <li><a onClick={(e) => handleNavClick(e, 'faq')}>Perguntas</a></li>
          <li><a onClick={(e) => handleNavClick(e, 'pre-registro')}>Pré-Registro</a></li>
        </ul>
        <div className="nav-right">
          <button className="btn btn-outline-primary nav-login-desktop" onClick={() => scrollToForm()}>
            Fazer Pré-cadastro
          </button>
          <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="btn btn-explore-top" onClick={scrollToPlatform}>O que oferecemos</button>
        <a onClick={(e) => handleNavClick(e, 'faq')}>Perguntas Frequentes</a>
        <a onClick={(e) => handleNavClick(e, 'pre-registro')}>Pré-Registro</a>
        <button className="btn btn-outline-primary" style={{ marginTop: '12px' }} onClick={() => scrollToForm()}>
          Fazer Pré-cadastro
        </button>
      </div>

      <header className="landing-hero">
        <div className="hero-centered">
          <span className="hero-tag">🚀 Plataforma em Pré-Lançamento</span>
          <h1 className="hero-title">
            Conectando quem <span className="highlight-primary">constrói</span> com quem precisa de <span className="highlight-accent">obras</span>.
          </h1>
          <p className="hero-subtitle">
            Encontre profissionais com IA, gerencie materiais e formalize contratos digitais seguros — tudo em um único lugar.
          </p>

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

          <div className="hero-cta-group">
            <button
              className="btn-explore-platform"
              onClick={scrollToPlatform}
              disabled={isJourneyScrolling}
            >
              <span className="btn-explore-icon">✨</span>
              {isJourneyScrolling ? 'Descendo...' : 'Descubra tudo que oferecemos'}
              <span className="btn-explore-arrow">↓</span>
            </button>
            <button
              className="btn btn-outline-primary hero-secondary-btn"
              onClick={() => scrollToForm()}
              disabled={isJourneyScrolling}
            >
              Ir direto ao cadastro
            </button>
          </div>

          <div className="hero-cta-group" style={{ marginTop: '12px' }}>
            <button className="btn btn-primary hero-role-btn" onClick={() => scrollToForm('contratante')} disabled={isJourneyScrolling}>
              Sou Contratante
            </button>
            <button className="btn btn-outline-primary hero-role-btn" onClick={() => scrollToForm('prestador')} disabled={isJourneyScrolling}>
              Quero Trabalhar
            </button>
          </div>

          <button className="scroll-hint" onClick={scrollToPlatform} aria-label="Rolar para ver funcionalidades">
            <span>Explore a plataforma</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </button>
        </div>
      </header>

      <section id="plataforma" className={`platform-showcase reveal-section ${platformHighlight ? 'platform-highlight' : ''}`} ref={addRevealRef}>
        <div className="stats-grid platform-stats">
          <div className="stat-card">
            <div className="stat-number primary">500+</div>
            <div className="stat-label">Pré-cadastros realizados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number accent">6</div>
            <div className="stat-label">Recursos integrados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number success">100%</div>
            <div className="stat-label">Contratos com segurança jurídica</div>
          </div>
        </div>

        <div className="section-header" id="features">
          <span className="section-tag">Tudo em um só lugar</span>
          <h2 className="section-title">
            O que a <span style={{ color: 'var(--primary-light)' }}>REDE</span><span style={{ color: 'var(--accent)' }}>OBRAS</span> proporciona
          </h2>
          <p className="section-subtitle">
            Tecnologia de ponta aplicada à construção civil. Uma plataforma completa para conectar, contratar e gerenciar obras com segurança.
          </p>
        </div>
        <div className="offerings-grid">
          {offerings.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="offering-card feature-card" style={{ '--card-accent': item.accent, '--stagger': i }}>
                <div className="feature-icon" style={item.iconStyle}><Icon size={30} /></div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="platform-connector">
          <div className="connector-line" /><span className="connector-label">Pronto para garantir seu lugar?</span><div className="connector-line" />
        </div>
      </section>

      <section id="pre-registro" ref={signupSectionRef} className={`signup-section ${signupVisible ? 'signup-visible' : ''}`}>
        <div className="signup-section-inner" ref={formRef}>
          <div className="signup-copy">
            <span className="section-tag">Pré-cadastro</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Garanta seu <span style={{ color: 'var(--accent)' }}>acesso prioritário</span></h2>
            <p className="signup-lead">
              Cadastre-se agora e seja um dos primeiros a usar a plataforma quando ela for lançada oficialmente.
            </p>
            <ul className="signup-perks">
              <li>✓ Acesso antecipado à plataforma</li>
              <li>✓ Benefícios exclusivos de lançamento</li>
              <li>✓ Notificação por e-mail no dia do lançamento</li>
            </ul>
          </div>
          {renderSignupForm()}
        </div>
      </section>

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
                <span>{faq.q}</span><ChevronDown />
              </button>
              <div className="faq-answer"><p>{faq.a}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section reveal-section" ref={addRevealRef}>
        <div className="cta-content">
          <h2>Não fique de fora da <span style={{ color: 'var(--accent)' }}>revolução</span> da construção civil</h2>
          <p>Garanta seu acesso prioritário agora e seja um dos primeiros a usar a plataforma mais inovadora do setor.</p>
          <button className="btn-cta-shimmer" onClick={() => scrollToForm()}>↑ Quero Garantir Meu Acesso</button>
        </div>
      </section>

      <footer className="landing-footer" id="privacidade">
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
              <li onClick={scrollToPlatform}>O que oferecemos</li>
              <li onClick={(e) => handleNavClick(e, 'faq')}>Perguntas Frequentes</li>
              <li onClick={(e) => handleNavClick(e, 'pre-registro')}>Pré-Registro</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li>contato@redeobras.com.br</li>
              <li>Brasil</li>
            </ul>
          </div>
          {OFICIAL_URL && (
            <div className="footer-col">
              <h4>Plataforma</h4>
              <ul>
                <li><a href={OFICIAL_URL} target="_blank" rel="noopener noreferrer">Site oficial</a></li>
              </ul>
            </div>
          )}
        </div>
        <div className="footer-bottom">
          <p>© 2026 REDEOBRAS. Todos os direitos reservados. Seus dados são tratados conforme a LGPD.</p>
        </div>
      </footer>
    </div>
  );
}
