const jwt = require('jsonwebtoken');
const Master = require('../models/Master');

const authMiddleware = async (req, res, next) => {
  try {
    // Получаем токен из заголовка
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Требуется аутентификация. Токен отсутствует.'
      });
    }

    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Находим пользователя по ID из токена
    const master = await Master.findById(decoded.id);
    
    if (!master) {
      return res.status(401).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    if (!master.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Учетная запись неактивна'
      });
    }

    // Добавляем пользователя в запрос
    req.master = master;
    req.token = token;
    next();
  } catch (error) {
    // Обрабатываем разные типы ошибок JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Неверный токен'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Срок действия токена истек'
      });
    }

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
        error: `Недостаточно прав. Требуемая роль: ${roles.join(' или ')}`
      });
    }

    next();
  };
};

// Дополнительный middleware для проверки владельца
const ownerMiddleware = async (req, res, next) => {
  try {
    if (!req.master) {
      return res.status(401).json({
        success: false,
        error: 'Требуется аутентификация'
      });
    }

    // Для администратора пропускаем проверку владельца
    if (req.master.role === 'admin') {
      return next();
    }

    // Проверяем, является ли мастер владельцем ресурса
    const resourceId = req.params.id || req.params.masterId;
    
    if (resourceId && req.master._id.toString() !== resourceId) {
      return res.status(403).json({
        success: false,
        error: 'Доступ разрешен только к собственным данным'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ошибка проверки прав доступа: ' + error.message
    });
  }
};

module.exports = { 
  authMiddleware, 
  roleMiddleware, 
  ownerMiddleware 
};