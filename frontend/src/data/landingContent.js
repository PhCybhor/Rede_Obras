import { SearchIcon, BoxIcon, FileIcon, ChatIcon, UserIcon, ToolsIcon } from '../components/Icons';

export const OFFERINGS = [
  {
    icon: SearchIcon,
    title: 'IA de Match Perfeito',
    desc: 'Descreva em linguagem natural o que precisa e nossa IA mapeia os profissionais ideais na sua região em segundos.',
    accent: 'rgba(59, 130, 246, 0.4)',
    iconStyle: { background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: 'var(--primary-light)' },
  },
  {
    icon: BoxIcon,
    title: 'Gestão de Materiais',
    desc: 'O prestador solicita insumos pelo painel. O contratante revisa quantidade, valores e aprova ou recusa com um clique.',
    accent: 'rgba(249, 115, 22, 0.4)',
    iconStyle: { background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)', color: 'var(--accent)' },
  },
  {
    icon: FileIcon,
    title: 'Contratos Digitais',
    desc: 'Formalize propostas com segurança jurídica. Publique demandas, receba orçamentos e aceite o melhor para o seu bolso.',
    accent: 'rgba(16, 185, 129, 0.4)',
    iconStyle: { background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)' },
  },
  {
    icon: ChatIcon,
    title: 'Chat Integrado',
    desc: 'Negocie diretamente com profissionais dentro da plataforma, com histórico completo de conversas por obra.',
    accent: 'rgba(139, 92, 246, 0.4)',
    iconStyle: { background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', color: '#a78bfa' },
  },
  {
    icon: ToolsIcon,
    title: 'Propostas Públicas',
    desc: 'Publique sua demanda e receba múltiplos orçamentos de prestadores qualificados para comparar e escolher.',
    accent: 'rgba(236, 72, 153, 0.4)',
    iconStyle: { background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', color: '#f472b6' },
  },
  {
    icon: UserIcon,
    title: 'Painéis Dedicados',
    desc: 'Áreas exclusivas para contratantes e prestadores, com dashboards completos para gerenciar obras e serviços.',
    accent: 'rgba(14, 165, 233, 0.4)',
    iconStyle: { background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)', color: '#38bdf8' },
  },
];

export const FAQ_OFICIAL = [
  {
    q: 'O que é a REDEOBRAS?',
    a: 'A REDEOBRAS é uma plataforma digital que conecta contratantes com prestadores de serviço qualificados da construção civil, utilizando inteligência artificial para garantir o melhor match entre profissional e demanda.',
  },
  {
    q: 'Como funciona o Match com IA?',
    a: 'Você descreve em linguagem natural o que precisa e nossa inteligência artificial analisa sua demanda, mapeando automaticamente os profissionais mais qualificados e disponíveis na sua região.',
  },
  {
    q: 'Os contratos digitais têm validade jurídica?',
    a: 'Sim. Todos os contratos gerados pela plataforma seguem as normas da legislação brasileira para contratos digitais, garantindo segurança jurídica para ambas as partes envolvidas.',
  },
  {
    q: 'Como faço para usar a plataforma?',
    a: 'Crie sua conta como contratante ou prestador e acesse o painel completo. Se a plataforma ainda não estiver aberta na sua região, faça o pré-cadastro na nossa página de lista de espera.',
  },
];

export const FAQ_PREREGISTRO = [
  {
    q: 'O que é a REDEOBRAS?',
    a: 'A REDEOBRAS é uma plataforma digital que conecta contratantes (pessoas que precisam de serviços de construção) com prestadores de serviço qualificados, utilizando inteligência artificial para garantir o melhor match entre profissional e demanda.',
  },
  {
    q: 'Como funciona o Match com IA?',
    a: 'Você descreve em linguagem natural o que precisa (ex: "preciso consertar um vazamento no banheiro") e nossa inteligência artificial analisa sua demanda, mapeando automaticamente os profissionais mais qualificados e disponíveis na sua região.',
  },
  {
    q: 'O pré-cadastro é gratuito?',
    a: 'Sim! O pré-cadastro é 100% gratuito e sem compromisso. Ao se cadastrar, você garante acesso prioritário e benefícios exclusivos quando a plataforma for lançada oficialmente.',
  },
  {
    q: 'Quando a plataforma será lançada?',
    a: 'Estamos em fase final de homologação. O lançamento oficial está previsto para breve. Ao realizar o pré-cadastro, você será notificado por e-mail assim que a plataforma estiver disponível.',
  },
  {
    q: 'Os contratos digitais têm validade jurídica?',
    a: 'Sim. Todos os contratos gerados pela plataforma seguem as normas da legislação brasileira para contratos digitais, garantindo segurança jurídica para ambas as partes envolvidas.',
  },
  {
    q: 'Meus dados estão seguros?',
    a: 'Sim. Seus dados são armazenados com segurança e utilizados apenas para contato sobre o lançamento, conforme a LGPD.',
  },
];

export const PREREGISTRO_URL = import.meta.env.VITE_PREREGISTRO_URL || '';
export const OFICIAL_URL = import.meta.env.VITE_OFICIAL_URL || '';
