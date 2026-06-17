import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

export default function PreCadastro() {
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

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus();
  }, []);

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
      setStatus({ type: 'success', message: 'Pré-cadastro enviado com sucesso!' });
      setForm({ name: '', email: '', phone: '', role: 'contratante', interest: '' });
      setErrors({});
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Erro ao enviar pré-cadastro' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pre-cadastro-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="sidebar-logo">RO</div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
            REDE<span style={{ color: 'var(--accent)' }}>OBRAS</span>
          </span>
        </div>
        <div className="container">
        <section className="hero-section">
          <div className="hero-copy">
            <h1>Projeto REDEOBRAS</h1>
            <p>
              Plataforma para conectar contratantes e prestadores de serviços da construção civil.
              Encontre profissionais, gerencie materiais e assine contratos digitais com facilidade.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => document.getElementById('pre-signup-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Quero pré-cadastro
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => document.getElementById('project-info')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Saiba mais
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-banner-card">
              <span className="badge">Lançamento em breve</span>
              <h2>Conexão rápida entre obra e serviço</h2>
              <p>Match inteligente, gestão de materiais e contratos digitais em um só lugar.</p>
            </div>
          </div>
        </section>
        <section className="features-section" id="project-info">
          <div className="features-intro">
            <h2>Mais eficiência para sua obra</h2>
            <p>
              A REDEOBRAS foi desenvolvida para tornar mais simples a contratação de prestadores,
              o controle de materiais e a formalização de serviços na construção civil.
            </p>
          </div>
          <div className="features-grid">
            <article className="feature-card">
              <strong>Match inteligente</strong>
              <p>Encontre profissionais adequados para seu projeto sem perder tempo.</p>
            </article>
            <article className="feature-card">
              <strong>Gestão de propostas</strong>
              <p>Receba, compare e acompanhe propostas diretamente pelo seu painel.</p>
            </article>
            <article className="feature-card">
              <strong>Contratos digitais</strong>
              <p>Formalize acordos com segurança e transparência.</p>
            </article>
          </div>
        </section>
      </div>

      <section className="pre-signup-section" id="pre-signup-form">
        <div className="pre-signup-card">
          <div className="pre-signup-header">
            <h2>Garanta seu acesso prioritário</h2>
            <p>Cadastre seus dados para ser avisado assim que a plataforma estiver disponível.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-grid">
              <label className="input-group">
                <span className="input-label">Nome</span>
                <input
                  id="pre-name"
                  ref={nameRef}
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'error-name' : undefined}
                  required
                />
                {errors.name && <span id="error-name" className="error-text">{errors.name}</span>}
              </label>

              <label className="input-group">
                <span className="input-label">E-mail</span>
                <input
                  id="pre-email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'error-email' : undefined}
                  required
                />
                {errors.email && <span id="error-email" className="error-text">{errors.email}</span>}
              </label>

              <label className="input-group">
                <span className="input-label">Telefone</span>
                <input
                  id="pre-phone"
                  className={`form-control ${errors.phone ? 'error' : ''}`}
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(xx) xxxxx-xxxx"
                  maxLength="15"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'error-phone' : undefined}
                />
                {errors.phone && <span id="error-phone" className="error-text">{errors.phone}</span>}
              </label>

              <label className="input-group">
                <span className="input-label">Sou</span>
                <select
                  id="pre-role"
                  name="role"
                  className={`form-control ${errors.role ? 'error' : ''}`}
                  value={form.role}
                  onChange={handleChange}
                  aria-invalid={!!errors.role}
                >
                  <option value="contratante">Contratante</option>
                  <option value="prestador">Prestador</option>
                </select>
                {errors.role && <span className="error-text">{errors.role}</span>}
              </label>
            </div>

            <label className="input-group full-width">
              <span className="input-label">Interesse / Observação</span>
              <textarea
                id="pre-interest"
                className="form-control"
                name="interest"
                value={form.interest}
                onChange={handleChange}
                rows="5"
                placeholder="Descreva seu projeto ou serviço desejado"
              />
            </label>

            <button
              type="submit"
              className={`btn ${form.role === 'prestador' ? 'btn-accent' : 'btn-primary'}`}
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: 12 }}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar pré-cadastro'}
            </button>

            {status && (
              <p
                className={`status-message ${status.type === 'success' ? 'status-success' : status.type === 'error' ? 'status-error' : ''}`}
                role="status"
                aria-live="polite"
                style={{ marginTop: 14 }}
              >
                {status.message}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}