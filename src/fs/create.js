const fs = require('fs').promises;
const path = require('path');

const createBook = async (title, author, year) => {
  const timestamp = Date.now();
  const filename = `book_${timestamp}.json`;
  const filePath = path.join(__dirname, '../../data/books', filename);
  const indexPath = path.join(__dirname, '../../data', 'book_index.json');

  try {

    try {
      await fs.access(filePath);
      throw new Error('Ошибка операции FS: Запись уже существует');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    const bookData = { id: timestamp, title, author, year };
    await fs.writeFile(filePath, JSON.stringify(bookData, null, 1));

    let index = [];
    try {
      const indexData = await fs.readFile(indexPath, 'utf8');
      index = JSON.parse(indexData);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    index.push({ id: timestamp, title, author, filename });
    await fs.writeFile(indexPath, JSON.stringify(index, null, 1));

    console.log(`Книга "${title}" успешно добавлена. Файл: ${filename}`);
  } catch (err) {
    console.error(err.message);
  }
};


const [, , title, author,  year] = process.argv;
if (!title || !author || !year) {
  console.error('Использование: node create.js "Название" "Автор" "" "Год"');
  process.exit(1);
}

createBook(title, author, year);