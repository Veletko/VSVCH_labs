// models/Workshop.js
const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название цеха обязательно'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  // Элементы схемы цеха
  elements: [{
    elementType: {
      type: String,
      enum: ['wall', 'door', 'machine'],
      required: true
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      angle: { type: Number, default: 0 }
    },
    // Для станков - ссылка на машину
    machine_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine',
      default: null
    },
    // Стили и визуальные свойства
    fill: { type: String, default: '#424242' },
    stroke: { type: String, default: '#212121' },
    strokeWidth: { type: Number, default: 2 }
  }],
  // Размеры canvas
  canvasWidth: {
    type: Number,
    default: 1200
  },
  canvasHeight: {
    type: Number,
    default: 800
  }
}, {
  timestamps: true,
  versionKey: '__v'
});

// Индексы
workshopSchema.index({ name: 1 });
workshopSchema.index({ 'elements.machine_id': 1 });

const Workshop = mongoose.model('Workshop', workshopSchema, 'workshops');

module.exports = Workshop;
