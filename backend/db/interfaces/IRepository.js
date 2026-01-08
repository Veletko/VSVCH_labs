/**
 * Интерфейс репозитория
 * Описывает базовые методы для работы с данными, независимо от БД
 */
class IRepository {
  /**
   * Получить все записи
   * @param {Object} options - Опции запроса (pagination, sorting, filtering)
   * @returns {Promise<Array>} Массив записей
   */
  async findAll(options = {}) {
    throw new Error('Method findAll must be implemented');
  }

  /**
   * Найти запись по ID
   * @param {number|string} id - ID записи
   * @param {Object} options - Опции запроса (include relations)
   * @returns {Promise<Object|null>} Запись или null
   */
  async findById(id, options = {}) {
    throw new Error('Method findById must be implemented');
  }

  /**
   * Создать новую запись
   * @param {Object} data - Данные для создания
   * @returns {Promise<Object>} Созданная запись
   */
  async create(data) {
    throw new Error('Method create must be implemented');
  }

  /**
   * Обновить запись
   * @param {number|string} id - ID записи
   * @param {Object} data - Данные для обновления
   * @returns {Promise<Object|null>} Обновленная запись или null
   */
  async update(id, data) {
    throw new Error('Method update must be implemented');
  }

  /**
   * Удалить запись
   * @param {number|string} id - ID записи
   * @returns {Promise<boolean>} true если удалено, false если не найдено
   */
  async delete(id) {
    throw new Error('Method delete must be implemented');
  }

  /**
   * Проверить существование записи
   * @param {number|string} id - ID записи
   * @returns {Promise<boolean>} true если существует
   */
  async exists(id) {
    throw new Error('Method exists must be implemented');
  }

  /**
   * Поиск записей
   * @param {Object} criteria - Критерии поиска
   * @param {Object} options - Опции запроса
   * @returns {Promise<Array>} Массив найденных записей
   */
  async search(criteria, options = {}) {
    throw new Error('Method search must be implemented');
  }

  /**
   * Подсчет записей
   * @param {Object} criteria - Критерии подсчета
   * @returns {Promise<number>} Количество записей
   */
  async count(criteria = {}) {
    throw new Error('Method count must be implemented');
  }
}

module.exports = IRepository;
