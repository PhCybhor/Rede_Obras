import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import logo from '../assets/logo.png';
import { 
  SearchIcon, UserIcon, ChatIcon, BoxIcon, 
  FileIcon, SettingsIcon, StarIcon, SendIcon, LogOutIcon, PlusIcon, CheckIcon, XIcon 
} from '../components/Icons';

export default function ContractorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'materials', 'contracts', 'proposals', 'chat', 'profile'
  const [providers, setProviders] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [detectedSpecialty, setDetectedSpecialty] = useState('');
  const [searched, setSearched] = useState(false);
  
  // Proposals & Bids state
  const [myProposals, setMyProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropDesc, setNewPropDesc] = useState('');
  const [newPropBudget, setNewPropBudget] = useState('');

  // Materials & Contracts state
  const [materialRequests, setMaterialRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);

  // Chat state
  const [chatRooms, setChatRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  // Profile state
  const [profileData, setProfileData] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Notifications/Errors
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load initial dashboard data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Poll chat messages if a chat room is open
  useEffect(() => {
    let interval;
    if (activeTab === 'chat' && activeRoom) {
      // Fetch messages immediately
      fetchRoomMessages(activeRoom.id);
      // Poll every 3 seconds
      interval = setInterval(() => {
        fetchRoomMessages(activeRoom.id);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeTab, activeRoom]);

  const loadInitialData = async () => {
    try {
      setError('');
      // Get all providers initially
      const allProviders = await api.getProviders();
      setProviders(allProviders);

      // Load client's proposals
      const props = await api.getProposals(user.id);
      setMyProposals(props);

      // Load material requests
      const matReqs = await api.getMaterialRequests();
      setMaterialRequests(matReqs);

      // Load contracts
      const activeContracts = await api.getContracts();
      setContracts(activeContracts);

      // Load chat rooms
      const rooms = await api.getChats();
      setChatRooms(rooms);

      // Load profile info
      const profile = await api.getMe();
      setProfileData(profile);
      setEditName(profile.name);
      setEditPhone(profile.phone || '');
    } catch (err) {
      setError('Erro ao carregar dados do painel: ' + err.message);
    }
  };

  // Save contractor profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSavingProfile(true);
    try {
      const updated = await api.updateProfile({ name: editName, phone: editPhone });
      setProfileData(updated);
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      setError('Erro ao salvar perfil: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // AI Matching Search
  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setError('');
    setSearched(true);
    try {
      const result = await api.searchAIProviders(aiPrompt);
      setDetectedSpecialty(result.detected_specialty);
      setProviders(result.providers);
    } catch (err) {
      setError('Erro na busca inteligente: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  // Start direct chat with provider
  const handleStartChat = async (providerId) => {
    try {
      setError('');
      const room = await api.startChat(providerId);
      // Reload chat rooms
      const rooms = await api.getChats();
      setChatRooms(rooms);
      // Select the active room
      const active = rooms.find(r => r.id === room.id) || room;
      setActiveRoom(active);
      setActiveTab('chat');
    } catch (err) {
      setError('Erro ao iniciar chat: ' + err.message);
    }
  };

  // Create new public job proposal
  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.createProposal(newPropTitle, newPropDesc, newPropBudget);
      setSuccess('Proposta de serviço publicada com sucesso!');
      setNewPropTitle('');
      setNewPropDesc('');
      setNewPropBudget('');
      setShowProposalForm(false);
      // Refresh proposals
      const props = await api.getProposals(user.id);
      setMyProposals(props);
    } catch (err) {
      setError('Erro ao criar proposta: ' + err.message);
    }
  };

  // Accept/Reject Bids on Proposals
  const handleAcceptBid = async (bidId) => {
    if (!window.confirm('Deseja aceitar este orçamento? Isso criará um contrato ativo e rejeitará as outras propostas.')) return;
    setError('');
    try {
      await api.acceptBid(bidId);
      setSuccess('Orçamento aceito! Contrato gerado.');
      // Refresh data
      loadInitialData();
      setActiveTab('contracts');
    } catch (err) {
      setError('Erro ao aceitar orçamento: ' + err.message);
    }
  };

  const handleRejectBid = async (bidId) => {
    if (!window.confirm('Deseja recusar este orçamento?')) return;
    setError('');
    try {
      await api.rejectBid(bidId);
      // Refresh proposals
      const props = await api.getProposals(user.id);
      setMyProposals(props);
      if (selectedProposal) {
        const updated = props.find(p => p.id === selectedProposal.id);
        setSelectedProposal(updated);
      }
    } catch (err) {
      setError('Erro ao rejeitar orçamento: ' + err.message);
    }
  };

  // Complete contract
  const handleCompleteContract = async (contractId) => {
    if (!window.confirm('Deseja marcar este contrato como concluído? Esta ação não pode ser desfeita.')) return;
    setError('');
    setSuccess('');
    try {
      const updated = await api.completeContract(contractId);
      setSuccess('Contrato marcado como concluído!');
      const activeContracts = await api.getContracts();
      setContracts(activeContracts);
      setSelectedContract(updated);
    } catch (err) {
      setError('Erro ao concluir contrato: ' + err.message);
    }
  };

  // Material requests approvals
  const handleApproveMaterial = async (reqId) => {
    setError('');
    try {
      await api.approveMaterialRequest(reqId);
      // Refresh
      const matReqs = await api.getMaterialRequests();
      setMaterialRequests(matReqs);
    } catch (err) {
      setError('Erro ao aprovar material: ' + err.message);
    }
  };

  const handleRejectMaterial = async (reqId) => {
    setError('');
    try {
      await api.rejectMaterialRequest(reqId);
      // Refresh
      const matReqs = await api.getMaterialRequests();
      setMaterialRequests(matReqs);
    } catch (err) {
      setError('Erro ao recusar material: ' + err.message);
    }
  };

  // Chat message actions
  const fetchRoomMessages = async (roomId) => {
    try {
      const room = await api.getChat(roomId);
      setChatMessages(room.messages || []);
    } catch (err) {
      console.error('Error loading chat messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeRoom) return;
    try {
      const msg = await api.sendMessage(activeRoom.id, newMessageText);
      setChatMessages([...chatMessages, msg]);
      setNewMessageText('');
    } catch (err) {
      setError('Erro ao enviar mensagem: ' + err.message);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand" style={{ padding: '20px 24px' }}>
          <img src={logo} alt="REDEOBRAS" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
        </div>

        <ul className="sidebar-menu">
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => { setActiveTab('search'); setSelectedProposal(null); }}
            >
              <SearchIcon /> Buscar Prestador (IA)
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'materials' ? 'active' : ''}`}
              onClick={() => { setActiveTab('materials'); setSelectedProposal(null); }}
            >
              <BoxIcon /> Materiais
              {materialRequests.filter(r => r.status === 'pending').length > 0 && (
                <span style={{ marginLeft: 'auto', backgroundColor: 'var(--accent)', color: 'white', fontSize: '0.75rem', padding: '2px 6px', borderRadius: 'var(--radius-full)' }}>
                  {materialRequests.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'contracts' ? 'active' : ''}`}
              onClick={() => { setActiveTab('contracts'); setSelectedProposal(null); setSelectedContract(null); }}
            >
              <FileIcon /> Contratos
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'proposals' ? 'active' : ''}`}
              onClick={() => { setActiveTab('proposals'); }}
            >
              <FileIcon /> Minhas Propostas
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => { setActiveTab('chat'); setSelectedProposal(null); }}
            >
              <ChatIcon /> Mensagens / Chat
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setSelectedProposal(null); }}
            >
              <SettingsIcon /> Configurações
            </button>
          </li>
        </ul>

        <div className="sidebar-user">
          <div className="user-avatar" style={{ backgroundColor: '#ef4444' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">Contratante</span>
          </div>
          <button 
            onClick={onLogout}
            style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }}
            title="Sair"
          >
            <LogOutIcon size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-bar">
          <h2 className="page-title">
            {activeTab === 'search' && 'Buscar Prestador por IA'}
            {activeTab === 'materials' && 'Gerenciamento de Materiais'}
            {activeTab === 'contracts' && 'Contratos de Obras'}
            {activeTab === 'proposals' && 'Propostas de Trabalho'}
            {activeTab === 'chat' && 'Central de Conversas'}
            {activeTab === 'profile' && 'Minhas Configurações'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)' }}>Online</span>
          </div>
        </header>

        <div className="content-body animate-fade-in">
          
          {/* Notification banners */}
          {error && (
            <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontWeight: 500 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ padding: '16px', backgroundColor: '#d1fae5', color: 'var(--success)', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontWeight: 500 }}>
              {success}
            </div>
          )}

          {/* TAB 1: AI SEARCH */}
          {activeTab === 'search' && (
            <div>
              <div className="card" style={{ marginBottom: '30px', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>O que você precisa hoje?</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px' }}>
                  Descreva o serviço em linguagem comum. Nosso sistema de IA detectará a categoria correta e buscará profissionais qualificados.
                </p>

                <form onSubmit={handleAISearch} className="ai-search-box">
                  <SearchIcon size={24} style={{ color: 'var(--primary-light)' }} />
                  <input 
                    type="text" 
                    placeholder="Ex: Preciso de um pedreiro para reformar um banheiro e colocar azulejos..."
                    className="ai-search-input"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  <button type="submit" disabled={aiLoading} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                    {aiLoading ? 'Analisando...' : 'Buscar'}
                  </button>
                </form>
              </div>

              {searched && (
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Especialidade detectada: </span>
                    <strong style={{ textTransform: 'uppercase', color: 'var(--accent)', fontSize: '1.1rem' }}>
                      {detectedSpecialty !== 'desconhecido' ? detectedSpecialty : 'Geral (Todos)'}
                    </strong>
                  </div>
                  <button 
                    onClick={() => setShowProposalForm(true)}
                    className="btn btn-accent"
                  >
                    <PlusIcon size={16} /> Lançar Proposta Pública
                  </button>
                </div>
              )}

              {/* Providers List Grid */}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '24px 0 16px' }}>
                {searched ? 'Prestadores qualificados disponíveis' : 'Profissionais recomendados em destaque'}
              </h3>
              
              {providers.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  Nenhum prestador de serviço cadastrado para esta categoria no momento. 
                  <button 
                    onClick={() => setShowProposalForm(true)}
                    className="btn btn-accent"
                    style={{ display: 'block', margin: '20px auto 0' }}
                  >
                    Lançar proposta para receber orçamentos
                  </button>
                </div>
              ) : (
                <div className="provider-grid">
                  {providers.map((p) => (
                    <div className="card provider-card animate-fade-in" key={p.id}>
                      <div className="provider-header">
                        <div className="user-avatar" style={{ backgroundColor: p.avatar_color || 'var(--primary)' }}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="provider-title-group">
                          <strong style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.name}</strong>
                          <span className="provider-badge">{p.specialty || 'Outro'}</span>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                          <div className="provider-rating">
                            <StarIcon fill="var(--warning)" /> {p.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>

                      <div className="provider-rate">
                        R$ {p.hourly_rate.toFixed(2)} <span>/ hora</span>
                      </div>

                      <p className="provider-bio">{p.bio || 'Sem biografia disponível.'}</p>
                      
                      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <button 
                          onClick={() => handleStartChat(p.id)}
                          className="btn btn-primary"
                          style={{ flex: 1 }}
                        >
                          <ChatIcon size={16} /> Falar no Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MATERIALS */}
          {activeTab === 'materials' && (
            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Abaixo estão listadas as solicitações de materiais de construção feitas pelos prestadores vinculados aos seus contratos de obra em andamento.
              </p>

              {materialRequests.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  Nenhuma solicitação de material de construção registrada.
                </div>
              ) : (
                <table className="materials-table">
                  <thead>
                    <tr>
                      <th>Contrato / Obra</th>
                      <th>Item / Material</th>
                      <th>Quantidade</th>
                      <th>Preço Est. (Total)</th>
                      <th>Solicitado Por</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialRequests.map((req) => (
                      <tr key={req.id}>
                        <td><strong>Contrato #{req.contract_id}</strong></td>
                        <td>{req.item_name}</td>
                        <td>{req.quantity}</td>
                        <td>R$ {(req.estimated_price * req.quantity).toFixed(2)}</td>
                        <td>{req.requested_by_id === user.id ? 'Você' : 'Prestador'}</td>
                        <td>
                          <span className={`status-badge ${
                            req.status === 'approved' ? 'status-open' : 
                            req.status === 'rejected' ? 'status-pending' : 'status-pending'
                          }`}>
                            {req.status === 'approved' && 'Aprovado'}
                            {req.status === 'rejected' && 'Recusado'}
                            {req.status === 'pending' && 'Pendente'}
                          </span>
                        </td>
                        <td>
                          {req.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                onClick={() => handleApproveMaterial(req.id)}
                                className="btn btn-primary" 
                                style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                                title="Aprovar"
                              >
                                <CheckIcon size={14} /> Aprovar
                              </button>
                              <button 
                                onClick={() => handleRejectMaterial(req.id)}
                                className="btn btn-outline" 
                                style={{ padding: '6px 10px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                title="Recusar"
                              >
                                <XIcon size={14} /> Recusar
                              </button>
                            </div>
                          )}
                          {req.status !== 'pending' && (
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Concluído</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 3: CONTRACTS */}
          {activeTab === 'contracts' && (
            <div>
              {selectedContract ? (
                <div>
                  <button 
                    onClick={() => setSelectedContract(null)}
                    className="btn btn-outline"
                    style={{ marginBottom: '20px' }}
                  >
                    ← Voltar para lista de contratos
                  </button>

                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
                      <div>
                        <span className="status-badge status-open" style={{ marginBottom: '8px' }}>
                          {selectedContract.status === 'active' ? 'Ativo' : 'Concluído'}
                        </span>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedContract.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Prestador: <strong>{selectedContract.provider.name}</strong> ({selectedContract.provider.specialty})
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Valor do Contrato</span>
                        <h4 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                          R$ {selectedContract.budget.toFixed(2)}
                        </h4>
                        {selectedContract.status === 'active' && (
                          <button
                            onClick={() => handleCompleteContract(selectedContract.id)}
                            className="btn btn-primary"
                            style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.85rem' }}
                          >
                            <CheckIcon size={14} /> Concluir Contrato
                          </button>
                        )}
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>Descrição do Escopo</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px', whiteSpace: 'pre-line' }}>
                      {selectedContract.description}
                    </p>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>Solicitações de Materiais Vinculados</h4>
                    {selectedContract.material_requests && selectedContract.material_requests.length === 0 ? (
                      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Nenhum material solicitado para este contrato.</p>
                    ) : (
                      <table className="materials-table">
                        <thead>
                          <tr>
                            <th>Material</th>
                            <th>Quantidade</th>
                            <th>Valor Unitário</th>
                            <th>Valor Total</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedContract.material_requests.map((mr) => (
                            <tr key={mr.id}>
                              <td>{mr.item_name}</td>
                              <td>{mr.quantity}</td>
                              <td>R$ {mr.estimated_price.toFixed(2)}</td>
                              <td>R$ {(mr.estimated_price * mr.quantity).toFixed(2)}</td>
                              <td>
                                <span className={`status-badge ${mr.status === 'approved' ? 'status-open' : 'status-pending'}`}>
                                  {mr.status === 'approved' ? 'Aprovado' : mr.status === 'rejected' ? 'Recusado' : 'Pendente'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Contratos oficiais gerados após a aceitação de orçamentos ou propostas de trabalho.
                  </p>

                  {contracts.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                      Você ainda não possui nenhum contrato ativo.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {contracts.map((c) => (
                        <div 
                          className="card proposal-list-item" 
                          key={c.id}
                          onClick={() => setSelectedContract(c)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div>
                            <span className="status-badge status-open" style={{ marginBottom: '8px' }}>
                              {c.status === 'active' ? 'Em Andamento' : 'Concluído'}
                            </span>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{c.title}</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                              Profissional: <strong>{c.provider.name}</strong> ({c.provider.specialty})
                            </p>
                          </div>
                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                              R$ {c.budget.toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: c.status === 'active' ? 'var(--text-light)' : 'var(--success)', marginTop: '4px', fontWeight: c.status === 'active' ? 400 : 600 }}>
                              {c.status === 'active' ? 'Ver Detalhes →' : 'Concluído ✓'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY PROPOSALS */}
          {activeTab === 'proposals' && (
            <div>
              {selectedProposal ? (
                <div>
                  <button 
                    onClick={() => setSelectedProposal(null)}
                    className="btn btn-outline"
                    style={{ marginBottom: '20px' }}
                  >
                    ← Voltar para Minhas Propostas
                  </button>

                  <div className="card" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                      <div>
                        <span className={`status-badge ${selectedProposal.status === 'open' ? 'status-open' : 'status-accepted'}`}>
                          {selectedProposal.status === 'open' ? 'Aberta para Propostas' : 'Finalizada'}
                        </span>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '6px' }}>{selectedProposal.title}</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Orçamento Estimado</span>
                        <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)' }}>R$ {selectedProposal.budget.toFixed(2)}</h4>
                      </div>
                    </div>
                    
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>Descrição</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{selectedProposal.description}</p>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
                    Orçamentos enviados pelos prestadores ({selectedProposal.bids ? selectedProposal.bids.length : 0})
                  </h3>

                  {(!selectedProposal.bids || selectedProposal.bids.length === 0) ? (
                    <div className="card" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-light)' }}>
                      Aguardando recebimento de orçamentos para este serviço.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {selectedProposal.bids.map((b) => (
                        <div className="card" key={b.id} style={{ borderLeft: b.status === 'accepted' ? '4px solid var(--success)' : '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div className="user-avatar" style={{ backgroundColor: b.provider.avatar_color, width: '38px', height: '38px', fontSize: '0.95rem' }}>
                                {b.provider.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <strong style={{ fontSize: '1rem' }}>{b.provider.name}</strong>
                                <span className="provider-badge" style={{ marginLeft: '8px', fontSize: '0.7rem' }}>{b.provider.specialty}</span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                                R$ {b.value.toFixed(2)}
                              </span>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Prazo estimado: <strong>{b.timeframe}</strong>
                              </div>
                            </div>
                          </div>

                          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', borderLeft: '2px solid var(--border-color)' }}>
                            {b.message}
                          </p>

                          {b.status === 'pending' && selectedProposal.status === 'open' && (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleAcceptBid(b.id)}
                                className="btn btn-primary"
                                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                              >
                                <CheckIcon size={14} /> Aceitar Orçamento
                              </button>
                              <button 
                                onClick={() => handleRejectBid(b.id)}
                                className="btn btn-outline"
                                style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                              >
                                <XIcon size={14} /> Recusar
                              </button>
                            </div>
                          )}

                          {b.status === 'accepted' && (
                            <div style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                              <CheckIcon size={16} /> Você aceitou este orçamento
                            </div>
                          )}

                          {b.status === 'rejected' && (
                            <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'right' }}>
                              Orçamento recusado
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                      Gerencie as propostas de obras públicas que você lançou no sistema REDEOBRAS.
                    </p>
                    <button 
                      onClick={() => setShowProposalForm(true)}
                      className="btn btn-primary"
                    >
                      <PlusIcon size={16} /> Criar Nova Proposta
                    </button>
                  </div>

                  {myProposals.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                      Você ainda não lançou nenhuma proposta pública.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {myProposals.map((p) => (
                        <div 
                          className="card proposal-list-item" 
                          key={p.id}
                          onClick={() => setSelectedProposal(p)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div>
                            <span className={`status-badge ${p.status === 'open' ? 'status-open' : 'status-accepted'}`}>
                              {p.status === 'open' ? 'Aberta' : 'Fechada'}
                            </span>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '6px' }}>{p.title}</h4>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'block', marginTop: '4px' }}>
                              Orçamentos recebidos: <strong>{p.bids ? p.bids.length : 0}</strong>
                            </span>
                          </div>
                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                              R$ {p.budget.toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '4px' }}>
                              Ver Orçamentos →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CHAT CENTRAL */}
          {activeTab === 'chat' && (
            <div className="chat-window">
              <div className="chat-sidebar">
                <div className="chat-sidebar-header">Conversas Ativas</div>
                <div className="chat-list">
                  {chatRooms.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      Nenhum chat iniciado ainda. Busque um prestador para começar.
                    </div>
                  ) : (
                    chatRooms.map((room) => {
                      const otherUser = room.provider;
                      const isActive = activeRoom && activeRoom.id === room.id;
                      return (
                        <div 
                          className={`chat-list-item ${isActive ? 'active' : ''}`}
                          key={room.id}
                          onClick={() => setActiveRoom(room)}
                        >
                          <div className="user-avatar" style={{ backgroundColor: otherUser.avatar_color, width: '36px', height: '36px', fontSize: '0.9rem' }}>
                            {otherUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <strong style={{ fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{otherUser.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{otherUser.specialty}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="chat-main">
                {activeRoom ? (
                  <>
                    <div className="chat-main-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="user-avatar" style={{ backgroundColor: activeRoom.provider.avatar_color, width: '38px', height: '38px' }}>
                          {activeRoom.provider.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ fontSize: '1rem', display: 'block' }}>{activeRoom.provider.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                            {activeRoom.provider.specialty} • Preço: R$ {activeRoom.provider.hourly_rate.toFixed(2)}/h
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="chat-messages">
                      {chatMessages.length === 0 ? (
                        <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-light)', fontSize: '0.95rem' }}>
                          Envie uma mensagem para dar início aos detalhes do serviço.
                        </div>
                      ) : (
                        chatMessages.map((msg) => {
                          const isSentByMe = msg.sender_id === user.id;
                          return (
                            <div className={`msg-wrapper ${isSentByMe ? 'sent' : 'received'}`} key={msg.id}>
                              <div className="msg-bubble">
                                {msg.text}
                              </div>
                              <span className="msg-time">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <form onSubmit={handleSendMessage} className="chat-input-area">
                      <input 
                        type="text" 
                        placeholder="Digite sua mensagem para o prestador..."
                        className="form-control"
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary">
                        <SendIcon /> Enviar
                      </button>
                    </form>
                  </>
                ) : (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-light)' }}>
                    <ChatIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p>Selecione um chat na barra lateral para iniciar a conversa.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: CONFIGURAÇÕES PROFILE */}
          {activeTab === 'profile' && profileData && (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <form onSubmit={handleSaveProfile}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div className="user-avatar" style={{ backgroundColor: '#ef4444', width: '80px', height: '80px', fontSize: '2.2rem', margin: '0 auto 16px' }}>
                    {(editName || profileData.name).charAt(0).toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{editName}</h3>
                  <span className="provider-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginTop: '6px' }}>Contratante</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  <div className="input-group">
                    <label className="input-label">Nome Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">E-mail de Cadastro (Inalterável)</label>
                    <input type="email" className="form-control" value={profileData.email} disabled />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="(xx) xxxxx-xxxx"
                    />
                  </div>

                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Data de Filiação</span>
                    <p style={{ fontWeight: 600, fontSize: '1rem', marginTop: '2px' }}>
                      {new Date(profileData.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <button type="submit" disabled={savingProfile} className="btn btn-primary" style={{ padding: '12px 24px', fontWeight: 700, marginTop: '10px' }}>
                    {savingProfile ? 'Salvando...' : 'Salvar Perfil'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* CREATE PROPOSAL MODAL */}
      {showProposalForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Lançar Nova Proposta Pública</h3>
              <button 
                onClick={() => setShowProposalForm(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProposal}>
              <div className="input-group">
                <label className="input-label">Título da Obra / Serviço</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: Reforma de reboco e pintura de muro"
                  className="form-control"
                  value={newPropTitle}
                  onChange={(e) => setNewPropTitle(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Orçamento Máximo Estimado (R$)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="Ex: 1500"
                  className="form-control"
                  value={newPropBudget}
                  onChange={(e) => setNewPropBudget(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Descrição Detalhada do Serviço</label>
                <textarea 
                  rows="4" 
                  required 
                  placeholder="Descreva as dimensões da parede, estado atual, se os materiais serão fornecidos por você e a urgência do trabalho."
                  className="form-control"
                  value={newPropDesc}
                  onChange={(e) => setNewPropDesc(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowProposalForm(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Publicar Proposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
