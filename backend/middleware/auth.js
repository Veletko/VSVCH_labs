const jwt = require('jsonwebtoken');
const Master = require('../models/Master');

const authMiddleware = async (req, res, next) => {
  try {
    // Получаем токен из заголовка
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Требуется аутентификация');
    }

    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Находим пользователя
    const master = await Master.findByPk(decoded.id);
    
    if (!master || !master.is_active) {
      throw new Error('Пользователь не найден или неактивен');
    }

    // Добавляем пользователя в запрос
    req.master = master;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Ошибка аутентификации: ' + error.message
    });
  }
};

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.master) {
      return res.status(401).json({
        success: false,
        error: 'Требуется аутентификация'
      });
    }

    if (!roles.includes(req.master.role)) {
      return res.status(403).json({
        success: false,
        error: 'Недостаточно прав для выполнения операции'
      });
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };