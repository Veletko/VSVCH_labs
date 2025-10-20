const fs = require('fs').promises;
const path = require('path');

const readBook = async (id) => {
  const indexPath = path.join(__dirname, '../../data', 'book_index.json');

  try {
    const indexData = await fs.readFile(indexPath, 'utf8');
    const index = JSON.parse(indexData);
    const book = index.find(b => b.id === parseInt(id));

    if (!book) {
      throw new Error('Книга не найдена');
    }

    const filePath = path.join(__dirname, '../../data/books', book.filename);
    const bookData = await fs.readFile(filePath, 'utf8');
    console.log(JSON.parse(bookData));
  } catch (err) {
    console.error(`Ошибка чтения: ${err.message}`);
  }
};

const [, , id] = process.argv;
if (!id) {
  console.error('Использование: node read.js <id>');
  process.exit(1);
}

readBook(id);