# Checklist de Lançamento — REDEOBRAS

> **Estratégia:** lançar primeiro a **landing de pré-registro** (Fase 1). A plataforma completa (Fase 2) fica para depois.

---

## Fase 1 — Pré-Registro (lançamento imediato)

Landing dedicada + API mínima segura. Sem login, dashboards ou pagamentos.

### Arquivos da Fase 1

| Arquivo | Função |
|---------|--------|
| `frontend/src/pages/LandingPreRegistro.jsx` | **Landing de pré-registro** — só formulário e lista de espera |
| `frontend/src/pages/LandingOficial.jsx` | **Landing oficial** — site da plataforma (login, features, sem formulário) |
| `frontend/src/data/landingContent.js` | Conteúdo compartilhado (features, FAQs) |
| `frontend/index.html` + `main.jsx` | Build **oficial** (plataforma completa) |
| `frontend/index-preregistro.html` + `mainPreRegistro.jsx` | Build **pré-registro** (landing isolada) |
| `frontend/vite.config.preregistro.js` | Config Vite separada |
| `backend/app/main_preregistro.py` | API mínima (só `/api/pre-cadastro` + `/api/health`) |
| `backend/app/preregistro_service.py` | Validação, rate limit e honeypot |
| `backend/run_preregistro.py` | Servidor da API de pré-registro |

### Como rodar localmente (Fase 1)

```bash
# Backend de pré-registro
cd backend
venv\Scripts\activate
python run_preregistro.py

# Landing de PRÉ-REGISTRO (porta 5174)
cd frontend
npm run dev:preregistro

# Site OFICIAL + plataforma (porta 5173) — outro terminal
cd frontend
npm run dev
```

| Landing | Comando | URL | Deploy |
|---------|---------|-----|--------|
| **Pré-registro** | `npm run dev:preregistro` | http://localhost:5174 | `npm run build:preregistro` → `dist-preregistro/` |
| **Oficial** | `npm run dev` | http://localhost:5173 | `npm run build` → `dist/` |

---

### P0 — Bloqueadores (Fase 1)

#### Segurança do pré-cadastro

- [x] API mínima separada (`main_preregistro.py`) — sem rotas de auth/propostas/chat
- [x] Rate limit por IP (5 req/hora configurável)
- [x] Honeypot anti-bot (campo `website` oculto)
- [x] Validação de campos (tamanho, e-mail, perfil)
- [x] Consentimento LGPD obrigatório no formulário
- [x] Resposta genérica (não revela se e-mail já existe)
- [x] CORS restrito via `ALLOWED_ORIGINS` (não `*`)
- [x] Swagger desabilitado em `ENV=production`
- [ ] Configurar `ALLOWED_ORIGINS` com domínio real antes do deploy
- [ ] Configurar `VITE_API_URL` apontando para API de produção
- [ ] HTTPS (certificado SSL) no domínio e na API
- [ ] Migrar banco para **PostgreSQL** em produção
- [ ] Backup automático do PostgreSQL

#### Deploy (Fase 1)

- [ ] Hospedar `dist-preregistro/` (Vercel, Netlify, Cloudflare Pages ou nginx)
- [ ] Hospedar API com `python run_preregistro.py` (Railway, Render, VPS)
- [ ] Domínio configurado (`redeobras.com.br`)
- [ ] Variáveis de ambiente de produção (ver `.env.preregistro.example`)

---

### P1 — Qualidade (Fase 1)

#### Legal / LGPD

- [ ] Redigir **Política de Privacidade** (texto real no footer)
- [ ] Redigir **Termos de Uso** (opcional nesta fase, recomendado)
- [ ] Link funcional para política no checkbox do formulário

#### SEO / Marketing

- [ ] `robots.txt`
- [ ] `sitemap.xml`
- [ ] Imagem Open Graph (`og:image`)
- [ ] URL canônica no `index-preregistro.html`
- [ ] Analytics básico (GA4 ou Plausible)

#### Operacional

- [ ] Exportar/visualizar leads do pré-cadastro (planilha ou painel admin simples)
- [ ] E-mail de confirmação ao usuário (SMTP) — opcional, mas recomendado
- [ ] Monitoramento de uptime (`/api/health`)

---

### Já pronto na Fase 1

- [x] Landing de pré-registro responsiva (hero, features, FAQ, formulário, footer)
- [x] Formulário com validação frontend + backend
- [x] Botões "Sou Contratante" / "Quero Trabalhar" levam ao cadastro
- [x] Sem botão "Entrar no Sistema" (plataforma ainda fechada)
- [x] Build separado (`npm run build:preregistro`)
- [x] API enxuta sem expor endpoints sensíveis
- [x] `.env.preregistro.example` (backend e frontend)

---

## Fase 2 — Plataforma Completa (depois do pré-registro)

> Não é necessário para o lançamento do pré-registro. Retomar quando for abrir login e dashboards.

### P0 — Bloqueadores (Fase 2)

- [ ] Corrigir import JWT no backend (`from jose import jwt, JWTError`)
- [ ] Completar `requirements.txt`
- [ ] Trocar `SECRET_KEY` fixa por variável segura
- [ ] Proteger `GET /api/proposals` (hoje público)
- [ ] Remover contas de teste de produção
- [ ] Migrations com Alembic
- [ ] Docker + docker-compose
- [ ] CI/CD

### P1 — Produto (Fase 2)

- [ ] React Router com URLs reais
- [ ] Destravar login/registro na landing completa
- [ ] Salvar perfil do prestador (`PUT /api/users/me`)
- [ ] Recuperação de senha
- [ ] Página 404
- [ ] Error Boundary global

### P2 — Diferenciais (Fase 2+)

- [ ] Contratos digitais com assinatura
- [ ] Pagamentos (Pix, gateway)
- [ ] Busca com IA real
- [ ] Chat WebSocket
- [ ] Painel admin de leads
- [ ] Testes automatizados (pytest + Vitest)

---

## Ordem de execução

```
FASE 1 — PRÉ-REGISTRO
1. Configurar domínio + HTTPS
2. PostgreSQL + deploy da API (run_preregistro.py)
3. Build e deploy da landing (npm run build:preregistro)
4. Política de Privacidade + analytics
5. Lançamento público do pré-cadastro
        ↓
FASE 2 — PLATAFORMA
6. Corrigir segurança da API completa
7. Deploy full stack (auth + dashboards)
8. Pagamentos + contratos digitais
```

**Estimativa Fase 1:** 3–7 dias (com domínio e hospedagem definidos).  
**Estimativa Fase 2:** +2–4 semanas após Fase 1.

---

*Última atualização: julho/2026*
