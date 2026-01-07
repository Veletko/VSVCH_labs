const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

class InitialMigration {
  constructor() {
    this.models = {};
  }

  async connect() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Fuctory';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('📡 Подключение к MongoDB для миграции...');
    return mongoose.connection;
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log('🔌 Отключение от MongoDB');
  }

  async run() {
    try {
      console.log('🚀 Начало миграции базы данных Fuctory...');
      
      await this.connect();
      
      // Определяем модели для миграции
      await this.defineModels();
      
      // Создаем коллекции с валидацией
      await this.createCollections();
      
      // Создаем индексы
      await this.createIndexes();
      
      // Добавляем начальные данные
      await this.seedInitialData();
      
      console.log('✅ Миграция успешно завершена!');
      
    } catch (error) {
      console.error('❌ Ошибка миграции:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  async defineModels() {
    console.log('📋 Определение моделей...');
    
    // Master Schema
    const masterSchema = new mongoose.Schema({
      last_name: String,
      first_name: String,
      middle_name: String,
      email: String,
      password_hash: String,
      role: String,
      is_active: Boolean,
      reset_password_token: String,
      reset_password_expires: Date
    }, { timestamps: false });
    
    // Worker Schema
    const workerSchema = new mongoose.Schema({
      last_name: String,
      first_name: String,
      middle_name: String,
      master_id: mongoose.Schema.Types.ObjectId
    }, { timestamps: false });
    
    // Machine Schema
    const machineSchema = new mongoose.Schema({
      name: String,
      type: String,
      model: String,
      serial_number: String,
      installation_date: Date,
      status: String,
      last_maintenance: Date,
      next_maintenance: Date
    }, { timestamps: true });
    
    // Maintenance History Schema
    const maintenanceHistorySchema = new mongoose.Schema({
      machine_id: mongoose.Schema.Types.ObjectId,
      master_id: mongoose.Schema.Types.ObjectId,
      state: String,
      start_date: Date,
      end_date: Date,
      description: String,
      parts_used: Array,
      total_cost: Number,
      notes: String
    }, { timestamps: true });
    
    // Создаем модели
    this.models.Master = mongoose.model('Master', masterSchema, 'masters');
    this.models.Worker = mongoose.model('Worker', workerSchema, 'workers');
    this.models.Machine = mongoose.model('Machine', machineSchema, 'machines');
    this.models.MaintenanceHistory = mongoose.model('MaintenanceHistory', maintenanceHistorySchema, 'maintenance_histories');
    
    console.log('✅ Модели определены');
  }

  async createCollections() {
    console.log('🗄️  Создание коллекций...');
    
    // MongoDB автоматически создает коллекции при первой вставке
    // Но мы можем создать их явно для установки валидации
    
    const db = mongoose.connection.db;
    
    // Создаем или получаем коллекции
    await db.createCollection('masters');
    await db.createCollection('workers');
    await db.createCollection('machines');
    await db.createCollection('maintenance_histories');
    
    console.log('✅ Коллекции созданы');
  }

  async createIndexes() {
    console.log('🔍 Создание индексов...');
    
    // Индексы для masters
    await this.models.Master.createIndexes([
      { email: 1 }, // Уникальный индекс для email
      { role: 1 },
      { is_active: 1 }
    ]);
    
    // Индексы для workers
    await this.models.Worker.createIndexes([
      { master_id: 1 },
      { last_name: 1, first_name: 1 }
    ]);
    
    // Индексы для machines
    await this.models.Machine.createIndexes([
      { serial_number: 1, unique: true, sparse: true },
      { status: 1 },
      { next_maintenance: 1 }
    ]);
    
    // Индексы для maintenance_histories
    await this.models.MaintenanceHistory.createIndexes([
      { machine_id: 1 },
      { master_id: 1 },
      { state: 1 },
      { start_date: -1 },
      { machine_id: 1, start_date: -1 } // Составной индекс
    ]);
    
    console.log('✅ Индексы созданы');
  }

  async seedInitialData() {
    console.log('🌱 Добавление начальных данных...');
    
    // Проверяем, есть ли уже данные
    const adminCount = await this.models.Master.countDocuments();
    
    if (adminCount === 0) {
      // Создаем администратора
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = new this.models.Master({
        last_name: 'Admin',
        first_name: 'System',
        email: 'admin@factory.com',
        password_hash: hashedPassword,
        role: 'admin',
        is_active: true
      });
      
      await admin.save();
      console.log('👑 Администратор создан: admin@factory.com / admin123');
      
      // Создаем тестового мастера
      const masterPassword = await bcrypt.hash('master123', 10);
      
      const master = new this.models.Master({
        last_name: 'Иванов',
        first_name: 'Иван',
        middle_name: 'Иванович',
        email: 'master@factory.com',
        password_hash: masterPassword,
        role: 'master',
        is_active: true
      });
      
      await master.save();
      console.log('👨‍🔧 Мастер создан: master@factory.com / master123');
      
      // Создаем тестовые машины
      const machines = [
        {
          name: 'Фрезерный станок',
          type: 'Фрезерный',
          model: 'FM-500',
          serial_number: 'SN001',
          installation_date: new Date('2023-01-15'),
          status: 'active'
        },
        {
          name: 'Токарный станок',
          type: 'Токарный',
          model: 'TL-300',
          serial_number: 'SN002',
          installation_date: new Date('2023-02-20'),
          status: 'active'
        },
        {
          name: 'Шлифовальный станок',
          type: 'Шлифовальный',
          model: 'GR-700',
          serial_number: 'SN003',
          installation_date: new Date('2023-03-10'),
          status: 'maintenance'
        }
      ];
      
      await this.models.Machine.insertMany(machines);
      console.log(`🖥️  Создано ${machines.length} тестовых машины`);
      
    } else {
      console.log('ℹ️  Начальные данные уже существуют');
    }
    
    console.log('✅ Начальные данные добавлены');
  }
}

module.exports = InitialMigration;