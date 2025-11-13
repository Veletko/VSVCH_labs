document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();
  await refreshAll();
  document.getElementById('addTaskBtn').addEventListener('click', addTask);
});

async function loadCategories() {
  try {
    const res = await fetch('/data/categories.json');
    const categories = await res.json();
    const select = document.getElementById('categorySelect');
    select.innerHTML = categories.map(c => 
      `<option value="${c.id}">${c.name}</option>`
    ).join('');
  } catch (err) {
    showError('Не удалось загрузить категории');
  }
}
async function loadTasks() {
  try {
    const tasks = await API.getTasks();
    const container = document.getElementById('tasksList');
    if (tasks.length === 0) {
      container.innerHTML = '<p style="color:#999;">Задач пока нет</p>';
      return;
    }
    container.innerHTML = tasks.map(task => `
      <div class="task ${task.done ? 'done' : ''}">
        <label>
          <input type="checkbox" 
                 ${task.done ? 'checked' : ''} 
                 data-id="${task.id}"
                 onchange="handleToggle(this)">
          <span>${escapeHtml(task.title)}</span>
        </label>
        <em style="color:#777; font-size:0.9em;">— ${escapeHtml(task.categoryName)}</em>
        <button class="danger" onclick="deleteTask(${task.id})">Удалить</button>
      </div>
    `).join('');
  } catch (err) {
    showError(err.message);
  }
}
async function refreshAll() {
  await Promise.all([loadTasks(), loadStats()]);
}


async function loadStats() {
  try {
    const stats = await API.getStats();
    const container = document.getElementById('stats');
    container.innerHTML = stats.map(s => `
      <div><strong>${escapeHtml(s.name)}</strong>: 
        ${s.done} из ${s.total} выполнено
      </div>
    `).join('');
  } catch (err) {
    const container = document.getElementById('stats');
    container.innerHTML = '<p style="color:red;">Ошибка статистики</p>';
  }
}

async function addTask() {
  const titleInput = document.getElementById('taskTitle');
  const title = titleInput.value.trim();
  const categoryId = document.getElementById('categorySelect').value;

  if (!title) {
    showError('Введите название задачи');
    return;
  }

  try {
    await API.addTask({ title, categoryId: Number(categoryId) });
    titleInput.value = '';
    await refreshAll();
  } catch (err) {
    showError(err.message);
  }
}

async function deleteTask(id) {
  if (!confirm('Удалить задачу?')) return;
  try {
    await API.deleteTask(id);
    await refreshAll();
  } catch (err) {
    showError(err.message);
  }
}

function downloadReport(format) {
  const types = {
    json: { type: 'application/json', file: 'report.json' },
    xml: { type: 'application/xml', file: 'report.xml' },
    html: { type: 'text/html', file: 'report.html' }
  };
  const config = types[format];
  API.downloadReport(config.type, config.file).catch(err => {
    showError('Ошибка скачивания: ' + err.message);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => errorDiv.style.display = 'none', 4000);
}
function handleToggle(checkbox) {
  const id = Number(checkbox.dataset.id);
  if (!id) return;
  const done = checkbox.checked;
  toggleDone(id, done, checkbox);
}

async function toggleDone(id, done, checkbox) {
  try {
    const updatedTask = await API.toggleTaskDone(id, done);
    await refreshAll();
  } catch (err) {
    showError(err.message || 'Не удалось обновить задачу');
    checkbox.checked = !done; 
  }
}