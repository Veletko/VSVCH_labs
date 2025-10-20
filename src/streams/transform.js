const { Transform } = require('stream');

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    try {
      const data = JSON.parse(chunk.toString());
      const transformed = { ...data, processed: true };
      this.push(JSON.stringify(transformed, null, 1));
      callback();
    } catch (err) {
      callback(err);
    }
  }
});

process.stdin
  .pipe(transformStream)
  .pipe(process.stdout)
  .on('error', (err) => {
    console.error(`Ошибка трансформации: ${err.message}`);
  });