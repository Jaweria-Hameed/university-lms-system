// src/pages/Login.jsx
import React, { useState } from 'react';
import { Lock, User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ADD THIS RIGHT AFTER THE IMPORTS
const PREDEFINED_USERS = [
  {
    username: 'student1',
    password: '123',
    role: 'student',
    name: 'Alex Chen',
    dataKey: 'student-data-student1',
  },
  {
    username: 'student2',
    password: '456',
    role: 'student',
    name: 'Sarah Kim',
    dataKey: 'student-data-student2',
  },
  {
    username: 'student3',
    password: '789',
    role: 'student',
    name: 'Mike Johnson',
    dataKey: 'student-data-student3',
  },
];

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !role) {
      setError('All fields are required');
      return;
    }

    if (isLogin) {
      // LOGIN MODE
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        setError('Invalid username or password');
        return;
      }

      // SAVE EXACT LOWERCASE ROLE
      const currentUser = {
        username: user.username,
        role: user.role.toLowerCase(), // ← FORCE lowercase
      };

      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('loginTime', Date.now().toString());

      // REDIRECT BASED ON ROLE
      if (currentUser.role === 'teacher') {
        navigate('/teacher');
      } else if (currentUser.role === 'student') {
        navigate('/student');
      } else if (currentUser.role === 'admin') {
        navigate('/admin');
      }
    } else {
      // REGISTER MODE
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (users.some((u) => u.username === username)) {
        setError('Username already exists');
        return;
      }

      const newUser = {
        username,
        password,
        role: role.toLowerCase(), // ← SAVE AS lowercase
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      alert('Registration successful! Please login.');
      setIsLogin(true); // Switch to login mode
      setUsername('');
      setPassword('');
      setRole('');
    }
  };
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password || (!isLogin && !role)) {
      setError('All fields are required');
      return;
    }

    if (isLogin) {
      // === LOGIN MODE ===
      // 1. Check predefined users first
      const predefinedUser = PREDEFINED_USERS.find(
        (u) => u.username === username && u.password === password
      );

      if (predefinedUser) {
        const currentUser = {
          username: predefinedUser.username,
          role: predefinedUser.role,
          name: predefinedUser.name,
          dataKey: predefinedUser.dataKey,
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('loginTime', Date.now().toString());
        navigate('/student');
        return;
      }

      // 2. Fallback: check localStorage users (for registered users)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        setError('Invalid username or password');
        return;
      }

      const currentUser = {
        username: user.username,
        role: user.role.toLowerCase(),
      };

      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('loginTime', Date.now().toString());

      if (currentUser.role === 'teacher') navigate('/teacher');
      else if (currentUser.role === 'student') navigate('/student');
      else if (currentUser.role === 'admin') navigate('/admin');
    } else {
      // === REGISTER MODE (unchanged) ===
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      if (users.some((u) => u.username === username)) {
        setError('Username already exists');
        return;
      }

      const newUser = {
        username,
        password,
        role: role.toLowerCase(),
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      alert('Registration successful! Please login.');
      setIsLogin(true);
      setUsername('');
      setPassword('');
      setRole('');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            {isLogin ? (
              <LogIn className="w-8 h-8 text-white" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="teacher1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* SIMPLE ROLE SELECTION — NO ICONS */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLogin ? 'Login' : 'Register'}</span>
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-600">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
