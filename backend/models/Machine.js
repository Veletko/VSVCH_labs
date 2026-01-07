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
  }]
}, {
  timestamps: true,
  versionKey: '__v'
});

const Machine = mongoose.model('Machine', machineSchema, 'machines');

module.exports = Machine;