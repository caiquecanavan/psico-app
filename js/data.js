// Dados Falsos de Profissionais e Estudantes do PSICO
const MockData = {
    professionals: [
        {
            id: 'prof_001',
            name: 'Dra. Beatriz Santos',
            type: 'formed',
            crp: '06/123456',
            specialty: 'Terapia Cognitivo-Comportamental',
            approach: 'TCC',
            experience: '8 anos',
            bio: 'Psicóloga clínica com mais de 8 anos de experiência, especializada em Terapia Cognitivo-Comportamental. Focada em auxiliar adultos a superarem desafios emocionais e reencontrarem seu equilíbrio mental através de um atendimento acolhedor e baseado em evidências.',
            rating: 4.9,
            totalRatings: 128,
            sessions: 450,
            languages: ['Português', 'Inglês'],
            modalities: ['chat', 'audio', 'video'],
            price: 180.00,
            avatar: 'https://i.pravatar.cc/150?img=5',
            tags: ['Ansiedade', 'Depressão', 'TCC', 'Luto'],
            availableSlots: generateSlots(5),
            nextAvailable: 'Hoje, 14:00',
            isOnline: true,
            reviews: [
                {
                    id: 'rev_001',
                    userId: 'user_001',
                    userName: 'Marina L.',
                    userInitial: 'M',
                    rating: 5,
                    text: 'A Dra. Beatriz é extremamente empática e profissional. Comecei a terapia para tratar ansiedade e em poucos meses já percebo uma evolução incrível na minha forma de lidar com os gatilhos.',
                    date: '2024-10-15',
                    timeAgo: 'Há 2 semanas'
                },
                {
                    id: 'rev_002',
                    userId: 'user_002',
                    userName: 'João Paulo',
                    userInitial: 'J',
                    rating: 5,
                    text: 'Sempre tive receio de fazer terapia online, mas a Dra. conseguiu criar um ambiente muito seguro e confortável. Recomendo muito a abordagem de TCC dela.',
                    date: '2024-09-20',
                    timeAgo: 'Há 1 mês'
                },
                {
                    id: 'rev_003',
                    userId: 'user_003',
                    userName: 'Carla M.',
                    userInitial: 'C',
                    rating: 5,
                    text: 'Excelente profissional! Me ajudou muito com questões de ansiedade e me deu ferramentas práticas que uso no dia a dia.',
                    date: '2024-09-10',
                    timeAgo: 'Há 1 mês'
                }
            ]
        },
        {
            id: 'prof_002',
            name: 'Dr. Ricardo Menezes',
            type: 'formed',
            crp: '06/789012',
            specialty: 'Psicologia Clínica',
            approach: 'TCC',
            experience: '12 anos',
            bio: 'Psicólogo clínico com vasta experiência em atendimento a adultos e adolescentes. Especialista em TCC e terapia breve, com foco em resultados práticos e duradouros.',
            rating: 4.8,
            totalRatings: 95,
            sessions: 380,
            languages: ['Português', 'Espanhol'],
            modalities: ['chat', 'video'],
            price: 200.00,
            avatar: 'https://i.pravatar.cc/150?img=68',
            tags: ['Depressão', 'Ansiedade', 'Estresse', 'Burnout'],
            availableSlots: generateSlots(3),
            nextAvailable: 'Hoje, 16:00',
            isOnline: true,
            reviews: [
                {
                    id: 'rev_004',
                    userId: 'user_004',
                    userName: 'Paulo R.',
                    userInitial: 'P',
                    rating: 5,
                    text: 'Dr. Ricardo é muito profissional e objetivo. Em poucas sessões já senti uma grande diferença na minha qualidade de vida.',
                    date: '2024-10-10',
                    timeAgo: 'Há 3 semanas'
                }
            ]
        },
        {
            id: 'prof_003',
            name: 'Dra. Helena Vaz',
            type: 'formed',
            crp: '06/345678',
            specialty: 'Gestalt-terapia',
            approach: 'Gestalt',
            experience: '15 anos',
            bio: 'Psicóloga formada há 15 anos, com especialização em Gestalt-terapia. Trabalho focado no aqui e agora, ajudando o paciente a desenvolver autoconhecimento e resolução de conflitos internos.',
            rating: 4.9,
            totalRatings: 210,
            sessions: 600,
            languages: ['Português', 'Inglês', 'Francês'],
            modalities: ['audio', 'video'],
            price: 220.00,
            avatar: 'https://i.pravatar.cc/150?img=47',
            tags: ['Autoconhecimento', 'Relacionamentos', 'Gestalt', 'Mindfulness'],
            availableSlots: generateSlots(4),
            nextAvailable: 'Amanhã, 09:00',
            isOnline: false,
            reviews: [
                {
                    id: 'rev_005',
                    userId: 'user_005',
                    userName: 'Ana C.',
                    userInitial: 'A',
                    rating: 5,
                    text: 'A abordagem da Dra. Helena mudou minha vida. Aprendi a viver mais o presente e a lidar melhor com minhas emoções.',
                    date: '2024-10-01',
                    timeAgo: 'Há 1 mês'
                }
            ]
        },
        {
            id: 'prof_004',
            name: 'Dr. Carlos Mendes',
            type: 'formed',
            crp: '06/901234',
            specialty: 'Psicanálise',
            approach: 'Psicanálise Clássica',
            experience: '20 anos',
            bio: 'Psicanalista com 20 anos de experiência clínica. Formação em Psicanálise Clássica, com ampla experiência no tratamento de transtornos de personalidade e questões profundas do inconsciente.',
            rating: 4.7,
            totalRatings: 156,
            sessions: 800,
            languages: ['Português'],
            modalities: ['video'],
            price: 250.00,
            avatar: 'https://i.pravatar.cc/150?img=12',
            tags: ['Psicanálise', 'Personalidade', 'Inconsciente', 'Terapia Longa'],
            availableSlots: generateSlots(2),
            nextAvailable: 'Quinta, 17:00',
            isOnline: false,
            reviews: [
                {
                    id: 'rev_006',
                    userId: 'user_006',
                    userName: 'Roberto S.',
                    userInitial: 'R',
                    rating: 4,
                    text: 'Um profissional muito experiente. A psicanálise requer tempo, mas os resultados são profundos e transformadores.',
                    date: '2024-09-25',
                    timeAgo: 'Há 1 mês'
                }
            ]
        },
        {
            id: 'prof_005',
            name: 'Dra. Mariana Costa',
            type: 'formed',
            crp: '06/567890',
            specialty: 'Terapia Sistêmica',
            approach: 'Sistêmica',
            experience: '10 anos',
            bio: 'Especialista em Terapia Sistêmica, com foco em terapia familiar e de casal. Trabalho com sistemas relacionais para promover mudanças significativas nos padrões de interação.',
            rating: 5.0,
            totalRatings: 89,
            sessions: 320,
            languages: ['Português'],
            modalities: ['chat', 'audio', 'video'],
            price: 190.00,
            avatar: 'https://i.pravatar.cc/150?img=23',
            tags: ['Família', 'Casal', 'Sistêmica', 'Relacionamentos'],
            availableSlots: generateSlots(6),
            nextAvailable: 'Hoje, 18:30',
            isOnline: true,
            reviews: [
                {
                    id: 'rev_007',
                    userId: 'user_007',
                    userName: 'Lucia F.',
                    userInitial: 'L',
                    rating: 5,
                    text: 'A Dra. Mariana nos ajudou muito como casal. Sua abordagem sistêmica foi fundamental para melhorarmos nossa comunicação.',
                    date: '2024-10-05',
                    timeAgo: 'Há 3 semanas'
                }
            ]
        },
        {
            id: 'student_001',
            name: 'Lucas Mendes',
            type: 'student',
            semester: '7º Semestre',
            specialty: 'Plantão Psicológico',
            approach: 'TCC',
            bio: 'Estudante do 7º semestre de Psicologia e voluntário no projeto PSICO. Atuo sob supervisão clínica constante, aplicando as bases da Terapia Cognitivo-Comportamental para auxiliar jovens e adultos em seu processo de autoconhecimento e saúde mental.',
            rating: 4.7,
            totalRatings: 52,
            sessions: 50,
            languages: ['Português', 'Inglês'],
            modalities: ['chat', 'video'],
            price: 80.00,
            avatar: 'https://i.pravatar.cc/150?img=33',
            tags: ['Ansiedade', 'Depressão', 'TCC', 'Luto', 'Estudante'],
            availableSlots: generateSlots(8),
            nextAvailable: 'Hoje, 10:00',
            isOnline: true,
            reviews: [
                {
                    id: 'rev_008',
                    userId: 'user_008',
                    userName: 'Marina L.',
                    userInitial: 'M',
                    rating: 5,
                    text: 'O Lucas é um estudante muito dedicado. Apesar de estar em formação, demonstra uma maturidade e empatia ímpares durante as sessões supervisionadas.',
                    date: '2024-10-12',
                    timeAgo: 'Há 2 semanas'
                },
                {
                    id: 'rev_009',
                    userId: 'user_009',
                    userName: 'João Paulo',
                    userInitial: 'J',
                    rating: 5,
                    text: 'Excelente atendimento! O Lucas é muito atencioso e a supervisão garante a qualidade do serviço.',
                    date: '2024-10-08',
                    timeAgo: 'Há 3 semanas'
                }
            ]
        },
        {
            id: 'student_002',
            name: 'Ana Silva',
            type: 'student',
            semester: '8º Semestre',
            specialty: 'Terapia Cognitivo-Comportamental',
            approach: 'TCC',
            bio: 'Estudante de Psicologia no 8º semestre, com foco em TCC e atendimento a jovens adultos. Supervisionada por profissionais experientes, oferece acolhimento e técnicas baseadas em evidências.',
            rating: 4.9,
            totalRatings: 38,
            sessions: 42,
            languages: ['Português'],
            modalities: ['chat', 'audio', 'video'],
            price: 90.00,
            avatar: 'https://i.pravatar.cc/150?img=44',
            tags: ['TCC', 'Jovens Adultos', 'Ansiedade', 'Estudante'],
            availableSlots: generateSlots(7),
            nextAvailable: 'Hoje, 11:30',
            isOnline: true,
            reviews: [
                {
                    id: 'rev_010',
                    userId: 'user_010',
                    userName: 'Pedro A.',
                    userInitial: 'P',
                    rating: 5,
                    text: 'Ana é muito competente e dedicada. As sessões são muito produtivas e me sinto muito acolhido.',
                    date: '2024-10-18',
                    timeAgo: 'Há 1 semana'
                }
            ]
        },
        {
            id: 'student_003',
            name: 'Gabriel Oliveira',
            type: 'student',
            semester: '10º Semestre',
            specialty: 'Neuropsicologia',
            approach: 'Comportamental',
            bio: 'Estudante do último ano de Psicologia, com interesse em Neuropsicologia e reabilitação cognitiva. Realiza atendimentos supervisionados focados em avaliação e estimulação cognitiva.',
            rating: 4.6,
            totalRatings: 25,
            sessions: 30,
            languages: ['Português', 'Inglês'],
            modalities: ['video'],
            price: 85.00,
            avatar: 'https://i.pravatar.cc/150?img=55',
            tags: ['Neuropsicologia', 'Cognição', 'Avaliação', 'Estudante'],
            availableSlots: generateSlots(5),
            nextAvailable: 'Amanhã, 14:00',
            isOnline: false,
            reviews: [
                {
                    id: 'rev_011',
                    userId: 'user_011',
                    userName: 'Teresa M.',
                    userInitial: 'T',
                    rating: 4,
                    text: 'Gabriel é muito atencioso e demonstra muito conhecimento. A supervisão garante um bom atendimento.',
                    date: '2024-10-20',
                    timeAgo: 'Há 5 dias'
                }
            ]
        }
    ],
    
    // Conteúdo da Dashboard
    resources: [
        {
            id: 'res_001',
            title: '5 técnicas de respiração',
            description: 'Reduza a ansiedade em 3 minutos.',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400'
        },
        {
            id: 'res_002',
            title: 'Higiene do sono',
            description: 'Como dormir melhor hoje à noite.',
            image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=400'
        }
    ]
};

// Função para gerar slots de horários
function generateSlots(count) {
    const slots = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + Math.floor(Math.random() * 14));
        date.setHours(8 + Math.floor(Math.random() * 10), [0, 30][Math.floor(Math.random() * 2)], 0, 0);
        
        if (date > now) {
            slots.push({
                id: Utils.generateId(),
                date: date.toISOString(),
                available: Math.random() > 0.2 // 80% chance de estar disponível
            });
        }
    }
    
    return slots.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Inicializar dados no localStorage se não existirem
function initializeData() {
    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.APPOINTMENTS)) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.RATINGS)) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.RATINGS, JSON.stringify([]));
    }
    
    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.MOOD_HISTORY)) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.MOOD_HISTORY, JSON.stringify([]));
    }
}