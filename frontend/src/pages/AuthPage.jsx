import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import logo from '../assets/logo.png';

export default function AuthPage({ onNavigate, params = {} }) {
  const [activeTab, setActiveTab] = useState(params.initialTab || 'login'); // 'login' or 'register'
  const [role, setRole] = useState(params.role || 'contratante'); // 'contratante' or 'prestador'
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Provider fields
  const [specialty, setSpecialty] = useState('pedreiro');
  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sync tab/role from params if they change
  useEffect(() => {
    if (params.initialTab) setActiveTab(params.initialTab);
    if (params.role) setRole(params.role);
  }, [params]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const user = await api.login(email, password);
        // Navigate based on user role
        if (user.role === 'contratante') {
          onNavigate('contratante');
        } else {
          onNavigate('prestador');
        }
      } else {
        // Registering
        await api.register(
          name, 
          email, 
          password, 
          role, 
          role === 'prestador' ? specialty : null,
          role === 'prestador' ? hourlyRate : 0,
          role === 'prestador' ? bio : '',
          phone
        );
        
        setSuccessMsg('Conta criada com sucesso! Faça login para entrar.');
        setActiveTab('login');
        setPassword(''); // clear password
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro no servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div 
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer' }}
        >
          <img src={logo} alt="REDEOBRAS" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {/* Tab switchers */}
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); }}
          >
            Acessar Conta
          </div>
          <div 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); }}
          >
            Criar Cadastro
          </div>
        </div>

        {/* Message banners */}
        {error && (
          <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 500 }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '12px', backgroundColor: '#d1fae5', color: 'var(--success)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 500 }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <>
              {/* Role Selection */}
              <div className="input-group">
                <label className="input-label">Tipo de Cadastro</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    className={`btn ${role === 'contratante' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                    onClick={() => setRole('contratante')}
                  >
                    Contratante (Dono da Obra)
                  </button>
                  <button
                    type="button"
                    className={`btn ${role === 'prestador' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                    onClick={() => setRole('prestador')}
                  >
                    Prestador de Serviço
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="input-group">
                <label htmlFor="auth-name" className="input-label">Nome Completo</label>
                <input
                  id="auth-name"
                  type="text"
                  required
                  placeholder="Ex: Carlos Silva"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="input-group">
            <label htmlFor="auth-email" className="input-label">Endereço de E-mail</label>
            <input
              id="auth-email"
              type="email"
              required
              placeholder="seuemail@provedor.com"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="auth-password" className="input-label">Senha de Acesso</label>
            <input
              id="auth-password"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {activeTab === 'register' && (
            <>
              {/* Phone */}
              <div className="input-group">
                <label htmlFor="auth-phone" className="input-label">Celular / WhatsApp</label>
                <input
                  id="auth-phone"
                  type="text"
                  required
                  placeholder="Ex: (11) 98765-4321"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Specific fields for service provider */}
              {role === 'prestador' && (
                <div style={{ padding: '20px', border: '1px dashed var(--accent)', borderRadius: 'var(--radius-lg)', backgroundColor: '#fffaf8', marginBottom: '24px' }}>
                  <h4 style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: '16px', fontSize: '0.95rem' }}>
                    Dados Profissionais do Prestador
                  </h4>

                  {/* Specialty */}
                  <div className="input-group">
                    <label htmlFor="auth-specialty" className="input-label">Especialidade Principal</label>
                    <select
                      id="auth-specialty"
                      className="form-control"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    >
                      <option value="pedreiro">Pedreiro (Alvenaria, Acabamento)</option>
                      <option value="eletricista">Eletricista (Instalação, Manutenção)</option>
                      <option value="pintor">Pintor (Paredes, Fachadas, Textura)</option>
                      <option value="encanador">Encanador (Hidráulica, Vazamentos)</option>
                      <option value="outro">Outro (Gesseiro, Carpinteiro, etc.)</option>
                    </select>
                  </div>

                  {/* Hourly Rate */}
                  <div className="input-group">
                    <label htmlFor="auth-rate" className="input-label">Preço Médio por Hora (R$)</label>
                    <input
                      id="auth-rate"
                      type="number"
                      required
                      placeholder="Ex: 45"
                      className="form-control"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                    />
                  </div>

                  {/* Bio */}
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="auth-bio" className="input-label">Resumo de Experiências / Habilidades</label>
                    <textarea
                      id="auth-bio"
                      rows="3"
                      required
                      placeholder="Descreva brevemente seus anos de experiência, ferramentas que possui e tipos de serviços que executa."
                      className="form-control"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn ${role === 'prestador' && activeTab === 'register' ? 'btn-accent' : 'btn-primary'}`}
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
          >
            {loading ? 'Processando...' : activeTab === 'login' ? 'Entrar' : 'Concluir Cadastro'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <span 
            onClick={() => onNavigate('landing')} 
            style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--primary)' }}
          >
            Voltar para a página inicial
          </span>
        </div>
      </div>
    </div>
  );
}
