const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Machine = sequelize.define('Machine', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // РАСКОММЕНТИРУЙТЕ ПОСЛЕ ВЫПОЛНЕНИЯ МИГРАЦИИ 20260108032710-add-machine-fields.js
  // Серийный номер станка
  // serial_number: {
  //   type: DataTypes.STRING(100),
  //   allowNull: true,
  //   validate: {
  //     len: {
  //       args: [0, 100],
  //       msg: 'Серийный номер не может превышать 100 символов'
  //     }
  //   }
  // },
  // Название станка
  // name: {
  //   type: DataTypes.STRING(200),
  //   allowNull: true,
  //   validate: {
  //     len: {
  //       args: [0, 200],
  //       msg: 'Название не может превышать 200 символов'
  //     }
  //   }
  // }
}, {
  tableName: 'machine',
  timestamps: false
});

module.exports = Machine;