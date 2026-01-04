class QuoteCharts {
    constructor() {
        this.charts = {};
        this.initializeCharts();
    }
    
    initializeCharts() {
        // Все графики будут созданы при загрузке данных
        console.log('Графики инициализированы');
    }
    
    updateCharts(data) {
        // Уничтожаем старые графики
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        
        // Создаем новые графики
        this.createAllCharts(data);
    }
    
    createAllCharts(data) {
        // 1. Line chart: уникальные авторы на каждой странице
        this.charts.authorsChart = this.createAuthorsChart(data);
        
        // 2. Bar chart: распределение цитат по страницам
        this.charts.quotesChart = this.createQuotesChart(data);
        
        // 3. Stacked bar chart: топ-авторы на каждой странице
        this.charts.topAuthorsChart = this.createTopAuthorsChart(data);
        
        // 4. Line chart: средняя длина цитат
        this.charts.lengthChart = this.createLengthChart(data);
        
        // 5. Radar chart: эмоциональные категории
        this.charts.radarChart = this.createRadarChart(data);
        
        // 6. Bar chart: цитаты по тегам
        this.charts.categoryChart = this.createCategoryChart(data);
        
        // 7. Scatter plot: длина vs экспрессивность
        this.charts.scatterChart = this.createScatterChart(data);
    }
    
    createAuthorsChart(data) {
        const ctx = document.getElementById('authorsChart').getContext('2d');
        const pageStats = data.pageStats || [];
        
        const labels = pageStats.map(p => `Страница ${p.pageNumber}`);
        const uniqueAuthors = pageStats.map(p => p.uniqueAuthors);
        
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Уникальные авторы',
                    data: uniqueAuthors,
                    borderColor: '#4a6fa5',
                    backgroundColor: 'rgba(74, 111, 165, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Количество уникальных авторов на каждой странице'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Количество авторов'
                        }
                    }
                }
            }
        });
    }
    
    createQuotesChart(data) {
        const ctx = document.getElementById('quotesChart').getContext('2d');
        const pageStats = data.pageStats || [];
        
        const labels = pageStats.map(p => `Страница ${p.pageNumber}`);
        const quotesCount = pageStats.map(p => p.quotesCount);
        
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Количество цитат',
                    data: quotesCount,
                    backgroundColor: '#4fc3a1'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Распределение цитат по страницам'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Количество цитат'
                        }
                    }
                }
            }
        });
    }
    
    createTopAuthorsChart(data) {
        const ctx = document.getElementById('topAuthorsChart').getContext('2d');
        const topAuthors = data.stats?.topAuthors || [];
        
        const labels = topAuthors.map(a => a.author);
        const counts = topAuthors.map(a => a.count);
        
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Количество цитат',
                    data: counts,
                    backgroundColor: [
                        '#4a6fa5', '#4fc3a1', '#ff6b6b', '#ffd166',
                        '#06d6a0', '#118ab2', '#ef476f', '#073b4c',
                        '#118ab2', '#06d6a0'
                    ]
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                plugins: {
                    title: {
                        display: true,
                        text: 'Топ-10 авторов по количеству цитат'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Количество цитат'
                        }
                    }
                }
            }
        });
    }
    
    createLengthChart(data) {
        const ctx = document.getElementById('lengthChart').getContext('2d');
        const pageStats = data.pageStats || [];
        
        const labels = pageStats.map(p => `Страница ${p.pageNumber}`);
        const lengths = pageStats.map(p => p.averageQuoteLength);
        
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Средняя длина цитат',
                    data: lengths,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Динамика средней длины цитат по страницам'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Символы'
                        }
                    }
                }
            }
        });
    }
    
    createRadarChart(data) {
        const ctx = document.getElementById('radarChart').getContext('2d');
        const emotionCategories = data.stats?.emotionCategories || {};
        
        const labels = Object.keys(emotionCategories);
        const values = Object.values(emotionCategories);
        
        return new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Интенсивность',
                    data: values,
                    backgroundColor: 'rgba(79, 195, 161, 0.2)',
                    borderColor: '#4fc3a1',
                    borderWidth: 2,
                    pointBackgroundColor: '#4fc3a1'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: Math.max(...values) * 1.2
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Характеристики эмоциональных категорий'
                    }
                }
            }
        });
    }
    
    createCategoryChart(data) {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        const quotesByCategory = data.stats?.quotesByCategory || {};
        
        const labels = Object.keys(quotesByCategory);
        const counts = Object.values(quotesByCategory);
        
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Количество цитат',
                    data: counts,
                    backgroundColor: [
                        '#4a6fa5', '#4fc3a1', '#ff6b6b', '#ffd166',
                        '#06d6a0', '#118ab2', '#ef476f'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Количество цитат по тегам/категориям'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Количество цитат'
                        }
                    }
                }
            }
        });
    }
    
    createScatterChart(data) {
        const ctx = document.getElementById('scatterChart').getContext('2d');
        const scatterData = data.stats?.lengthVsExpressiveness || [];
        
        // Группируем по страницам
        const page1Data = scatterData.filter(d => d.page === 1);
        const page2Data = scatterData.filter(d => d.page === 2);
        const page3Data = scatterData.filter(d => d.page === 3);
        
        return new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Страница 1',
                        data: page1Data.map(d => ({x: d.x, y: d.y})),
                        backgroundColor: '#4a6fa5',
                        pointRadius: 6
                    },
                    {
                        label: 'Страница 2',
                        data: page2Data.map(d => ({x: d.x, y: d.y})),
                        backgroundColor: '#4fc3a1',
                        pointRadius: 6
                    },
                    {
                        label: 'Страница 3',
                        data: page3Data.map(d => ({x: d.x, y: d.y})),
                        backgroundColor: '#ff6b6b',
                        pointRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Длина цитаты vs Экспрессивность'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Длина цитаты (символы)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Экспрессивность (0-100)'
                        },
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const point = scatterData.find(d => 
                                    Math.abs(d.x - context.parsed.x) < 1 && 
                                    Math.abs(d.y - context.parsed.y) < 1
                                );
                                if (point) {
                                    return [
                                        `Автор: ${point.author}`,
                                        `Длина: ${point.x} симв.`,
                                        `Экспр.: ${point.y}/100`,
                                        `Текст: ${point.text}`
                                    ];
                                }
                                return '';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Инициализация графиков
let quoteCharts;

document.addEventListener('DOMContentLoaded', () => {
    quoteCharts = new QuoteCharts();
    window.updateCharts = (data) => quoteCharts.updateCharts(data);
});