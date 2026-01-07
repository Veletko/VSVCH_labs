// models/MaintenanceHistory.js
const mongoose = require('mongoose');

const maintenanceHistorySchema = new mongoose.Schema({
  machine_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
    required: [true, 'ID машины обязателен']
  },
  master_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Master',
    required: [true, 'ID мастера обязателен']
  },
  state: {
    type: String,
    required: [true, 'Состояние обязательно'],
    enum: {
      values: ['completed', 'in_progress', 'planned', 'cancelled'],
      message: 'Недопустимое состояние. Допустимые значения: completed, in_progress, planned, cancelled'
    },
    trim: true
  },
  start_date: {
    type: Date,
    required: [true, 'Дата начала обязательна'],
    validate: {
      validator: function(value) {
        return value instanceof Date && !isNaN(value);
      },
      message: 'Дата начала должна быть валидной датой'
    }
  },
  end_date: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true; // allow null
        if (!(value instanceof Date) || isNaN(value)) return false;
        if (this.start_date && value <= this.start_date) return false;
        return true;
      },
      message: 'Дата окончания должна быть после даты начала'
    }
  }
}, {
  timestamps: false,
  versionKey: '__v'
});

// Индексы для улучшения производительности запросов
maintenanceHistorySchema.index({ machine_id: 1 });
maintenanceHistorySchema.index({ master_id: 1 });
maintenanceHistorySchema.index({ start_date: -1 });

const MaintenanceHistory = mongoose.model('MaintenanceHistory', maintenanceHistorySchema, 'maintenance_histories');

module.exports = MaintenanceHistory;