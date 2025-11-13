const API = {
  async getTasks() {
    const res = await fetch('/api/tasks');
    if (!res.ok) throw new Error('Ошибка загрузки задач');
    return res.json();
  },

  async getStats() {
    const res = await fetch('/api/stat', { method: 'POST' });
    if (!res.ok) throw new Error('Ошибка статистики');
    return res.json();
  },

  async addTask(task) {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Ошибка добавления');
    }
    return res.json();
  },

  async deleteTask(id) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' }); // Исправлено
    if (!res.ok) throw new Error('Ошибка удаления');
    return res.json();
  },

  async toggleTaskDone(id, done) {
    const res = await fetch(`/api/tasks/${id}`, { // Исправлено
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Ошибка обновления');
    }
    return res.json();
  },

  async downloadReport(type, filename) {
    const headers = { 'Accept': type };
    const res = await fetch('/api/report', { headers });
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ошибка скачивания: ${text}`);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};