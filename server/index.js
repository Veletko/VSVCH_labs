const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Импорт скрапера
const { scrapeAllPages } = require('./scraper');

// Путь к файлу данных
const DATA_FILE = path.join(__dirname, 'data', 'quotes.json');

// Функция для сохранения данных
const saveData = (data) => {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        throw error;
    }
};

// Функция для загрузки данных
const loadData = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
        return { quotes: [], stats: {}, pageStats: [] };
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return { quotes: [], stats: {}, pageStats: [] };
    }
};

// API эндпоинты

// Получить сохраненные данные
app.get('/api/data', (req, res) => {
    try {
        const data = loadData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Запустить парсинг
app.get('/api/scrape', async (req, res) => {
    try {
        console.log('Запуск парсинга...');
        const data = await scrapeAllPages();
        saveData(data);
        
        console.log(`Парсинг завершен. Получено цитат: ${data.quotes.length}`);
        res.json(data);
    } catch (error) {
        console.error('Ошибка парсинга:', error);
        res.status(500).json({ error: error.message });
    }
});

// Статичные файлы клиента
app.use(express.static(path.join(__dirname, '../client')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`API эндпоинты:`);
    console.log(`GET /api/data    - получить сохраненные данные`);
    console.log(`GET /api/scrape  - запустить парсинг`);
    console.log(`Клиент доступен по: http://localhost:${PORT}`);
});