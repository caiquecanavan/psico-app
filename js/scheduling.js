// Sistema de Agendamento do PSICO
class SchedulingSystem {
    constructor() {
        this.appointments = this.loadAppointments();
    }
    
    loadAppointments() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.APPOINTMENTS) || '[]');
    }
    
    saveAppointments() {
        localStorage.setItem(CONFIG.STORAGE_KEYS.APPOINTMENTS, JSON.stringify(this.appointments));
    }
    
    scheduleAppointment(professionalId, dateTime, modality) {
        if (!auth.isLoggedIn()) {
            return { success: false, error: 'Faça login para agendar.' };
        }
        
        const professional = searchSystem.getProfessionalById(professionalId);
        if (!professional) {
            return { success: false, error: 'Profissional não encontrado.' };
        }
        
        const selectedDate = new Date(dateTime);
        if (selectedDate < new Date()) {
            return { success: false, error: 'Selecione uma data/hora futura.' };
        }
        
        // Criar agendamento (sem validação de conflito para protótipo)
        const appointment = {
            id: Utils.generateId(),
            userId: auth.getCurrentUser().id,
            professionalId: professionalId,
            professionalName: professional.name,
            professionalSpecialty: professional.specialty,
            professionalAvatar: professional.avatar,
            dateTime: selectedDate.toISOString(),
            modality: modality,
            status: 'confirmed',
            price: professional.price || 0,
            duration: CONFIG.SESSION_DURATION,
            createdAt: new Date().toISOString(),
            notes: ''
        };
        
        this.appointments.push(appointment);
        this.saveAppointments();
        
        return { success: true, appointment };
    }
    
    cancelAppointment(appointmentId) {
        const index = this.appointments.findIndex(a => a.id === appointmentId);
        if (index === -1) {
            return { success: false, error: 'Agendamento não encontrado.' };
        }
        
        this.appointments[index].status = 'cancelled';
        this.appointments[index].cancelledAt = new Date().toISOString();
        this.saveAppointments();
        
        return { success: true };
    }
    
    getUserAppointments() {
        if (!auth.isLoggedIn()) return [];
        
        return this.appointments
            .filter(a => a.userId === auth.getCurrentUser().id)
            .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    }
    
    getUpcomingAppointments() {
        const now = new Date();
        return this.getUserAppointments()
            .filter(a => new Date(a.dateTime) > now && a.status === 'confirmed')
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    }
    
    getPastAppointments() {
        const now = new Date();
        return this.getUserAppointments()
            .filter(a => new Date(a.dateTime) <= now || a.status === 'cancelled')
            .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    }
    
    getAppointmentById(id) {
        return this.appointments.find(a => a.id === id);
    }
    
    getAvailableSlots(professionalId, daysAhead = 14) {
        const slots = [];
        const now = new Date();
        
        for (let i = 0; i < daysAhead; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);
            
            // Gerar horários das 8h às 20h, a cada 30 minutos
            for (let hour = 8; hour <= 20; hour++) {
                for (let minute of [0, 30]) {
                    const slotDate = new Date(date);
                    slotDate.setHours(hour, minute, 0, 0);
                    
                    // Apenas slots futuros
                    if (slotDate > now) {
                        slots.push({
                            id: Utils.generateId(),
                            date: slotDate.toISOString(),
                            available: true,
                            professionalId
                        });
                    }
                }
            }
        }
        
        return slots;
    }
    
    formatAppointmentDetails(appointment) {
        const date = new Date(appointment.dateTime);
        const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        
        return {
            date: `${weekdays[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`,
            time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            dayOfWeek: weekdays[date.getDay()],
            day: date.getDate(),
            month: months[date.getMonth()],
            year: date.getFullYear(),
            modalityLabel: {
                'chat': 'Chat (Mensagem)',
                'audio': 'Áudio (Ligação)',
                'video': 'Vídeo Chamada'
            }[appointment.modality] || appointment.modality
        };
    }
    
    getAppointmentCount() {
        if (!auth.isLoggedIn()) return 0;
        return this.getUserAppointments().filter(a => a.status === 'confirmed').length;
    }
    
    getTotalTherapyHours() {
        if (!auth.isLoggedIn()) return 0;
        const completed = this.getUserAppointments()
            .filter(a => a.status === 'confirmed' && new Date(a.dateTime) < new Date());
        return completed.length * (CONFIG.SESSION_DURATION / 60);
    }
}

const scheduling = new SchedulingSystem();