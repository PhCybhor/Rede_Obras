import { Navbar } from "./componentes/BarraNavegacao";
import { Hero } from "./componentes/SecaoPrincipal";
import { Partners } from "./componentes/Parceiros";
import { Features } from "./componentes/Funcionalidades";
import { Stats } from "./componentes/Estatisticas";
import { HowItWorks } from "./componentes/ComoFunciona";
import { Testimonials } from "./componentes/Depoimentos";
import { SecaoChamadaAcao } from "./componentes/SecaoChamadaAcao";
import { Footer } from "./componentes/Rodape";

export default function App() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Partners />
        <Features />
        <Stats />
        <HowItWorks />
        <Testimonials />
        <SecaoChamadaAcao />
      </main>
      <Footer />
    </div>
  );
}
