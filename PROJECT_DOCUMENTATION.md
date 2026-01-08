# 📚 Полная документация проекта SVCH

## Оглавление
1. [Начало работы - Миграции](#начало-работы---миграции)
2. [Общая структура проекта](#общая-структура-проекта)
3. [Бэкенд (Backend)](#бэкенд-backend)
4. [Фронтенд (Frontend)](#фронтенд-frontend)
5. [База данных](#база-данных)
6. [Архитектура и потоки данных](#архитектура-и-потоки-данных)
7. [Как все работает вместе](#как-все-работает-вместе)

---

## 🚀 Начало работы - Миграции

### Что такое миграции?
Миграции - это способ управления схемой базы данных версионированием. Каждая миграция содержит инструкции для создания или изменения структуры БД.

### Какие миграции нужно запустить?

В проекте есть **3 миграции** (в порядке выполнения):

#### 1. `20260104193622-add-auth-fields-to-master.js`
**Назначение:** Добавляет поля для аутентификации в таблицу `master`

**Что делает:**
- Добавляет поле `email` (email мастера для входа)
- Добавляет поле `password_hash` (хеш пароля)
- Добавляет поле `role` (ENUM: 'master' или 'admin')
- Добавляет поле `is_active` (активен ли мастер)
- Добавляет поля для восстановления пароля: `reset_password_token`, `reset_password_expires`

**Когда запускать:** Всегда (базовая миграция для аутентификации)

#### 2. `20260108032710-add-machine-fields.js` (ЗАКОММЕНТИРОВАНА)
**Назначение:** Добавляет поля `serial_number` и `name` для машин

**Что делает:**
- Добавляет поле `serial_number` (серийный номер станка)
- Добавляет поле `name` (название станка)

**Когда запускать:** Только если нужно использовать серийные номера и названия станков

**⚠️ ВАЖНО:** Эта миграция закомментирована. Раскомментируйте её в файле, если нужны эти поля.

#### 3. `20250115120000-create-workshop.js`
**Назначение:** Создает таблицу `workshop` для хранения схем цеха

**Что делает:**
- Создает таблицу `workshop` с полями:
  - `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
  - `name` (VARCHAR(200)) - название схемы
  - `layout_data` (JSONB) - данные схемы (стены, двери, станки)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)
- Создает индексы для быстрого поиска

**Когда запускать:** Всегда (для работы планировщика цеха)

### Как запустить миграции?

#### Способ 1: Через Sequelize CLI (Рекомендуется)
```bash
cd backend
npx sequelize-cli db:migrate
```

#### Способ 2: Вручную через SQL
Откройте PostgreSQL и выполните SQL из файлов миграций вручную.

#### Способ 3: Через Node.js скрипт
Создайте файл `backend/migrations/run.js`:
```javascript
const { execSync } = require('child_process');
execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
```

### Откат миграций (если нужно)
```bash
cd backend
npx sequelize-cli db:migrate:undo        # Откатить последнюю миграцию
npx sequelize-cli db:migrate:undo:all    # Откатить все миграции
```

---

## 📁 Общая структура проекта

```
SVCH/
├── backend/              # Серверная часть (Node.js + Express + Sequelize)
│   ├── config/          # Конфигурация
│   ├── controllers/     # Контроллеры (бизнес-логика)
│   ├── db/              # Абстракция базы данных
│   │   ├── adapters/    # Адаптеры для разных БД
│   │   ├── factories/   # Фабрики репозиториев
│   │   ├── interfaces/  # Интерфейсы (контракты)
│   │   └── repositories/# Репозитории (доступ к данным)
│   ├── middleware/      # Middleware (аутентификация, авторизация)
│   ├── migrations/      # Миграции БД
│   ├── models/          # Модели Sequelize
│   ├── routes/          # Маршруты API
│   ├── seeders/         # Начальные данные (seed)
│   └── server.js        # Точка входа сервера
│
└── frontend/            # Клиентская часть (React + Redux)
    ├── public/          # Статические файлы
    └── src/
        ├── components/  # React компоненты
        ├── pages/       # Страницы приложения
        ├── services/    # API сервисы
        ├── store/       # Redux store
        └── App.js       # Главный компонент
```

---

## 🔧 Бэкенд (Backend)

### 1. Конфигурация (`backend/config/`)

#### `database.js` - Настройка подключения к БД
**Расположение:** `backend/config/database.js`

**Что делает:**
- Создает подключение к PostgreSQL через Sequelize
- Создает адаптер базы данных (`SequelizeAdapter`)
- Экспортирует `connection` (для моделей) и `dbAdapter` (для server.js)

**Ключевые переменные окружения (.env):**
```env
DB_TYPE=sequelize              # Тип БД (пока только sequelize)
DB_NAME=your_database          # Имя базы данных
DB_USER=your_username          # Пользователь БД
DB_PASSWORD=your_password      # Пароль БД
DB_HOST=localhost              # Хост БД
DB_PORT=5432                   # Порт БД
```

**Как работает:**
1. Читает переменные окружения
2. Создает экземпляр Sequelize
3. Создает адаптер (для абстракции БД)
4. Экспортирует для использования в моделях и сервере

---

### 2. Модели (`backend/models/`)

Модели определяют структуру таблиц в БД и отношения между ними.

#### Структура моделей:

| Модель | Файл | Таблица | Описание |
|--------|------|---------|----------|
| **Master** | `Master.js` | `master` | Мастера (пользователи системы) |
| **Worker** | `Worker.js` | `worker` | Рабочие (подчиненные мастеров) |
| **Machine** | `Machine.js` | `machine` | Станки/машины на производстве |
| **MaintenanceHistory** | `MaintenanceHistory.js` | `maintenance_history` | История обслуживания станков |
| **Workshop** | `Workshop.js` | `workshop` | Схемы цеха (планировщик) |

#### `associations.js` - Связи между моделями
**Расположение:** `backend/models/associations.js`

**Что делает:**
Определяет отношения между таблицами:
- `Master` → `hasMany` → `Worker` (мастер имеет много рабочих)
- `Worker` → `belongsTo` → `Master` (рабочий принадлежит мастеру)
- `Master` → `hasMany` → `MaintenanceHistory` (мастер выполняет обслуживания)
- `Machine` → `hasMany` → `MaintenanceHistory` (станок имеет историю обслуживания)
- `MaintenanceHistory` → `belongsTo` → `Master` и `Machine`

**Как работает:**
При использовании `include` в Sequelize автоматически подтягивает связанные данные.

**Пример:**
```javascript
// Получить рабочего с мастером
const worker = await Worker.findByPk(id, {
  include: [{ model: Master, as: 'master' }]
});
// worker.master будет содержать данные мастера
```

---

### 3. Репозитории (`backend/db/repositories/`)

Репозитории - это слой абстракции для работы с данными. Они инкапсулируют логику доступа к БД.

#### Архитектура репозиториев:

```
IRepository (интерфейс)
    ↓
BaseRepository (базовая реализация)
    ↓
[MasterRepository, WorkerRepository, MachineRepository, ...] (специфичные)
```

#### `IRepository.js` - Интерфейс (контракт)
**Расположение:** `backend/db/interfaces/IRepository.js`

**Что делает:**
Определяет обязательные методы для всех репозиториев:
- `findAll(options)` - получить все записи
- `findById(id)` - получить по ID
- `create(data)` - создать запись
- `update(id, data)` - обновить запись
- `delete(id)` - удалить запись
- `findAndCountAll(options)` - получить с подсчетом (для пагинации)
- `count(options)` - подсчитать записи
- `findOne(options)` - найти одну запись

#### `BaseRepository.js` - Базовая реализация
**Расположение:** `backend/db/repositories/sequelize/BaseRepository.js`

**Что делает:**
Реализует все методы интерфейса для Sequelize:
- Обрабатывает фильтры, сортировку, пагинацию
- Парсит ID (строки → числа)
- Строит WHERE-условия

**Пример использования:**
```javascript
const repo = new BaseRepository(Master);
const masters = await repo.findAll({ where: { is_active: true } });
```

#### Специфичные репозитории:

| Репозиторий | Файл | Специальные методы |
|------------|------|-------------------|
| **MasterRepository** | `MasterRepository.js` | - |
| **WorkerRepository** | `WorkerRepository.js` | `findAllWithMaster()`, `findByIdWithMaster()` |
| **MachineRepository** | `MachineRepository.js` | `findByIdWithMaintenance()`, `getStatistics()`, `deleteWithDependencies()` |
| **MaintenanceRepository** | `MaintenanceRepository.js` | `getAllDetailed()`, `getDetailed()` |
| **WorkshopRepository** | `WorkshopRepository.js` | `findAllSorted()`, `findByName()` |

**Пример специфичного метода:**
```javascript
// WorkerRepository.findAllWithMaster()
// Автоматически включает данные мастера при получении рабочих
const result = await workerRepo.findAllWithMaster({
  where: { master_id: 1 }
});
// result.rows - массив рабочих, каждый worker.master содержит данные мастера
```

#### `RepositoryFactory.js` - Фабрика репозиториев
**Расположение:** `backend/db/factories/RepositoryFactory.js`

**Что делает:**
Создает правильный репозиторий в зависимости от типа БД.

**Как работает:**
```javascript
// В контроллере
const repo = RepositoryFactory.getWorkerRepository();
// Внутри проверяется DB_TYPE и создается SequelizeWorkerRepository или другой
```

**Зачем нужна:**
Позволяет легко переключаться между БД (PostgreSQL, MongoDB) без изменения контроллеров.

---

### 4. Контроллеры (`backend/controllers/`)

Контроллеры обрабатывают HTTP-запросы и вызывают репозитории для работы с данными.

#### `baseController.js` - Базовый контроллер
**Расположение:** `backend/controllers/baseController.js`

**Что делает:**
Содержит общие методы для всех контроллеров:
- `getAll(req, res)` - GET список с пагинацией
- `getById(req, res)` - GET по ID
- `create(req, res)` - POST создать
- `update(req, res)` - PUT обновить
- `delete(req, res)` - DELETE удалить
- `search(req, res)` - GET поиск
- `getAllSorted(req, res)` - GET отсортированный список
- `getAllFiltered(req, res)` - GET отфильтрованный список

**Как работает:**
```javascript
class BaseController {
  constructor(repository) {
    this.repository = repository; // Репозиторий для работы с данными
  }
  
  getAll = async (req, res) => {
    // Извлекает параметры из query string
    // Вызывает repository.findAll()
    // Возвращает JSON ответ
  }
}
```

#### Специфичные контроллеры:

| Контроллер | Файл | Наследует | Специальные методы |
|-----------|------|-----------|-------------------|
| **MasterController** | `masterController.js` | BaseController | `getAllWithMaintenance()`, `getWithMaintenance()`, `getStatistics()` |
| **WorkerController** | `workerController.js` | BaseController | Переопределяет `getAll()`, `getById()`, `create()`, `update()` для автоматического включения мастера |
| **MachineController** | `machineController.js` | BaseController | `getWithMaintenance()`, `getStatistics()`, `delete()` (с каскадным удалением) |
| **MaintenanceController** | `maintenanceController.js` | BaseController | `getAllDetailed()`, `getDetailed()`, `getByState()` |
| **WorkshopController** | `workshopController.js` | BaseController | Переопределяет `getAll()` (сортировка по дате), `update()` (частичное обновление) |
| **AuthController** | `authController.js` | - | `login()`, `register()`, `getMe()`, `changePassword()`, `forgotPassword()`, `resetPassword()` |

**Пример контроллера:**
```javascript
// backend/controllers/workerController.js
class WorkerController extends BaseController {
  constructor() {
    super(RepositoryFactory.getWorkerRepository()); // Получаем репозиторий
  }
  
  // Переопределяем getAll чтобы всегда включать мастера
  getAll = async (req, res) => {
    const result = await this.repository.findAllWithMaster(options);
    res.json({ success: true, data: result.rows });
  }
}
```

---

### 5. Роуты (`backend/routes/`)

Роуты определяют URL-пути и связывают их с методами контроллеров.

#### Структура роутов:

| Роутер | Файл | Базовый путь | Эндпоинты |
|--------|------|--------------|-----------|
| **auth** | `auth.js` | `/api/auth` | `/login`, `/register`, `/me`, `/change-password`, `/forgot-password`, `/reset-password/:token` |
| **masters** | `masters.js` | `/api/masters` | `/`, `/:id`, `/:id/with-maintenance`, `/:id/statistics`, `/search`, etc. |
| **workers** | `workers.js` | `/api/workers` | `/`, `/:id`, `/:id/with-master`, `/search`, etc. |
| **machines** | `machines.js` | `/api/machines` | `/`, `/:id`, `/:id/with-maintenance`, `/:id/statistics`, etc. |
| **maintenance** | `maintenance.js` | `/api/maintenance` | `/`, `/detailed/all`, `/:id`, `/state/:state`, etc. |
| **workshops** | `workshops.js` | `/api/workshops` | `/`, `/:id`, `/search`, etc. |

**Пример роута:**
```javascript
// backend/routes/workers.js
router.get('/', workerController.getAll.bind(workerController));
router.get('/:id', workerController.getById.bind(workerController));
router.post('/', workerController.create.bind(workerController));
// bind нужен чтобы сохранить контекст this
```

#### `server.js` - Главный файл сервера
**Расположение:** `backend/server.js`

**Что делает:**
1. Загружает переменные окружения (.env)
2. Подключает модели и ассоциации
3. Создает Express приложение
4. Настраивает middleware (CORS, JSON парсер)
5. Подключает роуты
6. Подключается к БД через адаптер
7. Синхронизирует модели с БД
8. Запускает сервер на порту 5000

**Порядок запуска:**
```javascript
1. require('dotenv').config()           // Загрузить .env
2. require('./models/associations')     // Загрузить модели и связи
3. const app = express()                // Создать Express app
4. app.use(cors())                      // Разрешить CORS
5. app.use(express.json())              // Парсить JSON
6. app.use('/api/masters', masterRoutes) // Подключить роуты
7. await dbAdapter.authenticate()       // Проверить подключение к БД
8. await dbAdapter.sync()               // Синхронизировать модели
9. app.listen(5000)                     // Запустить сервер
```

---

### 6. Middleware (`backend/middleware/`)

#### `auth.js` - Аутентификация и авторизация
**Расположение:** `backend/middleware/auth.js`

**Что содержит:**
- `authMiddleware` - проверяет JWT токен в заголовке `Authorization`
- `roleMiddleware(roles)` - проверяет роль пользователя

**Как работает:**
```javascript
// В роуте
router.get('/masters', authMiddleware, roleMiddleware(['admin']), masterController.getAll);

// authMiddleware:
// 1. Извлекает токен из заголовка Authorization
// 2. Проверяет валидность токена
// 3. Добавляет req.user с данными пользователя
// 4. Передает дальше или возвращает 401

// roleMiddleware(['admin']):
// 1. Проверяет req.user.role
// 2. Если роль в списке разрешенных - передает дальше
// 3. Иначе возвращает 403
```

---

## 🎨 Фронтенд (Frontend)

### 1. Структура

#### `src/index.js` - Точка входа
**Расположение:** `frontend/src/index.js`

**Что делает:**
Рендерит главный компонент `App` в DOM элемент `#root`.

#### `src/App.js` - Главный компонент
**Расположение:** `frontend/src/App.js`

**Что делает:**
- Настраивает Redux Provider
- Настраивает Material-UI Theme
- Определяет маршруты приложения (React Router)
- Обертка для всех страниц в `<Layout>`

**Маршруты:**
- `/` - Главная страница
- `/login` - Вход
- `/register` - Регистрация
- `/masters` - Мастера (защищенный)
- `/workers` - Рабочие (защищенный)
- `/machines` - Машины (защищенный)
- `/maintenance` - Обслуживание (защищенный)
- `/workshop` - Планировщик цеха (защищенный)
- `/workshop/:id` - Планировщик цеха для конкретной схемы

---

### 2. Redux Store (`frontend/src/store/`)

Redux управляет глобальным состоянием приложения.

#### `store.js` - Настройка Redux Store
**Расположение:** `frontend/src/store/store.js`

**Что содержит:**
- `auth` - состояние аутентификации
- `masters` - список мастеров
- `workers` - список рабочих
- `machines` - список машин
- `maintenance` - история обслуживания
- `workshops` - схемы цеха

#### Redux Slices (`frontend/src/store/slices/`)

Каждый slice управляет состоянием для одной сущности.

**Структура slice:**
```javascript
const slice = createSlice({
  name: 'workers',
  initialState: {
    items: [],           // Данные
    loading: false,      // Загрузка
    error: null,         // Ошибка
    pagination: {}       // Пагинация
  },
  reducers: {
    // Синхронные действия
    clearError: (state) => { state.error = null; }
  },
  extraReducers: {
    // Асинхронные действия (thunks)
    [fetchWorkers.pending]: (state) => { state.loading = true; },
    [fetchWorkers.fulfilled]: (state, action) => {
      state.items = action.payload.data;
      state.loading = false;
    }
  }
});
```

**Async Thunks (асинхронные действия):**
```javascript
export const fetchWorkers = createAsyncThunk(
  'workers/fetchWorkers',
  async (params) => {
    const response = await workersAPI.getAll(params);
    return response.data;
  }
);
// Использование:
dispatch(fetchWorkers({ page: 1, limit: 10 }));
```

---

### 3. API Сервисы (`frontend/src/services/`)

#### `api.js` - HTTP клиент
**Расположение:** `frontend/src/services/api.js`

**Что делает:**
- Создает axios экземпляр с базовым URL `http://localhost:5000/api`
- Добавляет JWT токен в заголовки (если есть)
- Обрабатывает ошибки (401 → редирект на /login)
- Экспортирует методы для всех API:
  - `authAPI` - аутентификация
  - `mastersAPI` - мастера
  - `workersAPI` - рабочие
  - `machinesAPI` - машины
  - `maintenanceAPI` - обслуживание
  - `workshopsAPI` - схемы цеха

**Пример:**
```javascript
// Вызов API
const response = await workersAPI.getAll({ page: 1, limit: 10 });
// Внутри выполняется GET http://localhost:5000/api/workers?page=1&limit=10
```

---

### 4. Компоненты (`frontend/src/components/`)

#### Структура компонентов:

| Директория | Компоненты | Описание |
|-----------|-----------|----------|
| **Auth/** | `LoginForm.js`, `RegisterForm.js`, `PrivateRoute.js`, etc. | Формы аутентификации и защита роутов |
| **Layout/** | `Layout.js`, `Header.js` | Общий layout и навигация |
| **Masters/** | `MasterList.js`, `MasterForm.js` | Список и форма мастеров |
| **Workers/** | `WorkerList.js`, `WorkerForm.js` | Список и форма рабочих |
| **Machines/** | `MachineList.js`, `MachineForm.js` | Список и форма машин |
| **Maintenance/** | `MaintenanceList.js`, `MaintenanceForm.js` | Список и форма обслуживания |
| **Workshop/** | `WorkshopPlanner.js` | Планировщик цеха с Fabric.js |

**Типичная структура List компонента:**
```javascript
// WorkerList.js
const WorkerList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector(state => state.workers);
  
  useEffect(() => {
    dispatch(fetchWorkers()); // Загрузить данные при монтировании
  }, [dispatch]);
  
  return (
    <Paper>
      <Table>
        {items.map(worker => (
          <TableRow key={worker.id}>
            {/* Отображение данных */}
          </TableRow>
        ))}
      </Table>
    </Paper>
  );
};
```

**Типичная структура Form компонента:**
```javascript
// WorkerForm.js
const WorkerForm = ({ worker, onClose }) => {
  const [formData, setFormData] = useState({...});
  const dispatch = useDispatch();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (worker) {
      await dispatch(updateWorker({ id: worker.id, data: formData }));
    } else {
      await dispatch(createWorker(formData));
    }
    onClose();
  };
  
  return <form onSubmit={handleSubmit}>{/* Поля формы */}</form>;
};
```

#### `WorkshopPlanner.js` - Планировщик цеха
**Расположение:** `frontend/src/components/Workshop/WorkshopPlanner.js`

**Что делает:**
1. Инициализирует Fabric.js Canvas
2. Загружает схему из Redux (если `workshopId` передан)
3. Позволяет добавлять элементы (стены, двери, станки)
4. Позволяет перемещать и изменять размеры элементов
5. Удаление элементов (Delete/Backspace)
6. Сохранение схемы в БД
7. Цвета станков в зависимости от обслуживания

**Как работает:**
```javascript
// Инициализация canvas
useEffect(() => {
  const canvas = new fabric.Canvas(canvasRef.current, {...});
  canvasInstanceRef.current = canvas;
}, []);

// Загрузка схемы
useEffect(() => {
  if (workshopId) {
    dispatch(fetchWorkshopById(workshopId));
  }
}, [workshopId]);

// Отображение элементов на canvas
useEffect(() => {
  layoutData.elements.forEach(element => {
    const obj = new fabric.Rect({...});
    canvas.add(obj);
  });
}, [currentWorkshop]);

// Сохранение
const handleSave = async () => {
  const elements = canvas.getObjects().map(obj => ({
    type: obj.get('elementType'),
    left: obj.left,
    top: obj.top,
    ...
  }));
  await dispatch(updateWorkshop({ id, data: { layout_data: { elements } } }));
};
```

---

### 5. Страницы (`frontend/src/pages/`)

Страницы - это обертки вокруг компонентов, которые используются в роутах.

**Пример:**
```javascript
// WorkersPage.js
import WorkerList from '../components/Workers/WorkerList';

const WorkersPage = () => {
  return <WorkerList />;
};
```

**Список страниц:**
- `HomePage.js` - Главная
- `LoginPage.js` - Вход
- `RegisterPage.js` - Регистрация
- `MastersPage.js` - Страница мастеров
- `WorkersPage.js` - Страница рабочих
- `MachinesPage.js` - Страница машин
- `MaintenancePage.js` - Страница обслуживания
- `WorkshopPage.js` - Страница планировщика цеха
- `ProfilePage.js` - Профиль пользователя

---

## 🗄️ База данных

### Таблицы и их назначение:

| Таблица | Описание | Связи |
|---------|----------|-------|
| **master** | Мастера (пользователи системы) | → hasMany → worker, maintenance_history |
| **worker** | Рабочие | → belongsTo → master |
| **machine** | Станки/машины | → hasMany → maintenance_history |
| **maintenance_history** | История обслуживания | → belongsTo → master, machine |
| **workshop** | Схемы цеха (JSONB данные) | - |

### Структура таблиц:

#### `master`
```sql
id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
last_name (VARCHAR(50))
first_name (VARCHAR(50))
middle_name (VARCHAR(50))
email (VARCHAR(100), UNIQUE)
password_hash (VARCHAR(255))
role (ENUM('master', 'admin'))
is_active (BOOLEAN)
reset_password_token (VARCHAR(255))
reset_password_expires (TIMESTAMP)
```

#### `worker`
```sql
id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
last_name (VARCHAR(50))
first_name (VARCHAR(50))
middle_name (VARCHAR(50))
master_id (INTEGER, FOREIGN KEY → master.id)
```

#### `machine`
```sql
id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
-- Опционально (если миграция раскомментирована):
-- serial_number (VARCHAR(100))
-- name (VARCHAR(200))
```

#### `maintenance_history`
```sql
id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
machine_id (INTEGER, FOREIGN KEY → machine.id)
master_id (INTEGER, FOREIGN KEY → master.id)
state (VARCHAR(50)) -- 'completed', 'in_progress', 'planned', 'cancelled'
start_date (TIMESTAMP)
end_date (TIMESTAMP)
```

#### `workshop`
```sql
id (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
name (VARCHAR(200))
layout_data (JSONB) -- { elements: [{ type, left, top, width, height, angle, machineId? }] }
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 🔄 Архитектура и потоки данных

### 1. Запрос данных (Fetch)

```
Frontend (Компонент)
    ↓ dispatch(fetchWorkers())
Redux Thunk (workersSlice.js)
    ↓ workersAPI.getAll()
API Service (api.js)
    ↓ axios.get('/api/workers')
Backend Route (routes/workers.js)
    ↓ workerController.getAll()
Controller (controllers/workerController.js)
    ↓ repository.findAllWithMaster()
Repository (db/repositories/sequelize/WorkerRepository.js)
    ↓ model.findAndCountAll({ include: [Master] })
Sequelize ORM
    ↓ SQL SELECT
PostgreSQL Database
    ↑ SQL Result
Sequelize ORM (преобразует в объекты)
    ↑ Array of Worker objects with Master
Repository (возвращает результат)
    ↑ { rows: [...], count: 10 }
Controller (формирует JSON ответ)
    ↑ { success: true, data: [...], count: 10 }
Route (отправляет HTTP ответ)
    ↑ HTTP 200 + JSON
API Service (возвращает response.data)
    ↑ { success: true, data: [...], count: 10 }
Redux Thunk (dispatch fulfilled action)
    ↓ dispatch({ type: 'workers/fetchWorkers/fulfilled', payload: {...} })
Redux Slice (обновляет state)
    ↓ state.items = payload.data
Component (получает данные из state)
    ↑ const { items } = useSelector(state => state.workers)
```

### 2. Создание записи (Create)

```
Frontend Form
    ↓ onSubmit → dispatch(createWorker(data))
Redux Thunk
    ↓ workersAPI.create(data)
API Service
    ↓ axios.post('/api/workers', data)
Backend Route
    ↓ workerController.create()
Controller
    ↓ repository.create(data)
Repository
    ↓ model.create(data)
Sequelize
    ↓ SQL INSERT
PostgreSQL
    ↑ New record with ID
Sequelize
    ↑ Worker object
Repository
    ↓ findByIdWithMaster(id) // Получить с мастером
Controller
    ↑ Worker object with Master
Route
    ↑ HTTP 201 + JSON
API Service
    ↑ { success: true, data: worker }
Redux Thunk
    ↓ dispatch fulfilled
Redux Slice
    ↓ state.items.push(payload.data)
Component
    ↑ Обновленный список
```

### 3. Планировщик цеха (Workshop Planner)

```
1. Открытие страницы /workshop
   ↓
2. WorkshopPage монтируется
   ↓
3. WorkshopPlanner монтируется
   ↓
4. useEffect → dispatch(fetchMachines()) - загрузить станки
   ↓
5. useEffect → dispatch(fetchMaintenance()) - загрузить обслуживание
   ↓
6. useEffect → Инициализация Fabric.js Canvas
   ↓
7. Если workshopId передан:
   ↓
8. useEffect → dispatch(fetchWorkshopById(id))
   ↓
9. Получены данные схемы из БД
   ↓
10. useEffect → Отображение элементов на canvas
    ↓
11. layout_data.elements.forEach → Создание Fabric объектов
    ↓
12. canvas.add(object) → Элементы отображаются
    ↓
13. Пользователь добавляет/перемещает элементы
    ↓
14. Кнопка "Сохранить"
    ↓
15. handleSave → Извлечение всех объектов из canvas
    ↓
16. canvas.getObjects() → map → { type, left, top, width, height, angle, machineId }
    ↓
17. dispatch(updateWorkshop({ id, data: { layout_data: { elements } } }))
    ↓
18. API запрос → Backend → Repository → Sequelize → PostgreSQL
    ↓
19. Схема сохранена в БД в поле layout_data (JSONB)
```

---

## 🔗 Как все работает вместе

### Пример: Просмотр рабочего с мастером

1. **Пользователь** открывает страницу `/workers`
2. **WorkerList** компонент монтируется
3. **useEffect** вызывает `dispatch(fetchWorkers())`
4. **Redux Thunk** вызывает `workersAPI.getAll()`
5. **API Service** делает HTTP GET `/api/workers`
6. **Backend Route** `/api/workers` → `workerController.getAll`
7. **Controller** вызывает `repository.findAllWithMaster()`
8. **Repository** вызывает `Worker.findAndCountAll({ include: [Master] })`
9. **Sequelize** генерирует SQL:
   ```sql
   SELECT worker.*, master.*
   FROM worker
   LEFT JOIN master ON worker.master_id = master.id
   ```
10. **PostgreSQL** возвращает данные
11. **Sequelize** преобразует в объекты:
    ```javascript
    {
      id: 1,
      last_name: "Иванов",
      master: {
        id: 5,
        last_name: "Петров"
      }
    }
    ```
12. **Response** идет обратно по цепочке
13. **Redux** сохраняет в `state.workers.items`
14. **WorkerList** отображает данные с мастером в таблице

### Пример: Сохранение схемы цеха

1. **Пользователь** открывает `/workshop`
2. **WorkshopPlanner** загружает существующую схему (если есть)
3. **Пользователь** добавляет стену, дверь, станки на canvas
4. **Fabric.js** позволяет перемещать и изменять размеры
5. **Пользователь** нажимает "Сохранить"
6. **handleSave** извлекает все объекты:
   ```javascript
   canvas.getObjects().map(obj => ({
     type: 'machine',
     left: 100,
     top: 200,
     width: 100,
     height: 100,
     angle: 0,
     machineId: 5
   }))
   ```
7. **Redux** вызывает `updateWorkshop({ layout_data: { elements: [...] } })`
8. **Backend** сохраняет в `workshop.layout_data` (JSONB)
9. **При следующем открытии** схема загружается и восстанавливается на canvas

---

## 📝 Резюме

**Ключевые принципы:**
- **Разделение ответственности:** Контроллеры → Репозитории → Модели → БД
- **Абстракция БД:** Репозитории позволяют переключаться между БД
- **Единая точка входа:** Все API запросы через Redux Thunks
- **Автоматические связи:** Sequelize associations автоматически подтягивают связанные данные
- **Валидация:** На уровне моделей (Sequelize) и форм (React)

**Где что находится:**
- **Бизнес-логика:** `backend/controllers/`
- **Доступ к данным:** `backend/db/repositories/`
- **Модели БД:** `backend/models/`
- **API маршруты:** `backend/routes/`
- **UI компоненты:** `frontend/src/components/`
- **Состояние приложения:** `frontend/src/store/`
- **HTTP клиент:** `frontend/src/services/api.js`

**Миграции:**
1. `20260104193622-add-auth-fields-to-master.js` - аутентификация
2. `20260108032710-add-machine-fields.js` - опционально (закомментирована)
3. `20250115120000-create-workshop.js` - планировщик цеха

**Запуск:**
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm start
```
