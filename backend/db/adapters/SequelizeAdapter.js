const DatabaseAdapter = require('./DatabaseAdapter');

/**
 * Адаптер для Sequelize/PostgreSQL
 */
class SequelizeAdapter extends DatabaseAdapter {
  constructor(connection) {
    super();
    if (!connection) {
      throw new Error('Sequelize connection is required for SequelizeAdapter');
    }
    this.connection = connection;
  }

  async connect() {
    try {
      await this.connection.authenticate();
      console.log('✅ Sequelize connection established successfully.');
      return true;
    } catch (error) {
      console.error('❌ Unable to connect to Sequelize database:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.connection.close();
      console.log('✅ Sequelize connection closed.');
      return true;
    } catch (error) {
      console.error('❌ Error closing Sequelize connection:', error);
      throw error;
    }
  }

  async authenticate() {
    return await this.connect();
  }

  async sync(options = {}) {
    try {
      await this.connection.sync(options);
      console.log('✅ Sequelize models synchronized.');
      return true;
    } catch (error) {
      console.error('❌ Error synchronizing Sequelize models:', error);
      throw error;
    }
  }

  async transaction(callback) {
    return await this.connection.transaction(callback);
  }

  getConnection() {
    return this.connection;
  }
}

module.exports = SequelizeAdapter;
