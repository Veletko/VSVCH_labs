// Основной клиентский скрипт
class QuoteApp {
    constructor() {
        this.quotes = [];
        this.filteredQuotes = [];
        this.stats = {};
        this.currentPage = 1;
        this.itemsPerPage = 9;
        
        this.initializeElements();
        this.bindEvents();
        this.checkServerConnection();
        this.loadData();
    }
    
    initializeElements() {
        // Кнопки
        this.scrapeBtn = document.getElementById('scrapeBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.clearFiltersBtn = document.getElementById('clearFiltersBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        
        // Фильтры
        this.searchInput = document.getElementById('searchInput');
        this.pageFilter = document.getElementById('pageFilter');
        this.authorFilter = document.getElementById('authorFilter');
        this.tagFilter = document.getElementById('tagFilter');
        
        // Статус
        this.statusText = document.getElementById('statusText');
        this.statusBar = document.getElementById('statusBar');
        this.serverStatus = document.getElementById('serverStatus');
        
        // Статистика
        this.totalQuotes = document.getElementById('totalQuotes');
        this.uniqueAuthors = document.getElementById('uniqueAuthors');
        this.totalTags = document.getElementById('totalTags');
        this.repeatedAuthors = document.getElementById('repeatedAuthors');
        this.pageStatsTable = document.getElementById('pageStatsTable');
        this.topAuthorsList = document.getElementById('topAuthorsList');
        this.repeatedAuthorsList = document.getElementById('repeatedAuthorsList');
        this.quotesCountText = document.getElementById('quotesCountText');
        this.filteredCountText = document.getElementById('filteredCountText');
        
        // Контейнеры
        this.quotesContainer = document.getElementById('quotesContainer');
        this.pagination = document.getElementById('pagination');
    }
    
    bindEvents() {
        this.scrapeBtn.addEventListener('click', () => this.scrapeData());
        this.refreshBtn.addEventListener('click', () => this.loadData());
        this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
        
        this.searchInput.addEventListener('input', () => this.filterQuotes());
        this.pageFilter.addEventListener('change', () => this.filterQuotes());
        this.authorFilter.addEventListener('change', () => this.filterQuotes());
        this.tagFilter.addEventListener('change', () => this.filterQuotes());
    }
    
    async checkServerConnection() {
        try {
            const response = await fetch('/api/data');
            if (response.ok) {
                this.serverStatus.textContent = '🟢 Подключен';
                this.serverStatus.style.color = 'green';
            } else {
                this.serverStatus.textContent = '🟡 Ошибка ответа';
                this.serverStatus.style.color = 'orange';
            }
        } catch (error) {
            this.serverStatus.textContent = '🔴 Не подключен';
            this.serverStatus.style.color = 'red';
        }
    }
    
    async scrapeData() {
        this.showLoading(true);
        this.statusText.textContent = '🔄 Парсинг данных...';
        this.statusBar.style.background = 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)';
        this.statusBar.style.borderLeftColor = '#ffc107';
        
        try {
            const response = await fetch('/api/scrape');
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            const data = await response.json();
            this.quotes = data.quotes;
            this.stats = data.stats;
            
            this.statusText.textContent = `Парсинг завершен. Получено ${data.quotes.length} цитат`;
            this.statusBar.style.background = 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)';
            this.statusBar.style.borderLeftColor = '#28a745';
            
            this.updateFilters();
            this.displayData();
            
        } catch (error) {
            this.statusText.textContent = `Ошибка: ${error.message}`;
            this.statusBar.style.background = 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)';
            this.statusBar.style.borderLeftColor = '#dc3545';
            console.error('Ошибка парсинга:', error);
        } finally {
            this.showLoading(false);
        }
    }
    
    async loadData() {
        this.showLoading(true);
        this.statusText.textContent = '🔄 Загрузка данных...';
        
        try {
            const response = await fetch('/api/data');
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            const data = await response.json();
            this.quotes = data.quotes;
            this.stats = data.stats;
            
            if (this.quotes.length > 0) {
                this.statusText.textContent = `Загружено ${this.quotes.length} цитат`;
                this.statusBar.style.background = 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)';
                this.statusBar.style.borderLeftColor = '#28a745';
                
                this.updateFilters();
                this.displayData();
            } else {
                this.statusText.textContent = '📭 Нет данных. Запустите парсинг';
                this.statusBar.style.background = 'linear-gradient(135deg, #e8f4fc 0%, #d4e8ff 100%)';
                this.statusBar.style.borderLeftColor = '#4a6fa5';
                
                this.quotesContainer.innerHTML = `
                    <div class="no-data">
                        <p>📭 Нет данных. Нажмите "Запустить парсинг" для получения цитат</p>
                    </div>
                `;
            }
            
        } catch (error) {
            this.statusText.textContent = `Ошибка загрузки: ${error.message}`;
            this.statusBar.style.background = 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)';
            this.statusBar.style.borderLeftColor = '#dc3545';
            console.error('Ошибка загрузки:', error);
        } finally {
            this.showLoading(false);
        }
    }
    
    updateFilters() {
        // Получаем уникальных авторов
        const authors = [...new Set(this.quotes.map(q => q.author))].sort();
        this.authorFilter.innerHTML = '<option value="">Все авторы</option>';
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            this.authorFilter.appendChild(option);
        });
        
        // Получаем уникальные теги
        const tags = [...new Set(this.quotes.flatMap(q => q.tags))].sort();
        this.tagFilter.innerHTML = '<option value="">Все теги</option>';
        tags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            this.tagFilter.appendChild(option);
        });
    }
    
    filterQuotes() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const pageFilter = this.pageFilter.value;
        const authorFilter = this.authorFilter.value;
        const tagFilter = this.tagFilter.value;
        
        this.filteredQuotes = this.quotes.filter(quote => {
            // Поиск по тексту или автору
            if (searchTerm) {
                const inText = quote.text.toLowerCase().includes(searchTerm);
                const inAuthor = quote.author.toLowerCase().includes(searchTerm);
                if (!inText && !inAuthor) return false;
            }
            
            // Фильтр по странице
            if (pageFilter && quote.pageSource.toString() !== pageFilter) {
                return false;
            }
            
            // Фильтр по автору
            if (authorFilter && quote.author !== authorFilter) {
                return false;
            }
            
            // Фильтр по тегу
            if (tagFilter && !quote.tags.includes(tagFilter)) {
                return false;
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.displayQuotes();
    }
    
    clearFilters() {
        this.searchInput.value = '';
        this.pageFilter.value = '';
        this.authorFilter.value = '';
        this.tagFilter.value = '';
        this.filteredQuotes = [...this.quotes];
        this.currentPage = 1;
        this.displayQuotes();
    }
    
    displayData() {
        this.filteredQuotes = [...this.quotes];
        this.displayStats();
        this.displayQuotes();
        
        // Обновляем графики
        if (window.updateCharts) {
            window.updateCharts({
                quotes: this.quotes,
                stats: this.stats,
                pageStats: this.stats.pageStats || []
            });
        }
    }
    
    displayStats() {
        // Основная статистика
        this.totalQuotes.textContent = this.stats.totalQuotes || 0;
        this.uniqueAuthors.textContent = this.stats.uniqueAuthors || 0;
        this.totalTags.textContent = this.stats.totalTags || 0;
        this.repeatedAuthors.textContent = this.stats.repeatedAuthorsCount || 0;
        
        // Динамика по страницам (таблица)
        let pageStatsHTML = '';
        if (this.stats.pageStats && this.stats.pageStats.length > 0) {
            pageStatsHTML = '<table>';
            pageStatsHTML += '<tr><th>Страница</th><th>Цитат</th><th>Авторов</th><th>Тегов</th><th>Ср. длина</th></tr>';
            
            this.stats.pageStats.forEach(page => {
                pageStatsHTML += `
                    <tr>
                        <td>${page.pageNumber}</td>
                        <td>${page.quotesCount}</td>
                        <td>${page.uniqueAuthors}</td>
                        <td>${page.tagDiversity}</td>
                        <td>${page.averageQuoteLength} симв.</td>
                    </tr>
                `;
            });
            pageStatsHTML += '</table>';
        } else {
            pageStatsHTML = '<p>Нет данных по страницам</p>';
        }
        this.pageStatsTable.innerHTML = pageStatsHTML;
        
        // Топ-10 авторов
        let topAuthorsHTML = '';
        if (this.stats.topAuthors && this.stats.topAuthors.length > 0) {
            topAuthorsHTML = '<ol>';
            this.stats.topAuthors.forEach((author, index) => {
                topAuthorsHTML += `<li><strong>${author.author}</strong> - ${author.count} цитат</li>`;
            });
            topAuthorsHTML += '</ol>';
        } else {
            topAuthorsHTML = '<p>Нет данных об авторах</p>';
        }
        this.topAuthorsList.innerHTML = topAuthorsHTML;
        
        // Повторяющиеся авторы
        let repeatedAuthorsHTML = '';
        if (this.stats.repeatedAuthors && this.stats.repeatedAuthors.length > 0) {
            this.stats.repeatedAuthors.forEach(author => {
                repeatedAuthorsHTML += `
                    <div style="margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 5px;">
                        <strong>${author.author}</strong> - встречается на страницах: ${author.pages.join(', ')}
                    </div>
                `;
            });
        } else {
            repeatedAuthorsHTML = '<p>Нет авторов, повторяющихся на разных страницах</p>';
        }
        this.repeatedAuthorsList.innerHTML = repeatedAuthorsHTML;
        
        // Обновляем счетчики цитат
        this.quotesCountText.textContent = `Загружено: ${this.quotes.length} цитат`;
        this.filteredCountText.textContent = `Показано: ${this.filteredQuotes.length} цитат`;
    }
    
    displayQuotes() {
        if (this.filteredQuotes.length === 0) {
            this.quotesContainer.innerHTML = `
                <div class="no-data">
                    <p>📭 Цитаты не найдены. Попробуйте изменить критерии поиска</p>
                </div>
            `;
            this.pagination.innerHTML = '';
            this.filteredCountText.textContent = `Показано: 0 цитат`;
            return;
        }
        
        // Пагинация
        const totalPages = Math.ceil(this.filteredQuotes.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedQuotes = this.filteredQuotes.slice(startIndex, endIndex);
        
        // Отображаем цитаты
        this.quotesContainer.innerHTML = paginatedQuotes.map(quote => `
            <div class="quote-card">
                <div class="quote-text">"ц${quote.text}"</div>
                <div class="quote-author">👤 ${quote.author}</div>
                <div class="quote-tags">
                    ${quote.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="quote-meta">
                    <span>Страница: ${quote.pageSource}</span>
                    <span>Позиция: ${quote.orderOnPage}</span>
                    <span>Длина: ${quote.quoteLength} симв.</span>
                </div>
            </div>
        `).join('');
        
        // Создаем пагинацию
        this.createPagination(totalPages);
        
        this.filteredCountText.textContent = `Показано: ${this.filteredQuotes.length} цитат (страница ${this.currentPage} из ${totalPages})`;
    }
    
    createPagination(totalPages) {
        let paginationHTML = '';
        
        // Кнопка "Назад"
        paginationHTML += `
            <button class="page-btn ${this.currentPage === 1 ? 'disabled' : ''}" 
                    onclick="quoteApp.changePage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''}>
                ←
            </button>
        `;
        
        // Номера страниц
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                paginationHTML += `
                    <button class="page-btn ${this.currentPage === i ? 'active' : ''}" 
                            onclick="quoteApp.changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                paginationHTML += `<span class="page-btn disabled">...</span>`;
            }
        }
        
        // Кнопка "Вперед"
        paginationHTML += `
            <button class="page-btn ${this.currentPage === totalPages ? 'disabled' : ''}" 
                    onclick="quoteApp.changePage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''}>
                →
            </button>
        `;
        
        this.pagination.innerHTML = paginationHTML;
    }
    
    changePage(page) {
        if (page < 1 || page > Math.ceil(this.filteredQuotes.length / this.itemsPerPage)) {
            return;
        }
        this.currentPage = page;
        this.displayQuotes();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    showLoading(show) {
        const btnText = this.scrapeBtn.querySelector('.btn-text');
        
        if (show) {
            btnText.textContent = 'Парсинг...';
            this.loadingSpinner.classList.remove('hidden');
            this.scrapeBtn.disabled = true;
            this.refreshBtn.disabled = true;
        } else {
            btnText.textContent = '🚀 Запустить парсинг';
            this.loadingSpinner.classList.add('hidden');
            this.scrapeBtn.disabled = false;
            this.refreshBtn.disabled = false;
        }
    }
}

// Инициализация приложения
let quoteApp;

document.addEventListener('DOMContentLoaded', () => {
    quoteApp = new QuoteApp();
});