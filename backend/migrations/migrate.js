// migrations/migrate.js

require('dotenv').config();
const CreateTablesMigration = require('./001-create-tables');
const FixIdsMigration = require('./002-fix-ids');
// РАСКОММЕНТИРУЙТЕ ПОСЛЕ ПОДГОТОВКИ МИГРАЦИИ 003-add-machine-fields.js
// const AddMachineFieldsMigration = require('./003-add-machine-fields');

async function main() {
  console.log('🏭 Factory Database Migration Tool');
  console.log('===================================\n');
  
  try {
    // Сначала создаем таблицы, если их нет
    console.log('📋 Шаг 1: Создание коллекций...\n');
    const createMigration = new CreateTablesMigration();
    try {
      await createMigration.run();
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Коллекции уже существуют, пропускаем создание');
      } else {
        throw error;
      }
    }
    
    // Затем исправляем ID
    console.log('\n📋 Шаг 2: Исправление ID...\n');
    const fixIdsMigration = new FixIdsMigration();
    await fixIdsMigration.run();
    
    // РАСКОММЕНТИРУЙТЕ ПОСЛЕ ПОДГОТОВКИ МИГРАЦИИ 003-add-machine-fields.js
    // Добавляем поля серийного номера и названия к машинам
    // console.log('\n📋 Шаг 3: Добавление полей к машинам...\n');
    // const addMachineFieldsMigration = new AddMachineFieldsMigration();
    // await addMachineFieldsMigration.run();
    
    console.log('\n✅ База данных готова к использованию!');
    console.log('📁 Сервер можно запускать командой: node server.js');
  } catch (error) {
    console.error('\n💥 Миграция завершилась с ошибкой');
    console.error('Убедитесь, что MongoDB запущена:');
    console.error('  Linux/Mac: sudo service mongod start или mongod');
    console.error('  Windows: net start MongoDB');
    process.exit(1);
  }
}

// Запуск миграции
if (require.main === module) {
  main();
}

module.exports = main;