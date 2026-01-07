# Миграции базы данных

## Запуск миграций

```bash
cd backend
node migrations/migrate.js
```

## Что делают миграции

### 001-create-tables.js
- Создает коллекции: `masters`, `workers`, `machines`, `maintenance_histories`
- Создает необходимые индексы
- Безопасна для повторного запуска (проверяет существование коллекций)

### 002-fix-ids.js
- Проверяет все документы в базе данных
- Исправляет неправильные типы ID:
  - Конвертирует строки в ObjectId (если валидны)
  - Удаляет невалидные ID (числа, невалидные строки)
  - Исправляет массивы ID в полях `workers`, `maintenance_history`
- **Важно**: Эта миграция исправляет существующие данные, не добавляет новые поля

## Структура ID в MongoDB

- Все документы имеют `_id` типа ObjectId (автоматически)
- Связи хранятся как ObjectId:
  - `workers.master_id` → ObjectId ссылка на `masters._id`
  - `maintenance_histories.machine_id` → ObjectId ссылка на `machines._id`
  - `maintenance_histories.master_id` → ObjectId ссылка на `masters._id`
- Массивы связей:
  - `masters.workers` → массив ObjectId
  - `masters.maintenance_history` → массив ObjectId
  - `machines.maintenance_history` → массив ObjectId

## После миграции

Убедитесь, что:
1. Все ID в базе данных имеют тип ObjectId
2. Все связи корректны
3. Сервер запускается без ошибок
4. Фронтенд правильно отображает данные
