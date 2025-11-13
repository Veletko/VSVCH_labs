const { create } = require('xmlbuilder2');

function escapeXml(unsafe) {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeHtml(unsafe) {
  if (unsafe == null) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toXML(tasks, categories) {
  const root = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('tasks');

  tasks.forEach(task => {
    const cat = categories.find(c => c.id === task.categoryId);
    const catName = cat ? escapeXml(cat.name) : 'Без категории';

    root.ele('task', { id: task.id, done: task.done })
      .ele('title').txt(escapeXml(task.title)).up()   
      .ele('category').txt(catName).up()             
      .up();
  });

  return root.end({ prettyPrint: true });
}

function toHTML(tasks, categories) {
  let html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Отчёт по задачам</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #333; }
    ul { list-style: none; padding: 0; }
    li { padding: 8px; border-bottom: 1px solid #eee; }
    .done { color: green; text-decoration: line-through; }
  </style>
</head>
<body>
  <h1>Список задач</h1>
  <ul>`;

  tasks.forEach(task => {
    const cat = categories.find(c => c.id === task.categoryId);
    const catName = cat ? escapeHtml(cat.name) : 'Без категории';
    const title = escapeHtml(task.title);
    const className = task.done ? 'done' : '';
    html += `<li class="${className}">
      <strong>${title}</strong> — ${catName}
    </li>`;
  });

  html += `  </ul>
</body>
</html>`;
  return html;
}

module.exports = { toXML, toHTML };