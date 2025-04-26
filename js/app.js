/**
 * Módulo de inicialização da aplicação
 * Responsável por inicializar todos os componentes
 */

// Inicializar os componentes de UI quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar navegação principal
    window.navUI = new Nav();
    
    // Inicializar autenticação
    window.authUI = new Auth();
    
    // Inicializar configurações
    window.configUI = new Config();
    
    // Inicializar módulo de edição
    window.editUI = new Edit();
    
    // Inicializar módulo de relatórios avançados
    window.reportUI = new Report();
});
