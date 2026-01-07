// models/Master.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const masterSchema = new mongoose.Schema({
  last_name: {
    type: String,
    required: [true, 'Фамилия не может быть пустой'],
    trim: true,
    maxlength: [50, 'Фамилия не может превышать 50 символов']
  },
  first_name: {
    type: String,
    required: [true, 'Имя не может быть пустым'],
    trim: true,
    maxlength: [50, 'Имя не может превышать 50 символов']
  },
  middle_name: {
    type: String,
    trim: true,
    maxlength: [50, 'Отчество не может превышать 50 символов'],
    default: ''
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Неверный формат email']
  },
  password_hash: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [6, 'Пароль должен содержать минимум 6 символов']
  },
  role: {
    type: String,
    enum: ['master', 'admin'],
    default: 'master'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  reset_password_token: String,
  reset_password_expires: Date,
  workers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  }],
  maintenance_history: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceHistory'
  }]
}, {
  timestamps: false,
  versionKey: '__v'
});

// Хук для хеширования пароля перед сохранением
masterSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Хук для хеширования пароля перед обновлением
masterSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.password_hash) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password_hash = await bcrypt.hash(update.password_hash, salt);
      this.setUpdate(update);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Метод для проверки пароля
masterSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// Метод для генерации JWT токена
masterSchema.methods.generateJWT = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      firstName: this.first_name,
      lastName: this.last_name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Виртуальное поле для полного имени
masterSchema.virtual('full_name').get(function() {
  return `${this.last_name} ${this.first_name} ${this.middle_name || ''}`.trim();
});

// Опции для преобразования JSON
masterSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password_hash;
    delete ret.reset_password_token;
    delete ret.reset_password_expires;
    return ret;
  }
});

const Master = mongoose.model('Master', masterSchema, 'masters');

module.exports = Master;