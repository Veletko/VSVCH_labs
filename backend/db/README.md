# Архитектура абстракции базы данных

Эта архитектура позволяет легко переключаться между разными базами данных без изменения контроллеров и бизнес-логики.

## Структура

```
backend/db/
├── interfaces/           # Интерфейсы (контракты)
│   └── IRepository.js    # Базовый интерфейс репозитория
├── repositories/         # Реализации репозиториев
│   ├── sequelize/       # Реализация для Sequelize/PostgreSQL
│   │   ├── BaseRepository.js
│   │   ├── MasterRepository.js
│   │   ├── WorkerRepository.js
│   │   ├── MachineRepository.js
│   │   └── MaintenanceRepository.js
│   ├── mongoose/        # (Будущая) Реализация для Mongoose/MongoDB
│   └── prisma/          # (Будущая) Реализация для Prisma
├── factories/           # Фабрики для создания репозиториев
│   └── RepositoryFactory.js
└── adapters/            # Адаптеры для подключения к БД
    ├── DatabaseAdapter.js
    └── SequelizeAdapter.js
```

## Как это работает

### 1. Интерфейсы (Interfaces)

Интерфейс `IRepository` определяет контракт, которому должны следовать все репозитории:

```javascript
class IRepository {
  async findAll(options) { ... }
  async findById(id, options) { ... }
  async create(data) { ... }
  async update(id, data) { ... }
  async delete(id) { ... }
  // ...
}
```

### 2. Репозитории (Repositories)

Реализации репозиториев наследуются от базового репозитория и реализуют специфичную логику:

- **BaseRepository** - общие методы для всех репозиториев
- **MasterRepository** - специфичные методы для мастеров (статистика, связи)
- **WorkerRepository** - методы для рабочих
- и т.д.

### 3. Фабрика репозиториев (RepositoryFactory)

Фабрика создает нужные репозитории в зависимости от типа БД, указанного в `DB_TYPE`:

```javascript
// В .env файле
DB_TYPE=sequelize  // или mongoose, prisma и т.д.

// Использование
const masterRepo = RepositoryFactory.getMasterRepository();
```

### 4. Адаптеры БД (Database Adapters)

Адаптеры обеспечивают единый интерфейс для подключения к разным БД:

- `connect()` - подключение
- `disconnect()` - отключение
- `sync()` - синхронизация моделей
- `transaction()` - транзакции

## Как переключиться на другую БД

### Пример: Переход с Sequelize на Mongoose

1. **Создайте адаптер для Mongoose:**

```javascript
// backend/db/adapters/MongooseAdapter.js
const DatabaseAdapter = require('./DatabaseAdapter');
const mongoose = require('mongoose');

class MongooseAdapter extends DatabaseAdapter {
  async connect() {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
  }
  
  async disconnect() {
    await mongoose.disconnect();
  }
  
  // ... другие методы
}
```

2. **Создайте репозитории для Mongoose:**

```javascript
// backend/db/repositories/mongoose/BaseRepository.js
const IRepository = require('../../interfaces/IRepository');

class BaseRepository extends IRepository {
  constructor(model) {
    super();
    this.model = model;
  }
  
  async findAll(options) {
    return await this.model.find(options.where || {});
  }
  
  // ... реализация методов
}
```

3. **Обновите RepositoryFactory:**

```javascript
// backend/db/factories/RepositoryFactory.js
case 'mongoose':
  BaseRepository = require('../repositories/mongoose/BaseRepository');
  MasterRepository = require('../repositories/mongoose/MasterRepository');
  // ...
  break;
```

4. **Обновите config/database.js:**

```javascript
case 'mongoose':
  const MongooseAdapter = require('../db/adapters/MongooseAdapter');
  dbAdapter = new MongooseAdapter();
  break;
```

5. **Измените переменную окружения:**

```env
DB_TYPE=mongoose
```

6. **Обновите модели** (создайте Mongoose схемы вместо Sequelize моделей)

## Текущая поддержка

✅ **Sequelize/PostgreSQL** - полностью реализовано

⏳ **Mongoose/MongoDB** - можно добавить по описанному выше алгоритму

⏳ **Prisma** - можно добавить по описанному выше алгоритму

## Преимущества

1. **Изоляция** - контроллеры не знают о деталях БД
2. **Тестируемость** - легко создать моки репозиториев
3. **Гибкость** - переключение БД через переменную окружения
4. **Расширяемость** - легко добавить новую БД
5. **Чистый код** - разделение ответственности

## Использование в контроллерах

Контроллеры используют репозитории через фабрику:

```javascript
const BaseController = require('./baseController');
const RepositoryFactory = require('../db/factories/RepositoryFactory');

class MasterController extends BaseController {
  constructor() {
    super(RepositoryFactory.getMasterRepository());
  }
  
  // Специфичные методы
  getAllWithMaintenance = async (req, res) => {
    const result = await this.repository.findAllWithMaintenance({
      page: 1,
      limit: 10
    });
    // ...
  };
}
```

Все базовые методы (CRUD) наследуются от `BaseController`.
