# Архитектура абстракции базы данных

Проект организован с использованием паттерна **Repository** и **Adapter**, что позволяет легко переключаться между разными базами данных без изменения контроллеров и бизнес-логики.

## 📁 Структура проекта

```
backend/
├── db/
│   ├── interfaces/           # Интерфейсы (контракты)
│   │   └── IRepository.js
│   ├── repositories/         # Реализации репозиториев
│   │   └── sequelize/       # Sequelize реализации
│   │       ├── BaseRepository.js
│   │       ├── MasterRepository.js
│   │       ├── WorkerRepository.js
│   │       ├── MachineRepository.js
│   │       └── MaintenanceRepository.js
│   ├── factories/           # Фабрики
│   │   └── RepositoryFactory.js
│   ├── adapters/            # Адаптеры БД
│   │   ├── DatabaseAdapter.js
│   │   └── SequelizeAdapter.js
│   └── README.md            # Детальная документация
├── controllers/             # Контроллеры (используют репозитории)
├── models/                  # Модели (Sequelize/Mongoose и т.д.)
├── config/
│   └── database.js          # Конфигурация БД с выбором адаптера
└── server.js                # Инициализация адаптера БД
```

## 🔄 Поток данных

```
HTTP Request
    ↓
Controller (не знает о БД)
    ↓
RepositoryFactory (выбирает репозиторий по DB_TYPE)
    ↓
Repository (реализация для конкретной БД)
    ↓
Database Adapter (подключение к БД)
    ↓
Database (PostgreSQL, MongoDB, MySQL и т.д.)
```

## 🚀 Как использовать

### Текущая конфигурация (Sequelize/PostgreSQL)

В `.env` файле:
```env
DB_TYPE=sequelize
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### Переключение на другую БД

1. **Измените `DB_TYPE` в `.env`:**
   ```env
   DB_TYPE=mongoose  # или prisma, typeorm и т.д.
   ```

2. **Создайте адаптер** для новой БД:
   ```javascript
   // backend/db/adapters/MongooseAdapter.js
   const DatabaseAdapter = require('./DatabaseAdapter');
   
   class MongooseAdapter extends DatabaseAdapter {
     async connect() { /* ... */ }
     async disconnect() { /* ... */ }
     // ...
   }
   ```

3. **Создайте репозитории** для новой БД:
   ```javascript
   // backend/db/repositories/mongoose/BaseRepository.js
   class BaseRepository extends IRepository {
     // Реализация методов для Mongoose
   }
   ```

4. **Обновите `config/database.js`** для поддержки нового типа:
   ```javascript
   case 'mongoose':
     const MongooseAdapter = require('../db/adapters/MongooseAdapter');
     dbAdapter = new MongooseAdapter();
     break;
   ```

5. **Обновите `RepositoryFactory`** для выбора репозиториев:
   ```javascript
   case 'mongoose':
     MasterRepository = require('../repositories/mongoose/MasterRepository');
     // ...
     break;
   ```

6. **Создайте модели** для новой БД (Mongoose схемы, Prisma модели и т.д.)

## ✨ Преимущества

- ✅ **Изоляция**: Контроллеры не зависят от конкретной БД
- ✅ **Гибкость**: Переключение БД через переменную окружения
- ✅ **Тестируемость**: Легко создать моки репозиториев
- ✅ **Расширяемость**: Просто добавить новую БД
- ✅ **Чистый код**: Четкое разделение ответственности

## 📝 Примеры использования

### В контроллере

```javascript
const BaseController = require('./baseController');
const RepositoryFactory = require('../db/factories/RepositoryFactory');

class MasterController extends BaseController {
  constructor() {
    // Используем фабрику для получения репозитория
    super(RepositoryFactory.getMasterRepository());
  }
  
  // Базовые методы (CRUD) наследуются от BaseController
  // Специфичные методы добавляем здесь
  getAllWithMaintenance = async (req, res) => {
    const result = await this.repository.findAllWithMaintenance({
      page: 1,
      limit: 10
    });
    // ...
  };
}
```

### В репозитории

```javascript
const BaseRepository = require('./BaseRepository');
const { Master } = require('../../../models/associations');

class MasterRepository extends BaseRepository {
  constructor() {
    super(Master);
  }
  
  // Специфичные методы для мастеров
  async findAllWithMaintenance(options) {
    return await this.findAndCountAll({
      include: [/* связи */],
      // ...
    });
  }
}
```

## 🔧 Текущая поддержка

- ✅ **Sequelize/PostgreSQL** - полностью реализовано
- ⏳ **Mongoose/MongoDB** - можно добавить по инструкции выше
- ⏳ **Prisma** - можно добавить по инструкции выше
- ⏳ **TypeORM** - можно добавить по инструкции выше

## 📚 Дополнительная документация

Подробная документация находится в `backend/db/README.md`
