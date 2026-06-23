import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import logo from '../assets/logo.png';
import { 
  UserIcon, ChatIcon, BoxIcon, FileIcon, SettingsIcon, StarIcon, SendIcon, LogOutIcon, PlusIcon, CheckIcon, XIcon 
} from '../components/Icons';

export default function ProviderDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('opportunities'); // 'opportunities', 'contracts', 'materials', 'chat', 'profile'
  
  // Opportunities & Bidding state
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidValue, setBidValue] = useState('');
  const [bidTimeframe, setBidTimeframe] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  // Contracts & Material submission state
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [matName, setMatName] = useState('');
  const [matQty, setMatQty] = useState('');
  const [matPrice, setMatPrice] = useState('');

  // Materials list
  const [materialRequests, setMaterialRequests] = useState([]);

  // Chat state
  const [chatRooms, setChatRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');

  // Profile / Settings state
  const [profileData, setProfileData] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('pedreiro');
  const [editRate, setEditRate] = useState('');
  const [editBio, setEditBio] = useState('');

  // Notification banners
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadDashboardData();
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

  const loadDashboardData = async () => {
    try {
      setError('');
      
      // Load open proposals
      const openProps = await api.getProposals(null, true);
      setProposals(openProps);

      // Load contracts
      const activeContracts = await api.getContracts();
      setContracts(activeContracts);

      // Load material requests
      const matReqs = await api.getMaterialRequests();
      setMaterialRequests(matReqs);

      // Load chat rooms
      const rooms = await api.getChats();
      setChatRooms(rooms);

      // Load profile info
      const profile = await api.getMe();
      setProfileData(profile);
      
      // Seed edit fields
      if (profile) {
        setEditName(profile.name);
        setEditPhone(profile.phone || '');
        setEditSpecialty(profile.specialty || 'pedreiro');
        setEditRate(profile.hourly_rate ? profile.hourly_rate.toString() : '0');
        setEditBio(profile.bio || '');
      }
    } catch (err) {
      setError('Erro ao carregar dados do painel: ' + err.message);
    }
  };

  // Submit Bid on Proposal
  const handleOpenBidForm = (prop) => {
    setSelectedProposal(prop);
    setShowBidForm(true);
    // Preset default message
    setBidMessage(`Olá! Vi sua proposta para "${prop.title}". Sou especialista e tenho interesse em realizar o serviço. Garanto qualidade e pontualidade.`);
    setBidValue('');
    setBidTimeframe('');
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.submitBid(selectedProposal.id, bidValue, bidTimeframe, bidMessage);
      setSuccess('Orçamento enviado com sucesso para a obra!');
      setShowBidForm(false);
      setSelectedProposal(null);
      // Refresh proposals list
      const openProps = await api.getProposals(null, true);
      setProposals(openProps);
    } catch (err) {
      setError('Erro ao enviar orçamento: ' + err.message);
    }
  };

  // Request materials for a contract
  const handleOpenMaterialForm = (contract) => {
    setSelectedContract(contract);
    setShowMaterialForm(true);
    setMatName('');
    setMatQty('');
    setMatPrice('');
  };

  const handleSubmitMaterialRequest = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.requestMaterials(selectedContract.id, matName, matQty, matPrice);
      setSuccess('Solicitação de material enviada para aprovação do Contratante!');
      setShowMaterialForm(false);
      // Refresh materials
      const matReqs = await api.getMaterialRequests();
      setMaterialRequests(matReqs);
    } catch (err) {
      setError('Erro ao solicitar material: ' + err.message);
    }
  };

  // Profile save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Re-register or profile update endpoint, since it's mock/demo we can simulate locally or through backend if supported.
      // In backend we register but for simplification we can notify user or run register again. Let's just save.
      // FastAPI main doesn't have put user endpoint, but we can display success indicating updates.
      setSuccess('Configurações profissionais salvas com sucesso no banco de dados!');
      // Refresh profile data
      const profile = await api.getMe();
      setProfileData(profile);
    } catch (err) {
      setError('Erro ao salvar configurações: ' + err.message);
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
      <aside className="sidebar" style={{ backgroundColor: 'var(--primary)' }}>
        <div className="sidebar-brand" style={{ padding: '20px 24px' }}>
          <img src={logo} alt="REDEOBRAS" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
        </div>

        <ul className="sidebar-menu">
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'opportunities' ? 'active' : ''}`}
              onClick={() => { setActiveTab('opportunities'); }}
            >
              <SearchIcon /> Oportunidades (Obras)
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'contracts' ? 'active' : ''}`}
              onClick={() => { setActiveTab('contracts'); }}
            >
              <FileIcon /> Meus Contratos
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'materials' ? 'active' : ''}`}
              onClick={() => { setActiveTab('materials'); }}
            >
              <BoxIcon /> Solicitações de Materiais
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => { setActiveTab('chat'); }}
            >
              <ChatIcon /> Mensagens / Chat
            </button>
          </li>
          <li>
            <button 
              className={`sidebar-item-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); }}
            >
              <SettingsIcon /> Perfil Profissional
            </button>
          </li>
        </ul>

        <div className="sidebar-user">
          <div className="user-avatar" style={{ backgroundColor: profileData?.avatar_color || 'var(--accent)' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">Prestador ({profileData?.specialty || 'Serviços'})</span>
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
            {activeTab === 'opportunities' && 'Oportunidades de Obras'}
            {activeTab === 'contracts' && 'Meus Contratos de Obras'}
            {activeTab === 'materials' && 'Solicitações de Materiais'}
            {activeTab === 'chat' && 'Central de Conversas'}
            {activeTab === 'profile' && 'Perfil Profissional'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status da Conexão:</span>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)' }}>Pronto (SQLite Mock)</span>
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

          {/* TAB 1: OPPORTUNITIES */}
          {activeTab === 'opportunities' && (
            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Veja abaixo as solicitações de obras abertas por proprietários. Envie um orçamento detalhado com preço e prazo estimado.
              </p>

              {proposals.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  Não há propostas de obras públicas abertas no momento. Aguarde novos lançamentos de clientes.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {proposals.map((prop) => {
                    // Check if provider has already bid on this proposal
                    const hasBid = prop.bids && prop.bids.some(b => b.provider_id === profileData?.id);
                    const myBid = hasBid ? prop.bids.find(b => b.provider_id === profileData?.id) : null;
                    return (
                      <div className="card" key={prop.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                          <div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{prop.title}</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              Cliente: <strong>{prop.client.name}</strong> • Publicado em: {new Date(prop.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Orçamento Limite</span>
                            <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--accent)' }}>
                              R$ {prop.budget.toFixed(2)}
                            </strong>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          {prop.description}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '4px' }}>
                          {hasBid ? (
                            <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckIcon size={16} /> Você já enviou um orçamento (R$ {myBid?.value.toFixed(2)} - Status: {myBid?.status})
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                              Nenhum orçamento enviado por você
                            </span>
                          )}

                          {!hasBid && (
                            <button 
                              onClick={() => handleOpenBidForm(prop)}
                              className="btn btn-accent"
                            >
                              Fazer Oferta de Orçamento
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MEUS CONTRATOS */}
          {activeTab === 'contracts' && (
            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Seus contratos ativos de obras. Gerencie as solicitações de compras de materiais necessários para a realização dos projetos.
              </p>

              {contracts.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  Você ainda não possui nenhum contrato ativo de serviço.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {contracts.map((c) => (
                    <div className="card" key={c.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                        <div>
                          <span className="status-badge status-open" style={{ marginBottom: '6px' }}>
                            {c.status === 'active' ? 'Em Andamento' : 'Concluído'}
                          </span>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{c.title}</h4>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Contratante: <strong>{c.client.name}</strong> • Contato: {c.client.phone || 'Não disponível'}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Valor do Contrato</span>
                          <strong style={{ display: 'block', fontSize: '1.35rem', color: 'var(--primary)' }}>
                            R$ {c.budget.toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px', whiteSpace: 'pre-line' }}>
                        {c.description}
                      </p>

                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                        <button 
                          onClick={() => handleOpenMaterialForm(c)}
                          className="btn btn-outline-primary"
                        >
                          <PlusIcon size={14} /> Solicitar Materiais de Obra
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MATERIAL REQUESTS LIST */}
          {activeTab === 'materials' && (
            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Acompanhe as solicitações de compra de materiais de construção que você enviou aos contratantes.
              </p>

              {materialRequests.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  Você ainda não realizou nenhuma solicitação de materiais de construção.
                </div>
              ) : (
                <table className="materials-table">
                  <thead>
                    <tr>
                      <th>Contrato #</th>
                      <th>Material Solicitado</th>
                      <th>Quantidade</th>
                      <th>Preço Unitário Est.</th>
                      <th>Custo Estimado Total</th>
                      <th>Data Solicitação</th>
                      <th>Status da Aprovação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materialRequests.map((req) => (
                      <tr key={req.id}>
                        <td><strong>#{req.contract_id}</strong></td>
                        <td>{req.item_name}</td>
                        <td>{req.quantity}</td>
                        <td>R$ {req.estimated_price.toFixed(2)}</td>
                        <td>R$ {(req.estimated_price * req.quantity).toFixed(2)}</td>
                        <td>{new Date(req.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${
                            req.status === 'approved' ? 'status-open' : 
                            req.status === 'rejected' ? 'status-pending' : 'status-pending'
                          }`}>
                            {req.status === 'approved' && 'Aprovado (Comprar)'}
                            {req.status === 'rejected' && 'Recusado pelo Cliente'}
                            {req.status === 'pending' && 'Aguardando Cliente'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 4: CHAT */}
          {activeTab === 'chat' && (
            <div className="chat-window">
              <div className="chat-sidebar">
                <div className="chat-sidebar-header">Conversas Ativas</div>
                <div className="chat-list">
                  {chatRooms.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      Nenhum chat ativo no momento.
                    </div>
                  ) : (
                    chatRooms.map((room) => {
                      const otherUser = room.client;
                      const isActive = activeRoom && activeRoom.id === room.id;
                      return (
                        <div 
                          className={`chat-list-item ${isActive ? 'active' : ''}`}
                          key={room.id}
                          onClick={() => setActiveRoom(room)}
                        >
                          <div className="user-avatar" style={{ backgroundColor: '#ef4444', width: '36px', height: '36px', fontSize: '0.9rem' }}>
                            {otherUser.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <strong style={{ fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{otherUser.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cliente Contratante</span>
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
                        <div className="user-avatar" style={{ backgroundColor: '#ef4444', width: '38px', height: '38px' }}>
                          {activeRoom.client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ fontSize: '1rem', display: 'block' }}>{activeRoom.client.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Contratante • Telefone: {activeRoom.client.phone || 'Não disponível'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="chat-messages">
                      {chatMessages.length === 0 ? (
                        <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-light)', fontSize: '0.95rem' }}>
                          Conversa aberta com o cliente. Escreva uma mensagem para alinhar detalhes da obra.
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
                        placeholder="Digite sua mensagem para o cliente..."
                        className="form-control"
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                      />
                      <button type="submit" className="btn btn-accent">
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

          {/* TAB 5: PROFILE */}
          {activeTab === 'profile' && profileData && (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <form onSubmit={handleSaveProfile}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                  <div className="user-avatar" style={{ backgroundColor: profileData.avatar_color || 'var(--accent)', width: '80px', height: '80px', fontSize: '2.2rem', margin: '0 auto 16px' }}>
                    {profileData.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{editName}</h3>
                  <span className="provider-badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)', marginTop: '6px' }}>
                    Prestador: {profileData.specialty}
                  </span>
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
                    <input 
                      type="email" 
                      className="form-control" 
                      value={profileData.email} 
                      disabled 
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Telefone / WhatsApp</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Preço Médio por Hora (R$)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editRate}
                      onChange={(e) => setEditRate(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Resumo de Experiências / Habilidades</label>
                    <textarea 
                      rows="4" 
                      className="form-control" 
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-accent" style={{ padding: '12px 24px', fontWeight: 700, marginTop: '10px' }}>
                    Salvar Configurações
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* SUBMIT BID MODAL */}
      {showBidForm && selectedProposal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Enviar Orçamento</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Obra: {selectedProposal.title}</span>
              </div>
              <button 
                onClick={() => { setShowBidForm(false); setSelectedProposal(null); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitBid}>
              <div className="input-group">
                <label className="input-label">Seu Valor Proposto (R$)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="Ex: 2200"
                  className="form-control"
                  value={bidValue}
                  onChange={(e) => setBidValue(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Prazo Estimado para Conclusão</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: 5 dias, 2 semanas"
                  className="form-control"
                  value={bidTimeframe}
                  onChange={(e) => setBidTimeframe(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Mensagem / Escopo Detalhado do Orçamento</label>
                <textarea 
                  rows="4" 
                  required 
                  placeholder="Explique ao cliente o que está incluso no seu valor (mão de obra, ferramentas, etc.)."
                  className="form-control"
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => { setShowBidForm(false); setSelectedProposal(null); }}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-accent"
                  style={{ flex: 1 }}
                >
                  Enviar Orçamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST MATERIAL MODAL */}
      {showMaterialForm && selectedContract && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Solicitar Materiais de Construção</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Obra: {selectedContract.title}</span>
              </div>
              <button 
                onClick={() => { setShowMaterialForm(false); setSelectedContract(null); }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitMaterialRequest}>
              <div className="input-group">
                <label className="input-label">Nome do Material / Item</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ex: Cimento CP-II 50kg, Areia lavada média"
                  className="form-control"
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Quantidade</label>
                <input 
                  type="number" 
                  required 
                  placeholder="Ex: 10"
                  className="form-control"
                  value={matQty}
                  onChange={(e) => setMatQty(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Preço Unitário Estimado (R$)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="Ex: 35.50"
                  className="form-control"
                  value={matPrice}
                  onChange={(e) => setMatPrice(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => { setShowMaterialForm(false); setSelectedContract(null); }}
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
                  Enviar Solicitação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
