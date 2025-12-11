# Архитектура и поток взаимодействия сервера

## 📋 Содержание
1. [Запуск сервера](#1-запуск-сервера)
2. [Поток GET запроса](#2-поток-get-запроса)
3. [Поток POST запроса](#3-поток-post-запроса)
4. [Наследование контроллеров](#4-наследование-контроллеров)
5. [Связи между модулями](#5-связи-между-модулями)

---

## 1. Запуск сервера

### Файл: `server.js`

```javascript
// ШАГ 1: Импорты и инициализация
const express = require('express');
const sequelize = require('./config/database');  // ← Подключение к БД
require('./models/associations');                // ← Загрузка связей моделей

// ШАГ 2: Импорт маршрутов (они загружают контроллеры)
const masterRoutes = require('./routes/masters');
// Внутри routes/masters.js:
//   const masterController = require('../controllers/masterController');
//   Внутри masterController.js:
//     const masterController = new MasterController();
//     MasterController наследуется от BaseController

// ШАГ 3: Создание Express приложения
const app = express();

// ШАГ 4: Регистрация middleware
app.use(cors());           // Разрешает CORS запросы
app.use(express.json());   // Парсит JSON из тела запроса

// ШАГ 5: Подключение маршрутов
app.use('/api/masters', masterRoutes);
// Теперь все запросы к /api/masters/* идут в masterRoutes

// ШАГ 6: Запуск сервера
startServer() → 
  sequelize.authenticate() → Проверка подключения к PostgreSQL
  sequelize.sync() → Синхронизация моделей с таблицами БД
  app.listen(PORT) → Сервер слушает порт 5000
```

**Порядок выполнения:**
```
1. require('./config/database') → создается sequelize instance
2. require('./models/associations') → загружаются все модели и связи
3. require('./routes/masters') → загружается router
   └─ require('./controllers/masterController') → создается controller instance
      └─ require('./baseController') → загружается BaseController
4. app.use('/api/masters', masterRoutes) → регистрируется маршрут
5. startServer() → подключение к БД и запуск сервера
```

---

## 2. Поток GET запроса

### Пример: `GET /api/masters`

```
┌─────────────────────────────────────────────────────────────────┐
│ КЛИЕНТ (Frontend)                                                │
│ fetch('http://localhost:5000/api/masters')                      │
└───────────────────────────┬─────────────────────────────────────┘
                             │ HTTP GET запрос
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ EXPRESS SERVER (server.js)                                      │
│                                                                 │
│ 1. app.use(cors()) → проверяет CORS заголовки                 │
│ 2. app.use(express.json()) → парсит тело (если есть)          │
│ 3. app.use('/api/masters', masterRoutes) → маршрутизация      │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ ROUTER (routes/masters.js)                                      │
│                                                                 │
│ router.get('/', masterController.getAll)                       │
│                                                                 │
│ Express проверяет:                                             │
│ - URL: /api/masters                                             │
│ - Метод: GET                                                    │
│ - Совпадение: router.get('/') → ДА!                            │
│                                                                 │
│ Вызывает: masterController.getAll(req, res)                    │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ CONTROLLER (controllers/masterController.js)                    │
│                                                                 │
│ class MasterController extends BaseController {                 │
│   // getAll наследуется от BaseController                      │
│ }                                                               │
│                                                                 │
│ Вызывается: BaseController.getAll(req, res)                   │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ BASE CONTROLLER (controllers/baseController.js)                 │
│                                                                 │
│ getAll = async (req, res) => {                                  │
│   const records = await this.model.findAll();                  │
│   // this.model = Master (передан в constructor)              │
│   res.json({ success: true, data: records });                 │
│ }                                                               │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ MODEL (models/Master.js)                                        │
│                                                                 │
│ Master.findAll() → это метод Sequelize                        │
│                                                                 │
│ Sequelize генерирует SQL:                                      │
│ SELECT * FROM master;                                          │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ DATABASE (PostgreSQL)                                           │
│                                                                 │
│ Выполняет SQL запрос                                            │
│ Возвращает данные из таблицы master                            │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼ [ОБРАТНЫЙ ПУТЬ]
┌─────────────────────────────────────────────────────────────────┐
│ MODEL (models/Master.js)                                        │
│                                                                 │
│ Sequelize преобразует строки БД в JavaScript объекты           │
│ [{ id: 1, last_name: 'Иванов', ... }, ...]                    │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ BASE CONTROLLER                                                 │
│                                                                 │
│ Формирует ответ:                                               │
│ {                                                               │
│   success: true,                                               │
│   data: [{ id: 1, ... }, ...],                                │
│   count: 2                                                      │
│ }                                                               │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ EXPRESS SERVER                                                  │
│                                                                 │
│ res.json() → отправляет JSON ответ клиенту                     │
│ HTTP 200 OK                                                     │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ КЛИЕНТ                                                          │
│                                                                 │
│ Получает JSON ответ                                             │
│ Обрабатывает данные                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Детальный разбор вызовов:

```javascript
// 1. Клиент отправляет запрос
fetch('http://localhost:5000/api/masters')

// 2. Express получает запрос
// server.js, строка 22:
app.use('/api/masters', masterRoutes)
// Express проверяет: URL начинается с /api/masters? ДА
// Передает управление в masterRoutes

// 3. Router обрабатывает маршрут
// routes/masters.js, строка 6:
router.get('/', masterController.getAll)
// Express проверяет: путь = '/'? ДА (после /api/masters)
// Вызывает: masterController.getAll(req, res)

// 4. Controller вызывает метод
// controllers/masterController.js:
// MasterController наследуется от BaseController
// getAll наследуется, но не переопределен
// Вызывается BaseController.getAll

// 5. BaseController выполняет запрос
// controllers/baseController.js, строка 9-23:
getAll = async (req, res) => {
  // this.model = Master (установлен в constructor)
  const records = await this.model.findAll();
  // Master.findAll() → это Sequelize метод
  res.json({ success: true, data: records });
}

// 6. Sequelize генерирует SQL
// Sequelize ORM преобразует:
Master.findAll()
// В SQL:
SELECT * FROM master;

// 7. PostgreSQL выполняет запрос
// Возвращает данные

// 8. Sequelize преобразует результат
// Строки БД → JavaScript объекты

// 9. Ответ возвращается клиенту
res.json({ success: true, data: [...] })
```

---

## 3. Поток POST запроса

### Пример: `POST /api/masters` с телом `{ last_name: "Иванов", first_name: "Иван" }`

```
┌─────────────────────────────────────────────────────────────────┐
│ КЛИЕНТ                                                           │
│ fetch('/api/masters', {                                          │
│   method: 'POST',                                                │
│   body: JSON.stringify({ last_name: "Иванов", ... })             │
│ })                                                               │
└───────────────────────────┬─────────────────────────────────────┘
                             │ HTTP POST + JSON body
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ EXPRESS MIDDLEWARE                                              │
│                                                                 │
│ 1. cors() → проверяет CORS                                     │
│ 2. express.json() → ПАРСИТ JSON из тела запроса                │
│    req.body = { last_name: "Иванов", first_name: "Иван" }     │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ ROUTER                                                           │
│                                                                 │
│ router.post('/', masterController.create)                       │
│                                                                 │
│ Express проверяет:                                             │
│ - URL: /api/masters                                             │
│ - Метод: POST                                                   │
│ - Совпадение: router.post('/') → ДА!                          │
│                                                                 │
│ Вызывает: masterController.create(req, res)                    │
│ req.body = { last_name: "Иванов", ... }                        │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ BASE CONTROLLER                                                  │
│                                                                 │
│ create = async (req, res) => {                                  │
│   // req.body содержит данные от клиента                        │
│   const record = await this.model.create(req.body);            │
│   // this.model = Master                                       │
│   // Master.create({ last_name: "Иванов", ... })               │
│   res.status(201).json({ success: true, data: record });      │
│ }                                                               │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ MODEL + VALIDATION                                               │
│                                                                 │
│ Master.create() → Sequelize:                                    │
│ 1. Проверяет валидацию (models/Master.js):                     │
│    - last_name не пустой? ДА                                   │
│    - first_name не пустой? ДА                                  │
│    - длина last_name <= 50? ДА                                  │
│                                                                 │
│ 2. Генерирует SQL:                                             │
│    INSERT INTO master (last_name, first_name)                  │
│    VALUES ('Иванов', 'Иван')                                   │
│    RETURNING *;                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ DATABASE                                                         │
│                                                                 │
│ Выполняет INSERT                                                │
│ Возвращает созданную запись с id (auto-increment)              │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼ [ОБРАТНЫЙ ПУТЬ]
┌─────────────────────────────────────────────────────────────────┐
│ CONTROLLER                                                       │
│                                                                 │
│ record = { id: 1, last_name: "Иванов", ... }                 │
│ res.status(201).json({ success: true, data: record })        │
└───────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ КЛИЕНТ                                                           │
│                                                                 │
│ Получает: HTTP 201 Created                                      │
│ { success: true, data: { id: 1, ... } }                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Наследование контроллеров

### Как работает наследование:

```javascript
// baseController.js
class BaseController {
  constructor(model) {
    this.model = model;  // Сохраняет модель
  }
  
  getAll = async (req, res) => { ... }
  create = async (req, res) => { ... }
  // ... другие методы
}

// masterController.js
class MasterController extends BaseController {
  constructor() {
    super(Master);  // ← Передает модель Master в BaseController
    // Теперь this.model = Master в BaseController
  }
  
  // Наследует ВСЕ методы от BaseController:
  // - getAll
  // - create
  // - update
  // - delete
  // и т.д.
  
  // Добавляет свои методы:
  getWithMaintenance = async (req, res) => { ... }
}

// Создание экземпляра
const masterController = new MasterController();
// masterController.getAll → метод из BaseController
// masterController.getWithMaintenance → метод из MasterController
```

### Цепочка вызовов при наследовании:

```javascript
// Когда вызывается masterController.getAll:

1. masterController.getAll(req, res)
   ↓
2. MasterController не имеет метода getAll
   ↓
3. Ищет в BaseController → НАЙДЕНО!
   ↓
4. Выполняется BaseController.getAll
   ↓
5. Внутри: this.model.findAll()
   ↓
6. this.model = Master (установлен в constructor)
   ↓
7. Master.findAll() → Sequelize запрос
```

---

## 5. Связи между модулями

### Граф зависимостей:

```
server.js
  ├─ config/database.js (sequelize instance)
  ├─ models/associations.js
  │   ├─ models/Master.js
  │   ├─ models/Worker.js
  │   ├─ models/Machine.js
  │   └─ models/MaintenanceHistory.js
  │
  └─ routes/
      ├─ routes/masters.js
      │   └─ controllers/masterController.js
      │       ├─ controllers/baseController.js
      │       └─ models/associations.js (для связей)
      │
      ├─ routes/workers.js
      │   └─ controllers/workerController.js
      │       ├─ controllers/baseController.js
      │       └─ models/associations.js
      │
      ├─ routes/machines.js
      │   └─ controllers/machineController.js
      │       ├─ controllers/baseController.js
      │       └─ models/associations.js
      │
      └─ routes/maintenance.js
          └─ controllers/maintenanceController.js
              ├─ controllers/baseController.js
              └─ models/associations.js
```

### Порядок загрузки модулей:

```
1. server.js запускается
   ↓
2. require('./config/database') → создается sequelize
   ↓
3. require('./models/associations') → загружаются модели
   │   ├─ require('./Master')
   │   ├─ require('./Worker')
   │   ├─ require('./Machine')
   │   └─ require('./MaintenanceHistory')
   │   Затем устанавливаются связи (hasMany, belongsTo)
   ↓
4. require('./routes/masters') → загружается router
   │   └─ require('./controllers/masterController')
   │       ├─ require('./baseController')
   │       └─ require('../models/associations')
   │           (но модели уже загружены, берет из кеша)
   ↓
5. app.use('/api/masters', masterRoutes) → регистрация
   ↓
6. startServer() → подключение к БД и запуск
```

---

## 6. Пример с JOIN запросом

### Запрос: `GET /api/masters/1/with-maintenance`

```javascript
// 1. Router (routes/masters.js)
router.get('/:id/with-maintenance', masterController.getWithMaintenance)
// req.params.id = 1

// 2. Controller (masterController.js)
getWithMaintenance = async (req, res) => {
  const master = await Master.findByPk(req.params.id, {
    include: [{
      model: MaintenanceHistory,
      as: 'maintenanceHistory',
      include: [{
        model: Machine,
        as: 'machine'
      }]
    }]
  });
  // Sequelize генерирует JOIN запрос
}

// 3. Sequelize генерирует SQL:
SELECT 
  master.*,
  maintenance_history.*,
  machine.*
FROM master
LEFT JOIN maintenance_history ON maintenance_history.master_id = master.id
LEFT JOIN machine ON machine.id = maintenance_history.machine_id
WHERE master.id = 1;

// 4. PostgreSQL выполняет запрос
// Возвращает данные с JOIN

// 5. Sequelize преобразует в структуру:
{
  id: 1,
  last_name: "Иванов",
  maintenanceHistory: [
    {
      id: 1,
      state: "completed",
      machine: { id: 1 }
    }
  ]
}

// 6. Controller возвращает клиенту
res.json({ success: true, data: master })
```

---

## 7. Обработка ошибок

### Пример: запрос несуществующей записи

```javascript
// GET /api/masters/999

// BaseController.getById
getById = async (req, res) => {
  const record = await this.model.findByPk(req.params.id);
  // record = null (не найдено)
  
  if (!record) {
    return res.status(404).json({
      success: false,
      error: 'Запись не найдена'
    });
  }
  // ...
}

// Клиент получает:
// HTTP 404 Not Found
// { success: false, error: 'Запись не найдена' }
```

---

## Резюме потока данных

```
КЛИЕНТ
  ↓ HTTP запрос
EXPRESS (middleware: CORS, JSON parser)
  ↓ маршрутизация
ROUTER (routes/*.js)
  ↓ вызывает метод
CONTROLLER (controllers/*Controller.js)
  ↓ может использовать
BASE CONTROLLER (наследование)
  ↓ вызывает метод модели
MODEL (models/*.js) → Sequelize ORM
  ↓ генерирует SQL
DATABASE (PostgreSQL)
  ↓ возвращает данные
MODEL (Sequelize преобразует)
  ↓ возвращает объекты
CONTROLLER (формирует ответ)
  ↓ JSON ответ
EXPRESS (отправляет HTTP)
  ↓ HTTP ответ
КЛИЕНТ
```

