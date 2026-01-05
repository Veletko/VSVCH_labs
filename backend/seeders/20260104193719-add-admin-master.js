'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const masterPasswordHash = await bcrypt.hash('master123', salt);
    
    // Проверяем, есть ли уже тестовые пользователи
    const [existingUsers] = await queryInterface.sequelize.query(
      "SELECT email FROM master WHERE email IN ('admin@factory.com', 'petr.ivanov@factory.com', 'maria.sidorova@factory.com')"
    );
    
    const existingEmails = existingUsers.map(user => user.email);
    const usersToInsert = [];
    
    // Добавляем только если их нет
    if (!existingEmails.includes('admin@factory.com')) {
      usersToInsert.push({
        last_name: 'Администратор',
        first_name: 'Системный',
        middle_name: null,
        email: 'admin@factory.com',
        password_hash: adminPasswordHash,
        role: 'admin',
        is_active: true,
        reset_password_token: null,
        reset_password_expires: null
      });
    }
    
    if (!existingEmails.includes('petr.ivanov@factory.com')) {
      usersToInsert.push({
        last_name: 'Иванов',
        first_name: 'Петр',
        middle_name: 'Сергеевич',
        email: 'petr.ivanov@factory.com',
        password_hash: masterPasswordHash,
        role: 'master',
        is_active: true,
        reset_password_token: null,
        reset_password_expires: null
      });
    }
    
    if (!existingEmails.includes('maria.sidorova@factory.com')) {
      usersToInsert.push({
        last_name: 'Сидорова',
        first_name: 'Мария',
        middle_name: 'Ивановна',
        email: 'maria.sidorova@factory.com',
        password_hash: masterPasswordHash,
        role: 'master',
        is_active: true,
        reset_password_token: null,
        reset_password_expires: null
      });
    }
    
    if (usersToInsert.length > 0) {
      await queryInterface.bulkInsert('master', usersToInsert, {});
      console.log(`✅ Created ${usersToInsert.length} test users`);
    } else {
      console.log('✅ Test users already exist');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('master', {
      email: {
        [Sequelize.Op.in]: [
          'admin@factory.com',
          'petr.ivanov@factory.com',
          'maria.sidorova@factory.com'
        ]
      }
    }, {});
  }
};