// middleware/transformId.js (создайте отдельный файл или добавьте в server.js)
const transformResponse = (data) => {
  if (!data) return data;
  
  // Если есть data поле (стандартная структура ответа нашего API)
  if (data.data !== undefined) {
    // Если data.data - массив
    if (Array.isArray(data.data)) {
      data.data = data.data.map(item => transformItem(item));
    } 
    // Если data.data - объект
    else if (data.data && typeof data.data === 'object') {
      data.data = transformItem(data.data);
    }
  }
  // Если ответ сам по себе массив (например, прямой find())
  else if (Array.isArray(data)) {
    data = data.map(item => transformItem(item));
  }
  // Если ответ сам по себе объект
  else if (data && typeof data === 'object') {
    data = transformItem(data);
  }
  
  return data;
};

const transformItem = (item) => {
  if (!item || typeof item !== 'object') return item;
  
  const transformed = { ...item };
  
  // Преобразуем _id в id
  if (transformed._id) {
    transformed.id = transformed._id.toString();
    delete transformed._id;
  }
  
  // Рекурсивно преобразуем вложенные объекты
  Object.keys(transformed).forEach(key => {
    if (Array.isArray(transformed[key])) {
      transformed[key] = transformed[key].map(subItem => {
        if (subItem && typeof subItem === 'object' && subItem._id) {
          return transformItem(subItem);
        }
        return subItem;
      });
    } else if (transformed[key] && typeof transformed[key] === 'object' && transformed[key]._id) {
      transformed[key] = transformItem(transformed[key]);
    }
  });
  
  return transformed;
};

// Middleware для использования
const transformIdMiddleware = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    const transformedData = transformResponse(data);
    originalJson.call(this, transformedData);
  };
  
  next();
};

module.exports = transformIdMiddleware;