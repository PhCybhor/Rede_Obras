import React, { useState, useEffect, useRef } from 'react';
import { OFFERINGS, FAQ_OFICIAL, PREREGISTRO_URL } from '../data/landingContent';
import logo from '../assets/logo.png';

const ChevronDown = () => (
  <svg className="faq-chevron" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default function LandingOficial({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
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

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToLogin = (initialTab = 'login') => {
    setMenuOpen(false);
    onNavigate('login', { initialTab });
  };

  const goToPreRegistro = () => {
    if (PREREGISTRO_URL) {
      window.open(PREREGISTRO_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    scrollTo('lista-espera');
  };

  return (
    <div className="landing-page animate-fade-in landing-oficial">
      <nav className="landing-navbar glass-navbar">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={logo} alt="REDEOBRAS" />
        </div>
        <ul className="nav-links">
          <li><button className="btn btn-explore-top" onClick={() => scrollTo('plataforma')}>O que oferecemos</button></li>
          <li><a onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>Perguntas</a></li>
          {PREREGISTRO_URL && (
            <li><a href={PREREGISTRO_URL} target="_blank" rel="noopener noreferrer">Lista de Espera</a></li>
          )}
        </ul>
        <div className="nav-right">
          <button onClick={() => goToLogin('login')} className="btn btn-outline-primary nav-login-desktop">
            Entrar no Sistema
          </button>
          <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="btn btn-explore-top" onClick={() => scrollTo('plataforma')}>O que oferecemos</button>
        <a onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>Perguntas Frequentes</a>
        {PREREGISTRO_URL && (
          <a href={PREREGISTRO_URL} target="_blank" rel="noopener noreferrer">Lista de Espera</a>
        )}
        <button onClick={() => goToLogin('login')} className="btn btn-outline-primary" style={{ marginTop: '12px' }}>
          Entrar no Sistema
        </button>
      </div>

      <header className="landing-hero">
        <div className="hero-centered">
          <span className="hero-tag">Plataforma Oficial REDEOBRAS</span>
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
            <button className="btn btn-primary hero-role-btn" onClick={() => goToLogin('register')}>
              Criar Conta
            </button>
            <button className="btn btn-outline-primary hero-role-btn" onClick={() => goToLogin('login')}>
              Entrar
            </button>
          </div>

          <button className="scroll-hint" onClick={() => scrollTo('plataforma')} aria-label="Rolar para ver funcionalidades">
            <span>Explore a plataforma</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </button>
        </div>
      </header>

      <section id="plataforma" className="platform-showcase reveal-section" ref={addRevealRef}>
        <div className="stats-grid platform-stats">
          <div className="stat-card">
            <div className="stat-number accent">6</div>
            <div className="stat-label">Recursos integrados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number primary">IA</div>
            <div className="stat-label">Match inteligente</div>
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
          {OFFERINGS.map((item, i) => {
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
      </section>

      {PREREGISTRO_URL && (
        <section id="lista-espera" className="cta-section reveal-section" ref={addRevealRef}>
          <div className="cta-content">
            <h2>A plataforma ainda não está disponível na sua região?</h2>
            <p>Entre na lista de espera e seja avisado assim que abrirmos novas vagas.</p>
            <a href={PREREGISTRO_URL} className="btn-cta-shimmer" target="_blank" rel="noopener noreferrer">
              Ir para Lista de Espera
            </a>
          </div>
        </section>
      )}

      <section className="faq-section reveal-section" ref={addRevealRef} id="faq">
        <div className="section-header">
          <span className="section-tag">Perguntas Frequentes</span>
          <h2 className="section-title">Tire suas dúvidas</h2>
        </div>
        <div className="faq-list">
          {FAQ_OFICIAL.map((faq, i) => (
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
          <h2>Pronto para <span style={{ color: 'var(--accent)' }}>começar</span>?</h2>
          <p>Crie sua conta ou entre no sistema e gerencie suas obras com a REDEOBRAS.</p>
          <div className="hero-cta-group" style={{ justifyContent: 'center' }}>
            <button className="btn-cta-shimmer" onClick={() => goToLogin('register')}>Criar Conta Grátis</button>
            <button className="btn btn-outline-primary hero-role-btn" onClick={() => goToLogin('login')}>Já tenho conta</button>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="REDEOBRAS" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
            <p>A plataforma inteligente que conecta contratantes a profissionais de construção civil. Conecte. Contrate. Construa.</p>
          </div>
          <div className="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li onClick={() => scrollTo('plataforma')}>O que oferecemos</li>
              <li onClick={() => scrollTo('faq')}>Perguntas Frequentes</li>
              {PREREGISTRO_URL && (
                <li><a href={PREREGISTRO_URL} target="_blank" rel="noopener noreferrer">Lista de Espera</a></li>
              )}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contato</h4>
            <ul>
              <li>contato@redeobras.com.br</li>
              <li>Brasil</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 REDEOBRAS. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
