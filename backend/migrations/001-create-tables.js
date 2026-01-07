// migrations/001-create-tables.js
const mongoose = require('mongoose');

class CreateTablesMigration {
  async connect() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Fuctory';
    await mongoose.connect(mongoUri);
    return mongoose.connection;
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  async run() {
    console.log('🚀 СОЗДАНИЕ БАЗЫ ДАННЫХ FACTORY');
    console.log('=================================\n');
    
    try {
      await this.connect();
      console.log('✅ Подключение к MongoDB установлено');
      
      const db = mongoose.connection.db;
      
      // 1. СОЗДАЕМ КОЛЛЕКЦИЮ MASTERS (мастера)
      console.log('\n1. Создаю коллекцию masters...');
      await db.createCollection('masters');
      const mastersCollection = db.collection('masters');
      
      // Индексы для masters
      await mastersCollection.createIndex({ email: 1 }, { unique: true });
      await mastersCollection.createIndex({ role: 1 });
      await mastersCollection.createIndex({ is_active: 1 });
      console.log('✅ Коллекция masters создана');
      
      // 2. СОЗДАЕМ КОЛЛЕКЦИЮ WORKERS (рабочие)
      console.log('\n2. Создаю коллекцию workers...');
      await db.createCollection('workers');
      const workersCollection = db.collection('workers');
      
      // Индексы для workers
      await workersCollection.createIndex({ master_id: 1 });
      await workersCollection.createIndex({ last_name: 1, first_name: 1 });
      console.log('✅ Коллекция workers создана');
      
      // 3. СОЗДАЕМ КОЛЛЕКЦИЮ MACHINES (машины)
      console.log('\n3. Создаю коллекцию machines...');
      await db.createCollection('machines');
      const machinesCollection = db.collection('machines');
      
      // Индексы для machines
      await machinesCollection.createIndex({ serial_number: 1 }, { unique: true, sparse: true });
      await machinesCollection.createIndex({ status: 1 });
      await machinesCollection.createIndex({ next_maintenance: 1 });
      console.log('✅ Коллекция machines создана');
      
      // 4. СОЗДАЕМ КОЛЛЕКЦИЮ MAINTENANCE_HISTORIES (история обслуживания)
      console.log('\n4. Создаю коллекцию maintenance_histories...');
      await db.createCollection('maintenance_histories');
      const maintenanceCollection = db.collection('maintenance_histories');
      
      // Индексы для maintenance_histories
      await maintenanceCollection.createIndex({ machine_id: 1 });
      await maintenanceCollection.createIndex({ master_id: 1 });
      await maintenanceCollection.createIndex({ state: 1 });
      await maintenanceCollection.createIndex({ start_date: -1 });
      await maintenanceCollection.createIndex({ machine_id: 1, start_date: -1 });
      console.log('✅ Коллекция maintenance_histories создана');
      
      console.log('\n🎉 БАЗА ДАННЫХ СОЗДАНА УСПЕШНО!');
      console.log('📊 Коллекции:');
      console.log('   - masters');
      console.log('   - workers');
      console.log('   - machines');
      console.log('   - maintenance_histories');
      console.log('\n✅ Все индексы созданы');
      
    } catch (error) {
      console.error('\n❌ Ошибка создания базы данных:', error.message);
      throw error;
    } finally {
      await this.disconnect();
      console.log('\n🔌 Соединение с MongoDB закрыто');
    }
  }
}

// Экспортируем класс
module.exports = CreateTablesMigration;

// Если файл запускается напрямую
if (require.main === module) {
  require('dotenv').config();
  const migration = new CreateTablesMigration();
  
  migration.run()
    .then(() => {
      console.log('\n✅ Миграция завершена успешно!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Миграция завершилась с ошибкой');
      process.exit(1);
    });
}