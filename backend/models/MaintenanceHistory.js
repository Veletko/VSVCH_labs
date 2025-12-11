const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MaintenanceHistory = sequelize.define('MaintenanceHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  machine_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'machine',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'ID машины обязателен'
      }
    }
  },
  master_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'master',
      key: 'id'
    },
    validate: {
      notNull: {
        msg: 'ID мастера обязателен'
      }
    }
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Состояние не может быть пустым'
      },
      isIn: {
        args: [['completed', 'in_progress', 'planned', 'cancelled']],
        msg: 'Недопустимое состояние'
      }
    }
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Дата начала обязательна'
      },
      isDate: {
        msg: 'Дата начала должна быть валидной датой'
      }
    }
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Дата окончания должна быть валидной датой'
      },
      isAfterStartDate(value) {
        if (value && this.start_date && new Date(value) <= new Date(this.start_date)) {
          throw new Error('Дата окончания должна быть после даты начала');
        }
      }
    }
  }
}, {
  tableName: 'maintenance_history',
  timestamps: false
});

module.exports = MaintenanceHistory;