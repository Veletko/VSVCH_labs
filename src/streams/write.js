const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');

const writeFileStream = (filename, title, author) => {
  const filePath = path.join(__dirname, '../../data', filename);
  const writeStream = createWriteStream(filePath, { encoding: 'utf8' });

  const bookData = JSON.stringify({ title, author }, null, 1);

  writeStream.write(bookData);
  writeStream.end();

  writeStream
    .on('finish', () => {
      console.log(`Данные записаны в ${filename}`);
    })
    .on('error', (err) => {
      console.error(`Ошибка записи: ${err.message}`);
    });
};

const [, , filename, title, author] = process.argv;
if (!filename || !title || !author) {
  console.error('Использование: node write.js <filename> "Название" "Автор"');
  process.exit(1);
}

writeFileStream(filename, title, author);