const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { toXML, toHTML } = require('./utils/formatters');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/data', express.static('data'));

fs.mkdir(path.join(__dirname, 'data'), { recursive: true }).catch(() => {});

const TASKS_PATH = path.join(__dirname, 'data', 'tasks.json');
const CATEGORIES_PATH = path.join(__dirname, 'data', 'categories.json');

async function readJson(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    console.error(`Ошибка чтения ${filePath}:`, err.message);
    return defaultValue;
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/tasks', async (req, res) => {
  try {
    const [tasks, categories] = await Promise.all([
      readJson(TASKS_PATH),
      readJson(CATEGORIES_PATH)
    ]);
    const enriched = tasks.map(task => ({
      ...task,
      categoryName: categories.find(c => c.id === task.categoryId)?.name || 'Без категории'
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка чтения задач' });
  }
});

app.post('/api/stat', async (req, res) => {
  try {
    const [tasks, categories] = await Promise.all([
      readJson(TASKS_PATH),
      readJson(CATEGORIES_PATH)
    ]);
    const stats = categories.map(cat => {
      const catTasks = tasks.filter(t => t.categoryId === cat.id);
      return {
        ...cat,
        total: catTasks.length,
        done: catTasks.filter(t => t.done).length
      };
    });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка статистики' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, categoryId } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Название обязательно' });
    if (!categoryId) return res.status(400).json({ error: 'Выберите категорию' });

    const [tasks, categories] = await Promise.all([
      readJson(TASKS_PATH),
      readJson(CATEGORIES_PATH)
    ]);

    if (!categories.some(c => c.id === Number(categoryId))) {
      return res.status(400).json({ error: 'Категория не существует' });
    }

    const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const newTask = { id: newId, title: title.trim(), categoryId: Number(categoryId), done: false };
    tasks.push(newTask);
    await writeJson(TASKS_PATH, tasks);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сохранения' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const tasks = await readJson(TASKS_PATH);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return res.status(404).json({ error: 'Задача не найдена' });
    tasks.splice(index, 1);
    await writeJson(TASKS_PATH, tasks);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { done } = req.body;

    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'done должно быть boolean' });
    }

    const tasks = await readJson(TASKS_PATH);
    const task = tasks.find(t => t.id === id);

    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    task.done = done;
    await writeJson(TASKS_PATH, tasks);

    const categories = await readJson(CATEGORIES_PATH);
    const enriched = {
      ...task,
      categoryName: categories.find(c => c.id === task.categoryId)?.name || 'Без категории'
    };

    res.json(enriched);
  } catch (err) {
    console.error('PATCH error:', err);
    res.status(500).json({ error: 'Ошибка обновления' });
  }
});

app.get('/api/report', async (req, res) => {
  try {
    const [tasks, categories] = await Promise.all([
      readJson(TASKS_PATH),
      readJson(CATEGORIES_PATH)
    ]);
    const accept = req.get('Accept') || '';

    if (accept.includes('application/xml')) {
      res.type('application/xml').send(toXML(tasks, categories));
    } else if (accept.includes('text/html')) {
      res.type('text/html').send(toHTML(tasks, categories));
    } else {
      res.json({ tasks, categories });
    }
  } catch (err) {
    res.status(500).json({ error: 'Ошибка отчёта' });
  }
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Сервер упал' });
});

app.listen(PORT, () => {
  console.log(`Сервер на http://localhost:${PORT}`);
});