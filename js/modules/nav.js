/**
 * Módulo Nav (anteriormente NavUI)
 * Responsável pela navegação principal entre módulos
 */

class Nav {
    constructor() {
        // Elementos de navegação
        this.editButton = document.getElementById('edit-button');
        this.reportButton = document.getElementById('report-button');
        this.configButton = document.getElementById('config-button');
        
        // Módulos
        this.editModule = document.getElementById('edit-module');
        this.reportModule = document.getElementById('report-module');
        this.configModule = document.getElementById('config-module');
        
        // Estado da navegação
        this.activeModule = 'edit'; // Valores possíveis: 'edit', 'report', 'config'
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Botão de edição
        this.editButton.addEventListener('click', () => {
            this.switchToModule('edit');
        });
        
        // Botão de relatórios
        this.reportButton.addEventListener('click', () => {
            this.switchToModule('report');
            
            // Atualizar relatórios ao navegar para eles
            if (window.reportUI) {
                window.reportUI.updateReports();
            }
        });
        
        // Botão de configurações
        this.configButton.addEventListener('click', () => {
            this.switchToModule('config');
            
            // Carregar dados do usuário ao navegar para configurações
            if (window.configUI) {
                window.configUI.loadUserData();
            }
        });
    }
    
    // Alternar para um módulo específico
    switchToModule(moduleName) {
        // Atualizar estado interno
        this.activeModule = moduleName;
        
        // Ocultar todos os módulos
        this.editModule.classList.add('hidden');
        this.reportModule.classList.add('hidden');
        this.configModule.classList.add('hidden');
        
        // Remover estado ativo de todos os botões
        this.editButton.classList.remove('active', 'bg-turquoise', 'text-white');
        this.reportButton.classList.remove('active', 'bg-turquoise', 'text-white');
        this.configButton.classList.remove('active', 'bg-turquoise', 'text-white');
        
        this.editButton.classList.add('bg-white', 'text-gray-700');
        this.reportButton.classList.add('bg-white', 'text-gray-700');
        this.configButton.classList.add('bg-white', 'text-gray-700');
        
        // Mostrar o módulo selecionado e marcar o botão como ativo
        switch (moduleName) {
            case 'edit':
                this.editModule.classList.remove('hidden');
                this.editButton.classList.add('active', 'bg-turquoise', 'text-white');
                this.editButton.classList.remove('bg-white', 'text-gray-700');
                break;
            case 'report':
                this.reportModule.classList.remove('hidden');
                this.reportButton.classList.add('active', 'bg-turquoise', 'text-white');
                this.reportButton.classList.remove('bg-white', 'text-gray-700');
                break;
            case 'config':
                this.configModule.classList.remove('hidden');
                this.configButton.classList.add('active', 'bg-turquoise', 'text-white');
                this.configButton.classList.remove('bg-white', 'text-gray-700');
                break;
        }
    }
}

// Exposição global para compatibilidade
window.Nav = Nav;
