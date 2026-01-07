// migrations/002-fix-ids.js
const mongoose = require('mongoose');

class FixIdsMigration {
  async connect() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Fuctory';
    await mongoose.connect(mongoUri);
    return mongoose.connection;
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  async run() {
    console.log('🔧 ИСПРАВЛЕНИЕ ID В БАЗЕ ДАННЫХ');
    console.log('=================================\n');
    
    try {
      await this.connect();
      console.log('✅ Подключение к MongoDB установлено');
      
      const db = mongoose.connection.db;
      let totalFixed = 0;

      // 1. ИСПРАВЛЯЕМ WORKERS - master_id должен быть ObjectId
      console.log('\n1. Проверяю и исправляю workers...');
      const workersCollection = db.collection('workers');
      const workers = await workersCollection.find({}).toArray();
      
      for (const worker of workers) {
        let needsUpdate = false;
        const update = {};
        
        // Проверяем master_id
        if (worker.master_id) {
          if (typeof worker.master_id === 'string') {
            if (mongoose.Types.ObjectId.isValid(worker.master_id)) {
              update.master_id = new mongoose.Types.ObjectId(worker.master_id);
              needsUpdate = true;
            } else {
              console.warn(`  ⚠️  Worker ${worker._id}: невалидный master_id "${worker.master_id}", удаляю`);
              update.$unset = { master_id: '' };
              needsUpdate = true;
            }
          } else if (typeof worker.master_id === 'number') {
            console.warn(`  ⚠️  Worker ${worker._id}: master_id это число, удаляю`);
            update.$unset = { master_id: '' };
            needsUpdate = true;
          }
        }
        
        if (needsUpdate) {
          await workersCollection.updateOne(
            { _id: worker._id },
            update
          );
          totalFixed++;
          console.log(`  ✅ Исправлен worker ${worker._id}`);
        }
      }
      console.log(`✅ Обработано workers: ${workers.length}, исправлено: ${totalFixed}`);

      // 2. ИСПРАВЛЯЕМ MAINTENANCE_HISTORIES - machine_id и master_id должны быть ObjectId
      console.log('\n2. Проверяю и исправляю maintenance_histories...');
      const maintenanceCollection = db.collection('maintenance_histories');
      const maintenanceItems = await maintenanceCollection.find({}).toArray();
      let maintenanceFixed = 0;
      
      for (const item of maintenanceItems) {
        let needsUpdate = false;
        const update = {};
        
        // Проверяем machine_id
        if (item.machine_id) {
          if (typeof item.machine_id === 'string') {
            if (mongoose.Types.ObjectId.isValid(item.machine_id)) {
              update.machine_id = new mongoose.Types.ObjectId(item.machine_id);
              needsUpdate = true;
            } else {
              console.error(`  ❌ Maintenance ${item._id}: невалидный machine_id "${item.machine_id}"`);
            }
          } else if (typeof item.machine_id === 'number') {
            console.warn(`  ⚠️  Maintenance ${item._id}: machine_id это число "${item.machine_id}"`);
            // Пытаемся найти машину по числовому ID (если была старая система)
            const machine = await db.collection('machines').findOne({ _id: new mongoose.Types.ObjectId(item.machine_id.toString()) });
            if (!machine) {
              console.error(`  ❌ Maintenance ${item._id}: машина с ID ${item.machine_id} не найдена`);
            }
          }
        }
        
        // Проверяем master_id
        if (item.master_id) {
          if (typeof item.master_id === 'string') {
            if (mongoose.Types.ObjectId.isValid(item.master_id)) {
              update.master_id = new mongoose.Types.ObjectId(item.master_id);
              needsUpdate = true;
            } else {
              console.error(`  ❌ Maintenance ${item._id}: невалидный master_id "${item.master_id}"`);
            }
          } else if (typeof item.master_id === 'number') {
            console.warn(`  ⚠️  Maintenance ${item._id}: master_id это число "${item.master_id}"`);
            // Пытаемся найти мастера по числовому ID
            const master = await db.collection('masters').findOne({ _id: new mongoose.Types.ObjectId(item.master_id.toString()) });
            if (!master) {
              console.error(`  ❌ Maintenance ${item._id}: мастер с ID ${item.master_id} не найден`);
            }
          }
        }
        
        if (needsUpdate) {
          await maintenanceCollection.updateOne(
            { _id: item._id },
            { $set: update }
          );
          maintenanceFixed++;
          console.log(`  ✅ Исправлен maintenance ${item._id}`);
        }
      }
      console.log(`✅ Обработано maintenance_histories: ${maintenanceItems.length}, исправлено: ${maintenanceFixed}`);
      totalFixed += maintenanceFixed;

      // 3. ПРОВЕРЯЕМ MACHINES - убеждаемся что maintenance_history это массив ObjectId
      console.log('\n3. Проверяю machines...');
      const machinesCollection = db.collection('machines');
      const machines = await machinesCollection.find({}).toArray();
      let machinesFixed = 0;
      
      for (const machine of machines) {
        if (machine.maintenance_history && Array.isArray(machine.maintenance_history)) {
          let needsUpdate = false;
          const fixedHistory = machine.maintenance_history.map(id => {
            if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
              needsUpdate = true;
              return new mongoose.Types.ObjectId(id);
            } else if (typeof id === 'number') {
              needsUpdate = true;
              return new mongoose.Types.ObjectId(id.toString());
            }
            return id;
          }).filter(id => id instanceof mongoose.Types.ObjectId);
          
          if (needsUpdate) {
            await machinesCollection.updateOne(
              { _id: machine._id },
              { $set: { maintenance_history: fixedHistory } }
            );
            machinesFixed++;
            console.log(`  ✅ Исправлен machine ${machine._id}`);
          }
        }
      }
      console.log(`✅ Обработано machines: ${machines.length}, исправлено: ${machinesFixed}`);
      totalFixed += machinesFixed;

      // 4. ПРОВЕРЯЕМ MASTERS - убеждаемся что workers и maintenance_history это массивы ObjectId
      console.log('\n4. Проверяю masters...');
      const mastersCollection = db.collection('masters');
      const masters = await mastersCollection.find({}).toArray();
      let mastersFixed = 0;
      
      for (const master of masters) {
        let needsUpdate = false;
        const update = {};
        
        // Проверяем workers
        if (master.workers && Array.isArray(master.workers)) {
          const fixedWorkers = master.workers.map(id => {
            if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
              needsUpdate = true;
              return new mongoose.Types.ObjectId(id);
            } else if (typeof id === 'number') {
              needsUpdate = true;
              return new mongoose.Types.ObjectId(id.toString());
            }
            return id;
          }).filter(id => id instanceof mongoose.Types.ObjectId);
          
          if (needsUpdate) {
            update.workers = fixedWorkers;
          }
        }
        
        // Проверяем maintenance_history
        if (master.maintenance_history && Array.isArray(master.maintenance_history)) {
          const fixedHistory = master.maintenance_history.map(id => {
            if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
              needsUpdate = true;
              return new mongoose.Types.ObjectId(id);
            } else if (typeof id === 'number') {
              needsUpdate = true;
              return new mongoose.Types.ObjectId(id.toString());
            }
            return id;
          }).filter(id => id instanceof mongoose.Types.ObjectId);
          
          if (needsUpdate) {
            update.maintenance_history = fixedHistory;
          }
        }
        
        if (needsUpdate) {
          await mastersCollection.updateOne(
            { _id: master._id },
            { $set: update }
          );
          mastersFixed++;
          console.log(`  ✅ Исправлен master ${master._id}`);
        }
      }
      console.log(`✅ Обработано masters: ${masters.length}, исправлено: ${mastersFixed}`);
      totalFixed += mastersFixed;

      console.log('\n🎉 МИГРАЦИЯ ЗАВЕРШЕНА!');
      console.log(`📊 Всего исправлено документов: ${totalFixed}`);
      
    } catch (error) {
      console.error('\n❌ Ошибка миграции:', error.message);
      console.error(error.stack);
      throw error;
    } finally {
      await this.disconnect();
      console.log('\n🔌 Соединение с MongoDB закрыто');
    }
  }
}

// Экспортируем класс
module.exports = FixIdsMigration;

// Если файл запускается напрямую
if (require.main === module) {
  require('dotenv').config();
  const migration = new FixIdsMigration();
  
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
