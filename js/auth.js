// Sistema de Autenticação do PSICO
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }
    
    // Carregar usuário atual do localStorage
    loadCurrentUser() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
        if (saved) {
            this.currentUser = JSON.parse(saved);
        }
    }
    
    // Salvar usuário atual
    saveCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem(CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
    
    // Registrar novo usuário
    register(userData) {
        const users = this.getAllUsers();
        
        // Validar dados
        const validation = this.validateRegistration(userData);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }
        
        // Verificar se email já existe
        if (users.find(u => u.email === userData.email)) {
            return { success: false, error: 'Este email já está cadastrado.' };
        }
        
        // Verificar se CPF já existe
        if (users.find(u => u.cpf === userData.cpf)) {
            return { success: false, error: 'Este CPF já está cadastrado.' };
        }
        
        // Criar usuário
        const newUser = {
            id: Utils.generateId(),
            name: userData.name,
            email: userData.email,
            cpf: userData.cpf,
            birthDate: userData.birthDate,
            password: this.hashPassword(userData.password), // Simulação de hash
            isStudent: userData.isStudent || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            stats: {
                totalSessions: 0,
                totalHours: 0,
                averageRating: 0
            },
            preferences: {
                notifications: true,
                theme: 'light'
            }
        };
        
        users.push(newUser);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
        
        // Auto-login após registro
        const { password, ...userWithoutPassword } = newUser;
        this.saveCurrentUser(userWithoutPassword);
        
        return { success: true, user: userWithoutPassword };
    }
    
    // Login
    login(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return { success: false, error: 'Email não encontrado.' };
        }
        
        if (user.password !== this.hashPassword(password)) {
            return { success: false, error: 'Senha incorreta.' };
        }
        
        const { password: _, ...userWithoutPassword } = user;
        this.saveCurrentUser(userWithoutPassword);
        
        return { success: true, user: userWithoutPassword };
    }
    
    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem(CONFIG.STORAGE_KEYS.CURRENT_USER);
    }
    
    // Verificar se está logado
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Atualizar dados do usuário
    updateUser(updatedData) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === this.currentUser.id);
        
        if (index === -1) return { success: false, error: 'Usuário não encontrado.' };
        
        // Manter campos sensíveis
        const currentUser = users[index];
        users[index] = {
            ...currentUser,
            ...updatedData,
            id: currentUser.id,
            password: currentUser.password,
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
        
        const { password, ...userWithoutPassword } = users[index];
        this.saveCurrentUser(userWithoutPassword);
        
        return { success: true, user: userWithoutPassword };
    }
    
    // Obter todos os usuários
    getAllUsers() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS) || '[]');
    }
    
    // Validar registro
    validateRegistration(data) {
        if (!data.name || data.name.length < 3) {
            return { valid: false, error: 'Nome deve ter pelo menos 3 caracteres.' };
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            return { valid: false, error: 'Email inválido.' };
        }
        
        if (!data.cpf || !this.isValidCPF(data.cpf)) {
            return { valid: false, error: 'CPF inválido.' };
        }
        
        if (!data.birthDate) {
            return { valid: false, error: 'Data de nascimento é obrigatória.' };
        }
        
        if (!data.password || data.password.length < 6) {
            return { valid: false, error: 'Senha deve ter pelo menos 6 caracteres.' };
        }
        
        if (data.password !== data.confirmPassword) {
            return { valid: false, error: 'Senhas não conferem.' };
        }
        
        return { valid: true };
    }
    
    // Validar formato de email
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Validar CPF (simplificado)
    isValidCPF(cpf) {
        const cleanCPF = cpf.replace(/[^\d]/g, '');
        return cleanCPF.length === 11;
    }
    
    // Simular hash de senha (em produção usar bcrypt)
    hashPassword(password) {
        return btoa(password + 'psico_salt_2024');
    }
}

// Instância global do sistema de autenticação
const auth = new AuthSystem();