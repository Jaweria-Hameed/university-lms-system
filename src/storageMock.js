// src/storageMock.js
if (!window.storage) {
  window.storage = {
    async get(key) {
      const item = localStorage.getItem(key);
      return item ? { value: item } : null;
    },
    async set(key, value) {
      localStorage.setItem(key, value);
    },
  };
}
