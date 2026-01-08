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
  }
}, {
  timestamps: true,
  versionKey: '__v'
});

const Machine = mongoose.model('Machine', machineSchema, 'machines');

module.exports = Machine;