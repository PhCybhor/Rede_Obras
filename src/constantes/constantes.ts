

import {
  Network,
  FileSearch,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
  UserPlus,
  Search,
  Handshake,
  BarChart3,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import type {
  NavLink,
  Partner,
  Feature,
  Stat,
  Step,
  Testimonial,
  FormField,
  FooterLinkGroup,
  ContactItem,
} from "../tipos/tipos";

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1746364742672-c6383331b032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwaW5mcmFzdHJ1Y3R1cmUlMjBjaXZpbCUyMGVuZ2luZWVyaW5nJTIwbW9kZXJufGVufDF8fHx8MTc4MDM3MDQ2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  engineer:
    "https://images.unsplash.com/photo-1716037991590-c975184b37df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwaW5mcmFzdHJ1Y3R1cmUlMjBjaXZpbCUyMGVuZ2luZWVyaW5nJTIwbW9kZXJufGVufDF8fHx8MTc4MDM3MDQ2OXww&ixlib=rb-4.1.0&q=80&w=1080",
  blueprint:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBibHVlcHJpbnQlMjBlbmdpbmVlcmluZyUyMHRlYW0lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzgwMzcwNDczfDA&ixlib=rb-4.1.0&q=80&w=1080",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Início", href: "#inicio" },
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

export const HERO_HIGHLIGHTS: string[] = [
  "Cadastro 100% gratuito",
  "Mais de 12.000 empresas parceiras",
  "Suporte especializado",
];

export const HERO_STATS = [
  { value: "12K+", label: "Empresas cadastradas", color: "#1B56F0" },
  { value: "R$2B+", label: "Em obras gerenciadas", color: "#F59E0B" },
  { value: "98%", label: "Taxa de satisfação", color: "#22C55E" },
  { value: "350+", label: "Cidades atendidas", color: "#A855F7" },
] as const;

export const PARTNERS: Partner[] = [
  { name: "Constroenge" },
  { name: "MRV" },
  { name: "Cyrela" },
  { name: "Even" },
  { name: "Tenda" },
  { name: "Direcional" },
  { name: "Lavvi" },
  { name: "Mitre" },
];

export const FEATURES: Feature[] = [
  {
    icon: Network,
    color: "#1B56F0",
    bg: "rgba(27,86,240,0.1)",
    title: "Rede Inteligente",
    description:
      "Conecte-se automaticamente com fornecedores, empreiteiros e profissionais qualificados próximos às suas obras.",
  },
  {
    icon: FileSearch,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    title: "Gestão de Licitações",
    description:
      "Acompanhe editais, envie propostas e gerencie licitações públicas e privadas em um só lugar.",
  },
  {
    icon: ShieldCheck,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.1)",
    title: "Verificação de Empresas",
    description:
      "Todas as empresas são verificadas com CNPJ, certidões e histórico de obras para sua segurança.",
  },
  {
    icon: TrendingUp,
    color: "#A855F7",
    bg: "rgba(168,85,247,0.1)",
    title: "Análise de Mercado",
    description:
      "Dashboards com indicadores de mercado, tendências de preços e benchmarks por região.",
  },
  {
    icon: Users,
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.1)",
    title: "Equipe Colaborativa",
    description:
      "Gerencie sua equipe, atribua tarefas e acompanhe o progresso de cada obra em tempo real.",
  },
  {
    icon: Zap,
    color: "#F97316",
    bg: "rgba(249,115,22,0.1)",
    title: "Automação de Processos",
    description:
      "Automatize orçamentos, contratos e relatórios com inteligência artificial integrada.",
  },
];

export const STATS: Stat[] = [
  {
    value: 12000,
    suffix: "+",
    label: "Empresas cadastradas",
    description: "Construtoras, fornecedores e profissionais",
  },
  {
    value: 2,
    suffix: "B+",
    prefix: "R$",
    label: "Em obras gerenciadas",
    description: "Volume total de contratos na plataforma",
  },
  {
    value: 350,
    suffix: "+",
    label: "Cidades atendidas",
    description: "Presença em todo o território nacional",
  },
  {
    value: 98,
    suffix: "%",
    label: "Taxa de satisfação",
    description: "NPS dos nossos clientes ativos",
  },
];

export const STEPS: Step[] = [
  {
    number: "01",
    icon: UserPlus,
    color: "#1B56F0",
    title: "Cadastre sua empresa",
    description:
      "Crie sua conta gratuita em menos de 5 minutos. Informe CNPJ, área de atuação e portfólio de obras.",
  },
  {
    number: "02",
    icon: Search,
    color: "#F59E0B",
    title: "Explore oportunidades",
    description:
      "Acesse um catálogo de licitações, fornecedores e parceiros filtrados por região, segmento e porte.",
  },
  {
    number: "03",
    icon: Handshake,
    color: "#22C55E",
    title: "Conecte e negocie",
    description:
      "Entre em contato direto com empresas verificadas, envie propostas e feche negócios com segurança.",
  },
  {
    number: "04",
    icon: BarChart3,
    color: "#A855F7",
    title: "Acompanhe resultados",
    description:
      "Monitore o desempenho das suas obras, contratos ativos e indicadores de crescimento.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Carlos Eduardo Mendes",
    role: "CEO, Construtora Mendes & Filhos",
    avatar: "CM",
    color: "#1B56F0",
    rating: 5,
    text: "A RedesObras transformou completamente nossa forma de prospectar fornecedores. Em 3 meses, reduzimos custos em 18% e aumentamos nossa carteira de parceiros em 60%. Plataforma indispensável.",
  },
  {
    name: "Fernanda Oliveira",
    role: "Gerente de Projetos, Constroenge",
    avatar: "FO",
    color: "#F59E0B",
    rating: 5,
    text: "A gestão de licitações ficou muito mais eficiente. Antes perdíamos editais por falta de organização. Hoje, temos alertas automáticos e nunca mais perdemos uma oportunidade importante.",
  },
  {
    name: "Ricardo Almeida",
    role: "Diretor Comercial, Almeida Incorporadora",
    avatar: "RA",
    color: "#22C55E",
    rating: 5,
    text: "Fechamos 4 contratos significativos nos primeiros 2 meses de uso. A verificação de empresas parceiras dá uma segurança enorme. Recomendo para qualquer empresa do setor.",
  },
  {
    name: "Ana Paula Costa",
    role: "Fundadora, APC Engenharia",
    avatar: "AC",
    color: "#A855F7",
    rating: 5,
    text: "Como pequena construtora, ter acesso à mesma rede de fornecedores das grandes empresas foi um divisor de águas. O custo-benefício é excelente e o suporte é sempre atencioso.",
  },
  {
    name: "Marcelo Ferreira",
    role: "Sócio, MF Construções",
    avatar: "MF",
    color: "#06B6D4",
    rating: 5,
    text: "Os dashboards de mercado são incríveis para tomada de decisão. Conseguimos identificar tendências de preços e nos posicionar melhor nas negociações. Ferramenta estratégica.",
  },
  {
    name: "Juliana Santos",
    role: "Engenheira Civil, JS Projetos",
    avatar: "JS",
    color: "#F97316",
    rating: 5,
    text: "A automação de orçamentos economiza horas do meu dia. O que antes levava 2 dias agora faço em menos de 1 hora. A qualidade da plataforma é notável.",
  },
];

export const CTA_FORM_FIELDS: FormField[] = [
  { label: "Nome completo", placeholder: "João Silva", type: "text" },
  { label: "E-mail corporativo", placeholder: "joao@empresa.com.br", type: "email" },
  { label: "CNPJ da empresa", placeholder: "00.000.000/0001-00", type: "text" },
  { label: "Telefone (WhatsApp)", placeholder: "(11) 99999-9999", type: "tel" },
];

export const CTA_PERKS: string[] = [
  "Sem cartão de crédito",
  "Acesso completo por 30 dias",
  "Cancele quando quiser",
];

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    category: "Plataforma",
    links: ["Funcionalidades", "Preços", "Integrações", "API", "Atualizações"],
  },
  {
    category: "Empresa",
    links: ["Sobre nós", "Blog", "Carreiras", "Imprensa", "Parceiros"],
  },
  {
    category: "Suporte",
    links: ["Central de Ajuda", "Documentação", "Status", "Contato", "Comunidade"],
  },
  {
    category: "Legal",
    links: ["Termos de Uso", "Privacidade", "Cookies", "LGPD", "Segurança"],
  },
];

export const FOOTER_CONTACT_ITEMS: ContactItem[] = [
  { icon: Mail, text: "contato@redesobras.com.br" },
  { icon: Phone, text: "(11) 4002-8922" },
  { icon: MapPin, text: "São Paulo, SP — Brasil" },
];
