const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.tokenKey = 'redeobras_token';
    this.userKey = 'redeobras_user';
  }

  // Get active JWT token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Set auth data
  setAuth(token, user) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Clear auth data
  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  // Get current stored user profile
  getStoredUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Make HTTP requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Set headers
    const headers = options.headers || {};
    const token = this.getToken();
    
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token expired or invalid, clear auth
        this.clearAuth();
        // Redirect to login if on dashboard page
        if (!window.location.pathname.endsWith('/login') && window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Algo deu errado');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  // --- Auth API ---

  async register(name, email, password, role, specialty = null, hourlyRate = 0.0, bio = '', phone = '') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        specialty,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : 0,
        bio,
        phone,
        avatar_color: role === 'contratante' ? '#ef4444' : this.getRandomColor(specialty)
      })
    });
  }

  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || 'E-mail ou senha incorretos');
    }

    // Save token and user details
    const user = {
      id: data.user_id,
      name: data.name,
      email: email,
      role: data.role
    };
    
    this.setAuth(data.access_token, user);
    return user;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // --- Providers & AI Search ---

  async getProviders(query = '') {
    return this.request(`/providers?query=${encodeURIComponent(query)}`);
  }

  async searchAIProviders(prompt) {
    return this.request(`/providers/ai-search?prompt=${encodeURIComponent(prompt)}`);
  }

  // --- Proposals & Bidding ---

  async createProposal(title, description, budget) {
    return this.request('/proposals', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        budget: parseFloat(budget)
      })
    });
  }

  async getProposals(clientId = null, openOnly = false) {
    let url = '/proposals?';
    if (clientId) url += `client_id=${clientId}&`;
    if (openOnly) url += `open_only=true&`;
    return this.request(url);
  }

  async getProposal(proposalId) {
    return this.request(`/proposals/${proposalId}`);
  }

  async submitBid(proposalId, value, timeframe, message = '') {
    return this.request('/bids', {
      method: 'POST',
      body: JSON.stringify({
        proposal_id: parseInt(proposalId),
        value: parseFloat(value),
        timeframe,
        message
      })
    });
  }

  async acceptBid(bidId) {
    return this.request(`/bids/${bidId}/accept`, {
      method: 'POST'
    });
  }

  async rejectBid(bidId) {
    return this.request(`/bids/${bidId}/reject`, {
      method: 'POST'
    });
  }

  // --- Chats ---

  async startChat(providerId) {
    return this.request('/chats', {
      method: 'POST',
      body: JSON.stringify({
        provider_id: parseInt(providerId)
      })
    });
  }

  async getChats() {
    return this.request('/chats');
  }

  async getChat(roomId) {
    return this.request(`/chats/${roomId}`);
  }

  async sendMessage(roomId, text) {
    return this.request(`/chats/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  // --- Contracts & Materials ---

  async getContracts() {
    return this.request('/contracts');
  }

  async getContract(contractId) {
    return this.request(`/contracts/${contractId}`);
  }

  async getMaterialRequests() {
    return this.request('/materials/requests');
  }

  async requestMaterials(contractId, itemName, quantity, estimatedPrice) {
    return this.request(`/contracts/${contractId}/materials`, {
      method: 'POST',
      body: JSON.stringify({
        item_name: itemName,
        quantity: parseInt(quantity),
        estimated_price: parseFloat(estimatedPrice)
      })
    });
  }

  async approveMaterialRequest(reqId) {
    return this.request(`/materials/requests/${reqId}/approve`, {
      method: 'POST'
    });
  }

  async rejectMaterialRequest(reqId) {
    return this.request(`/materials/requests/${reqId}/reject`, {
      method: 'POST'
    });
  }

  // Utility colors helper
  getRandomColor(specialty) {
    const colors = {
      pedreiro: '#f97316',    // Orange
      eletricista: '#eab308', // Yellow
      pintor: '#3b82f6',      // Blue
      encanador: '#10b981',   // Emerald
      outro: '#64748b'        // Slate
    };
    return colors[specialty] || '#1e3a8a';
  }
}

export const api = new ApiService();
export default api;
