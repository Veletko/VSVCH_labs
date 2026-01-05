const Master = require('../models/Master');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');

class AuthController {
  // Регистрация нового мастера
  register = async (req, res) => {
    try {
      const { last_name, first_name, middle_name, email, password } = req.body;

      // Проверяем, существует ли пользователь с таким email
      const existingMaster = await Master.findOne({ where: { email } });
      if (existingMaster) {
        return res.status(400).json({
          success: false,
          error: 'Пользователь с таким email уже существует'
        });
      }

      // Создаем нового мастера
      const master = await Master.create({
        last_name,
        first_name,
        middle_name,
        email,
        password_hash: password // Хук автоматически захеширует
      });

      // Генерируем токен
      const token = master.generateJWT();

      res.status(201).json({
        success: true,
        data: {
          master: {
            id: master.id,
            last_name: master.last_name,
            first_name: master.first_name,
            middle_name: master.middle_name,
            email: master.email,
            role: master.role,
            is_active: master.is_active
          },
          token
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Вход в систему
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Находим пользователя по email
      const master = await Master.findOne({ where: { email } });
      
      if (!master) {
        return res.status(401).json({
          success: false,
          error: 'Неверный email или пароль'
        });
      }

      // Проверяем активность пользователя
      if (!master.is_active) {
        return res.status(403).json({
          success: false,
          error: 'Учетная запись неактивна'
        });
      }

      // Проверяем пароль
      const isPasswordValid = await master.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Неверный email или пароль'
        });
      }

      // Генерируем токен
      const token = master.generateJWT();

      res.json({
        success: true,
        data: {
          master: {
            id: master.id,
            last_name: master.last_name,
            first_name: master.first_name,
            middle_name: master.middle_name,
            email: master.email,
            role: master.role,
            is_active: master.is_active
          },
          token
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получение текущего пользователя
  getMe = async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          master: {
            id: req.master.id,
            last_name: req.master.last_name,
            first_name: req.master.first_name,
            middle_name: req.master.middle_name,
            email: req.master.email,
            role: req.master.role,
            is_active: req.master.is_active,
            created_at: req.master.created_at
          }
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Смена пароля
  changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Проверяем текущий пароль
      const isPasswordValid = await req.master.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Неверный текущий пароль'
        });
      }

      // Обновляем пароль
      req.master.password_hash = newPassword;
      await req.master.save();

      // Генерируем новый токен
      const token = req.master.generateJWT();

      res.json({
        success: true,
        data: {
          message: 'Пароль успешно изменен',
          token
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Запрос на восстановление пароля
  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      const master = await Master.findOne({ where: { email } });
      
      if (!master) {
        // Возвращаем успех даже если email не найден (в целях безопасности)
        return res.json({
          success: true,
          data: {
            message: 'Если пользователь с таким email существует, инструкции отправлены'
          }
        });
      }

      // Генерируем токен для сброса пароля
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Сохраняем токен и срок его действия (1 час)
      master.reset_password_token = resetTokenHash;
      master.reset_password_expires = Date.now() + 3600000; // 1 час
      await master.save();

      // TODO: Отправка email с токеном
      // В реальном приложении здесь должен быть код отправки email
      const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

      console.log('Ссылка для сброса пароля:', resetUrl);

      res.json({
        success: true,
        data: {
          message: 'Если пользователь с таким email существует, инструкции отправлены',
          // В реальном приложении не отправляем ссылку в ответе
          resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Сброс пароля по токену
  resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      // Хешируем токен для сравнения
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Ищем пользователя с действующим токеном
      const master = await Master.findOne({
        where: {
          reset_password_token: resetTokenHash,
          reset_password_expires: {
            [Op.gt]: Date.now()
          }
        }
      });

      if (!master) {
        return res.status(400).json({
          success: false,
          error: 'Неверный или просроченный токен сброса пароля'
        });
      }

      // Обновляем пароль
      master.password_hash = password;
      master.reset_password_token = null;
      master.reset_password_expires = null;
      await master.save();

      // Генерируем новый токен
      const authToken = master.generateJWT();

      res.json({
        success: true,
        data: {
          message: 'Пароль успешно сброшен',
          token: authToken
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };
}

module.exports = new AuthController();