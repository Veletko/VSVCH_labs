// migrations/migrate.js

require('dotenv').config();
const CreateTablesMigration = require('./001-create-tables');

async function main() {
  console.log('🏭 Factory Database Migration Tool');
  console.log('===================================\n');
  
  const migration = new CreateTablesMigration();
  
  try {
    await migration.run();
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