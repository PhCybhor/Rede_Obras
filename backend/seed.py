from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app import models, crud
from app.schemas import UserCreate, ProposalCreate, BidCreate

def seed_db():
    # Create tables if not exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if we already have users seeded
        existing_users = db.query(models.User).count()
        if existing_users > 0:
            print("Database already seeded with users. Skipping seeding.")
            return

        print("Seeding database...")
        
        # 1. Create Contratante
        client = UserCreate(
            name="Carlos Silva",
            email="cliente@teste.com",
            password="password123",
            role="contratante",
            bio="Proprietário residencial buscando reformar minha casa.",
            avatar_color="#ef4444",
            phone="(11) 98765-4321"
        )
        db_client = crud.create_user(db, client)
        print(f"Created Contratante: {db_client.name}")

        # 2. Create Pedreiro
        pedreiro = UserCreate(
            name="Marcos Pedreiro",
            email="marcos.pedreiro@teste.com",
            password="password123",
            role="prestador",
            specialty="pedreiro",
            hourly_rate=55.00,
            bio="Construção do alicerce ao acabamento. Assentamento de tijolos, reboco, contrapiso, lajes e colocação de pisos e revestimentos.",
            avatar_color="#f97316",
            phone="(11) 91111-2222"
        )
        db_pedreiro = crud.create_user(db, pedreiro)
        # Update default rating
        db_pedreiro.rating = 4.9
        print(f"Created Pedreiro: {db_pedreiro.name}")

        # 3. Create Pintor
        pintor = UserCreate(
            name="João Pintor",
            email="joao.pintor@teste.com",
            password="password123",
            role="prestador",
            specialty="pintor",
            hourly_rate=38.00,
            bio="Especialista em pintura de fachadas, interiores, texturas, grafiato e aplicação de massa corrida. Foco na limpeza e qualidade do acabamento.",
            avatar_color="#3b82f6",
            phone="(11) 93333-4444"
        )
        db_pintor = crud.create_user(db, pintor)
        db_pintor.rating = 4.8
        print(f"Created Pintor: {db_pintor.name}")

        # 4. Create Eletricista
        eletricista = UserCreate(
            name="Roberto Eletricista",
            email="roberto.eletrica@teste.com",
            password="password123",
            role="prestador",
            specialty="eletricista",
            hourly_rate=48.00,
            bio="Instalações elétricas residenciais novas, substituição de fiação antiga, instalação de disjuntores, tomadas, interruptores e luminárias.",
            avatar_color="#eab308",
            phone="(11) 95555-6666"
        )
        db_eletricista = crud.create_user(db, eletricista)
        db_eletricista.rating = 4.7
        print(f"Created Eletricista: {db_eletricista.name}")

        # 5. Create Encanador
        encanador = UserCreate(
            name="Lucas Encanador",
            email="lucas.hidraulica@teste.com",
            password="password123",
            role="prestador",
            specialty="encanador",
            hourly_rate=42.00,
            bio="Localização e conserto de vazamentos, infiltrações e entupimentos. Instalação e manutenção de redes de água e esgoto.",
            avatar_color="#10b981",
            phone="(11) 97777-8888"
        )
        db_encanador = crud.create_user(db, encanador)
        db_encanador.rating = 4.6
        print(f"Created Encanador: {db_encanador.name}")

        # 6. Create a Proposal (Carlos Silva needs an electricist)
        prop = ProposalCreate(
            title="Troca de fiação de casa antiga",
            description="Preciso trocar a fiação elétrica de uma casa antiga com 3 quartos. Fios antigos de tecido, aquecimento nos chuveiros está caindo o disjuntor. Preciso de redimensionamento completo.",
            budget=2500.00
        )
        db_prop = crud.create_proposal(db, prop, client_id=db_client.id)
        print(f"Created Proposal: '{db_prop.title}' by Carlos Silva")

        # 7. Create a Bid on that Proposal (Roberto Eletricista bids on it)
        bid = BidCreate(
            proposal_id=db_prop.id,
            value=2300.00,
            timeframe="4 dias",
            message="Olá Carlos! Tenho experiência em reformas elétricas desse tipo. Posso fazer o redimensionamento dos cabos, troca do padrão de entrada e instalação do quadro de distribuição novo com DR para segurança de sua família. Fecho por R$ 2300,00 e posso começar na segunda-feira."
        )
        db_bid = crud.create_bid(db, bid, provider_id=db_eletricista.id)
        print(f"Created Bid: Roberto Eletricista bid R$ {db_bid.value} on '{db_prop.title}'")

        db.commit()
        print("Database successfully seeded!")
        
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
