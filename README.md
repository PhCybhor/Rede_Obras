# REDEOBRAS

Plataforma inteligente para conexão entre contratantes e prestadores de serviços da construção civil, com gerenciamento integrado de materiais de construção, propostas públicas e contratos seguros.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React.js (com Vite), CSS3 Vanilla (sem Tailwind) customizado com base no paleta de cores: **Azul, Branco e Laranja**.
- **Backend**: Python 3.13 + FastAPI.
- **Banco de Dados**: SQLAlchemy ORM configurado para **PostgreSQL** com suporte de mock a **SQLite** para execução local imediata sem necessidade de configuração prévia.

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- **Python 3.10+**
- **Node.js 18+**

---

### 2. Configurando o Backend (Python FastAPI)

Abra um terminal no diretório `backend`:

```bash
cd backend
```

1. **Crie e ative o ambiente virtual (venv)**:
   - **Windows (PowerShell/CMD)**:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```

2. **Instale as dependências**:
   ```bash
   pip install -r requirements.txt
   pip install email-validator python-jose[cryptography]
   ```

3. **Popule o Banco de Dados com Dados de Teste (Seed)**:
   Execute o script para criar a base SQLite automaticamente e inserir perfis prontos para uso (um cliente contratante e profissionais como Marcos Pedreiro, João Pintor, Roberto Eletricista e Lucas Encanador):
   ```bash
   python seed.py
   ```

4. **Inicie o Servidor Backend**:
   ```bash
   python run.py
   ```
   O backend estará ativo em: **http://localhost:8000**
   Documentação interativa das rotas (Swagger): **http://localhost:8000/docs**

---

### 3. Configurando o Frontend (React)

Abra outro terminal no diretório `frontend`:

```bash
cd frontend
```

1. **Instale as dependências do React**:
   ```bash
   npm install
   ```

2. **Inicie o Servidor do Frontend**:
   ```bash
   npm run dev
   ```
   O frontend estará ativo em: **http://localhost:5173** (ou a porta exibida no terminal).

---

## 🔑 Contas de Teste Pré-cadastradas

Para testar o fluxo de ponta a ponta sem precisar criar contas, você pode usar os seguintes acessos criados pelo `seed.py`:

### Contratante (Cliente)
- **E-mail**: `cliente@teste.com`
- **Senha**: `password123`

### Prestadores de Serviço (Profissionais)
- **Marcos Pedreiro**: `marcos.pedreiro@teste.com` / `password123`
- **João Pintor**: `joao.pintor@teste.com` / `password123`
- **Roberto Eletricista**: `roberto.eletrica@teste.com` / `password123`
- **Lucas Encanador**: `lucas.hidraulica@teste.com` / `password123`

*Dica: Você pode abrir uma aba anônima para fazer login como prestador e negociar orçamentos e aprovação de materiais com a conta de cliente na aba normal.*

---

## 🐘 Como Mudar para o Banco de Dados PostgreSQL

Quando você estiver pronto para subir com o banco **PostgreSQL**, siga estes passos simples:

1. **Abra o arquivo de configuração do backend**:
   Vá até `backend/.env`.

2. **Edite a URL do Banco de Dados**:
   Substitua a linha:
   ```env
   DATABASE_URL=sqlite:///./redeobras.db
   ```
   Pela URL de conexão do seu PostgreSQL local ou de produção:
   ```env
   DATABASE_URL=postgresql://usuario_postgres:senha_postgres@localhost:5432/nome_banco
   ```

3. **Crie a Base de Dados no PostgreSQL**:
   Certifique-se de que a database correspondente ao `nome_banco` já está criada no seu servidor PostgreSQL.

4. **Execute o Seed para Recriar as Tabelas**:
   Execute novamente no terminal do backend com o ambiente virtual ativo:
   ```bash
   python seed.py
   ```
   O SQLAlchemy detectará a nova conexão e criará automaticamente todas as tabelas e relacionamentos direto no seu PostgreSQL, populando-o com os dados iniciais.
   
5. Rode o servidor backend normalmente (`python run.py`). Nenhuma alteração no código Python ou React será necessária!
