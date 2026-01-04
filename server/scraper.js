const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://quotes.toscrape.com/tag/inspirational';
const MAX_PAGES = 3;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Парсинг одной страницы
async function scrapePage(pageNumber) {
    try {
        const url = pageNumber === 1 ? BASE_URL : `${BASE_URL}/page/${pageNumber}/`;
        console.log(`Парсинг страницы ${pageNumber}: ${url}`);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        if (response.status !== 200) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        
        const $ = cheerio.load(response.data);
        const quotes = [];
        
        $('.quote').each((index, element) => {
            const $quote = $(element);
            
            const text = $quote.find('.text').text().trim().replace(/^"(.*)"$/, '$1');
            const author = $quote.find('.author').text().trim();
            const tags = $quote.find('.tags .tag').map((i, el) => $(el).text().trim()).get();
            const pageSource = pageNumber;
            const orderOnPage = index + 1;
            
            quotes.push({
                id: `${pageNumber}-${orderOnPage}`,
                text,
                author,
                tags,
                pageSource,
                orderOnPage,
                quoteLength: text.length,
                wordCount: text.split(/\s+/).length
            });
        });
        
        console.log(`Страница ${pageNumber}: получено ${quotes.length} цитат`);
        return quotes;
        
    } catch (error) {
        console.error(`Ошибка при парсинге страницы ${pageNumber}:`, error.message);
        throw error;
    }
}

// Расчет статистики
function calculateStats(allQuotes) {
    console.log('📊 Расчет статистики...');
    
    // Основные статистики
    const uniqueAuthors = [...new Set(allQuotes.map(q => q.author))];
    const allTags = [...new Set(allQuotes.flatMap(q => q.tags))];
    
    // Статистика по страницам
    const pageStats = [];
    const tagDiversityPerPage = {};
    const averageLengthPerPage = {};
    const authorsPerPage = {};
    
    for (let page = 1; page <= MAX_PAGES; page++) {
        const pageQuotes = allQuotes.filter(q => q.pageSource === page);
        
        if (pageQuotes.length > 0) {
            const pageData = {
                pageNumber: page,
                quotesCount: pageQuotes.length,
                uniqueAuthors: [...new Set(pageQuotes.map(q => q.author))].length,
                tags: [...new Set(pageQuotes.flatMap(q => q.tags))],
                tagDiversity: 0,
                averageQuoteLength: 0,
                authors: [...new Set(pageQuotes.map(q => q.author))]
            };
            
            // Средняя длина цитат
            const totalLength = pageQuotes.reduce((sum, q) => sum + q.quoteLength, 0);
            pageData.averageQuoteLength = Math.round(totalLength / pageQuotes.length);
            
            // Разнообразие тегов
            pageData.tagDiversity = pageData.tags.length;
            
            pageStats.push(pageData);
            tagDiversityPerPage[page] = pageData.tagDiversity;
            averageLengthPerPage[page] = pageData.averageQuoteLength;
            authorsPerPage[page] = pageData.uniqueAuthors;
        }
    }
    
    // Частота авторов и топ-10
    const authorFrequency = {};
    allQuotes.forEach(quote => {
        authorFrequency[quote.author] = (authorFrequency[quote.author] || 0) + 1;
    });
    
    const topAuthors = Object.entries(authorFrequency)
        .map(([author, count]) => ({ author, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    
    // Повторяющиеся авторы на разных страницах
    const authorPages = {};
    allQuotes.forEach(quote => {
        if (!authorPages[quote.author]) {
            authorPages[quote.author] = new Set();
        }
        authorPages[quote.author].add(quote.pageSource);
    });
    
    const repeatedAuthors = Object.entries(authorPages)
        .filter(([author, pages]) => pages.size > 1)
        .map(([author, pages]) => ({
            author,
            pages: [...pages].sort(),
            pageCount: pages.size
        }));
    
    // Подготовка данных для графиков
    
    // Radar chart: эмоциональные категории (на основе тегов)
    const emotionCategories = {
        'Вдохновение': allTags.filter(tag => tag.includes('inspir') || tag.includes('motiv')).length * 10 + 30,
        'Мудрость': allTags.filter(tag => tag.includes('wisdom') || tag.includes('life')).length * 8 + 25,
        'Любовь': allTags.filter(tag => tag.includes('love') || tag.includes('heart')).length * 12 + 20,
        'Успех': allTags.filter(tag => tag.includes('success') || tag.includes('achievement')).length * 9 + 15,
        'Философия': allTags.filter(tag => tag.includes('philosophy') || tag.includes('truth')).length * 7 + 10,
        'Счастье': allTags.filter(tag => tag.includes('happiness') || tag.includes('joy')).length * 11 + 18
    };
    
    // Bar chart: цитаты по тегам (топ-7 тегов)
    const tagFrequency = {};
    allQuotes.forEach(quote => {
        quote.tags.forEach(tag => {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
    });
    
    const quotesByCategory = Object.entries(tagFrequency)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 7)
        .reduce((obj, item) => {
            obj[item.tag] = item.count;
            return obj;
        }, {});
    
    // Scatter plot: длина vs экспрессивность
    const lengthVsExpressiveness = allQuotes.map((quote) => {
        const text = quote.text.toLowerCase();
        
        // Рассчитываем экспрессивность
        const exclamationCount = (text.match(/!/g) || []).length;
        const questionCount = (text.match(/\?/g) || []).length;
        const strongWords = (text.match(/\b(amazing|incredible|wonderful|fantastic|beautiful|powerful|great)\b/g) || []).length;
        const wordDiversity = new Set(text.split(/\s+/)).size / quote.wordCount;
        
        const expressiveness = Math.min(100, Math.round(
            (exclamationCount * 8) +
            (questionCount * 5) +
            (strongWords * 12) +
            (wordDiversity * 40) +
            (quote.quoteLength / 50)
        ));
        
        return {
            x: quote.quoteLength,
            y: expressiveness,
            author: quote.author,
            page: quote.pageSource,
            text: quote.text.length > 60 ? quote.text.substring(0, 60) + '...' : quote.text
        };
    });
    
    // Формируем финальный объект статистики
    return {
        totalQuotes: allQuotes.length,
        uniqueAuthors: uniqueAuthors.length,
        totalTags: allTags.length,
        repeatedAuthorsCount: repeatedAuthors.length,
        topAuthors: topAuthors,
        tagDiversityPerPage: tagDiversityPerPage,
        averageLengthPerPage: averageLengthPerPage,
        authorsPerPage: authorsPerPage,
        
        // Данные для графиков
        emotionCategories: emotionCategories,
        quotesByCategory: quotesByCategory,
        lengthVsExpressiveness: lengthVsExpressiveness,
        pageStats: pageStats,
        repeatedAuthors: repeatedAuthors
    };
}

// Основная функция парсинга
async function scrapeAllPages() {
    const allQuotes = [];
    
    console.log('🚀 Начало парсинга 3 страниц...');
    
    for (let page = 1; page <= MAX_PAGES; page++) {
        try {
            const pageQuotes = await scrapePage(page);
            allQuotes.push(...pageQuotes);
            
            // Задержка 1 секунда между запросами
            if (page < MAX_PAGES) {
                await delay(1000);
            }
        } catch (error) {
            console.error(`Пропуск страницы ${page}:`, error.message);
            // Продолжаем со следующей страницей
        }
    }
    
    console.log(`Всего получено цитат: ${allQuotes.length}`);
    
    // Рассчитываем статистику
    const stats = calculateStats(allQuotes);
    
    return {
        quotes: allQuotes,
        stats: stats,
        pageStats: stats.pageStats
    };
}

module.exports = { scrapeAllPages };