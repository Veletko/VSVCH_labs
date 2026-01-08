const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Workshop = sequelize.define('Workshop', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    defaultValue: 'Новая схема цеха',
    validate: {
      notEmpty: {
        msg: 'Название схемы не может быть пустым'
      },
      len: {
        args: [1, 200],
        msg: 'Название схемы должно быть от 1 до 200 символов'
      }
    }
  },
  layout_data: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: { elements: [] },
    validate: {
      isValidLayout(value) {
        if (!value || typeof value !== 'object') {
          throw new Error('Данные схемы должны быть объектом');
        }
        if (!Array.isArray(value.elements)) {
          throw new Error('Элементы схемы должны быть массивом');
        }
      }
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'workshop',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true,
  hooks: {
    beforeUpdate: (workshop) => {
      workshop.updated_at = new Date();
    }
  }
});

module.exports = Workshop;
