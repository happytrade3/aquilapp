/**
 * Módulo Storage (anteriormente AppStorage)
 * Responsável pelo armazenamento persistente e gerenciamento de acesso aos dados
 */

const Storage = {
    // Prefixo para as chaves de localStorage
    prefix: 'aquiLideroEu_',
    
    // Inicializar o armazenamento
    init() {
        // Garantir que o índice de usuários exista
        if (!localStorage.getItem(this.prefix + 'users')) {
            localStorage.setItem(this.prefix + 'users', JSON.stringify({}));
        }
        
        // Definir usuário atual como null (não logado)
        this.currentUser = null;
    },
    
    // Verificar se um usuário (senha) existe
    userExists(password) {
        const users = this.getUsers();
        return !!users[password];
    },
    
    // Obter lista de usuários
    getUsers() {
        try {
            return JSON.parse(localStorage.getItem(this.prefix + 'users')) || {};
        } catch (e) {
            console.error('Erro ao carregar usuários:', e);
            return {};
        }
    },
    
    // Salvar usuário
    saveUser(password, userData) {
        const users = this.getUsers();
        users[password] = userData;
        
        try {
            localStorage.setItem(this.prefix + 'users', JSON.stringify(users));
            return true;
        } catch (e) {
            console.error('Erro ao salvar usuário:', e);
            return false;
        }
    },
    
    // Criar novo usuário
    createUser(password, name) {
        return this.saveUser(password, {
            name: name,
            records: [],
            lastRecord: null
        });
    },
    
    // Atualizar nome do usuário
    updateUserName(password, name) {
        const user = this.getUser(password);
        if (!user) return false;
        
        user.name = name;
        return this.saveUser(password, user);
    },
    
    // Atualizar senha do usuário
    updateUserPassword(oldPassword, newPassword) {
        const user = this.getUser(oldPassword);
        if (!user) return false;
        
        // Remover usuário com senha antiga
        const users = this.getUsers();
        delete users[oldPassword];
        
        // Adicionar usuário com nova senha
        users[newPassword] = user;
        
        try {
            localStorage.setItem(this.prefix + 'users', JSON.stringify(users));
            return true;
        } catch (e) {
            console.error('Erro ao atualizar senha:', e);
            return false;
        }
    },
    
    // Obter dados de um usuário
    getUser(password) {
        const users = this.getUsers();
        return users[password] || null;
    },
    
    // Login de usuário
    login(password) {
        if (!this.userExists(password)) {
            return false;
        }
        
        this.currentUser = password;
        return true;
    },
    
    // Logout de usuário
    logout() {
        this.currentUser = null;
    },
    
    // Obter usuário atual
    getCurrentUser() {
        if (!this.currentUser) return null;
        return this.getUser(this.currentUser);
    },
    
    // Adicionar registro
    addRecord(cycleId, dateTime, data) {
        if (!this.currentUser) return false;
        
        const user = this.getUser(this.currentUser);
        if (!user) return false;
        
        const record = {
            id: Date.now().toString(),
            cycleId,
            dateTime,
            data
        };
        
        // Guardar como último registro
        user.lastRecord = {
            cycleId,
            dateTime,
            data: {...data}
        };
        
        // Adicionar aos registros
        user.records = user.records || [];
        user.records.push(record);
        
        return this.saveUser(this.currentUser, user);
    },
    
    // Obter registros
    getRecords(cycleId = null, startDate = null, endDate = null) {
        if (!this.currentUser) return [];
        
        const user = this.getUser(this.currentUser);
        if (!user || !user.records) return [];
        
        return user.records.filter(record => {
            if (cycleId && record.cycleId !== cycleId) return false;
            
            if (startDate && endDate) {
                const recordDate = new Date(record.dateTime);
                return recordDate >= new Date(startDate) && 
                       recordDate <= new Date(endDate);
            }
            
            return true;
        }).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    },
    
    // Obter último registro
    getLastRecord() {
        if (!this.currentUser) return null;
        
        const user = this.getUser(this.currentUser);
        if (!user) return null;
        
        return user.lastRecord;
    },
    
    // Limpar todos os dados do usuário atual
    clearCurrentUserData() {
        if (!this.currentUser) return false;
        
        const user = this.getUser(this.currentUser);
        if (!user) return false;
        
        user.records = [];
        user.lastRecord = null;
        
        return this.saveUser(this.currentUser, user);
    },
    
    // Exportar todos os dados do usuário atual
    exportAllData() {
        if (!this.currentUser) return null;
        
        const user = this.getUser(this.currentUser);
        if (!user) return null;
        
        return {
            name: user.name,
            records: user.records,
            exportDate: new Date().toISOString()
        };
    }
};

// Inicializar o armazenamento
Storage.init();

// Exposição global para compatibilidade
window.Storage = Storage;
