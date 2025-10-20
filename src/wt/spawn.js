const { spawn } = require('child_process');
const path = require('path');

const searchBooks = (keyword) => {
  const indexPath = path.join(__dirname, '../../data', 'book_index.json');
  const child = spawn('findstr', ['/I', keyword, indexPath], { shell: true });

  child.stdout.on('data', (data) => {
    console.log(`Результаты поиска "${keyword}":`);
    console.log(data.toString());
  });

  child.stderr.on('data', (data) => {
    console.error(`Ошибка поиска: ${data.toString()}`);
  });

  child.on('close', (code) => {
    console.log(`Поиск завершен с кодом ${code}`);
  });
};

const [, , keyword] = process.argv;
if (!keyword) {
  console.error('Использование: node spawn.js <ключевое_слово>');
  process.exit(1);
}

searchBooks(keyword);