/**
 * Базовый адаптер для подключения к БД
 * Обеспечивает единый интерфейс для разных типов БД
 */
class DatabaseAdapter {
  /**
   * Подключиться к БД
   */
  async connect() {
    throw new Error('Method connect must be implemented');
  }

  /**
   * Отключиться от БД
   */
  async disconnect() {
    throw new Error('Method disconnect must be implemented');
  }

  /**
   * Проверить подключение
   */
  async authenticate() {
    throw new Error('Method authenticate must be implemented');
  }

  /**
   * Выполнить синхронизацию моделей
   */
  async sync(options = {}) {
    throw new Error('Method sync must be implemented');
  }

  /**
   * Начать транзакцию
   */
  async transaction(callback) {
    throw new Error('Method transaction must be implemented');
  }

  /**
   * Получить экземпляр подключения
   */
  getConnection() {
    throw new Error('Method getConnection must be implemented');
  }
}

module.exports = DatabaseAdapter;
