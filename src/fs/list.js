const fs = require('fs').promises;
const path = require('path');

const listBooks = async () => {
  const indexPath = path.join(__dirname, '../../data', 'book_index.json');

  try {
    const indexData = await fs.readFile(indexPath, 'utf8');
    const index = JSON.parse(indexData);

    if (index.length === 0) {
      console.log('Список книг пуст');
      return;
    }

    index.forEach(book => {
      console.log(`ID: ${book.id}, Название: ${book.title}, Автор: ${book.author}, Файл: ${book.filename}`);
    });
  } catch (err) {
    console.error(`Ошибка чтения списка: ${err.message}`);
  }
};

listBooks();