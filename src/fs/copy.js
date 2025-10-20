const fs = require('fs').promises;
const path = require('path');

const copyDir = async (src, dest) => {
  try {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
    console.log(`Копия папки ${src} создана в ${dest}`);
  } catch (err) {
    console.error(`Ошибка копирования: ${err.message}`);
  }
};

const [, , src, dest] = process.argv;
if (!src || !dest) {
  console.error('Использование: node copy.js ./source_folder ./destination_folder');
  process.exit(1);
}

copyDir(path.resolve(src), path.resolve(dest));