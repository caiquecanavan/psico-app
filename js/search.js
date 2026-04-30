// Sistema de Busca e Filtros do PSICO
class SearchSystem {
    constructor() {
        this.professionals = MockData.professionals;
        this.filters = {
            searchTerm: '',
            availability: false,
            type: 'all', // 'all', 'student', 'formed'
            modality: 'all', // 'all', 'chat', 'audio', 'video'
            minRating: 0,
            maxPrice: 1000,
            specialties: [],
            sortBy: 'rating' // 'rating', 'price', 'experience'
        };
        this.results = [...this.professionals];
    }
    
    // Buscar profissionais com filtros
    search(filters = {}) {
        this.filters = { ...this.filters, ...filters };
        
        this.results = this.professionals.filter(prof => {
            // Filtro por termo de busca
            if (this.filters.searchTerm) {
                const term = this.filters.searchTerm.toLowerCase();
                const matchName = prof.name.toLowerCase().includes(term);
                const matchSpecialty = prof.specialty.toLowerCase().includes(term);
                const matchApproach = prof.approach.toLowerCase().includes(term);
                const matchTags = prof.tags.some(tag => tag.toLowerCase().includes(term));
                
                if (!matchName && !matchSpecialty && !matchApproach && !matchTags) {
                    return false;
                }
            }
            
            // Filtro por disponibilidade
            if (this.filters.availability && !prof.isOnline) {
                return false;
            }
            
            // Filtro por tipo (estudante/formado)
            if (this.filters.type === 'student' && prof.type !== 'student') {
                return false;
            }
            if (this.filters.type === 'formed' && prof.type !== 'formed') {
                return false;
            }
            
            // Filtro por modalidade
            if (this.filters.modality !== 'all' && !prof.modalities.includes(this.filters.modality)) {
                return false;
            }
            
            // Filtro por rating mínimo
            if (prof.rating < this.filters.minRating) {
                return false;
            }
            
            // Filtro por preço máximo
            if (prof.price > this.filters.maxPrice) {
                return false;
            }
            
            // Filtro por especialidades
            if (this.filters.specialties.length > 0) {
                const hasSpecialty = this.filters.specialties.some(spec => 
                    prof.specialty.includes(spec) || prof.tags.includes(spec)
                );
                if (!hasSpecialty) return false;
            }
            
            return true;
        });
        
        // Ordenar resultados
        this.sortResults();
        
        return this.results;
    }
    
    // Ordenar resultados
    sortResults() {
        switch (this.filters.sortBy) {
            case 'rating':
                this.results.sort((a, b) => b.rating - a.rating);
                break;
            case 'price':
                this.results.sort((a, b) => a.price - b.price);
                break;
            case 'experience':
                this.results.sort((a, b) => b.totalRatings - a.totalRatings);
                break;
            default:
                this.results.sort((a, b) => b.rating - a.rating);
        }
    }
    
    // Obter todos os profissionais
    getAllProfessionals() {
        return this.professionals;
    }
    
    // Obter profissional por ID
    getProfessionalById(id) {
        return this.professionals.find(p => p.id === id);
    }
    
    // Obter todas as especialidades únicas
    getAllSpecialties() {
        const specialties = new Set();
        this.professionals.forEach(prof => {
            specialties.add(prof.specialty);
            prof.tags.forEach(tag => specialties.add(tag));
        });
        return Array.from(specialties).sort();
    }
    
    // Obter profissionais disponíveis agora
    getAvailableNow() {
        return this.professionals.filter(p => p.isOnline);
    }
    
    // Obter estudantes
    getStudents() {
        return this.professionals.filter(p => p.type === 'student');
    }
    
    // Obter formados
    getFormed() {
        return this.professionals.filter(p => p.type === 'formed');
    }
    
    // Salvar avaliação
    saveRating(professionalId, rating, text) {
        if (!auth.isLoggedIn()) {
            return { success: false, error: 'Faça login para avaliar.' };
        }
        
        const ratings = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.RATINGS) || '[]');
        const newRating = {
            id: Utils.generateId(),
            professionalId,
            userId: auth.getCurrentUser().id,
            userName: auth.getCurrentUser().name,
            userInitial: auth.getCurrentUser().name.charAt(0).toUpperCase(),
            rating,
            text,
            date: new Date().toISOString(),
            timeAgo: 'Agora mesmo'
        };
        
        ratings.push(newRating);
        localStorage.setItem(CONFIG.STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
        
        // Atualizar rating do profissional nos dados mock
        const prof = this.getProfessionalById(professionalId);
        if (prof) {
            const allRatings = this.getRatingsForProfessional(professionalId);
            prof.rating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
            prof.totalRatings = allRatings.length;
            prof.reviews.unshift(newRating);
        }
        
        return { success: true, rating: newRating };
    }
    
    // Obter avaliações de um profissional
    getRatingsForProfessional(professionalId) {
        const ratings = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.RATINGS) || '[]');
        const profRatings = ratings.filter(r => r.professionalId === professionalId);
        
        // Combinar com ratings mock
        const prof = this.getProfessionalById(professionalId);
        if (prof && prof.reviews) {
            const allRatings = [...prof.reviews, ...profRatings];
            return allRatings;
        }
        
        return profRatings;
    }
}

// Instância global do sistema de busca
const searchSystem = new SearchSystem();