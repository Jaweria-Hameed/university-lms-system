// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './storageMock.js';

// CREATE DEFAULT USER IF NONE EXISTS
const createDefaultUser = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.length === 0) {
    const defaultUsers = [
      { username: 'teacher1', password: '123', role: 'teacher' },
      { username: 'student1', password: '123', role: 'student' },
      { username: 'admin1', password: '123', role: 'admin' },
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    console.log(
      'Default users created: teacher1, student1, admin1 (password: 123)'
    );
  }
};

// Run once on app load
createDefaultUser();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
