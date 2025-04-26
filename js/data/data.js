/**
 * Módulo Data (anteriormente AppData)
 * Responsável por definições de dados e operações sobre eles
 */

const Data = {
    // Mapeamento para valores numéricos/texto
    valueMap: {
        '5': 'Excelente',
        '4': 'Bom',
        '3': 'Regular',
        '2': 'Ruim',
        '1': 'Péssimo'
    },
    
    // Ciclos
    cycles: {
        biologico: {
            name: 'Ciclo Biológico',
            categories: [
                {
                    id: 'sono',
                    name: 'Sono e Descanso',
                    subcategories: [
                        { id: 'qualidade', name: 'Qualidade do Sono' },
                        { id: 'cama', name: 'Qualidade da Cama' },
                        { id: 'mente', name: 'Qualidade da Mente' }
                    ]
                },
                {
                    id: 'sonhos',
                    name: 'Sonhos',
                    subcategories: [
                        { id: 'teve', name: 'Teve Sonhos', type: 'boolean' }
                    ]
                },
                {
                    id: 'alimentacao',
                    name: 'Alimentação',
                    subcategories: [
                        { id: 'qualidade', name: 'Qualidade' }
                    ]
                },
                {
                    id: 'maconha',
                    name: 'Uso de Maconha',
                    subcategories: [
                        { id: 'usou', name: 'Fez Uso', type: 'boolean' }
                    ]
                },
                {
                    id: 'atividade',
                    name: 'Atividade Física',
                    subcategories: [
                        { id: 'nivel', name: 'Nível' }
                    ]
                },
                {
                    id: 'hidratacao',
                    name: 'Hidratação',
                    subcategories: [
                        { id: 'nivel', name: 'Nível' }
                    ]
                }
            ]
        }
        // Outros ciclos serão adicionados aqui no futuro
    },
    
    // Localizar categoria por ID
    findCategory(cycleId, categoryId) {
        const cycle = this.cycles[cycleId];
        if (!cycle) return null;
        
        return cycle.categories.find(category => category.id === categoryId);
    },
    
    // Localizar subcategoria
    findSubcategory(cycleId, categoryId, subcategoryId) {
        const category = this.findCategory(cycleId, categoryId);
        if (!category) return null;
        
        return category.subcategories.find(sub => sub.id === subcategoryId);
    },
    
    // Obter todas as subcategorias de um ciclo
    getAllSubcategories(cycleId) {
        const cycle = this.cycles[cycleId];
        if (!cycle) return [];
        
        const result = [];
        cycle.categories.forEach(category => {
            category.subcategories.forEach(subcategory => {
                result.push({
                    categoryId: category.id,
                    categoryName: category.name,
                    subcategoryId: subcategory.id,
                    subcategoryName: subcategory.name,
                    type: subcategory.type || 'select',
                    fullId: `${category.id}-${subcategory.id}`
                });
            });
        });
        
        return result;
    },
    
    // Determinar status class baseado no valor
    getStatusClass(value) {
        if (!value) return '';
        
        // Para valores booleanos
        if (value === true) return 'status-excellent';
        if (value === false) return '';
        
        // Para valores numéricos
        const numValue = parseInt(value);
        if (isNaN(numValue)) return '';
        
        switch(numValue) {
            case 5: return 'status-excellent';
            case 4: return 'status-good';
            case 3: return 'status-regular';
            case 2: return 'status-bad';
            case 1: return 'status-terrible';
            default: return '';
        }
    },
    
    // Formatar valor para exibição
    formatValue(value, type) {
        if (value === undefined || value === null) return '-';
        
        // Valores booleanos
        if (type === 'boolean') {
            return value ? 'Sim' : 'Não';
        }
        
        // Valores numéricos
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            return this.valueMap[numValue] || value;
        }
        
        // Texto e outros tipos
        return value;
    }
};

// Exposição global para compatibilidade
window.Data = Data;
