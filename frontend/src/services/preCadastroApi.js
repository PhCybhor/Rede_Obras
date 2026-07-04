const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class PreCadastroApi {
  async submit(data) {
    const payload = {
      nome: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      telefone: data.phone?.trim() || null,
      cargo: data.role || null,
      interesse: data.interest?.trim() || null,
      role: data.role,
      website: data.website || '',
      consentimento_lgpd: data.consentimento_lgpd === true,
    };

    const response = await fetch(`${API_BASE_URL}/pre-cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let body = {};
    try {
      body = await response.json();
    } catch {
      body = { detail: 'Resposta inválida do servidor' };
    }

    if (!response.ok) {
      const detail = body.detail;
      const message = typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((e) => e.msg).join(', ')
          : 'Não foi possível enviar o pré-cadastro. Tente novamente.';
      throw new Error(message);
    }

    return body;
  }
}

export const preCadastroApi = new PreCadastroApi();
export default preCadastroApi;
