// migrations/003-add-machine-fields.js
// Миграция для добавления полей: серийный номер (serial_number) и название (name) для машин
// 
// ИСПОЛЬЗОВАНИЕ:
// 1. Раскомментируйте весь код в этом файле
// 2. Добавьте эту миграцию в migrate.js (раскомментируйте соответствующие строки)
// 3. Запустите: cd backend && node migrations/migrate.js

/*
const mongoose = require('mongoose');

class AddMachineFieldsMigration {
  async connect() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Fuctory';
    await mongoose.connect(mongoUri);
    return mongoose.connection;
  }

  async disconnect() {
    await mongoose.disconnect();
  }

  async run() {
    console.log('🔧 ДОБАВЛЕНИЕ ПОЛЕЙ К МАШИНАМ');
    console.log('=================================\n');
    
    try {
      await this.connect();
      console.log('✅ Подключение к MongoDB установлено');
      
      const db = mongoose.connection.db;
      const machinesCollection = db.collection('machines');
      
      // Проверяем, есть ли уже документы без этих полей
      const machinesWithoutFields = await machinesCollection.find({
        $or: [
          { serial_number: { $exists: false } },
          { name: { $exists: false } }
        ]
      }).toArray();
      
      console.log(`\n📊 Найдено машин без полей serial_number/name: ${machinesWithoutFields.length}`);
      
      if (machinesWithoutFields.length > 0) {
        // Обновляем все машины, добавляя поля со значениями по умолчанию
        let updatedCount = 0;
        
        for (const machine of machinesWithoutFields) {
          const updateData = {};
          
          // Если нет serial_number, добавляем пустую строку или генерируем из ID
          if (!machine.serial_number) {
            updateData.serial_number = `SN-${machine._id.toString().slice(-8).toUpperCase()}`;
          }
          
          // Если нет name, добавляем значение по умолчанию
          if (!machine.name) {
            updateData.name = `Машина #${machine._id.toString().slice(-6)}`;
          }
          
          if (Object.keys(updateData).length > 0) {
            await machinesCollection.updateOne(
              { _id: machine._id },
              { $set: updateData }
            );
            updatedCount++;
          }
        }
        
        console.log(`✅ Обновлено машин: ${updatedCount}`);
      } else {
        console.log('ℹ️  Все машины уже имеют необходимые поля');
      }
      
      // Создаем индексы для быстрого поиска
      try {
        await machinesCollection.createIndex({ serial_number: 1 });
        await machinesCollection.createIndex({ name: 1 });
        console.log('✅ Индексы для serial_number и name созданы');
      } catch (error) {
        if (error.code === 85) { // IndexOptionsConflict
          console.log('ℹ️  Индексы уже существуют');
        } else {
          throw error;
        }
      }
      
      console.log('\n🎉 МИГРАЦИЯ ЗАВЕРШЕНА УСПЕШНО!');
    } catch (error) {
      console.error('\n💥 Ошибка при выполнении миграции:', error);
      throw error;
    } finally {
      await this.disconnect();
      console.log('🔌 Соединение с MongoDB закрыто');
    }
  }
}

// Экспортируем класс миграции
module.exports = AddMachineFieldsMigration;

// Если файл запущен напрямую, выполняем миграцию
if (require.main === module) {
  const migration = new AddMachineFieldsMigration();
  migration.run()
    .then(() => {
      console.log('\n✅ Миграция выполнена успешно');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Ошибка выполнения миграции:', error);
      process.exit(1);
    });
}
*/
