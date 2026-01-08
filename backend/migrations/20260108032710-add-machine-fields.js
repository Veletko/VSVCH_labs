'use strict';

/** @type {import('sequelize-cli').Migration} */
// Миграция для добавления полей: серийный номер (serial_number) и название (name) для машин
// 
// ИСПОЛЬЗОВАНИЕ:
// 1. Раскомментируйте весь код в этом файле
// 2. Запустите миграцию: npx sequelize-cli db:migrate
// Или через node: node migrations/migrate-manual.js (если есть)
//
// РАСКОММЕНТИРУЙТЕ ПОСЛЕ ПРОВЕРКИ ВСЕХ ИЗМЕНЕНИЙ:

/*
module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем колонку serial_number (серийный номер)
    await queryInterface.addColumn('machine', 'serial_number', {
      type: Sequelize.STRING(100),
      allowNull: true, // Разрешаем NULL для существующих записей
      unique: false
    });

    // Добавляем колонку name (название станка)
    await queryInterface.addColumn('machine', 'name', {
      type: Sequelize.STRING(200),
      allowNull: true, // Разрешаем NULL для существующих записей
      defaultValue: null
    });

    // Обновляем существующие записи, добавляя значения по умолчанию
    await queryInterface.sequelize.query(`
      UPDATE machine 
      SET 
        serial_number = COALESCE(serial_number, 'SN-' || LPAD(id::text, 8, '0'))
      WHERE serial_number IS NULL;
    `);

    await queryInterface.sequelize.query(`
      UPDATE machine 
      SET 
        name = COALESCE(name, 'Машина #' || id::text)
      WHERE name IS NULL;
    `);

    // Теперь можем сделать поля обязательными (раскомментируйте, если нужно)
    // await queryInterface.changeColumn('machine', 'serial_number', {
    //   type: Sequelize.STRING(100),
    //   allowNull: false
    // });
    // 
    // await queryInterface.changeColumn('machine', 'name', {
    //   type: Sequelize.STRING(200),
    //   allowNull: false
    // });

    // Создаем индексы для быстрого поиска
    await queryInterface.addIndex('machine', ['serial_number'], {
      name: 'machine_serial_number_idx'
    });

    await queryInterface.addIndex('machine', ['name'], {
      name: 'machine_name_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    // Удаляем индексы
    await queryInterface.removeIndex('machine', 'machine_serial_number_idx');
    await queryInterface.removeIndex('machine', 'machine_name_idx');
    
    // Удаляем колонки
    await queryInterface.removeColumn('machine', 'serial_number');
    await queryInterface.removeColumn('machine', 'name');
  }
};
*/
