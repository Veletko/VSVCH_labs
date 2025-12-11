const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Worker = sequelize.define('Worker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Фамилия не может быть пустой'
      },
      len: {
        args: [1, 50],
        msg: 'Фамилия должна содержать от 1 до 50 символов'
      }
    }
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Имя не может быть пустым'
      },
      len: {
        args: [1, 50],
        msg: 'Имя должно содержать от 1 до 50 символов'
      }
    }
  },
  middle_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'Отчество не может превышать 50 символов'
      }
    }
  },
  master_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'master',
      key: 'id'
    }
  }
}, {
  tableName: 'worker',
  timestamps: false
});

module.exports = Worker;
