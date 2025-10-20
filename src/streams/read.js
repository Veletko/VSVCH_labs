const fs = require('fs');
const path = require('path');
const { createReadStream } = require('fs');

const readFileStream = (filename) => {
  const filePath = path.join(__dirname, '../../data', filename);

  const readStream = createReadStream(filePath, { encoding: 'utf8' });

  readStream
    .on('data', (chunk) => {
      console.log(chunk);
    })
    .on('error', (err) => {
      console.error(`Ошибка чтения: ${err.message}`);
    })
    .on('end', () => {
      console.log('Чтение файла завершено');
    });
};

const [, , filename] = process.argv;
if (!filename) {
  console.error('Использование: node read.js <filename>');
  process.exit(1);
}

readFileStream(filename);