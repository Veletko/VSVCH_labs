'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Сначала создаем ENUM тип для ролей
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_master_role" AS ENUM ('master', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Добавляем колонку email
    await queryInterface.addColumn('master', 'email', {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: 'temp@example.com'
    });

    // Добавляем остальные колонки
    await queryInterface.addColumn('master', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: 'temp_password'
    });

    await queryInterface.addColumn('master', 'role', {
      type: Sequelize.ENUM('master', 'admin'),
      defaultValue: 'master',
      allowNull: false
    });

    await queryInterface.addColumn('master', 'is_active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });

    await queryInterface.addColumn('master', 'reset_password_token', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('master', 'reset_password_expires', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Обновляем существующие записи
    await queryInterface.sequelize.query(`
      UPDATE master 
      SET 
        email = CONCAT('master_', id, '@factory.com'),
        password_hash = '$2a$10$YourTemporaryPasswordHashForExistingUsers'
      WHERE email = 'temp@example.com';
    `);

    // Создаем уникальный индекс для email
    await queryInterface.addIndex('master', ['email'], {
      unique: true,
      name: 'master_email_unique'
    });

    // Убираем временные default значения
    await queryInterface.changeColumn('master', 'email', {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: null
    });

    await queryInterface.changeColumn('master', 'password_hash', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: null
    });
  },

  async down(queryInterface, Sequelize) {
    // Удаляем индекс
    await queryInterface.removeIndex('master', 'master_email_unique');
    
    // Удаляем колонки
    await queryInterface.removeColumn('master', 'email');
    await queryInterface.removeColumn('master', 'password_hash');
    await queryInterface.removeColumn('master', 'role');
    await queryInterface.removeColumn('master', 'is_active');
    await queryInterface.removeColumn('master', 'reset_password_token');
    await queryInterface.removeColumn('master', 'reset_password_expires');
    
    // Удаляем ENUM тип
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_master_role";');
  }
};