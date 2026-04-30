// Sistema de Perfil do Usuário e Mood Tracker
class ProfileSystem {
    constructor() {
        this.moodHistory = this.loadMoodHistory();
    }
    
    // Carregar histórico de humor
    loadMoodHistory() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.MOOD_HISTORY) || '[]');
    }
    
    // Salvar histórico de humor
    saveMoodHistory() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.MOOD_HISTORY, JSON.stringify(this.moodHistory));
    }
    
    // Salvar mood do dia
    saveMood(mood) {
        if (!auth.isLoggedIn()) return;
        
        const today = new Date().toISOString().split('T')[0];
        
        // Verificar se já registrou hoje
        const existingIndex = this.moodHistory.findIndex(m => m.date === today);
        
        if (existingIndex >= 0) {
            this.moodHistory[existingIndex].mood = mood;
        } else {
            this.moodHistory.push({
                id: Utils.generateId(),
                userId: auth.getCurrentUser().id,
                date: today,
                mood: mood,
                timestamp: new Date().toISOString()
            });
        }
        
        this.saveMoodHistory();
        return { success: true };
    }
    
    // Obter mood do dia
    getTodayMood() {
        if (!auth.isLoggedIn()) return null;
        
        const today = new Date().toISOString().split('T')[0];
        return this.moodHistory.find(m => 
            m.userId === auth.getCurrentUser().id && m.date === today
        );
    }
    
    // Obter estatísticas do usuário
    getUserStats() {
        if (!auth.isLoggedIn()) return null;
        
        const appointments = scheduling.getUserAppointments();
        const completedSessions = appointments.filter(a => 
            a.status === 'confirmed' && new Date(a.dateTime) < new Date()
        );
        
        return {
            totalSessions: completedSessions.length,
            totalHours: scheduling.getTotalTherapyHours(),
            averageRating: this.calculateAverageRating(),
            memberSince: this.formatMemberSince()
        };
    }
    
    // Calcular média de avaliações dadas
    calculateAverageRating() {
        const ratings = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.RATINGS) || '[]');
        const userRatings = ratings.filter(r => r.userId === auth.getCurrentUser().id);
        
        if (userRatings.length === 0) return 0;
        
        return userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
    }
    
    // Formatar data de registro
    formatMemberSince() {
        if (!auth.isLoggedIn()) return '';
        
        const user = auth.getCurrentUser();
        const date = new Date(user.createdAt);
        const month = date.toLocaleDateString('pt-BR', { month: 'long' });
        const year = date.getFullYear();
        
        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    }
    
    // Atualizar perfil
    updateProfile(data) {
        if (!auth.isLoggedIn()) {
            return { success: false, error: 'Faça login para editar o perfil.' };
        }
        
        const result = auth.updateUser(data);
        
        if (result.success) {
            Utils.showToast('Perfil atualizado com sucesso!');
        }
        
        return result;
    }
    
    // Obter resumo da semana
    getWeekSummary() {
        if (!auth.isLoggedIn()) return [];
        
        const weekMoods = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const moodEntry = this.moodHistory.find(m => 
                m.userId === auth.getCurrentUser().id && m.date === dateStr
            );
            
            weekMoods.push({
                date: dateStr,
                day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
                mood: moodEntry ? moodEntry.mood : null
            });
        }
        
        return weekMoods;
    }
    
    // Deletar conta
    deleteAccount() {
        if (!auth.isLoggedIn()) return { success: false, error: 'Não autenticado.' };
        
        const users = auth.getAllUsers();
        const filtered = users.filter(u => u.id !== auth.getCurrentUser().id);
        localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(filtered));
        
        auth.logout();
        return { success: true };
    }
}

// Instância global do sistema de perfil
const profileSystem = new ProfileSystem();