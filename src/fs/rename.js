const fs = require('fs').promises;
const path = require('path');

const renameFile = async (oldName, newName) => {
  const oldPath = path.join(__dirname, '../../data/books', oldName);
  const newPath = path.join(__dirname, '../../data/books', newName);
  const indexPath = path.join(__dirname, '../../data', 'book_index.json');

  try {
    await fs.rename(oldPath, newPath);

    const indexData = await fs.readFile(indexPath, 'utf8');
    const index = JSON.parse(indexData);
    const entry = index.find(book => book.filename === oldName);
    if (entry) {
      entry.filename = newName;
      await fs.writeFile(indexPath, JSON.stringify(index, null, 1));
    }

    console.log(`Файл ${oldName} переименован в ${newName}`);
  } catch (err) {
    console.error(`Ошибка переименования: ${err.message}`);
  }
};

const [, , oldName, newName] = process.argv;
if (!oldName || !newName) {
  console.error('Использование: node rename.js old_filename.json new_filename.json');
  process.exit(1);
}

renameFile(oldName, newName);