// models/Worker.js
const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
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
  master_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Master',
    required: false
  }
}, {
  timestamps: false,
  versionKey: '__v'
});

// Виртуальное поле для полного имени
workerSchema.virtual('full_name').get(function() {
  return `${this.last_name} ${this.first_name} ${this.middle_name || ''}`.trim();
});

// Опции для преобразования JSON
workerSchema.set('toJSON', {
  virtuals: true
});

const Worker = mongoose.model('Worker', workerSchema, 'workers');

module.exports = Worker;