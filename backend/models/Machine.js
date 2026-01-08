// models/Machine.js
const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  maintenance_history: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceHistory'
  }],
  // Координаты и размеры на схеме цеха
  workshop_position: {
    x: {
      type: Number,
      default: null
    },
    y: {
      type: Number,
      default: null
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    }
  },
  // РАСКОММЕНТИРУЙТЕ ПОСЛЕ ВЫПОЛНЕНИЯ МИГРАЦИИ 003-add-machine-fields.js
  // Серийный номер станка
  // serial_number: {
  //   type: String,
  //   trim: true,
  //   sparse: true, // Разрешаем множественные null значения
  //   index: true
  // },
  // Название станка
  // name: {
  //   type: String,
  //   trim: true,
  //   default: ''
  // }
}, {
  timestamps: true,
  versionKey: '__v'
});

const Machine = mongoose.model('Machine', machineSchema, 'machines');

module.exports = Machine;