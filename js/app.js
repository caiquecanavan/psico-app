// PSICO - Aplicação Principal

// Componentes Compartilhados
class UIComponents {
    static professionalCard(professional) {
        return `
            <div class="fade-in" style="background: white; border-radius: 16px; padding: 24px; margin-bottom: 16px; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.04);" 
                 onclick="viewProfessional('${professional.id}')">
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div style="position: relative;">
                        <img src="${professional.avatar}" alt="${professional.name}" 
                             style="width: 64px; height: 64px; border-radius: 16px; object-fit: cover;"
                             onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:64px;height:64px;background:linear-gradient(135deg,#002271,#0B369B);border-radius:16px;display:flex;align-items:center;justify-content:center;color:white;font-size:28px;font-weight:700;\\'>${professional.name.charAt(0)}</div>'">
                        ${professional.isOnline ? '<div style="position:absolute;bottom:0;right:0;width:14px;height:14px;background:#10b981;border:3px solid white;border-radius:50%;"></div>' : ''}
                    </div>
                    <div style="flex:1;">
                        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                            <div>
                                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                                    <h3 style="font-size:16px;font-weight:700;color:#1e293b;">${professional.name}</h3>
                                    ${professional.type === 'student' ? '<span style="font-size:11px;padding:2px 10px;background:#eff6ff;color:#002271;border-radius:12px;font-weight:600;">Estudante</span>' : `<span style="font-size:12px;color:#64748b;">CRP ${professional.crp}</span>`}
                                </div>
                                <p style="font-size:14px;color:#64748b;">${professional.specialty}</p>
                            </div>
                            <div style="display:flex;align-items:center;gap:4px;background:#fffbeb;padding:4px 10px;border-radius:20px;">
                                <span class="material-symbols-outlined filled-icon" style="font-size:16px;color:#f59e0b;">star</span>
                                <span style="font-weight:600;font-size:14px;color:#1e293b;">${professional.rating}</span>
                            </div>
                        </div>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
                            ${professional.tags.slice(0,3).map(tag => `<span style="font-size:11px;padding:2px 10px;background:#f1f5f9;color:#475569;border-radius:12px;">${tag}</span>`).join('')}
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <span style="font-size:10px;text-transform:uppercase;color:#94a3b8;font-weight:600;">Próxima Vaga</span>
                                <p style="font-size:14px;font-weight:600;color:#002271;">${professional.nextAvailable}</p>
                            </div>
                            <button onclick="event.stopPropagation();scheduleAppointment('${professional.id}')" 
                                    style="padding:10px 20px;background:linear-gradient(135deg,#002271,#0B369B);color:white;border:none;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;">
                                Agendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    static appointmentCard(appointment, isPast = false) {
        const details = scheduling.formatAppointmentDetails(appointment);
        return `
            <div class="fade-in" style="background:white;border-radius:16px;padding:20px;margin-bottom:12px;${isPast ? 'opacity:0.7;' : ''}">
                <div style="display:flex;align-items:center;gap:16px;">
                    <img src="${appointment.professionalAvatar}" style="width:48px;height:48px;border-radius:12px;object-fit:cover;">
                    <div style="flex:1;">
                        <div style="display:flex;justify-content:space-between;">
                            <div>
                                <h4 style="font-weight:600;color:#1e293b;">${appointment.professionalName}</h4>
                                <p style="font-size:13px;color:#64748b;">${appointment.professionalSpecialty}</p>
                            </div>
                            <span style="font-size:11px;padding:4px 10px;border-radius:20px;font-weight:600;${appointment.status === 'confirmed' ? 'background:#f0fdf4;color:#16a34a;' : 'background:#fffbeb;color:#d97706;'}">
                                ${appointment.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                            </span>
                        </div>
                        <div style="display:flex;gap:16px;margin-top:8px;font-size:13px;color:#475569;">
                            <span>📅 ${details.date}</span>
                            <span>🕐 ${details.time}</span>
                        </div>
                    </div>
                </div>
            </div>`;
    }
}

// Funções Globais
function viewProfessional(id) { router.navigate(`/professional/${id}`); }
function scheduleAppointment(id) {
    if (!auth.isLoggedIn()) { Utils.showToast('Faça login para agendar', 'error'); router.navigate('/login'); return; }
    router.navigate(`/schedule/${id}`);
}

// Filtros
let activeFilters = { availability: false, type: 'all', modality: 'all', searchTerm: '', sortBy: 'rating' };

function handleSearch() {
    const input = document.getElementById('searchInput');
    if (input) { activeFilters.searchTerm = input.value; applyFilters(); }
}

function toggleFilter(type, value) {
    if (type === 'availability') activeFilters.availability = !activeFilters.availability;
    else if (type === 'type') activeFilters.type = activeFilters.type === value ? 'all' : value;
    else if (type === 'modality') activeFilters.modality = activeFilters.modality === value ? 'all' : value;
    applyFilters();
    updateFilterButtons();
}

function updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const ft = btn.dataset.filterType;
        const fv = btn.dataset.filterValue;
        btn.classList.remove('active');
        if (ft === 'availability' && activeFilters.availability) btn.classList.add('active');
        else if (ft === 'type' && activeFilters.type === fv) btn.classList.add('active');
        else if (ft === 'modality' && activeFilters.modality === fv) btn.classList.add('active');
    });
}

function applyFilters() {
    const results = searchSystem.search(activeFilters);
    const container = document.getElementById('searchResults');
    if (!container) return;
    if (results.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px;"><p style="color:#94a3b8;">Nenhum profissional encontrado</p></div>';
    } else {
        container.innerHTML = `<p style="margin-bottom:16px;color:#64748b;"><strong>${results.length}</strong> profissional(is) encontrado(s)</p>` + results.map(p => UIComponents.professionalCard(p)).join('');
    }
}

function sortResults(sortBy) { activeFilters.sortBy = sortBy; applyFilters(); }

// Mood
function saveMood(index) {
    profileSystem.saveMood(index);
    Utils.showToast('Humor registrado! 💙');
    document.querySelectorAll('.mood-btn').forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });
}

// Handlers
function handleLogin(event) {
    event.preventDefault();
    const result = auth.login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
    if (result.success) { Utils.showToast('Login realizado!'); setTimeout(() => router.navigate('/dashboard'), 500); }
    else Utils.showToast(result.error, 'error');
}

function handleRegister(event) {
    event.preventDefault();
    const data = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        cpf: document.getElementById('regCPF').value.replace(/[^\d]/g, ''),
        birthDate: document.getElementById('regBirthDate').value,
        password: document.getElementById('regPassword').value,
        confirmPassword: document.getElementById('regConfirmPassword').value,
        isStudent: document.getElementById('regIsStudent')?.checked || false
    };
    const result = auth.register(data);
    if (result.success) { Utils.showToast('Conta criada!'); setTimeout(() => router.navigate('/dashboard'), 500); }
    else Utils.showToast(result.error, 'error');
}

function handleGoogleLogin() { Utils.showToast('Em breve!'); }
function handleLogout() { if (confirm('Sair?')) { auth.logout(); router.navigate('/login'); } }

function cancelAppointment(id) {
    if (confirm('Cancelar agendamento?')) {
        scheduling.cancelAppointment(id);
        Utils.showToast('Cancelado!');
        router.navigate('/appointments');
    }
}

// Rating
let selectedRating = 0;
function setRating(r) {
    selectedRating = r;
    document.querySelectorAll('#ratingStars .star-rating').forEach((s, i) => {
        s.style.color = i < r ? '#f59e0b' : '#cbd5e0';
        s.classList.toggle('filled-icon', i < r);
    });
}

function submitReview(profId) {
    if (!selectedRating) return Utils.showToast('Selecione estrelas', 'error');
    const text = document.getElementById('reviewText')?.value;
    if (!text?.trim()) return Utils.showToast('Escreva um comentário', 'error');
    const result = searchSystem.saveRating(profId, selectedRating, text);
    if (result.success) { Utils.showToast('Avaliado! ⭐'); setTimeout(() => router.navigate(`/professional/${profId}`), 1000); }
    else Utils.showToast(result.error, 'error');
}

// Páginas de Autenticação
function renderLoginPage() {
    document.getElementById('app').innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#002271,#0B369B);padding:40px;">
            <div style="width:100%;max-width:440px;background:white;border-radius:24px;padding:40px;">
                <div style="text-align:center;margin-bottom:32px;">
                    <span class="material-symbols-outlined filled-icon" style="font-size:48px;color:#002271;">psychology_alt</span>
                    <h1 style="font-size:28px;font-weight:700;color:#1e293b;margin-top:12px;">Bem-vindo</h1>
                </div>
                <form onsubmit="handleLogin(event)" style="display:flex;flex-direction:column;gap:16px;">
                    <div>
                        <label style="font-size:13px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">E-mail</label>
                        <input type="email" id="loginEmail" required style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;" placeholder="exemplo@psico.com.br">
                    </div>
                    <div>
                        <label style="font-size:13px;font-weight:600;color:#475569;display:block;margin-bottom:4px;">Senha</label>
                        <input type="password" id="loginPassword" required style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;" placeholder="••••••••">
                    </div>
                    <button type="submit" style="width:100%;padding:14px;background:linear-gradient(135deg,#002271,#0B369B);color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;">Entrar</button>
                </form>
                <p style="text-align:center;margin-top:20px;font-size:14px;color:#64748b;">Não tem conta? <a onclick="router.navigate('/register')" style="color:#002271;font-weight:600;cursor:pointer;">Cadastre-se</a></p>
            </div>
        </div>`;
}

function renderRegisterPage() {
    document.getElementById('app').innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#CFDEE7;padding:40px;">
            <div style="width:100%;max-width:500px;background:white;border-radius:24px;padding:40px;">
                <h1 style="font-size:28px;font-weight:700;color:#002271;text-align:center;margin-bottom:24px;">Criar Conta</h1>
                <form onsubmit="handleRegister(event)" style="display:flex;flex-direction:column;gap:16px;">
                    <input type="text" id="regName" required placeholder="Nome completo" style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;">
                    <input type="email" id="regEmail" required placeholder="E-mail" style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;">
                    <input type="text" id="regCPF" required placeholder="CPF" style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;">
                    <input type="date" id="regBirthDate" required style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;">
                    <input type="password" id="regPassword" required placeholder="Senha" style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;">
                    <input type="password" id="regConfirmPassword" required placeholder="Confirmar senha" style="width:100%;padding:12px;border:1px solid #e2e8f0;border-radius:10px;">
                    <label style="display:flex;align-items:center;gap:8px;font-size:14px;color:#475569;"><input type="checkbox" id="regIsStudent"> Sou estudante</label>
                    <button type="submit" style="width:100%;padding:14px;background:linear-gradient(135deg,#002271,#0B369B);color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;">Criar Conta</button>
                </form>
                <p style="text-align:center;margin-top:20px;font-size:14px;color:#64748b;">Já tem conta? <a onclick="router.navigate('/login')" style="color:#002271;font-weight:600;cursor:pointer;">Login</a></p>
            </div>
        </div>`;
}

// Dashboard
function renderDashboard() {
    const user = auth.getCurrentUser();
    if (!user) { router.navigate('/login'); return; }
    const stats = profileSystem.getUserStats();
    const todayMood = profileSystem.getTodayMood();
    const upcoming = scheduling.getUpcomingAppointments();
    const next = upcoming[0];
    const moods = ['😞', '😐', '😊', '🤩', '🧘'];
    const moodLabels = ['Triste', 'Neutro', 'Bem', 'Ótimo', 'Calmo'];
    
    const resources = [
        { icon: '🧘', category: 'Meditação', title: '5 técnicas de respiração', desc: 'Reduza a ansiedade em 3 minutos', color: '#EBF0FF' },
        { icon: '😴', category: 'Sono', title: 'Higiene do sono', desc: 'Como dormir melhor hoje à noite', color: '#FEF3C7' },
        { icon: '💪', category: 'Resiliência', title: 'Construindo resiliência', desc: 'Fortalecimento emocional diário', color: '#D1FAE5' },
        { icon: '🧠', category: 'TCC', title: 'Reestruturação cognitiva', desc: 'Identifique padrões de pensamento', color: '#EDE9FE' },
        { icon: '❤️', category: 'Bem-estar', title: 'Autocompaixão na prática', desc: 'Exercícios para ser mais gentil', color: '#FCE7F3' },
        { icon: '📝', category: 'Journaling', title: 'Diário de gratidão', desc: '3 perguntas para transformar seu dia', color: '#E0F2FE' }
    ];
    
    const content = `
        <div class="fade-in">
            <!-- Welcome -->
            <div style="margin-bottom: 32px;">
                <h1 style="font-size: 28px; font-weight: 700; color: #1F2937;">Olá, ${user.name.split(' ')[0]} 👋</h1>
                <p style="color: #6B7280; font-size: 15px; margin-top: 4px;">Bem-vindo ao seu santuário digital.</p>
            </div>
            
            <!-- Grid Principal -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                <!-- Coluna Esquerda -->
                <div>
                    <!-- Mood -->
                    <div class="card" style="margin-bottom: 24px;">
                        <h3 style="font-size: 16px; font-weight: 600; color: #1F2937; margin-bottom: 16px;">Como você está hoje?</h3>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            ${moods.map((m, i) => `
                                <button onclick="saveMood(${i})" class="mood-btn ${todayMood?.mood === i ? 'selected' : ''}"
                                        style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; padding:16px 8px; background:${todayMood?.mood === i ? '#EBF0FF' : 'white'}; border:1.5px solid ${todayMood?.mood === i ? '#315BD8' : '#E5E7EB'}; border-radius:12px; cursor:pointer; position:relative;">
                                    <span class="emoji">${m}</span>
                                    <span style="font-size:11px; font-weight:500; color:${todayMood?.mood === i ? '#315BD8' : '#6B7280'};">${moodLabels[i]}</span>
                                    ${todayMood?.mood === i ? '<span style="position:absolute;top:6px;right:6px;width:18px;height:18px;background:#315BD8;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:10px;">✓</span>' : ''}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Stats -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                        <div class="card" style="text-align: center; padding: 20px;">
                            <span class="material-symbols-outlined" style="font-size: 28px; color: #315BD8; margin-bottom: 8px;">calendar_month</span>
                            <div style="font-size: 24px; font-weight: 700; color: #1F2937;">${stats.totalSessions}</div>
                            <div style="font-size: 12px; color: #6B7280;">Consultas</div>
                        </div>
                        <div class="card" style="text-align: center; padding: 20px;">
                            <span class="material-symbols-outlined" style="font-size: 28px; color: #315BD8; margin-bottom: 8px;">schedule</span>
                            <div style="font-size: 24px; font-weight: 700; color: #1F2937;">${stats.totalHours}h</div>
                            <div style="font-size: 12px; color: #6B7280;">Horas de apoio</div>
                        </div>
                    </div>
                </div>
                
                <!-- Coluna Direita -->
                <div>
                    <!-- Próxima Consulta -->
                    ${next ? `
                        <div style="background: linear-gradient(135deg, #315BD8 0%, #4F73E0 100%); border-radius: 16px; padding: 28px; color: white; position: relative; overflow: hidden;">
                            <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                            <div style="position: relative; z-index: 1;">
                                <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; margin-bottom: 12px;">Próxima Consulta</p>
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                                    <img src="${next.professionalAvatar}" class="avatar avatar-md" style="border: 2px solid rgba(255,255,255,0.3);">
                                    <div>
                                        <h3 style="font-size: 16px; font-weight: 600;">${next.professionalName}</h3>
                                        <p style="font-size: 13px; opacity: 0.8;">${next.professionalSpecialty}</p>
                                    </div>
                                </div>
                                <div style="display: flex; gap: 20px; margin-bottom: 20px; font-size: 13px;">
                                    <span>📅 ${scheduling.formatAppointmentDetails(next).date}</span>
                                    <span>🕐 ${scheduling.formatAppointmentDetails(next).time}</span>
                                </div>
                                <button style="width:100%; padding:10px; background:white; color:#315BD8; border:none; border-radius:10px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif;">Entrar na Sessão</button>
                            </div>
                        </div>
                    ` : `
                        <div class="card" style="text-align:center; padding:32px;">
                            <span class="material-symbols-outlined" style="font-size:48px; color:#D1D5DB; margin-bottom:12px;">event_busy</span>
                            <h3 style="font-size:16px; font-weight:600; color:#6B7280;">Nenhuma consulta</h3>
                            <p style="font-size:13px; color:#9CA3AF; margin-bottom:16px;">Encontre um profissional</p>
                            <button onclick="router.navigate('/search')" class="btn btn-primary btn-sm">Buscar</button>
                        </div>
                    `}
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 48px;">
                <button onclick="router.navigate('/search')" class="btn btn-primary btn-lg btn-full">Agendar Consulta</button>
                <button onclick="router.navigate('/appointments')" class="btn btn-secondary btn-lg btn-full">Histórico</button>
            </div>
            
            <!-- Seção Para Você - Carrossel -->
            <div style="margin-bottom: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="font-size: 16px; font-weight: 600; color: #1F2937;">Para Você</h3>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="scrollCarousel('para-voce', 'left')" class="carousel-btn carousel-btn-left" style="position:static;">←</button>
                        <button onclick="scrollCarousel('para-voce', 'right')" class="carousel-btn carousel-btn-right" style="position:static;">→</button>
                    </div>
                </div>
                <div class="carousel-container">
                    <div id="para-voce" class="carousel-track">
                        ${resources.map(r => `
                            <div class="carousel-item">
                                <div class="resource-card" onclick="router.navigate('/search')">
                                    <div class="image-wrapper" style="background: ${r.color};">
                                        <span style="font-size: 36px;">${r.icon}</span>
                                    </div>
                                    <div class="content">
                                        <div class="category">${r.category}</div>
                                        <div class="title">${r.title}</div>
                                        <div class="description">${r.desc}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
        </div>`;
    router.renderLayout(content);
}

// Função de scroll do carrossel
function scrollCarousel(id, direction) {
    const carousel = document.getElementById(id);
    if (!carousel) return;
    const scrollAmount = 280;
    const newScroll = direction === 'left' 
        ? carousel.scrollLeft - scrollAmount 
        : carousel.scrollLeft + scrollAmount;
    carousel.scrollTo({ left: newScroll, behavior: 'smooth' });
}

// Busca
function renderSearchPage() {
    const professionals = searchSystem.getAllProfessionals();
    const content = `
        <div class="fade-in">
            <h1 style="font-size:32px;font-weight:700;color:#1e293b;margin-bottom:24px;">Buscar Profissionais</h1>
            <div style="background:white;border-radius:16px;padding:24px;margin-bottom:24px;">
                <input type="text" id="searchInput" oninput="handleSearch()" placeholder="Nome, especialidade ou abordagem..." 
                       style="width:100%;padding:14px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:16px;">
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button onclick="toggleFilter('availability')" data-filter-type="availability" class="filter-btn" 
                            style="padding:8px 16px;border:1px solid #e2e8f0;border-radius:20px;background:white;cursor:pointer;">🟢 Disponível</button>
                    <button onclick="toggleFilter('type','student')" data-filter-type="type" data-filter-value="student" class="filter-btn"
                            style="padding:8px 16px;border:1px solid #e2e8f0;border-radius:20px;background:white;cursor:pointer;">🎓 Estudante</button>
                    <button onclick="toggleFilter('type','formed')" data-filter-type="type" data-filter-value="formed" class="filter-btn"
                            style="padding:8px 16px;border:1px solid #e2e8f0;border-radius:20px;background:white;cursor:pointer;">✅ Formado</button>
                    <button onclick="toggleFilter('modality','video')" data-filter-type="modality" data-filter-value="video" class="filter-btn"
                            style="padding:8px 16px;border:1px solid #e2e8f0;border-radius:20px;background:white;cursor:pointer;">📹 Online</button>
                </div>
            </div>
            <div id="searchResults">
                <p style="margin-bottom:16px;color:#64748b;"><strong>${professionals.length}</strong> profissional(is)</p>
                ${professionals.map(p => UIComponents.professionalCard(p)).join('')}
            </div>
        </div>`;
    router.renderLayout(content);
}
// Perfil do Profissional
function renderProfessionalProfile(params) {
    const prof = searchSystem.getProfessionalById(params.id);
    if (!prof) { router.navigate('/search'); return; }
    const ratings = searchSystem.getRatingsForProfessional(params.id);
    
    const content = `
        <div class="fade-in">
            <a onclick="router.navigate('/search')" style="color:#64748b;cursor:pointer;">← Voltar</a>
            <div style="display:grid;grid-template-columns:1fr 350px;gap:24px;margin-top:16px;" class="profile-layout">
                <div>
                    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:24px;">
                        <div style="display:flex;gap:20px;margin-bottom:20px;">
                            <img src="${prof.avatar}" style="width:80px;height:80px;border-radius:16px;object-fit:cover;">
                            <div>
                                <h1 style="font-size:24px;font-weight:700;color:#1e293b;">${prof.name}</h1>
                                <p style="color:#64748b;">${prof.specialty}</p>
                                <div style="display:flex;align-items:center;gap:4px;margin-top:4px;">
                                    <span style="color:#f59e0b;">★</span><span>${prof.rating} (${ratings.length} avaliações)</span>
                                </div>
                            </div>
                        </div>
                        <p style="color:#475569;line-height:1.6;">${prof.bio}</p>
                        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;">
                            ${prof.tags.map(t => `<span style="padding:4px 12px;background:#f1f5f9;border-radius:16px;font-size:12px;">${t}</span>`).join('')}
                        </div>
                    </div>
                    <div style="background:white;border-radius:16px;padding:24px;">
                        <h3 style="font-size:18px;font-weight:600;margin-bottom:16px;">Avaliações</h3>
                        ${ratings.slice(0,5).map(r => `
                            <div style="padding:12px 0;border-bottom:1px solid #f1f5f9;">
                                <p style="font-weight:600;">${r.userName} <span style="color:#f59e0b;">${'★'.repeat(r.rating)}</span></p>
                                <p style="color:#64748b;font-style:italic;">"${r.text}"</p>
                            </div>
                        `).join('')}
                        <div style="margin-top:20px;">
                            <div id="ratingStars" style="display:flex;gap:4px;font-size:28px;margin-bottom:8px;">
                                ${[1,2,3,4,5].map(i => `<span class="material-symbols-outlined star-rating" onclick="setRating(${i})" style="cursor:pointer;color:#cbd5e0;">star</span>`).join('')}
                            </div>
                            <textarea id="reviewText" rows="2" placeholder="Sua avaliação..." style="width:100%;padding:8px;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;"></textarea>
                            <button onclick="submitReview('${prof.id}')" style="padding:8px 16px;background:#002271;color:white;border:none;border-radius:8px;cursor:pointer;">Enviar</button>
                        </div>
                    </div>
                </div>
                <div>
                    <div style="background:white;border-radius:16px;padding:24px;position:sticky;top:20px;">
                        <h3 style="font-size:18px;font-weight:600;margin-bottom:16px;">Agendar</h3>
                        <div style="background:#f8fafc;padding:16px;border-radius:12px;margin-bottom:16px;">
                            <p style="font-size:24px;font-weight:700;color:#002271;">${prof.price === 0 ? 'Grátis' : 'R$ ' + prof.price.toFixed(2)}</p>
                            <p style="color:#94a3b8;font-size:12px;">${CONFIG.SESSION_DURATION} minutos</p>
                        </div>
                        <button onclick="scheduleAppointment('${prof.id}')" style="width:100%;padding:14px;background:linear-gradient(135deg,#002271,#0B369B);color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;">Agendar Consulta</button>
                    </div>
                </div>
            </div>
        </div>`;
    router.renderLayout(content);
}

// Agendamento
function renderSchedulingPage(params) {
    const prof = searchSystem.getProfessionalById(params.id);
    if (!prof) { router.navigate('/search'); return; }
    const slots = scheduling.getAvailableSlots(params.id, 14);
    const slotsByDate = groupSlotsByDate(slots);
    window.schedulingState = { professionalId: params.id, selectedDate: Object.keys(slotsByDate)[0], selectedTime: slots[0]?.date, selectedModality: prof.modalities[0] };
    
    const content = `
        <div class="fade-in">
            <a onclick="router.navigate('/professional/${params.id}')" style="color:#64748b;cursor:pointer;">← Voltar</a>
            <h1 style="font-size:32px;font-weight:700;color:#1e293b;margin:16px 0;">Agendar Consulta</h1>
            <div style="display:grid;grid-template-columns:1fr 350px;gap:24px;" class="schedule-layout">
                <div>
                    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;">
                        <h3 style="margin-bottom:12px;">Modalidade</h3>
                        <div style="display:flex;gap:8px;">
                            ${prof.modalities.map(m => `
                                <button onclick="selectModality('${m}')" class="modality-btn ${m === prof.modalities[0] ? 'selected' : ''}"
                                        style="flex:1;padding:16px;background:${m === prof.modalities[0] ? '#eff6ff' : 'white'};border:2px solid ${m === prof.modalities[0] ? '#002271' : '#e2e8f0'};border-radius:12px;cursor:pointer;">
                                    ${m === 'video' ? '📹' : m === 'audio' ? '🎙️' : '💬'} ${m}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:16px;">
                        <h3 style="margin-bottom:12px;">Data</h3>
                        <div style="display:flex;gap:8px;overflow-x:auto;" id="dateSlots">
                            ${Object.keys(slotsByDate).slice(0,14).map((d,i) => {
                                const dt = new Date(d);
                                return `<button onclick="selectDate('${d}')" data-date="${d}" class="date-slot ${i===0?'selected':''}"
                                        style="min-width:70px;padding:12px;background:${i===0?'#eff6ff':'white'};border:2px solid ${i===0?'#002271':'#e2e8f0'};border-radius:12px;cursor:pointer;">
                                        <div style="font-size:18px;font-weight:700;">${dt.getDate()}</div>
                                        <div style="font-size:11px;">${dt.toLocaleDateString('pt-BR',{weekday:'short'}).toUpperCase()}</div>
                                    </button>`;
                            }).join('')}
                        </div>
                    </div>
                    <div style="background:white;border-radius:16px;padding:24px;">
                        <h3 style="margin-bottom:12px;">Horários</h3>
                        <div id="timeSlots" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
                            ${renderTimeSlots(slots.filter(s => new Date(s.date).toISOString().split('T')[0] === Object.keys(slotsByDate)[0]).slice(0,20))}
                        </div>
                    </div>
                </div>
                <div>
                    <div style="background:white;border-radius:16px;padding:24px;position:sticky;top:20px;">
                        <div style="display:flex;gap:12px;margin-bottom:16px;">
                            <img src="${prof.avatar}" style="width:48px;height:48px;border-radius:12px;">
                            <div>
                                <p style="font-weight:600;">${prof.name}</p>
                                <p style="color:#64748b;font-size:14px;">${prof.specialty}</p>
                            </div>
                        </div>
                        <p style="font-size:20px;font-weight:700;color:#002271;margin-bottom:4px;">${prof.price === 0 ? 'Grátis' : 'R$ ' + prof.price.toFixed(2)}</p>
                        <p style="color:#94a3b8;font-size:12px;margin-bottom:16px;">${CONFIG.SESSION_DURATION} minutos</p>
                        <button onclick="confirmScheduling('${params.id}')" style="width:100%;padding:14px;background:linear-gradient(135deg,#002271,#0B369B);color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>`;
    router.renderLayout(content);
}

function groupSlotsByDate(slots) {
    const g = {};
    slots.forEach(s => { const d = new Date(s.date).toISOString().split('T')[0]; if(!g[d]) g[d] = []; g[d].push(s); });
    return g;
}

function renderTimeSlots(slots) {
    if (!slots?.length) return '<p style="grid-column:1/-1;text-align:center;color:#94a3b8;">Sem horários</p>';
    return slots.map((s,i) => {
        const t = new Date(s.date);
        const h = t.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
        if (!s.available) return `<div style="padding:12px;text-align:center;background:#f1f5f9;color:#cbd5e0;border-radius:10px;">${h}</div>`;
        return `<button onclick="selectTime('${s.date}',this)" class="time-slot ${i===0?'selected':''}" 
                style="padding:12px;background:${i===0?'#eff6ff':'white'};border:2px solid ${i===0?'#002271':'#e2e8f0'};border-radius:10px;cursor:pointer;font-weight:600;color:#002271;">${h}</button>`;
    }).join('');
}

function selectModality(m) { 
    window.schedulingState.selectedModality = m; 
    document.querySelectorAll('.modality-btn').forEach(b => { 
        const btnText = b.textContent.trim();
        const isSelected = btnText.includes(m);
        b.style.background = isSelected ? '#eff6ff' : 'white'; 
        b.style.borderColor = isSelected ? '#002271' : '#e2e8f0';
        if (isSelected) b.classList.add('selected');
        else b.classList.remove('selected');
    }); 
}
function selectDate(d) { 
    window.schedulingState.selectedDate = d; 
    document.querySelectorAll('.date-slot').forEach(b => { 
        const isSelected = b.dataset.date === d; 
        b.style.background = isSelected ? '#eff6ff' : 'white'; 
        b.style.borderColor = isSelected ? '#002271' : '#e2e8f0';
        if (isSelected) b.classList.add('selected');
        else b.classList.remove('selected');
    });
    
    // Atualizar horários para a data selecionada
    const profId = window.schedulingState.professionalId;
    const allSlots = scheduling.getAvailableSlots(profId, 14);
    const dateSlots = allSlots.filter(s => new Date(s.date).toISOString().split('T')[0] === d);
    
    const timeSlotsContainer = document.getElementById('timeSlots');
    if (timeSlotsContainer) {
        timeSlotsContainer.innerHTML = renderTimeSlots(dateSlots.slice(0, 20));
    }
    
    // Selecionar primeiro horário disponível
    if (dateSlots.length > 0) {
        window.schedulingState.selectedTime = dateSlots[0].date;
    }
}
function selectTime(t, el) { 
    window.schedulingState.selectedTime = t; 
    document.querySelectorAll('.time-slot').forEach(b => { 
        b.style.background = 'white'; 
        b.style.borderColor = '#e2e8f0';
        b.classList.remove('selected');
    }); 
    if (el) {
        el.style.background = '#eff6ff'; 
        el.style.borderColor = '#002271';
        el.classList.add('selected');
    }
}

function confirmScheduling(profId) {
    const st = window.schedulingState;
    if (!st?.selectedTime) { Utils.showToast('Selecione horário', 'error'); return; }
    const r = scheduling.scheduleAppointment(profId, st.selectedTime, st.selectedModality);
    if (r.success) { Utils.showToast('Agendado! 🎉'); router.navigate(`/confirmation/${r.appointment.id}`); }
    else Utils.showToast(r.error, 'error');
}

function renderConfirmation(params) {
    const apt = scheduling.getAppointmentById(params.id);
    if (!apt) { router.navigate('/dashboard'); return; }
    const d = scheduling.formatAppointmentDetails(apt);
    const content = `
        <div class="fade-in" style="max-width:500px;margin:40px auto;">
            <div style="background:white;border-radius:24px;padding:40px;text-align:center;">
                <span class="material-symbols-outlined filled-icon" style="font-size:64px;color:#10b981;">check_circle</span>
                <h2 style="font-size:24px;font-weight:700;margin:16px 0;">Agendado! 🎉</h2>
                <div style="background:#f8fafc;padding:20px;border-radius:16px;text-align:left;margin:20px 0;">
                    <p><strong>${apt.professionalName}</strong></p>
                    <p style="color:#64748b;">${d.date}</p>
                    <p style="color:#64748b;">${d.time} • ${d.modalityLabel}</p>
                </div>
                <button onclick="router.navigate('/appointments')" style="width:100%;padding:14px;background:linear-gradient(135deg,#002271,#0B369B);color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;margin-bottom:8px;">Ver Agenda</button>
                <button onclick="router.navigate('/dashboard')" style="width:100%;padding:14px;background:#f1f5f9;color:#475569;border:none;border-radius:10px;font-weight:600;cursor:pointer;">Dashboard</button>
            </div>
        </div>`;
    router.renderLayout(content);
}

function renderAppointmentsPage() {
    const up = scheduling.getUpcomingAppointments();
    const past = scheduling.getPastAppointments();
    const content = `
        <div class="fade-in">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                <h1 style="font-size:32px;font-weight:700;color:#1e293b;">Minha Agenda</h1>
                <button onclick="router.navigate('/search')" style="padding:12px 20px;background:#002271;color:white;border:none;border-radius:10px;cursor:pointer;">+ Nova Consulta</button>
            </div>
            <h3 style="margin-bottom:16px;color:#475569;">Próximas (${up.length})</h3>
            ${up.length ? up.map(a => UIComponents.appointmentCard(a)).join('') : '<p style="color:#94a3b8;">Nenhuma consulta agendada</p>'}
            ${past.length ? `<h3 style="margin:24px 0 16px;color:#475569;">Histórico (${past.length})</h3>` + past.map(a => UIComponents.appointmentCard(a, true)).join('') : ''}
        </div>`;
    router.renderLayout(content);
}

function renderUserProfile() {
    const u = auth.getCurrentUser();
    if (!u) { router.navigate('/login'); return; }
    const s = profileSystem.getUserStats();
    
    const content = `
        <div class="fade-in">
            <h1 style="font-size: 28px; font-weight: 700; color: #1F2937; margin-bottom: 24px;">Meu Perfil</h1>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                <!-- Coluna Esquerda - Info do Usuário -->
                <div>
                    <div class="card" style="text-align: center; padding: 32px; margin-bottom: 24px;">
                        <div class="avatar avatar-xl" style="background: var(--primary); display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 700; margin-bottom: 16px;">
                            ${u.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 style="font-size: 22px; font-weight: 700; color: #1F2937;">${u.name}</h2>
                        <p style="color: #6B7280; font-size: 14px; margin-top: 4px;">${u.email}</p>
                        <p style="color: #9CA3AF; font-size: 12px; margin-top: 4px;">Membro desde ${s.memberSince}</p>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px;">
                            <div style="background: #F9FAFB; border-radius: 12px; padding: 16px;">
                                <div style="font-size: 22px; font-weight: 700; color: #315BD8;">${s.totalSessions}</div>
                                <div style="font-size: 12px; color: #6B7280;">Consultas</div>
                            </div>
                            <div style="background: #F9FAFB; border-radius: 12px; padding: 16px;">
                                <div style="font-size: 22px; font-weight: 700; color: #315BD8;">${s.totalHours}h</div>
                                <div style="font-size: 12px; color: #6B7280;">Horas de apoio</div>
                            </div>
                        </div>
                        
                        <button onclick="editProfile()" class="btn btn-secondary btn-full" style="margin-top: 20px;">
                            <span class="material-symbols-outlined" style="font-size: 18px;">edit</span>
                            Editar Perfil
                        </button>
                    </div>
                </div>
                
                <!-- Coluna Direita - Menu -->
                <div>
                    <div class="card" style="padding: 8px; margin-bottom: 24px;">
                        <div class="profile-menu-item" onclick="router.navigate('/appointments')">
                            <div class="menu-icon" style="background: #EBF0FF; color: #315BD8;">
                                <span class="material-symbols-outlined">calendar_today</span>
                            </div>
                            <div class="menu-content">
                                <div class="menu-title">Meus Agendamentos</div>
                                <div class="menu-subtitle">Gerencie suas consultas</div>
                            </div>
                            <span class="material-symbols-outlined menu-arrow">chevron_right</span>
                        </div>
                        
                        <div class="profile-menu-item" onclick="router.navigate('/appointments')">
                            <div class="menu-icon" style="background: #D1FAE5; color: #22C55E;">
                                <span class="material-symbols-outlined">notifications</span>
                            </div>
                            <div class="menu-content">
                                <div class="menu-title">Notificações</div>
                                <div class="menu-subtitle">Lembretes e atualizações</div>
                            </div>
                            <span class="material-symbols-outlined menu-arrow">chevron_right</span>
                        </div>
                        
                        <div class="profile-menu-item" onclick="router.navigate('/profile')">
                            <div class="menu-icon" style="background: #FEF3C7; color: #F59E0B;">
                                <span class="material-symbols-outlined">lock</span>
                            </div>
                            <div class="menu-content">
                                <div class="menu-title">Privacidade e Segurança</div>
                                <div class="menu-subtitle">Gerencie seus dados</div>
                            </div>
                            <span class="material-symbols-outlined menu-arrow">chevron_right</span>
                        </div>
                        
                        <div class="profile-menu-item" onclick="router.navigate('/profile')">
                            <div class="menu-icon" style="background: #EDE9FE; color: #7C3AED;">
                                <span class="material-symbols-outlined">help</span>
                            </div>
                            <div class="menu-content">
                                <div class="menu-title">Suporte e Ajuda</div>
                                <div class="menu-subtitle">Fale conosco</div>
                            </div>
                            <span class="material-symbols-outlined menu-arrow">chevron_right</span>
                        </div>
                    </div>
                    
                    <!-- Logout -->
                    <button onclick="handleLogout()" class="btn btn-full" style="background: #FEF2F2; color: #EF4444; border: 1.5px solid #FECACA; font-weight: 600; padding: 14px; border-radius: 12px; cursor: pointer; font-family: 'Inter', sans-serif;">
                        <span class="material-symbols-outlined" style="font-size: 18px;">logout</span>
                        Sair da Conta
                    </button>
                </div>
            </div>
            
        </div>`;
    router.renderLayout(content);
}

function setupRoutes() {
    router.addRoute('/login', () => renderLoginPage(), { title: 'PSICO - Login' });
    router.addRoute('/register', () => renderRegisterPage(), { title: 'PSICO - Cadastro' });
    router.addRoute('/dashboard', () => renderDashboard(), { requiresAuth: true, title: 'PSICO - Dashboard' });
    router.addRoute('/search', () => renderSearchPage(), { requiresAuth: true, title: 'PSICO - Buscar' });
    router.addRoute('/professional/:id', (p) => renderProfessionalProfile(p), { requiresAuth: true, title: 'PSICO - Profissional' });
    router.addRoute('/schedule/:id', (p) => renderSchedulingPage(p), { requiresAuth: true, title: 'PSICO - Agendamento' });
    router.addRoute('/appointments', () => renderAppointmentsPage(), { requiresAuth: true, title: 'PSICO - Agenda' });
    router.addRoute('/profile', () => renderUserProfile(), { requiresAuth: true, title: 'PSICO - Perfil' });
    router.addRoute('/confirmation/:id', (p) => renderConfirmation(p), { requiresAuth: true, title: 'PSICO - Confirmado' });
}

function initApp() { setupRoutes(); router.init(); }
document.addEventListener('DOMContentLoaded', initApp);