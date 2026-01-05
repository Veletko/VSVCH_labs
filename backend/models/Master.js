const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Master = sequelize.define('Master', {
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
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      name: 'master_email_unique',
      msg: 'Пользователь с таким email уже существует'
    },
    validate: {
      isEmail: {
        msg: 'Неверный формат email'
      },
      notEmpty: {
        msg: 'Email не может быть пустым'
      }
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Пароль не может быть пустым'
      },
      len: {
        args: [6, 255],
        msg: 'Пароль должен содержать минимум 6 символов'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('master', 'admin'),
    defaultValue: 'master',
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  reset_password_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'master',
  timestamps: false, // ← ИЗМЕНЕНИЕ: ставим false, так как этих полей нет в БД
  underscored: true,
  hooks: {
    beforeCreate: async (master) => {
      if (master.password_hash) {
        const salt = await bcrypt.genSalt(10);
        master.password_hash = await bcrypt.hash(master.password_hash, salt);
      }
    },
    beforeUpdate: async (master) => {
      if (master.changed('password_hash')) {
        const salt = await bcrypt.genSalt(10);
        master.password_hash = await bcrypt.hash(master.password_hash, salt);
      }
    }
  }
});

// Метод для проверки пароля
Master.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

// Метод для генерации JWT токена
Master.prototype.generateJWT = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      role: this.role,
      firstName: this.first_name,
      lastName: this.last_name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = Master;