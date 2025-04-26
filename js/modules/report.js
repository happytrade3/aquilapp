/**
 * Módulo Report (anteriormente EnhancedReportUI)
 * Responsável pelos relatórios e visualizações
 */

class Report {
    constructor() {
        this.cycleId = 'biologico'; // Ciclo padrão
        
        // Elementos de UI para filtros de data
        this.reportStartDate = document.getElementById('report-start-date');
        this.reportEndDate = document.getElementById('report-end-date');
        this.filterReportBtn = document.getElementById('filter-report-btn');
        
        // Elementos para controles de visualização
        this.historyViewOptions = document.querySelectorAll('.history-view-option');
        this.historySort = document.getElementById('history-sort');
        this.historyCategoryFilter = document.getElementById('history-category-filter');
        this.itemsPerPage = document.getElementById('items-per-page');
        
        // Elementos para visualizações
        this.historyCardsContainer = document.getElementById('history-cards-container');
        this.historyTableContainer = document.getElementById('history-table-container');
        this.historyTableBody = document.getElementById('history-table-body');
        
        // Elementos de paginação
        this.paginationPages = document.getElementById('pagination-pages');
        this.paginationButtons = document.querySelectorAll('.history-pagination-button');
        
        // Elementos para modal de filtro de categorias
        this.categoryFilterModal = document.getElementById('category-filter-modal');
        this.categoryFilterContent = document.getElementById('category-filter-content');
        this.categoryFilterClose = document.getElementById('category-filter-close');
        this.selectAllCategoriesBtn = document.getElementById('select-all-categories-btn');
        this.deselectAllCategoriesBtn = document.getElementById('deselect-all-categories-btn');
        this.applyCategoryFilter = document.getElementById('apply-category-filter');
        
        // Elementos para modal de exportação
        this.exportHistoryBtn = document.getElementById('export-history-btn');
        this.exportModal = document.getElementById('export-modal');
        this.exportModalClose = document.getElementById('export-modal-close');
        this.exportCategories = document.getElementById('export-categories');
        this.exportPreview = document.getElementById('export-preview');
        this.exportCancel = document.getElementById('export-cancel');
        this.exportDownload = document.getElementById('export-download');
        
        // Elementos para gráficos
        this.trendChartOptions = document.getElementById('trend-chart-options');
        this.trendChartDownload = document.getElementById('trend-chart-download');
        this.radarChartOptions = document.getElementById('radar-chart-options');
        this.radarChartDownload = document.getElementById('radar-chart-download');
        
        // Estados
        this.currentView = 'cards';
        this.currentSort = 'date-desc';
        this.currentPage = 1;
        this.itemsPerPageValue = 10;
        this.totalPages = 1;
        this.enabledCategories = new Set(); // Categorias ativas para visualização
        this.allCategories = []; // Lista de todas as categorias disponíveis
        this.filteredRecords = []; // Registros já filtrados por data
        this.displayRecords = []; // Registros após paginação e ordenação
        
        // Charts
        this.trendChart = null;
        this.radarChart = null;
        
        this.initEventListeners();
        this.initCharts();
        this.setInitialDates();
        this.loadCategories();
    }
    
    initEventListeners() {
        // Filtrar relatórios
        if (this.filterReportBtn) {
            this.filterReportBtn.addEventListener('click', () => {
                this.updateReports();
            });
        }
        
        // Alternar entre visualizações
        this.historyViewOptions.forEach(option => {
            option.addEventListener('click', () => {
                const view = option.getAttribute('data-view');
                this.setView(view);
            });
        });
        
        // Mudar ordenação
        if (this.historySort) {
            this.historySort.addEventListener('change', () => {
                this.currentSort = this.historySort.value;
                this.sortRecords();
                this.updateDisplay();
            });
        }
        
        // Abrir modal de filtro de categorias
        if (this.historyCategoryFilter) {
            this.historyCategoryFilter.addEventListener('click', () => {
                this.showCategoryFilterModal();
            });
        }
        
        // Fechar modal de filtro de categorias
        if (this.categoryFilterClose) {
            this.categoryFilterClose.addEventListener('click', () => {
                this.hideCategoryFilterModal();
            });
        }
        
        // Selecionar todas as categorias
        if (this.selectAllCategoriesBtn) {
            this.selectAllCategoriesBtn.addEventListener('click', () => {
                this.selectAllCategories();
            });
        }
        
        // Desmarcar todas as categorias
        if (this.deselectAllCategoriesBtn) {
            this.deselectAllCategoriesBtn.addEventListener('click', () => {
                this.deselectAllCategories();
            });
        }
        
        // Aplicar filtro de categorias
        if (this.applyCategoryFilter) {
            this.applyCategoryFilter.addEventListener('click', () => {
                this.applyCategories();
                this.hideCategoryFilterModal();
            });
        }
        
        // Paginação
        this.paginationButtons.forEach(button => {
            button.addEventListener('click', () => {
                const page = button.getAttribute('data-page');
                this.changePage(page);
            });
        });
        
        // Itens por página
        if (this.itemsPerPage) {
            this.itemsPerPage.addEventListener('change', () => {
                this.itemsPerPageValue = parseInt(this.itemsPerPage.value, 10);
                this.currentPage = 1; // Voltar para a primeira página
                this.updatePagination();
                this.updateDisplay();
            });
        }
        
        // Exportação
        if (this.exportHistoryBtn) {
            this.exportHistoryBtn.addEventListener('click', () => {
                this.showExportModal();
            });
        }
        
        // Fechar modal de exportação
        if (this.exportModalClose) {
            this.exportModalClose.addEventListener('click', () => {
                this.hideExportModal();
            });
        }
        
        // Cancelar exportação
        if (this.exportCancel) {
            this.exportCancel.addEventListener('click', () => {
                this.hideExportModal();
            });
        }
        
        // Download da exportação
        if (this.exportDownload) {
            this.exportDownload.addEventListener('click', () => {
                this.performExport();
            });
        }
        
        // Download de gráficos
        if (this.trendChartDownload) {
            this.trendChartDownload.addEventListener('click', () => {
                this.downloadChart('trend-chart', 'tendencias');
            });
        }
        
        if (this.radarChartDownload) {
            this.radarChartDownload.addEventListener('click', () => {
                this.downloadChart('radar-chart', 'visao-geral');
            });
        }
        
        // Opções de gráficos
        if (this.trendChartOptions) {
            this.trendChartOptions.addEventListener('click', () => {
                this.showChartOptions('trend');
            });
        }
        
        if (this.radarChartOptions) {
            this.radarChartOptions.addEventListener('click', () => {
                this.showChartOptions('radar');
            });
        }
        
        // Abas de relatórios
        const reportTabs = document.querySelectorAll('#report-tabs button[data-report]');
        reportTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const reportId = tab.dataset.report;
                this.switchCycle(reportId);
            });
        });
    }
    
    // Definir datas iniciais para o período
    setInitialDates() {
        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        if (this.reportEndDate) {
            this.reportEndDate.value = now.toISOString().split('T')[0];
        }
        
        if (this.reportStartDate) {
            this.reportStartDate.value = oneMonthAgo.toISOString().split('T')[0];
        }
    }
    
    // Inicializar gráficos
    initCharts() {
        // Gráfico de tendências
        const trendCtx = document.getElementById('trend-chart');
        if (trendCtx) {
            this.trendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'white',
                            titleColor: '#374151',
                            bodyColor: '#4b5563',
                            borderColor: '#e5e7eb',
                            borderWidth: 1,
                            padding: 10,
                            boxWidth: 10,
                            boxHeight: 10,
                            usePointStyle: true,
                            callbacks: {
                                title: function(tooltipItems) {
                                    return tooltipItems[0].label;
                                },
                                label: function(context) {
                                    const value = context.raw;
                                    if (value === null || value === undefined) return '';
                                    
                                    const label = context.dataset.label || '';
                                    const valueMap = {
                                        '5': 'Excelente',
                                        '4': 'Bom',
                                        '3': 'Regular',
                                        '2': 'Ruim',
                                        '1': 'Péssimo'
                                    };
                                    
                                    return `${label}: ${valueMap[value] || value}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            min: 1,
                            max: 5,
                            ticks: {
                                stepSize: 1,
                                callback: function(value) {
                                    const valueMap = {
                                        '5': 'Excelente',
                                        '4': 'Bom',
                                        '3': 'Regular',
                                        '2': 'Ruim',
                                        '1': 'Péssimo'
                                    };
                                    return valueMap[value] || value;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Gráfico de radar
        const radarCtx = document.getElementById('radar-chart');
        if (radarCtx) {
            this.radarChart = new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Valores Atuais',
                        backgroundColor: 'rgba(26, 158, 173, 0.2)',
                        borderColor: '#1A9EAD',
                        pointBackgroundColor: '#1A9EAD',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#1A9EAD',
                        data: []
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 1,
                            suggestedMax: 5,
                            ticks: {
                                stepSize: 1,
                                backdropColor: 'transparent'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'white',
                            titleColor: '#374151',
                            bodyColor: '#4b5563',
                            borderColor: '#e5e7eb',
                            borderWidth: 1,
                            padding: 10,
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw;
                                    const valueMap = {
                                        '5': 'Excelente',
                                        '4': 'Bom',
                                        '3': 'Regular',
                                        '2': 'Ruim',
                                        '1': 'Péssimo'
                                    };
                                    return `${context.label}: ${valueMap[value] || value}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // Carregar todas as categorias disponíveis
    loadCategories() {
        this.allCategories = Data.getAllSubcategories(this.cycleId);
        
        // Inicialmente todas as categorias estão ativas
        this.allCategories.forEach(category => {
            this.enabledCategories.add(category.fullId);
        });
    }
    
    // Trocar para outro ciclo
    switchCycle(cycleId) {
        if (this.cycleId === cycleId) return;
        
        this.cycleId = cycleId;
        
        // Atualizar abas
        const reportTabs = document.querySelectorAll('#report-tabs button[data-report]');
        reportTabs.forEach(t => t.classList.remove('tab-active', 'text-turquoise'));
        reportTabs.forEach(t => t.classList.add('text-gray-500', 'opacity-60'));
        
        const activeTab = document.querySelector(`#report-tabs button[data-report="${cycleId}"]`);
        if (activeTab) {
            activeTab.classList.add('tab-active', 'text-turquoise');
            activeTab.classList.remove('text-gray-500', 'opacity-60');
        }
        
        // Atualizar painéis
        const reportPanels = document.querySelectorAll('.report-panel');
        reportPanels.forEach(panel => {
            if (panel.dataset.report === cycleId) {
                panel.classList.remove('hidden');
            } else {
                panel.classList.add('hidden');
            }
        });
        
        // Atualizar filtro de categorias
        this.enabledCategories.clear();
        this.loadCategories();
        
        // Atualizar relatórios
        this.updateReports();
    }
    
    // Atualizar todos os relatórios
    updateReports() {
        // Mostrar indicador de carregamento
        this.showLoading(true);
        
        // Buscar registros com base no filtro de data
        const startDate = this.reportStartDate ? this.reportStartDate.value : null;
        const endDate = this.reportEndDate ? this.reportEndDate.value : null;
        
        // Usar setTimeout para simular carregamento assíncrono e permitir que o UI responda
        setTimeout(() => {
            this.filteredRecords = Storage.getRecords(this.cycleId, startDate, endDate);
            
            // Atualizar gráficos
            this.updateCharts();
            
            // Ordenar e paginar registros
            this.sortRecords();
            this.updatePagination();
            
            // Atualizar a visualização
            this.updateDisplay();
            
            // Esconder indicador de carregamento
            this.showLoading(false);
        }, 500); // Delay artificial de 500ms para feedback visual
    }
    
    // Mostrar/ocultar indicador de carregamento
    showLoading(show) {
        const loadingElement = document.getElementById('history-loading');
        if (loadingElement) {
            if (show) {
                loadingElement.style.display = 'flex';
            } else {
                loadingElement.style.display = 'none';
            }
        }
    }
    
    // Ordenar registros com base no critério atual
    sortRecords() {
        const records = [...this.filteredRecords]; // Clonar para não modificar o original
        
        switch (this.currentSort) {
            case 'date-desc':
                records.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
                break;
            case 'date-asc':
                records.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
                break;
            case 'rating-desc':
                records.sort((a, b) => this.calculateAverageRating(b) - this.calculateAverageRating(a));
                break;
            case 'rating-asc':
                records.sort((a, b) => this.calculateAverageRating(a) - this.calculateAverageRating(b));
                break;
        }
        
        this.filteredRecords = records;
    }
    
    // Calcular média de avaliações para ordenação
    calculateAverageRating(record) {
        let sum = 0;
        let count = 0;
        
        // Percorrer dados do registro
        for (const key in record.data) {
            const value = record.data[key];
            
            // Considerar apenas valores numéricos
            if (typeof value === 'number' || !isNaN(parseInt(value))) {
                sum += parseInt(value);
                count++;
            }
        }
        
        return count > 0 ? sum / count : 0;
    }
    
    // Atualizar paginação
    updatePagination() {
        const totalRecords = this.filteredRecords.length;
        this.totalPages = Math.ceil(totalRecords / this.itemsPerPageValue) || 1;
        
        // Garantir que a página atual é válida
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }
        
        // Recortar registros para a página atual
        const startIndex = (this.currentPage - 1) * this.itemsPerPageValue;
        const endIndex = startIndex + this.itemsPerPageValue;
        this.displayRecords = this.filteredRecords.slice(startIndex, endIndex);
        
        // Atualizar botões de paginação
        this.renderPaginationButtons();
    }
    
    // Renderizar botões de paginação
    renderPaginationButtons() {
        if (!this.paginationPages) return;
        
        this.paginationPages.innerHTML = '';
        
        // Determinar quais páginas mostrar
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(this.totalPages, startPage + 4);
        
        // Ajustar startPage se necessário
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Botão para primeira página
        if (startPage > 1) {
            const firstBtn = document.createElement('button');
            firstBtn.className = 'history-pagination-button';
            firstBtn.textContent = '1';
            firstBtn.setAttribute('data-page', '1');
            firstBtn.addEventListener('click', () => this.changePage(1));
            this.paginationPages.appendChild(firstBtn);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'history-pagination-button';
                ellipsis.textContent = '...';
                ellipsis.style.pointerEvents = 'none';
                this.paginationPages.appendChild(ellipsis);
            }
        }
        
        // Botões para as páginas
        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = 'history-pagination-button' + (i === this.currentPage ? ' active' : '');
            btn.textContent = i;
            btn.setAttribute('data-page', i);
            btn.addEventListener('click', () => this.changePage(i));
            this.paginationPages.appendChild(btn);
        }
        
        // Botão para última página
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'history-pagination-button';
                ellipsis.textContent = '...';
                ellipsis.style.pointerEvents = 'none';
                this.paginationPages.appendChild(ellipsis);
            }
            
            const lastBtn = document.createElement('button');
            lastBtn.className = 'history-pagination-button';
            lastBtn.textContent = this.totalPages;
            lastBtn.setAttribute('data-page', this.totalPages);
            lastBtn.addEventListener('click', () => this.changePage(this.totalPages));
            this.paginationPages.appendChild(lastBtn);
        }
        
        // Habilitar/desabilitar botões de anterior/próximo
        const prevButton = document.querySelector('.history-pagination-button[data-page="prev"]');
        const nextButton = document.querySelector('.history-pagination-button[data-page="next"]');
        
        if (prevButton) {
            prevButton.disabled = this.currentPage === 1;
            prevButton.style.opacity = this.currentPage === 1 ? '0.5' : '1';
        }
        
        if (nextButton) {
            nextButton.disabled = this.currentPage === this.totalPages;
            nextButton.style.opacity = this.currentPage === this.totalPages ? '0.5' : '1';
        }
    }
    
    // Mudar página
    changePage(page) {
        if (page === 'prev') {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        } else if (page === 'next') {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        } else {
            this.currentPage = parseInt(page);
        }
        
        this.updatePagination();
        this.updateDisplay();
    }
    
    // Definir modo de visualização
    setView(view) {
        this.currentView = view;
        
        // Atualizar botões
        this.historyViewOptions.forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-view') === view);
        });
        
        // Atualizar containers
        if (view === 'cards') {
            this.historyCardsContainer.classList.remove('hidden');
            this.historyTableContainer.classList.add('hidden');
        } else {
            this.historyCardsContainer.classList.add('hidden');
            this.historyTableContainer.classList.remove('hidden');
        }
        
        this.updateDisplay();
    }
    
    // Atualizar visualização baseada nos registros
    updateDisplay() {
        if (this.currentView === 'cards') {
            this.updateCardsView();
        } else {
            this.updateTableView();
        }
    }
    
    // Atualizar visualização em cartões
    updateCardsView() {
        if (!this.historyCardsContainer) return;
        
        // Limpar container
        this.historyCardsContainer.innerHTML = '';
        
        if (this.displayRecords.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'col-span-full flex justify-center items-center py-12';
            emptyMessage.innerHTML = '<span class="text-gray-500">Nenhum registro encontrado para o período selecionado.</span>';
            this.historyCardsContainer.appendChild(emptyMessage);
            return;
        }
        
        // Criar cartões para cada registro
        this.displayRecords.forEach(record => {
            const card = this.createHistoryCard(record);
            this.historyCardsContainer.appendChild(card);
        });
    }
    
    // Criar cartão de histórico para um registro
    createHistoryCard(record) {
        const card = document.createElement('div');
        card.className = 'history-card';
        
        // Data e hora
        const date = new Date(record.dateTime);
        const formattedDate = UIUtils.formatDate(date);
        const formattedTime = UIUtils.formatTime(date);
        
        // Cabeçalho do cartão
        const header = document.createElement('div');
        header.className = 'history-card-header';
        header.innerHTML = `
            <div class="history-card-date">${formattedDate}</div>
            <div class="history-card-time">${formattedTime}</div>
        `;
        card.appendChild(header);
        
        // Corpo do cartão
        const body = document.createElement('div');
        body.className = 'history-card-body';
        
        // Agrupar dados por categoria
        const categoryGroups = this.groupDataByCategory(record.data);
        
        // Criar seções para cada categoria
        for (const categoryId in categoryGroups) {
            // Verificar se alguma subcategoria está ativa
            const hasActiveSubcategory = Object.keys(categoryGroups[categoryId].subcategories)
                .some(subId => this.enabledCategories.has(`${categoryId}-${subId}`));
            
            if (!hasActiveSubcategory) continue; // Pular categoria se nenhuma subcategoria estiver ativa
            
            const categoryData = categoryGroups[categoryId];
            
            // Criar seção da categoria
            const categorySection = document.createElement('div');
            categorySection.className = 'history-card-category';
            
            // Título da categoria com ícone
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'history-card-category-title';
            
            // Definir ícone baseado na categoria
            let categoryIcon = 'fa-star'; // Ícone padrão
            
            switch (categoryId) {
                case 'sono':
                    categoryIcon = 'fa-bed';
                    break;
                case 'sonhos':
                    categoryIcon = 'fa-cloud';
                    break;
                case 'alimentacao':
                    categoryIcon = 'fa-utensils';
                    break;
                case 'maconha':
                    categoryIcon = 'fa-cannabis';
                    break;
                case 'atividade':
                    categoryIcon = 'fa-running';
                    break;
                case 'hidratacao':
                    categoryIcon = 'fa-tint';
                    break;
            }
            
            categoryTitle.innerHTML = `<i class="fas ${categoryIcon}"></i> ${categoryData.name}`;
            categorySection.appendChild(categoryTitle);
            
            // Subcategorias
            const subcategories = categoryData.subcategories;
            for (const subId in subcategories) {
                const fullId = `${categoryId}-${subId}`;
                
                // Verificar se a subcategoria está habilitada
                if (!this.enabledCategories.has(fullId)) continue;
                
                const subData = subcategories[subId];
                
                // Criar item de subcategoria
                const subItem = document.createElement('div');
                subItem.className = 'history-card-subcategory';
                
                // Valor
                let displayValue = Data.formatValue(subData.value, subData.type);
                let statusClass = Data.getStatusClass(subData.value);
                
                subItem.innerHTML = `
                    <div class="history-card-subcategory-name">${subData.name}</div>
                    <div class="history-card-subcategory-value ${statusClass}">${displayValue}</div>
                `;
                
                categorySection.appendChild(subItem);
                
                // Adicionar notas se existirem
                if (subData.notes) {
                    const notesElement = document.createElement('div');
                    notesElement.className = 'history-card-notes';
                    notesElement.textContent = subData.notes;
                    categorySection.appendChild(notesElement);
                }
            }
            
            body.appendChild(categorySection);
        }
        
        // Se não houver dados ativos para mostrar
        if (body.children.length === 0) {
            body.innerHTML = '<div class="text-center text-gray-500 py-4">Nenhum dado disponível para as categorias selecionadas.</div>';
        }
        
        card.appendChild(body);
        
        return card;
    }
    
    // Agrupar dados do registro por categoria
    groupDataByCategory(data) {
        const result = {};
        
        // Primeiro, coletar todas as categorias e subcategorias
        this.allCategories.forEach(cat => {
            // Criar categoria se não existir
            if (!result[cat.categoryId]) {
                result[cat.categoryId] = {
                    name: cat.categoryName,
                    subcategories: {}
                };
            }
            
            // Adicionar subcategoria
            result[cat.categoryId].subcategories[cat.subcategoryId] = {
                name: cat.subcategoryName,
                type: cat.type,
                value: null,
                notes: null
            };
        });
        
        // Preencher com os valores reais do registro
        for (const key in data) {
            const parts = key.split('-');
            
            if (parts.length < 2) continue;
            
            const catId = parts[0];
            const subId = parts[1];
            
            // Verificar se é uma chave de nota (ex: "sono-qualidade-notes")
            if (key.startsWith(`${catId}-${subId}`) && !key.endsWith('-notes')) {
                // Valores normais
                if (result[catId] && result[catId].subcategories[subId]) {
                    result[catId].subcategories[subId].value = data[key];
                }
            } else if (key.startsWith(`${catId}-${subId}-notes`) || key === `${catId}-${subId}`) {
                // Notas
                if (result[catId] && result[catId].subcategories[subId]) {
                    result[catId].subcategories[subId].notes = data[key];
                }
            }
        }
        
        return result;
    }
    
    // Atualizar visualização em tabela
    updateTableView() {
        if (!this.historyTableContainer || !this.historyTableBody) return;
        
        // Limpar corpo da tabela
        this.historyTableBody.innerHTML = '';
        
        // Limpar e recriar cabeçalhos
        const tableHead = this.historyTableContainer.querySelector('thead tr');
        tableHead.innerHTML = '<th class="history-table-date">Data/Hora</th>';
        
        if (this.displayRecords.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="20" class="text-center py-4 text-gray-500">Nenhum registro encontrado para o período selecionado.</td>';
            this.historyTableBody.appendChild(emptyRow);
            return;
        }
        
        // Coletar todas as subcategorias ativas
        const activeSubcategories = this.allCategories
            .filter(subcat => this.enabledCategories.has(subcat.fullId))
            .sort((a, b) => {
                // Ordenar primeiro por categoria, depois por subcategoria
                if (a.categoryName !== b.categoryName) {
                    return a.categoryName.localeCompare(b.categoryName);
                }
                return a.subcategoryName.localeCompare(b.subcategoryName);
            });
        
        // Adicionar cabeçalhos
        activeSubcategories.forEach(subcat => {
            const th = document.createElement('th');
            th.textContent = `${subcat.categoryName} - ${subcat.subcategoryName}`;
            tableHead.appendChild(th);
        });
        
        // Adicionar linhas para cada registro
        this.displayRecords.forEach(record => {
            const row = document.createElement('tr');
            
            // Célula de data/hora
            const date = new Date(record.dateTime);
            const dateCell = document.createElement('td');
            dateCell.className = 'history-table-date';
            dateCell.innerHTML = `
                ${UIUtils.formatDate(date)}
                <div class="history-table-time">${UIUtils.formatTime(date)}</div>
            `;
            row.appendChild(dateCell);
            
            // Células para cada subcategoria ativa
            activeSubcategories.forEach(subcat => {
                const cell = document.createElement('td');
                cell.className = 'history-table-cell';
                
                const fullId = subcat.fullId;
                const value = record.data[fullId];
                
                if (value !== undefined && value !== null) {
                    const formattedValue = Data.formatValue(value, subcat.type);
                    const statusClass = Data.getStatusClass(value);
                    
                    cell.innerHTML = `<span class="history-table-value ${statusClass}">${formattedValue}</span>`;
                    
                    // Verificar se há notas
                    const notesKey = `${subcat.fullId}`;
                    if (record.data[notesKey] && record.data[notesKey].trim() !== '') {
                        // Indicador de nota
                        const indicator = document.createElement('div');
                        indicator.className = 'history-table-notes-indicator';
                        cell.appendChild(indicator);
                        
                        // Tooltip com a nota
                        const tooltip = document.createElement('div');
                        tooltip.className = 'history-table-notes-tooltip';
                        tooltip.textContent = record.data[notesKey];
                        cell.appendChild(tooltip);
                    }
                } else {
                    cell.innerHTML = '<span class="text-gray-400">-</span>';
                }
                
                row.appendChild(cell);
            });
            
            this.historyTableBody.appendChild(row);
        });
    }
    
    // Atualizar gráficos
    updateCharts() {
        if (this.filteredRecords.length === 0) {
            // Sem dados para mostrar
            if (this.trendChart) {
                this.trendChart.data.labels = [];
                this.trendChart.data.datasets = [];
                this.trendChart.update();
            }
            
            if (this.radarChart) {
                this.radarChart.data.labels = [];
                this.radarChart.data.datasets[0].data = [];
                this.radarChart.update();
            }
            return;
        }
        
        // Atualizar gráfico de tendências
        this.updateTrendChart();
        
        // Atualizar gráfico de radar
        this.updateRadarChart();
    }
    
    // Atualizar gráfico de tendências
    updateTrendChart() {
        if (!this.trendChart) return;
        
        // Categorias ativas para mostrar no gráfico
        const activeSubcategories = this.allCategories
            .filter(sub => this.enabledCategories.has(sub.fullId) && sub.type !== 'boolean');
        
        // Limitar a 5 categorias para manter o gráfico legível
        const limitedSubcategories = activeSubcategories.slice(0, 5);
        
        // Ordenar registros por data (do mais antigo para o mais recente)
        const sortedRecords = [...this.filteredRecords]
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        
        // Preparar datas e dados
        const dates = sortedRecords.map(record => {
            const date = new Date(record.dateTime);
            return date.toLocaleDateString('pt-BR');
        });
        
        const datasets = limitedSubcategories.map((sub, index) => {
            const color = this.getColorForIndex(index);
            
            return {
                label: `${sub.categoryName} - ${sub.subcategoryName}`,
                data: sortedRecords.map(record => record.data[sub.fullId] || null),
                borderColor: color,
                backgroundColor: color,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            };
        });
        
        // Atualizar gráfico
        this.trendChart.data.labels = dates;
        this.trendChart.data.datasets = datasets;
        this.trendChart.update();
        
        // Atualizar legenda
        this.updateChartLegend('trend', limitedSubcategories);
    }
    
    // Atualizar gráfico de radar
    updateRadarChart() {
        if (!this.radarChart) return;
        
        // Usar o registro mais recente
        const latestRecord = this.filteredRecords[0]; // Já está ordenado por data desc
        
        if (!latestRecord) return;
        
        // Categorias ativas para mostrar no gráfico
        const activeSubcategories = this.allCategories
            .filter(sub => this.enabledCategories.has(sub.fullId) && sub.type !== 'boolean');
        
        // Limitar a 8 categorias para manter o gráfico legível
        const limitedSubcategories = activeSubcategories.slice(0, 8);
        
        // Obter valores para o radar
        const labels = limitedSubcategories.map(sub => `${sub.categoryName} - ${sub.subcategoryName}`);
        const data = limitedSubcategories.map(sub => {
            const value = latestRecord.data[sub.fullId];
            return value !== undefined && value !== null ? value : 0;
        });
        
        // Atualizar gráfico
        this.radarChart.data.labels = labels;
        this.radarChart.data.datasets[0].data = data;
        this.radarChart.update();
        
        // Atualizar legenda
        this.updateChartLegend('radar', limitedSubcategories);
    }
    
    // Atualizar legenda de gráfico
    updateChartLegend(chartType, categories) {
        // Encontrar o container da legenda
        const chartCard = document.querySelector(`.chart-card:has(#${chartType}-chart)`);
        if (!chartCard) return;
        
        // Verificar se já existe uma legenda e removê-la
        let legendContainer = chartCard.querySelector('.chart-legend');
        if (!legendContainer) {
            // Criar novo container para a legenda
            legendContainer = document.createElement('div');
            legendContainer.className = 'chart-legend';
            chartCard.appendChild(legendContainer);
        } else {
            // Limpar legenda existente
            legendContainer.innerHTML = '';
        }
        
        // Criar itens de legenda
        categories.forEach((category, index) => {
            const color = this.getColorForIndex(index);
            
            const legendItem = document.createElement('div');
            legendItem.className = 'chart-legend-item';
            legendItem.innerHTML = `
                <div class="chart-legend-color" style="background-color: ${color}"></div>
                <span>${category.categoryName} - ${category.subcategoryName}</span>
            `;
            
            legendContainer.appendChild(legendItem);
        });
    }
    
    // Mostrar modal de filtro de categorias
    showCategoryFilterModal() {
        if (!this.categoryFilterModal || !this.categoryFilterContent) return;
        
        // Limpar conteúdo
        this.categoryFilterContent.innerHTML = '';
        
        // Agrupar por categoria
        const categoriesByGroup = {};
        
        this.allCategories.forEach(subcat => {
            if (!categoriesByGroup[subcat.categoryId]) {
                categoriesByGroup[subcat.categoryId] = {
                    name: subcat.categoryName,
                    subcategories: []
                };
            }
            
            categoriesByGroup[subcat.categoryId].subcategories.push({
                id: subcat.subcategoryId,
                name: subcat.subcategoryName,
                fullId: subcat.fullId,
                enabled: this.enabledCategories.has(subcat.fullId)
            });
        });
        
        // Criar interface para cada grupo
        for (const categoryId in categoriesByGroup) {
            const category = categoriesByGroup[categoryId];
            
            const categoryGroup = document.createElement('div');
            categoryGroup.className = 'mb-4';
            
            // Cabeçalho da categoria
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'flex items-center mb-2';
            
            // Toggle para toda a categoria
            const allSubcategoriesEnabled = category.subcategories.every(sub => sub.enabled);
            const someCategoriesEnabled = category.subcategories.some(sub => sub.enabled);
            
            categoryHeader.innerHTML = `
                <input type="checkbox" class="category-group-toggle mr-2" 
                       data-category="${categoryId}" 
                       ${allSubcategoriesEnabled ? 'checked' : ''} 
                       ${allSubcategoriesEnabled !== someCategoriesEnabled ? 'indeterminate' : ''}>
                <span class="font-medium text-gray-800">${category.name}</span>
            `;
            
            categoryGroup.appendChild(categoryHeader);
            
            // Container de subcategorias com indentação
            const subcategoriesContainer = document.createElement('div');
            subcategoriesContainer.className = 'ml-6';
            
            // Adicionar subcategorias
            category.subcategories.forEach(subcat => {
                const subcategoryItem = document.createElement('div');
                subcategoryItem.className = 'flex items-center mb-1';
                subcategoryItem.innerHTML = `
                    <input type="checkbox" class="subcategory-toggle mr-2" 
                           data-category="${categoryId}" 
                           data-subcategory="${subcat.id}" 
                           data-fullid="${subcat.fullId}" 
                           ${subcat.enabled ? 'checked' : ''}>
                    <span class="text-gray-700">${subcat.name}</span>
                `;
                
                subcategoriesContainer.appendChild(subcategoryItem);
            });
            
            categoryGroup.appendChild(subcategoriesContainer);
            this.categoryFilterContent.appendChild(categoryGroup);
        }
        
        // Adicionar evento de toggle para categorias
        const categoryToggles = this.categoryFilterContent.querySelectorAll('.category-group-toggle');
        categoryToggles.forEach(toggle => {
            // Estado indeterminado para seleção parcial
            if (toggle.hasAttribute('indeterminate')) {
                toggle.indeterminate = true;
            }
            
            toggle.addEventListener('change', e => {
                const categoryId = e.target.dataset.category;
                const checked = e.target.checked;
                
                // Atualizar todas as subcategorias
                const subcatToggles = this.categoryFilterContent.querySelectorAll(
                    `.subcategory-toggle[data-category="${categoryId}"]`
                );
                
                subcatToggles.forEach(subToggle => {
                    subToggle.checked = checked;
                });
            });
        });
        
        // Adicionar evento para subcategorias atualizarem o estado do grupo
        const subcategoryToggles = this.categoryFilterContent.querySelectorAll('.subcategory-toggle');
        subcategoryToggles.forEach(toggle => {
            toggle.addEventListener('change', e => {
                const categoryId = e.target.dataset.category;
                
                // Verificar estado de todas as subcategorias
                const subcatToggles = this.categoryFilterContent.querySelectorAll(
                    `.subcategory-toggle[data-category="${categoryId}"]`
                );
                
                const allChecked = Array.from(subcatToggles).every(t => t.checked);
                const someChecked = Array.from(subcatToggles).some(t => t.checked);
                
                // Atualizar toggle da categoria
                const categoryToggle = this.categoryFilterContent.querySelector(
                    `.category-group-toggle[data-category="${categoryId}"]`
                );
                
                if (categoryToggle) {
                    categoryToggle.checked = allChecked;
                    categoryToggle.indeterminate = !allChecked && someChecked;
                }
            });
        });
        
        // Mostrar modal
        UIUtils.showModal(this.categoryFilterModal);
    }
    
    // Ocultar modal de filtro de categorias
    hideCategoryFilterModal() {
        UIUtils.hideModal(this.categoryFilterModal);
    }
    
    // Selecionar todas as categorias
    selectAllCategories() {
        if (!this.categoryFilterContent) return;
        
        const allToggles = this.categoryFilterContent.querySelectorAll('input[type="checkbox"]');
        allToggles.forEach(toggle => {
            toggle.checked = true;
            toggle.indeterminate = false;
        });
    }
    
    // Desmarcar todas as categorias
    deselectAllCategories() {
        if (!this.categoryFilterContent) return;
        
        const allToggles = this.categoryFilterContent.querySelectorAll('input[type="checkbox"]');
        allToggles.forEach(toggle => {
            toggle.checked = false;
            toggle.indeterminate = false;
        });
    }
    
    // Aplicar seleção de categorias
    applyCategories() {
        if (!this.categoryFilterContent) return;
        
        // Limpar conjunto atual
        this.enabledCategories.clear();
        
        // Coletar categorias habilitadas
        const enabledSubcatToggles = this.categoryFilterContent.querySelectorAll('.subcategory-toggle:checked');
        enabledSubcatToggles.forEach(toggle => {
            const fullId = toggle.dataset.fullid;
            this.enabledCategories.add(fullId);
        });
        
        // Atualizar contador de categorias selecionadas
        const countSpan = document.getElementById('selected-categories-count');
        if (countSpan) {
            if (this.enabledCategories.size === this.allCategories.length) {
                countSpan.textContent = 'Todas';
            } else {
                countSpan.textContent = this.enabledCategories.size;
            }
        }
        
        // Atualizar visualização e gráficos
        this.updateDisplay();
        this.updateCharts();
    }
    
    // Mostrar modal de exportação
    showExportModal() {
        if (!this.exportModal || !this.exportCategories) return;
        
        // Limpar conteúdo
        this.exportCategories.innerHTML = '';
        
        // Agrupar por categoria
        const categoriesByGroup = {};
        
        this.allCategories.forEach(subcat => {
            if (!categoriesByGroup[subcat.categoryId]) {
                categoriesByGroup[subcat.categoryId] = {
                    name: subcat.categoryName,
                    subcategories: []
                };
            }
            
            categoriesByGroup[subcat.categoryId].subcategories.push({
                id: subcat.subcategoryId,
                name: subcat.subcategoryName,
                fullId: subcat.fullId,
                enabled: this.enabledCategories.has(subcat.fullId)
            });
        });
        
        // Criar interface para cada grupo
        for (const categoryId in categoriesByGroup) {
            const category = categoriesByGroup[categoryId];
            
            const categoryGroup = document.createElement('div');
            categoryGroup.className = 'export-category-group';
            
            // Cabeçalho da categoria
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'export-category-header';
            
            // Toggle para toda a categoria
            const allSubcategoriesEnabled = category.subcategories.every(sub => sub.enabled);
            
            categoryHeader.innerHTML = `
                <input type="checkbox" class="export-category-toggle" 
                       data-category="${categoryId}" 
                       ${allSubcategoriesEnabled ? 'checked' : ''}>
                <span class="export-category-name">${category.name}</span>
            `;
            
            categoryGroup.appendChild(categoryHeader);
            
            // Container de subcategorias
            const subcategoriesContainer = document.createElement('div');
            subcategoriesContainer.className = 'export-subcategories';
            
            // Adicionar subcategorias
            category.subcategories.forEach(subcat => {
                const subcategoryItem = document.createElement('div');
                subcategoryItem.className = 'export-subcategory';
                subcategoryItem.innerHTML = `
                    <input type="checkbox" class="export-subcategory-toggle" 
                           data-category="${categoryId}" 
                           data-subcategory="${subcat.id}" 
                           data-fullid="${subcat.fullId}" 
                           ${subcat.enabled ? 'checked' : ''}>
                    <span>${subcat.name}</span>
                `;
                
                subcategoriesContainer.appendChild(subcategoryItem);
            });
            
            categoryGroup.appendChild(subcategoriesContainer);
            this.exportCategories.appendChild(categoryGroup);
        }
        
        // Adicionar evento de toggle para categorias
        const categoryToggles = this.exportCategories.querySelectorAll('.export-category-toggle');
        categoryToggles.forEach(toggle => {
            toggle.addEventListener('change', e => {
                const categoryId = e.target.dataset.category;
                const checked = e.target.checked;
                
                // Atualizar todas as subcategorias
                const subcatToggles = this.exportCategories.querySelectorAll(
                    `.export-subcategory-toggle[data-category="${categoryId}"]`
                );
                
                subcatToggles.forEach(subToggle => {
                    subToggle.checked = checked;
                });
                
                // Atualizar pré-visualização
                this.updateExportPreview();
            });
        });
        
        // Adicionar evento para subcategorias
        const subcategoryToggles = this.exportCategories.querySelectorAll('.export-subcategory-toggle');
        subcategoryToggles.forEach(toggle => {
            toggle.addEventListener('change', e => {
                const categoryId = e.target.dataset.category;
                
                // Verificar estado de todas as subcategorias
                const subcatToggles = this.exportCategories.querySelectorAll(
                    `.export-subcategory-toggle[data-category="${categoryId}"]`
                );
                
                const allChecked = Array.from(subcatToggles).every(t => t.checked);
                
                // Atualizar toggle da categoria
                const categoryToggle = this.exportCategories.querySelector(
                    `.export-category-toggle[data-category="${categoryId}"]`
                );
                
                if (categoryToggle) {
                    categoryToggle.checked = allChecked;
                }
                
                // Atualizar pré-visualização
                this.updateExportPreview();
            });
        });
        
        // Adicionar eventos para opções de exportação
        const formatOptions = document.querySelectorAll('input[name="export-format"]');
        formatOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateExportPreview();
            });
        });
        
        const includeNotesOption = document.getElementById('include-notes');
        if (includeNotesOption) {
            includeNotesOption.addEventListener('change', () => {
                this.updateExportPreview();
            });
        }
        
        const formatValuesOption = document.getElementById('format-values');
        if (formatValuesOption) {
            formatValuesOption.addEventListener('change', () => {
                this.updateExportPreview();
            });
        }
        
        // Gerar pré-visualização inicial
        this.updateExportPreview();
        
        // Mostrar modal
        UIUtils.showModal(this.exportModal);
    }
    
    // Ocultar modal de exportação
    hideExportModal() {
        UIUtils.hideModal(this.exportModal);
    }
    
    // Atualizar pré-visualização de exportação
    updateExportPreview() {
        if (!this.exportPreview) return;
        
        // Limpar pré-visualização
        this.exportPreview.innerHTML = '';
        
        // Obter formato selecionado
        const formatRadios = document.querySelectorAll('input[name="export-format"]');
        let selectedFormat = 'csv';
        formatRadios.forEach(radio => {
            if (radio.checked) {
                selectedFormat = radio.value;
            }
        });
        
        // Obter outras opções
        const includeNotes = document.getElementById('include-notes').checked;
        const formatValues = document.getElementById('format-values').checked;
        
        // Coletar categorias selecionadas
        const selectedCategories = new Set();
        const subcatToggles = this.exportCategories.querySelectorAll('.export-subcategory-toggle:checked');
        subcatToggles.forEach(toggle => {
            const fullId = toggle.dataset.fullid;
            selectedCategories.add(fullId);
        });
        
        // Usar período filtrado ou todos os registros
        const periodRadios = document.querySelectorAll('input[name="export-period"]');
        let useFilteredPeriod = true;
        periodRadios.forEach(radio => {
            if (radio.checked && radio.value === 'all') {
                useFilteredPeriod = false;
            }
        });
        
        // Obter registros
        let records = [];
        if (useFilteredPeriod) {
            records = [...this.filteredRecords];
        } else {
            const startDate = null;
            const endDate = null;
            records = Storage.getRecords(this.cycleId, startDate, endDate);
        }
        
        // Limitar a 5 registros na pré-visualização
        const previewRecords = records.slice(0, 5);
        
        // Criar pré-visualização baseada no formato
        if (selectedFormat === 'csv' || selectedFormat === 'excel') {
            // Gerar tabela para CSV/Excel
            const table = document.createElement('table');
            table.className = 'w-full border-collapse text-sm';
            
            // Cabeçalho
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = '<th class="border border-gray-300 px-2 py-1 bg-gray-100">Data</th><th class="border border-gray-300 px-2 py-1 bg-gray-100">Hora</th>';
            
            // Subcategorias filtradas e ordenadas
            const activeSubcategories = this.allCategories
                .filter(subcat => selectedCategories.has(subcat.fullId))
                .sort((a, b) => {
                    if (a.categoryName !== b.categoryName) {
                        return a.categoryName.localeCompare(b.categoryName);
                    }
                    return a.subcategoryName.localeCompare(b.subcategoryName);
                });
            
            activeSubcategories.forEach(subcat => {
                headerRow.innerHTML += `<th class="border border-gray-300 px-2 py-1 bg-gray-100">${subcat.categoryName} - ${subcat.subcategoryName}</th>`;
                
                if (includeNotes) {
                    headerRow.innerHTML += `<th class="border border-gray-300 px-2 py-1 bg-gray-100">Observações</th>`;
                }
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // Corpo da tabela
            const tbody = document.createElement('tbody');
            
            previewRecords.forEach(record => {
                const row = document.createElement('tr');
                
                // Data e hora
                const date = new Date(record.dateTime);
                row.innerHTML = `
                    <td class="border border-gray-300 px-2 py-1">${UIUtils.formatDate(date)}</td>
                    <td class="border border-gray-300 px-2 py-1">${UIUtils.formatTime(date)}</td>
                `;
                
                // Valores para cada subcategoria
                activeSubcategories.forEach(subcat => {
                    const value = record.data[subcat.fullId];
                    const displayValue = formatValues 
                        ? Data.formatValue(value, subcat.type)
                        : value;
                    
                    row.innerHTML += `<td class="border border-gray-300 px-2 py-1">${displayValue !== undefined ? displayValue : '-'}</td>`;
                    
                    if (includeNotes) {
                        const notesKey = `${subcat.fullId}`;
                        const notes = record.data[notesKey] || '';
                        row.innerHTML += `<td class="border border-gray-300 px-2 py-1">${notes}</td>`;
                    }
                });
                
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            
            // Adicionar à pré-visualização
            this.exportPreview.appendChild(table);
            
            // Adicionar indicador de pré-visualização limitada
            if (records.length > 5) {
                const note = document.createElement('div');
                note.className = 'text-sm text-gray-500 mt-2';
                note.textContent = `Mostrando 5 de ${records.length} registros.`;
                this.exportPreview.appendChild(note);
            }
        } else if (selectedFormat === 'pdf') {
            // Pré-visualização para PDF
            const pdfPreview = document.createElement('div');
            pdfPreview.className = 'p-4 bg-white border border-gray-300 rounded';
            
            // Título
            const title = document.createElement('div');
            title.className = 'text-xl font-bold text-center mb-4';
            title.textContent = `Relatório do Ciclo ${Data.cycles[this.cycleId].name}`;
            pdfPreview.appendChild(title);
            
            // Informações do período
            const periodInfo = document.createElement('div');
            periodInfo.className = 'text-sm text-gray-600 mb-4';
            if (useFilteredPeriod && this.reportStartDate.value && this.reportEndDate.value) {
                periodInfo.textContent = `Período: ${this.reportStartDate.value} a ${this.reportEndDate.value}`;
            } else {
                periodInfo.textContent = 'Todos os registros';
            }
            pdfPreview.appendChild(periodInfo);
            
            // Tabela de dados
            const table = document.createElement('table');
            table.className = 'w-full border-collapse text-sm';
            
            // Cabeçalho
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = '<th class="border border-gray-300 px-2 py-1 bg-gray-100">Data/Hora</th>';
            
            // Subcategorias filtradas
            const activeSubcategories = this.allCategories
                .filter(subcat => selectedCategories.has(subcat.fullId))
                .sort((a, b) => {
                    if (a.categoryName !== b.categoryName) {
                        return a.categoryName.localeCompare(b.categoryName);
                    }
                    return a.subcategoryName.localeCompare(b.subcategoryName);
                });
            
            activeSubcategories.forEach(subcat => {
                headerRow.innerHTML += `<th class="border border-gray-300 px-2 py-1 bg-gray-100">${subcat.categoryName} - ${subcat.subcategoryName}</th>`;
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // Corpo da tabela
            const tbody = document.createElement('tbody');
            
            previewRecords.forEach(record => {
                const row = document.createElement('tr');
                
                // Data e hora
                const date = new Date(record.dateTime);
                row.innerHTML = `
                    <td class="border border-gray-300 px-2 py-1">${UIUtils.formatDate(date)} ${UIUtils.formatTime(date)}</td>
                `;
                
                // Valores para cada subcategoria
                activeSubcategories.forEach(subcat => {
                    const value = record.data[subcat.fullId];
                    const displayValue = formatValues 
                        ? Data.formatValue(value, subcat.type)
                        : value;
                    
                    const notes = includeNotes ? record.data[`${subcat.fullId}`] || '' : '';
                    const cellContent = displayValue !== undefined 
                        ? `${displayValue}${notes ? '<br><span class="text-xs text-gray-600">' + notes + '</span>' : ''}`
                        : '-';
                    
                    row.innerHTML += `<td class="border border-gray-300 px-2 py-1">${cellContent}</td>`;
                });
                
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            pdfPreview.appendChild(table);
            
            // Adicionar à pré-visualização
            this.exportPreview.appendChild(pdfPreview);
            
            // Adicionar nota
            const note = document.createElement('div');
            note.className = 'text-sm text-gray-500 mt-2';
            note.textContent = 'O PDF incluirá cabeçalho, rodapé e formatação adequada para impressão.';
            this.exportPreview.appendChild(note);
        }
    }
    
    // Executar exportação
    performExport() {
        // Obter formato selecionado
        const formatRadios = document.querySelectorAll('input[name="export-format"]');
        let selectedFormat = 'csv';
        formatRadios.forEach(radio => {
            if (radio.checked) {
                selectedFormat = radio.value;
            }
        });
        
        // Obter outras opções
        const includeNotes = document.getElementById('include-notes').checked;
        const formatValues = document.getElementById('format-values').checked;
        
        // Coletar categorias selecionadas
        const selectedCategories = new Set();
        const subcatToggles = this.exportCategories.querySelectorAll('.export-subcategory-toggle:checked');
        subcatToggles.forEach(toggle => {
            const fullId = toggle.dataset.fullid;
            selectedCategories.add(fullId);
        });
        
        if (selectedCategories.size === 0) {
            alert('Selecione pelo menos uma categoria para exportar.');
            return;
        }
        
        // Usar período filtrado ou todos os registros
        const periodRadios = document.querySelectorAll('input[name="export-period"]');
        let useFilteredPeriod = true;
        periodRadios.forEach(radio => {
            if (radio.checked && radio.value === 'all') {
                useFilteredPeriod = false;
            }
        });
        
        // Obter registros
        let records = [];
        let startDate = null;
        let endDate = null;
        
        if (useFilteredPeriod) {
            startDate = this.reportStartDate ? this.reportStartDate.value : null;
            endDate = this.reportEndDate ? this.reportEndDate.value : null;
            records = [...this.filteredRecords];
        } else {
            records = Storage.getRecords(this.cycleId);
        }
        
        // Ordenar registros (mais recente primeiro)
        records.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        
        // Executar exportação conforme o formato
        if (selectedFormat === 'csv') {
            this.exportAsCSV(records, selectedCategories, includeNotes, formatValues, startDate, endDate);
        } else if (selectedFormat === 'excel') {
            this.exportAsExcel(records, selectedCategories, includeNotes, formatValues, startDate, endDate);
        } else if (selectedFormat === 'pdf') {
            this.exportAsPDF(records, selectedCategories, includeNotes, formatValues, startDate, endDate);
        }
        
        // Fechar modal
        this.hideExportModal();
    }
    
    // Exportar como CSV
    exportAsCSV(records, selectedCategories, includeNotes, formatValues, startDate, endDate) {
        // Subcategorias filtradas e ordenadas
        const activeSubcategories = this.allCategories
            .filter(subcat => selectedCategories.has(subcat.fullId))
            .sort((a, b) => {
                if (a.categoryName !== b.categoryName) {
                    return a.categoryName.localeCompare(b.categoryName);
                }
                return a.subcategoryName.localeCompare(b.subcategoryName);
            });
        
        // Preparar cabeçalhos
        const headers = ['Data', 'Hora'];
        
        activeSubcategories.forEach(subcat => {
            headers.push(`${subcat.categoryName} - ${subcat.subcategoryName}`);
            
            if (includeNotes) {
                headers.push(`Observações: ${subcat.categoryName} - ${subcat.subcategoryName}`);
            }
        });
        
        // Preparar linhas
        const rows = records.map(record => {
            const date = new Date(record.dateTime);
            const row = [
                UIUtils.formatDate(date),
                UIUtils.formatTime(date)
            ];
            
            // Adicionar valores para cada subcategoria
            activeSubcategories.forEach(subcat => {
                const value = record.data[subcat.fullId];
                const displayValue = formatValues 
                    ? Data.formatValue(value, subcat.type)
                    : value;
                
                row.push(displayValue !== undefined ? displayValue : '');
                
                if (includeNotes) {
                    const notesKey = `${subcat.fullId}`;
                    row.push(record.data[notesKey] || '');
                }
            });
            
            return row;
        });
        
        // Combinar cabeçalhos e linhas
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        // Criar blob e link para download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        
        // Nome do arquivo com período
        let fileName = `aqui-lidero-${this.cycleId}`;
        if (startDate && endDate) {
            fileName += `-${startDate}-a-${endDate}`;
        }
        fileName += '.csv';
        
        a.download = fileName;
        a.click();
        
        URL.revokeObjectURL(url);
        
        // Mostrar toast
        UIUtils.showToast('Dados exportados com sucesso!');
    }
    
    // Exportar como Excel (simplificado para CSV com extensão .xlsx)
    exportAsExcel(records, selectedCategories, includeNotes, formatValues, startDate, endDate) {
        // Aviso sobre limitação
        alert('Exportação para Excel não está totalmente implementada. Os dados serão exportados como CSV que pode ser importado no Excel.');
        
        // Usar a mesma função do CSV
        this.exportAsCSV(records, selectedCategories, includeNotes, formatValues, startDate, endDate);
    }
    
    // Exportar como PDF (simplificado)
    exportAsPDF(records, selectedCategories, includeNotes, formatValues, startDate, endDate) {
        // Aviso sobre limitação
        alert('Exportação para PDF não está totalmente implementada devido às limitações do ambiente. Os dados serão exportados como CSV.');
        
        // Usar a mesma função do CSV
        this.exportAsCSV(records, selectedCategories, includeNotes, formatValues, startDate, endDate);
    }
    
    // Função para download de gráficos
    downloadChart(chartId, filename) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return;
        
        // Criar link temporário
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
        link.click();
    }
    
    // Mostrar opções de gráficos
    showChartOptions(chartType) {
        alert(`Opções para o gráfico de ${chartType === 'trend' ? 'tendências' : 'radar'} serão implementadas em uma versão futura.`);
    }
    
    // Função auxiliar para gerar cores
    getColorForIndex(index) {
        const colors = [
            '#1A9EAD', // turquoise
            '#FF7E36', // orange
            '#4CAF50', // green
            '#9C27B0', // purple
            '#FF5722', // deep orange
            '#3F51B5', // indigo
            '#FFC107', // amber
            '#607D8B'  // blue grey
        ];
        
        return colors[index % colors.length];
    }
}

// Exposição global para compatibilidade
window.Report = Report;
