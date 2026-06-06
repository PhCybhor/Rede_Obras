# RedesObras — Mapa da Estrutura do Projeto

Projeto React + TypeScript + Vite + Tailwind CSS + shadcn/ui  
Landing page para a plataforma de conexão entre profissionais e obras civis.

---

## 📁 Visão Geral das Pastas

```
redesobras-organizado/
│
├── 📄 ESTRUTURA.md              ← Este arquivo (guia da organização)
│
├── 📂 documentacao/             ← Textos e guias do projeto
│   ├── LEIAME.md                ← Apresentação geral do projeto
│   ├── DIRETRIZES.md            ← Regras de código e boas práticas
│   └── ATRIBUICOES.md           ← Créditos de imagens e recursos externos
│
├── 📂 configuracoes/            ← Arquivos de configuração do projeto
│   ├── index.html               ← HTML raiz da aplicação
│   ├── package.json             ← Dependências e scripts npm/pnpm
│   ├── vite.config.ts           ← Configuração do Vite (bundler)
│   ├── postcss.config.mjs       ← Configuração do PostCSS (processa CSS)
│   └── pnpm-workspace.yaml      ← Configuração do workspace pnpm
│
└── 📂 src/                      ← Código-fonte da aplicação
    │
    ├── 📄 entrada-principal.tsx ← Ponto de entrada: monta o React na página
    │
    ├── 📂 estilos/              ── ESTILIZAÇÃO (tudo que é visual/CSS)
    │   ├── estilos-globais.css  ← Reset e estilos base do site
    │   ├── tema-cores.css       ← Variáveis de cores e tipografia do projeto
    │   ├── tema-shadcn-padrao.css ← Tema padrão da biblioteca shadcn/ui
    │   ├── fontes.css           ← Importação e definição das fontes
    │   ├── tailwind.css         ← Configuração das diretivas do Tailwind
    │   └── entrada-estilos.css  ← Arquivo que junta/importa os demais CSS
    │
    ├── 📂 tipos/                ── TIPAGEM (estrutura dos dados)
    │   └── tipos.ts             ← Interfaces TypeScript: NavLink, Feature, Stat…
    │
    ├── 📂 constantes/           ── DADOS ESTÁTICOS (conteúdo da página)
    │   └── constantes.ts        ← Textos, links, imagens, ícones fixos da UI
    │
    ├── 📂 hooks/                ── LÓGICA REUTILIZÁVEL (comportamentos)
    │   └── hooks.ts             ← Hooks customizados (ex: scroll, formulário)
    │
    └── 📂 paginas/              ── ESTRUTURA DA PÁGINA (componentes React)
        │
        ├── 📄 Aplicacao.tsx     ← Componente raiz: monta todas as seções
        │
        └── 📂 componentes/      ← Seções e peças visuais da página
            │
            ├── BarraNavegacao.tsx     ← Menu superior com links de navegação
            ├── SecaoPrincipal.tsx     ← Banner/hero com título e chamada principal
            ├── Funcionalidades.tsx    ← Cards com os recursos da plataforma
            ├── ComoFunciona.tsx       ← Passo a passo de uso da plataforma
            ├── Estatisticas.tsx       ← Números e métricas do produto
            ├── Depoimentos.tsx        ← Avaliações de usuários
            ├── Parceiros.tsx          ← Logos de empresas parceiras
            ├── SecaoChamadaAcao.tsx   ← Formulário/botão de cadastro (CTA)
            ├── Rodape.tsx             ← Rodapé com links e contato
            │
            ├── 📂 figma/              ← Componente auxiliar de imagens
            │   └── ImagemComFallback.tsx ← Exibe imagem com placeholder de erro
            │
            └── 📂 ui/                 ← Biblioteca de componentes shadcn/ui
                │                        (botões, cards, modais, tabelas…)
                ├── button.tsx
                ├── card.tsx
                ├── dialog.tsx
                ├── input.tsx
                ├── table.tsx
                └── … (30+ componentes prontos para uso)
```

---

## 🗂️ Lógica da Organização

| Pasta         | O que contém                                          | Quando mexer aqui                         |
|---------------|-------------------------------------------------------|-------------------------------------------|
| `estilos/`    | CSS, cores, fontes, tema visual                       | Para mudar aparência, cores ou tipografia |
| `tipos/`      | Interfaces e tipos TypeScript                         | Para adicionar novos formatos de dados    |
| `constantes/` | Textos, links, imagens hardcoded da página            | Para editar conteúdo sem tocar no código  |
| `hooks/`      | Lógica de comportamento reutilizável                  | Para adicionar interações e eventos       |
| `componentes/`| Cada seção visual da landing page                     | Para editar o layout de cada seção        |
| `ui/`         | Componentes genéricos (botão, modal, etc.)            | Raramente — são da biblioteca shadcn      |
| `configuracoes/` | Configuração de build, dependências              | Para alterar dependências ou build        |
| `documentacao/`  | Textos de referência e guias                     | Para atualizar documentação do projeto    |
