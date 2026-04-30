// Configurações Globais do PSICO
const CONFIG = {
    APP_NAME: 'PSICO',
    APP_VERSION: '2.4.1',
    APP_DESCRIPTION: 'Santuário de Bem-Estar Digital',
    
    STORAGE_KEYS: {
        USERS: 'psico_users',
        CURRENT_USER: 'psico_current_user',
        APPOINTMENTS: 'psico_appointments',
        RATINGS: 'psico_ratings',
        MOOD_HISTORY: 'psico_mood_history'
    },
    
    COLORS: {
        primary: '#002271',
        primaryLight: '#0B369B',
        secondary: '#295bb2',
        tertiary: '#00226f',
        background: '#CFDEE7',
        surface: '#ffffff',
        error: '#ba1a1a',
        success: '#10b981',
        warning: '#f59e0b'
    },
    
    SESSION_DURATION: 50, // minutos
    MAX_DAYS_AHEAD: 30, // dias para agendamento
    
    SPECIALTIES: [
        'Terapia Cognitivo-Comportamental',
        'Psicanálise',
        'Gestalt-terapia',
        'Terapia Sistêmica',
        'Psicologia Clínica',
        'Neuropsicologia',
        'Psicologia Junguiana',
        'Terapia de Aceitação e Compromisso',
        'Psicodrama',
        'Terapia Breve'
    ],
    
    APPROACHES: [
        'TCC',
        'Psicanálise Clássica',
        'Psicanálise Lacaniana',
        'Gestalt',
        'Sistêmica',
        'Humanista',
        'Comportamental',
        'Existencial',
        'Fenomenológica'
    ]
};

// Utilitários
const Utils = {
    formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    formatTime(date) {
        return new Date(date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    formatCPF(cpf) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast fade-in';
        toast.style.background = type === 'success' ? '#10b981' : '#ba1a1a';
        toast.style.color = 'white';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};
