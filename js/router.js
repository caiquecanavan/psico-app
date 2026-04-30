class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.appContainer = document.getElementById('app');
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }
    
    addRoute(path, handler, options = {}) {
        this.routes[path] = { handler, requiresAuth: options.requiresAuth || false, title: options.title || 'PSICO' };
        return this;
    }
    
    navigate(path) { window.location.hash = path; }
    
    findMatchingRoute(hash) {
        if (this.routes[hash]) return { route: this.routes[hash], params: {} };
        for (const [pattern, route] of Object.entries(this.routes)) {
            if (pattern.includes(':')) {
                const pp = pattern.split('/'), hp = hash.split('/');
                if (pp.length === hp.length) {
                    let match = true; const params = {};
                    for (let i = 0; i < pp.length; i++) {
                        if (pp[i].startsWith(':')) params[pp[i].slice(1)] = hp[i];
                        else if (pp[i] !== hp[i]) { match = false; break; }
                    }
                    if (match) return { route, params };
                }
            }
        }
        return null;
    }
    
    async handleRoute() {
        const hash = window.location.hash.slice(1) || '/login';
        const match = this.findMatchingRoute(hash);
        if (!match) { this.navigate('/login'); return; }
        const { route, params } = match;
        if (route.requiresAuth && !auth.isLoggedIn()) { this.navigate('/login'); return; }
        if (['/login', '/register'].includes(hash) && auth.isLoggedIn()) { this.navigate('/dashboard'); return; }
        document.title = route.title;
        this.currentRoute = hash;
        try { await route.handler(params); }
        catch (e) { console.error(e); this.appContainer.innerHTML = '<div style="padding:40px;text-align:center;">Erro ao carregar página</div>'; }
        window.scrollTo(0, 0);
    }
    
    renderHeader() {
        const user = auth.getCurrentUser();
        const nav = [
            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
            { id: 'search', label: 'Buscar', icon: 'search', route: '/search' },
            { id: 'appointments', label: 'Agenda', icon: 'calendar_today', route: '/appointments' },
            { id: 'profile', label: 'Perfil', icon: 'person', route: '/profile' }
        ];
        
        return `
            <header style="background: white; border-bottom: 1px solid #E5E7EB; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
                <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 64px;">
                    <div style="display: flex; align-items: center; gap: 32px;">
                        <a onclick="router.navigate('/dashboard')" style="display: flex; align-items: center; gap: 10px; cursor: pointer; text-decoration: none;">
                            <div style="width: 56px; height: 56px; border-radius: 10px; overflow: hidden;">
                                <img src="assets/PSIC_logo.svg" alt="PSICO" style="width: 100%; height: 100%; object-fit: contain;">
                            </div>
                            <span style="font-size: 20px; font-weight: 700; color: #1F2937;">PSICO</span>
                        </a>
                        <nav style="display: flex; gap: 4px;" class="hide-mobile">
                            ${nav.map(item => `
                                <a onclick="router.navigate('${item.route}')" 
                                   style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; color: ${this.currentRoute === item.route || this.currentRoute.startsWith(item.route + '/') ? '#315BD8' : '#6B7280'}; background: ${this.currentRoute === item.route || this.currentRoute.startsWith(item.route + '/') ? '#EBF0FF' : 'transparent'};"
                                   onmouseover="this.style.background='${this.currentRoute === item.route ? '#EBF0FF' : '#F3F4F6'}'"
                                   onmouseout="this.style.background='${this.currentRoute === item.route ? '#EBF0FF' : 'transparent'}'">
                                    <span class="material-symbols-outlined" style="font-size: 18px;">${item.icon}</span>
                                    ${item.label}
                                </a>
                            `).join('')}
                        </nav>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${user ? `
                            <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="router.navigate('/profile')">
                                <div class="avatar avatar-sm" style="background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 14px;">
                                    ${user.name.charAt(0).toUpperCase()}
                                </div>
                                <span class="hide-mobile" style="font-size: 14px; font-weight: 500; color: #374151;">${user.name.split(' ')[0]}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </header>`;
    }
    
    renderFooter() {
        return `
            <footer style="background: white; border-top: 1px solid #E5E7EB; padding: 48px 0 0; width: 100%; margin-top: auto;">
                <div style="max-width: 1280px; margin: 0 auto; padding: 0 24px;">
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; padding-bottom: 40px; border-bottom: 1px solid #F3F4F6;">
                        <div>
                            <div style="font-size: 20px; font-weight: 700; color: #1F2937; margin-bottom: 12px;">PSICO</div>
                            <p style="font-size: 14px; color: #6B7280; line-height: 1.6; margin-bottom: 20px; max-width: 300px;">
                                Santuário de bem-estar digital. Conectando você aos melhores profissionais de saúde mental.
                            </p>
                            <div style="display: flex; gap: 12px;">
                                <span class="material-symbols-outlined" style="color: #9CA3AF; cursor: pointer;">mail</span>
                                <span class="material-symbols-outlined" style="color: #9CA3AF; cursor: pointer;">call</span>
                                <span class="material-symbols-outlined" style="color: #9CA3AF; cursor: pointer;">chat</span>
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px;">Institucional</div>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">Sobre Nós</a>
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">Conselho Federal</a>
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">Carreira</a>
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">Imprensa</a>
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px;">Legal</div>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">Termos de Uso</a>
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">Privacidade</a>
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">LGPD</a>
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">Ética Profissional</a>
                            </div>
                        </div>
                        <div>
                            <div style="font-size: 12px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px;">Suporte</div>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">Central de Ajuda</a>
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">Contato</a>
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">FAQ</a>
                                <a style="font-size: 14px; color: #6B7280; cursor: pointer; text-decoration: none;" onmouseover="this.style.color='#315BD8'" onmouseout="this.style.color='#6B7280'">Status</a>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 0; font-size: 13px; color: #9CA3AF;">
                        <span>© ${new Date().getFullYear()} PSICO - Saúde Mental para Todos. Todos os direitos reservados.</span>
                        <div style="display: flex; gap: 24px;">
                            <span style="cursor: pointer;" onmouseover="this.style.color='#6B7280'" onmouseout="this.style.color='#9CA3AF'">Termos</span>
                            <span style="cursor: pointer;" onmouseover="this.style.color='#6B7280'" onmouseout="this.style.color='#9CA3AF'">Privacidade</span>
                            <span style="cursor: pointer;" onmouseover="this.style.color='#6B7280'" onmouseout="this.style.color='#9CA3AF'">Cookies</span>
                        </div>
                    </div>
                </div>
            </footer>`;
    }
    
        renderLayout(content) {
        const user = auth.getCurrentUser();
        const navItems = [
            { id: 'dashboard', label: 'Home', icon: 'home', route: '/dashboard' },
            { id: 'search', label: 'Buscar', icon: 'search', route: '/search' },
            { id: 'appointments', label: 'Agenda', icon: 'calendar_today', route: '/appointments' },
            { id: 'profile', label: 'Perfil', icon: 'person', route: '/profile' }
        ];
        
        // Bottom Navigation Mobile
        const bottomNav = `
            <nav class="mobile-bottom-nav">
                ${navItems.map(item => `
                    <a onclick="router.navigate('${item.route}')" 
                       class="${this.currentRoute === item.route || this.currentRoute.startsWith(item.route + '/') ? 'active' : ''}">
                        <span class="material-symbols-outlined icon ${this.currentRoute === item.route || this.currentRoute.startsWith(item.route + '/') ? 'filled-icon' : ''}">${item.icon}</span>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </nav>`;
        
        this.appContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; min-height: 100vh; background: #F5F6FA;">
                ${this.renderHeader()}
                <main style="flex: 1; max-width: 1280px; margin: 0 auto; padding: 32px 24px; width: 100%; box-sizing: border-box;">
                    ${content}
                </main>
                ${this.renderFooter()}
                ${bottomNav}
            </div>`;
    }
    
    init() { initializeData(); this.handleRoute(); }
}

const router = new Router();