const fs = require('fs').promises;
const path = require('path');

const deleteBook = async (id) => {
  const indexPath = path.join(__dirname, '../../data', 'book_index.json');

  try {
    const indexData = await fs.readFile(indexPath, 'utf8');
    const index = JSON.parse(indexData);
    const book = index.find(b => b.id === parseInt(id));

    if (!book) {
      throw new Error('Запись не найдена');
    }

    const filePath = path.join(__dirname, '../../data/books', book.filename);
    await fs.unlink(filePath);

    const updatedIndex = index.filter(b => b.id !== parseInt(id));
    await fs.writeFile(indexPath, JSON.stringify(updatedIndex, null, 1));

    console.log(`Книга с ID ${id} удалена`);
  } catch (err) {
    console.error(`Ошибка удаления: ${err.message}`);
  }
};

const [, , id] = process.argv;
if (!id) {
  console.error('Использование: node delete.js <id>');
  process.exit(1);
}

deleteBook(id);