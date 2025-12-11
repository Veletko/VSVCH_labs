# Инструкция по запуску сервера

## Проблема: ERR_CONNECTION_REFUSED

Эта ошибка означает, что сервер не запущен или недоступен.

## Шаги для запуска:

### 1. Установите зависимости

```bash
cd "backeand копия"
npm install
```

### 2. Настройте базу данных

Создайте файл `.env` в папке `backeand копия` на основе `.env.example`:

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
PORT=5000
NODE_ENV=development
```

### 3. Убедитесь, что PostgreSQL запущен

Проверьте, что PostgreSQL установлен и запущен на вашем компьютере.

### 4. Создайте базу данных

```sql
CREATE DATABASE your_database_name;
```

### 5. Запустите сервер

**Обычный запуск:**
```bash
npm start
```

**Запуск с автоперезагрузкой (для разработки):**
```bash
npm run dev
```

### 6. Проверьте работу сервера

Откройте в браузере: http://localhost:5000/api/health

Должен вернуться JSON с сообщением о том, что API работает.

## Проверка маршрутов

После запуска сервера доступны следующие эндпоинты:

- `GET http://localhost:5000/api/health` - проверка работы сервера
- `GET http://localhost:5000/api/masters` - список мастеров
- `GET http://localhost:5000/api/workers` - список рабочих
- `GET http://localhost:5000/api/machines` - список машин
- `GET http://localhost:5000/api/maintenance` - список обслуживания
- `GET http://localhost:5000/api/maintenance/detailed/all` - детальный список обслуживания

## Решение проблем

### Порт 5000 занят
Измените PORT в файле `.env` на другой порт (например, 5001).

### Ошибка подключения к БД
1. Проверьте, что PostgreSQL запущен
2. Проверьте правильность данных в `.env`
3. Убедитесь, что база данных создана

### Модули не найдены
Выполните `npm install` в папке `backeand копия`

