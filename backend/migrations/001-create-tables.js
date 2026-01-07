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
      console.log('\n1. Проверяю коллекцию masters...');
      const collections = await db.listCollections({ name: 'masters' }).toArray();
      if (collections.length === 0) {
        await db.createCollection('masters');
        console.log('  ✅ Коллекция masters создана');
      } else {
        console.log('  ℹ️  Коллекция masters уже существует');
      }
      const mastersCollection = db.collection('masters');
      
      // Индексы для masters
      try {
        await mastersCollection.createIndex({ email: 1 }, { unique: true });
        await mastersCollection.createIndex({ role: 1 });
        await mastersCollection.createIndex({ is_active: 1 });
        console.log('  ✅ Индексы для masters созданы/проверены');
      } catch (error) {
        console.log('  ℹ️  Индексы для masters уже существуют');
      }
      
      // 2. СОЗДАЕМ КОЛЛЕКЦИЮ WORKERS (рабочие)
      console.log('\n2. Проверяю коллекцию workers...');
      const workersCollections = await db.listCollections({ name: 'workers' }).toArray();
      if (workersCollections.length === 0) {
        await db.createCollection('workers');
        console.log('  ✅ Коллекция workers создана');
      } else {
        console.log('  ℹ️  Коллекция workers уже существует');
      }
      const workersCollection = db.collection('workers');
      
      // Индексы для workers
      try {
        await workersCollection.createIndex({ master_id: 1 });
        await workersCollection.createIndex({ last_name: 1, first_name: 1 });
        console.log('  ✅ Индексы для workers созданы/проверены');
      } catch (error) {
        console.log('  ℹ️  Индексы для workers уже существуют');
      }
      
      // 3. СОЗДАЕМ КОЛЛЕКЦИЮ MACHINES (машины)
      console.log('\n3. Проверяю коллекцию machines...');
      const machinesCollections = await db.listCollections({ name: 'machines' }).toArray();
      if (machinesCollections.length === 0) {
        await db.createCollection('machines');
        console.log('  ✅ Коллекция machines создана');
      } else {
        console.log('  ℹ️  Коллекция machines уже существует');
      }
      const machinesCollection = db.collection('machines');
      
      // Индексы для machines
      try {
        await machinesCollection.createIndex({ status: 1 });
        console.log('  ✅ Индексы для machines созданы/проверены');
      } catch (error) {
        console.log('  ℹ️  Индексы для machines уже существуют');
      }
      
      // 4. СОЗДАЕМ КОЛЛЕКЦИЮ MAINTENANCE_HISTORIES (история обслуживания)
      console.log('\n4. Проверяю коллекцию maintenance_histories...');
      const maintenanceCollections = await db.listCollections({ name: 'maintenance_histories' }).toArray();
      if (maintenanceCollections.length === 0) {
        await db.createCollection('maintenance_histories');
        console.log('  ✅ Коллекция maintenance_histories создана');
      } else {
        console.log('  ℹ️  Коллекция maintenance_histories уже существует');
      }
      const maintenanceCollection = db.collection('maintenance_histories');
      
      // Индексы для maintenance_histories
      try {
        await maintenanceCollection.createIndex({ machine_id: 1 });
        await maintenanceCollection.createIndex({ master_id: 1 });
        await maintenanceCollection.createIndex({ state: 1 });
        await maintenanceCollection.createIndex({ start_date: -1 });
        await maintenanceCollection.createIndex({ machine_id: 1, start_date: -1 });
        console.log('  ✅ Индексы для maintenance_histories созданы/проверены');
      } catch (error) {
        console.log('  ℹ️  Индексы для maintenance_histories уже существуют');
      }
      
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