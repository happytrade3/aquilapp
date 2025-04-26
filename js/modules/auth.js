/**
 * Módulo Auth (anteriormente AuthUI)
 * Responsável pela autenticação e gerenciamento de usuários
 */

class Auth {
    constructor() {
        this.loginOverlay = document.getElementById('login-overlay');
        this.passwordInput = document.getElementById('password-input');
        this.loginButton = document.getElementById('login-button');
        this.createButton = document.getElementById('create-user-button');
        this.loginError = document.getElementById('login-error');
        this.logoutButton = document.getElementById('logout-button');
        this.appTitle = document.getElementById('app-title');
        
        this.newUserModal = document.getElementById('new-user-modal');
        this.newUserName = document.getElementById('new-user-name');
        this.newUserCreate = document.getElementById('new-user-create');
        this.newUserCancel = document.getElementById('new-user-cancel');
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Login com senha existente
        this.loginButton.addEventListener('click', () => this.attemptLogin());
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.attemptLogin();
            }
        });
        
        // Criação de novo usuário pelo botão de criar
        this.createButton.addEventListener('click', () => this.showNewUserModal());
        
        // Confirmação e cancelamento no modal de novo usuário
        this.newUserCreate.addEventListener('click', () => this.createNewUser());
        this.newUserCancel.addEventListener('click', () => this.hideNewUserModal());
        
        // Logout
        this.logoutButton.addEventListener('click', () => this.logout());
    }
    
    attemptLogin() {
        const password = this.passwordInput.value;
        if (!password) {
            this.showLoginError("Por favor, digite uma senha.");
            return;
        }
        
        if (Storage.userExists(password)) {
            // Login bem-sucedido
            Storage.login(password);
            this.loginSuccess();
        } else {
            // Senha não encontrada, perguntar se deseja criar
            this.showNewUserModal();
        }
    }
    
    showNewUserModal() {
        const password = this.passwordInput.value;
        if (!password) {
            this.showLoginError("Por favor, digite uma senha para o novo perfil.");
            return;
        }
        
        // Resetar campo de nome
        this.newUserName.value = '';
        
        // Mostrar modal
        UIUtils.showModal(this.newUserModal);
    }
    
    hideNewUserModal() {
        UIUtils.hideModal(this.newUserModal);
    }
    
    createNewUser() {
        const password = this.passwordInput.value;
        const name = this.newUserName.value.trim();
        
        if (!name) {
            alert("Por favor, digite seu nome.");
            return;
        }
        
        if (Storage.createUser(password, name)) {
            Storage.login(password);
            this.hideNewUserModal();
            this.loginSuccess();
        } else {
            alert("Erro ao criar usuário. Por favor, tente novamente.");
        }
    }
    
    loginSuccess() {
        this.hideLoginError();
        this.loginOverlay.style.display = 'none';
        this.updateAppTitle();
    }
    
    updateAppTitle() {
        const user = Storage.getCurrentUser();
        if (user && user.name) {
            this.appTitle.textContent = `Aqui Lidero ${user.name}`;
        } else {
            this.appTitle.textContent = 'Aqui Lidero Eu';
        }
    }
    
    showLoginError(message) {
        this.loginError.textContent = message || "Senha incorreta, tente novamente.";
        this.loginError.classList.remove('hidden');
        this.passwordInput.value = '';
        setTimeout(() => {
            this.hideLoginError();
        }, 3000);
    }
    
    hideLoginError() {
        this.loginError.classList.add('hidden');
    }
    
    logout() {
        Storage.logout();
        this.passwordInput.value = '';
        this.loginOverlay.style.display = 'flex';
    }
}

// Exposição global para compatibilidade
window.Auth = Auth;
