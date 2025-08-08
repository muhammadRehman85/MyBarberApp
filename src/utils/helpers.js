// Array helpers
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = (array) => {
  return [...new Set(array)];
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (order === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};

// Object helpers
export const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export const omit = (object, keys) => {
  return Object.keys(object)
    .filter(key => !keys.includes(key))
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
};

export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// String helpers
export const truncate = (str, length = 50, suffix = '...') => {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Number helpers
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const round = (num, decimals = 0) => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Date helpers
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addHours = (date, hours) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

export const isTomorrow = (date) => {
  const tomorrow = addDays(new Date(), 1);
  const checkDate = new Date(date);
  return (
    checkDate.getDate() === tomorrow.getDate() &&
    checkDate.getMonth() === tomorrow.getMonth() &&
    checkDate.getFullYear() === tomorrow.getFullYear()
  );
};

// Async helpers
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async (fn, retries = 3, delayMs = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await delay(delayMs);
      return retry(fn, retries - 1, delayMs);
    }
    throw error;
  }
};

// Storage helpers
export const storage = {
  set: (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      // Use AsyncStorage or your preferred storage method
      // AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving data', error);
      return false;
    }
  },
  
  get: (key) => {
    try {
      // const jsonValue = await AsyncStorage.getItem(key);
      // return jsonValue != null ? JSON.parse(jsonValue) : null;
      return null;
    } catch (error) {
      console.error('Error reading data', error);
      return null;
    }
  },
  
  remove: (key) => {
    try {
      // await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing data', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      // await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing data', error);
      return false;
    }
  },
};

// Platform helpers
export const isIOS = () => {
  return Platform.OS === 'ios';
};

export const isAndroid = () => {
  return Platform.OS === 'android';
};

// Device helpers
export const getDeviceId = () => {
  // Implement device ID logic
  return 'device-id';
};

export const getAppVersion = () => {
  // Implement app version logic
  return '1.0.0';
};
