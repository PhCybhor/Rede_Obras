# RedesObras - Python Backend API

Estrutura de backend em Python (FastAPI) configurada e pronta para desenvolvimento.

## Estrutura do Projeto

```
backend/
├── main.py                     # Ponto de entrada da aplicação FastAPI
├── requirements.txt            # Dependências Python
├── .env.example                # Configuração de variáveis de ambiente
└── app/
    ├── config.py               # Configurações gerais da aplicação
    ├── database.py             # Conexão com banco de dados
    ├── models/                 # Modelos ORM (Ex: SQLAlchemy)
    ├── schemas/                # Modelos de validação (Pydantic)
    ├── routers/                # Endpoints e rotas da API
    ├── services/               # Lógica de negócio / Serviços
    └── tests/                  # Testes unitários e de integração
```

## Como Iniciar

1. Crie um ambiente virtual:
   ```bash
   python -m venv .venv
   ```

2. Ative o ambiente virtual:
   - Windows: `.venv\Scripts\activate`
   - Linux/Mac: `source .venv/bin/activate`

3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

4. Copie o arquivo `.env.example` para `.env` e configure suas variáveis.

5. Inicie o servidor de desenvolvimento:
   ```bash
   uvicorn main:app --reload
   ```
