'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workshop', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
        defaultValue: 'Новая схема цеха'
      },
      layout_data: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: { elements: [] }
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Создаем индексы для быстрого поиска
    await queryInterface.addIndex('workshop', ['name'], {
      name: 'workshop_name_idx'
    });
    
    await queryInterface.addIndex('workshop', ['created_at'], {
      name: 'workshop_created_at_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    // Удаляем индексы
    await queryInterface.removeIndex('workshop', 'workshop_name_idx');
    await queryInterface.removeIndex('workshop', 'workshop_created_at_idx');
    
    // Удаляем таблицу
    await queryInterface.dropTable('workshop');
  }
};
