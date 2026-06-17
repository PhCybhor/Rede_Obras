import React from 'react';
import { ToolsIcon, SearchIcon, BoxIcon, FileIcon } from '../components/Icons';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav className="landing-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="sidebar-logo">RO</div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            REDE<span style={{ color: 'var(--accent)' }}>OBRAS</span>
          </span>
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
        <span className="hero-tag">A evolução digital da construção civil</span>
        <h1 className="hero-title">
          Conectando quem <span style={{ color: 'var(--primary)' }}>constrói</span> com quem precisa de <span style={{ color: 'var(--accent)' }}>obras</span>.
        </h1>
        <p className="hero-subtitle">
          Encontre os melhores profissionais de forma inteligente, gerencie materiais de construção e assine contratos digitais seguros em um único lugar.
        </p>
        <div className="hero-actions">
          <button 
            onClick={() => onNavigate('login', { initialTab: 'register', role: 'contratante' })}
            className="btn btn-primary"
            style={{ padding: '14px 28px', fontSize: '1.05rem' }}
          >
            Quero Contratar
          </button>
          <button 
            onClick={() => onNavigate('login', { initialTab: 'register', role: 'prestador' })}
            className="btn btn-accent"
            style={{ padding: '14px 28px', fontSize: '1.05rem' }}
          >
            Quero Trabalhar
          </button>
          <button
            onClick={() => onNavigate('pre-cadastro')}
            className="btn btn-outline-primary"
            style={{ padding: '14px 28px', fontSize: '1.05rem' }}
          >
            Pré-cadastro
          </button>
        </div>
      </header>

      {/* Features Grid */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '50px' }}>
          O que faz a <span style={{ color: 'var(--primary)' }}>REDE</span><span style={{ color: 'var(--accent)' }}>OBRAS</span> única?
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          
          <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(30, 58, 138, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '20px' }}>
              <SearchIcon size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>IA de Match Perfeito</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Escreva em linguagem natural o que você precisa ("preciso consertar vazamento no banheiro") e nossa IA fará a análise mapeando os profissionais ideias disponíveis na hora.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '20px' }}>
              <BoxIcon size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Solicitação de Materiais</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              O prestador solicita os materiais necessários direto pelo painel de serviço. O contratante revisa a quantidade, valores sugeridos e aprova ou recusa com um clique.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '20px' }}>
              <FileIcon size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>Contratos & Propostas</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Caso não encontre profissionais livres de imediato, publique uma proposta. Prestadores qualificados fazem orçamentos e você aceita o que melhor cabe no seu bolso.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '40px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
        <p>© 2026 REDEOBRAS. Todos os direitos reservados. Projeto inovador de Conectividade na Construção.</p>
      </footer>
    </div>
  );
}
