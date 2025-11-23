import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  BookOpen,
  Bell,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  UserCheck,
  AlertTriangle,
  Calendar,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Clock,
  Download,
  ChevronRight,
  Search,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const PREDEFINED_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
  },
  { username: 'student1', password: '123', name: 'Alex Chen', role: 'student' },
  { username: 'student2', password: '456', name: 'Sarah Kim', role: 'student' },
  {
    username: 'teacher1',
    password: 'teacher123',
    name: 'Dr. Smith',
    role: 'teacher',
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: 'New course request: Machine Learning II',
      time: '5m ago',
      type: 'request',
    },
    {
      id: 2,
      text: 'System backup completed successfully',
      time: '1h ago',
      type: 'system',
    },
    {
      id: 3,
      text: 'User "student99" requested password reset',
      time: '2h ago',
      type: 'security',
    },
  ]);

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (current.role !== 'admin') {
      window.location.href = '/';
    }
  }, []);

  const stats = [
    {
      label: 'Total Users',
      value: '1,284',
      change: '+12%',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Active Courses',
      value: '68',
      change: '+8%',
      icon: BookOpen,
      color: 'green',
    },
    {
      label: 'Pending Requests',
      value: '12',
      change: 'New',
      icon: AlertTriangle,
      color: 'orange',
    },
    {
      label: 'System Health',
      value: '98.5%',
      change: '+0.3%',
      icon: Shield,
      color: 'purple',
    },
  ];

  const activityData = [
    { name: 'Mon', users: 890, courses: 45 },
    { name: 'Tue', users: 1020, courses: 52 },
    { name: 'Wed', users: 980, courses: 48 },
    { name: 'Thu', users: 1150, courses: 61 },
    { name: 'Fri', users: 1340, courses: 72 },
    { name: 'Sat', users: 890, courses: 38 },
    { name: 'Sun', users: 720, courses: 29 },
  ];

  const roleDistribution = [
    { name: 'Students', value: 1180, color: '#3b82f6' },
    { name: 'Teachers', value: 78, color: '#10b981' },
    { name: 'Admins', value: 26, color: '#8b5cf6' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        stat.change.includes('+')
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Weekly Activity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      name="Active Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="courses"
                      stroke="#10b981"
                      name="Courses Accessed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  User Role Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Recent System Alerts
              </h3>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notif.type === 'request'
                            ? 'bg-orange-500'
                            : notif.type === 'system'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {notif.text}
                        </p>
                        <p className="text-xs text-slate-500">{notif.time}</p>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      View →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                User Management
              </h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: 'Dr. Smith',
                      role: 'Teacher',
                      status: 'Active',
                      last: '2 hours ago',
                    },
                    {
                      name: 'Sarah Kim',
                      role: 'Student',
                      status: 'Active',
                      last: '5 mins ago',
                    },
                    {
                      name: 'Mike Johnson',
                      role: 'Student',
                      status: 'Inactive',
                      last: '3 days ago',
                    },
                  ].map((u, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {u.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {u.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {u.name.toLowerCase().replace(' ', '.')}
                              @university.edu
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.role === 'Teacher'
                              ? 'bg-green-100 text-green-700'
                              : u.role === 'Student'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {u.last}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                            <Lock className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                Course Requests
              </h2>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Create New Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Advanced AI Ethics',
                  instructor: 'Prof. Garcia',
                  status: 'pending',
                  date: '2025-11-20',
                },
                {
                  title: 'Quantum Computing',
                  instructor: 'Dr. Chen',
                  status: 'pending',
                  date: '2025-11-19',
                },
                {
                  title: 'Blockchain Development',
                  instructor: 'Ms. Patel',
                  status: 'approved',
                  date: '2025-11-18',
                },
              ].map((req, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-800">
                      {req.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        req.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : req.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    by {req.instructor}
                  </p>
                  <p className="text-xs text-slate-500 mb-6">
                    Requested on {req.date}
                  </p>
                  <div className="flex space-x-3">
                    {req.status === 'pending' && (
                      <>
                        <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center justify-center space-x-2">
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'announcements':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">
              System Announcements
            </h2>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Send New Announcement
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Semester Break Notice"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Audience
                  </label>
                  <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option>All Users</option>
                    <option>Students Only</option>
                    <option>Teachers Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Type your announcement..."
                  ></textarea>
                </div>
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium text-lg flex items-center justify-center space-x-3">
                  <Send className="w-5 h-5" />
                  <span>Broadcast Announcement</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Previous Announcements
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Maintenance Scheduled',
                    date: 'Nov 20, 2025',
                    audience: 'All Users',
                  },
                  {
                    title: 'New Grading Policy',
                    date: 'Nov 15, 2025',
                    audience: 'Students',
                  },
                ].map((ann, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {ann.title}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Sent to: {ann.audience}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">{ann.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Section Under Development
              </h2>
              <p className="text-slate-600">
                This feature will be available soon
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  EduPro Admin Portal
                </h1>
                <p className="text-xs text-slate-500">System Administration</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Administrator
                </p>
                <p className="text-xs text-slate-500">admin@university.edu</p>
              </div>
              <button className="text-red-600 hover:text-red-700 flex items-center space-x-1">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-slate-200 min-h-screen p-6 transition-all duration-300`}
        >
          <nav className="space-y-2">
            {[
              { icon: Home, label: 'Overview', id: 'overview' },
              { icon: Users, label: 'User Management', id: 'users' },
              { icon: BookOpen, label: 'Course Requests', id: 'courses' },
              { icon: Bell, label: 'Announcements', id: 'announcements' },
              { icon: BarChart3, label: 'Reports & Analytics', id: 'reports' },
              { icon: Shield, label: 'Security & Roles', id: 'security' },
              { icon: Calendar, label: 'Semester Management', id: 'semester' },
              { icon: Settings, label: 'System Settings', id: 'settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span
                  className={`font-medium ${
                    sidebarOpen ? 'block' : 'hidden lg:block'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  );
}








import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  BookOpen,
  Bell,
  MessageSquare,
  BarChart3,
  Settings,
  Shield,
  UserCheck,
  AlertTriangle,
  Calendar,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Clock,
  Download,
  ChevronRight,
  Search,
  LogOut,
  Menu,
  X,
  Plus,
  Lock,
  Eye,
  EyeOff,
  Camera,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const PREDEFINED_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
  },
  { username: 'student1', password: '123', name: 'Alex Chen', role: 'student' },
  { username: 'student2', password: '456', name: 'Sarah Kim', role: 'student' },
  {
    username: 'teacher1',
    password: 'teacher123',
    name: 'Dr. Smith',
    role: 'teacher',
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: 'New course request: Machine Learning II',
      time: '5m ago',
      type: 'request',
    },
    { id: 2, text: 'System backup completed', time: '1h ago', type: 'system' },
    {
      id: 3,
      text: 'User "student99" requested password reset',
      time: '2h ago',
      type: 'security',
    },
  ]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [user, setUser] = useState({});

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (current.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    setUser(current);
  }, []);

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.map((u) =>
      u.username === user.username ? { ...u, password: passwordData.new } : u
    );
    localStorage.setItem('users', JSON.stringify(updated));
    setUser({ ...user, password: passwordData.new });
    alert('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const uploadProfilePic = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const updatedUser = { ...user, avatar: ev.target.result };
          setUser(updatedUser);
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const updatedUsers = users.map((u) =>
            u.username === user.username ? updatedUser : u
          );
          localStorage.setItem('users', JSON.stringify(updatedUsers));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const stats = [
    {
      label: 'Total Users',
      value: '1,284',
      change: '+12%',
      icon: Users,
      color: 'blue',
    },
    {
      label: 'Active Courses',
      value: '68',
      change: '+8%',
      icon: BookOpen,
      color: 'green',
    },
    {
      label: 'Pending Requests',
      value: '12',
      change: 'New',
      icon: AlertTriangle,
      color: 'orange',
    },
    {
      label: 'System Health',
      value: '98.5%',
      change: '+0.3%',
      icon: Shield,
      color: 'purple',
    },
  ];

  const activityData = [
    { name: 'Mon', users: 890, courses: 45 },
    { name: 'Tue', users: 1020, courses: 52 },
    { name: 'Wed', users: 980, courses: 48 },
    { name: 'Thu', users: 1150, courses: 61 },
    { name: 'Fri', users: 1340, courses: 72 },
    { name: 'Sat', users: 890, courses: 38 },
    { name: 'Sun', users: 720, courses: 29 },
  ];

  const roleDistribution = [
    { name: 'Students', value: 1180, color: '#3b82f6' },
    { name: 'Teachers', value: 78, color: '#10b981' },
    { name: 'Admins', value: 26, color: '#8b5cf6' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        stat.change.includes('+')
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Weekly Activity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      name="Active Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="courses"
                      stroke="#10b981"
                      name="Courses Accessed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  User Role Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Recent System Alerts
              </h3>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notif.type === 'request'
                            ? 'bg-orange-500'
                            : notif.type === 'system'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {notif.text}
                        </p>
                        <p className="text-xs text-slate-500">{notif.time}</p>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      View →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                User Management
              </h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: 'Dr. Smith',
                      role: 'Teacher',
                      status: 'Active',
                      last: '2 hours ago',
                    },
                    {
                      name: 'Sarah Kim',
                      role: 'Student',
                      status: 'Active',
                      last: '5 mins ago',
                    },
                    {
                      name: 'Mike Johnson',
                      role: 'Student',
                      status: 'Inactive',
                      last: '3 days ago',
                    },
                  ].map((u, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {u.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {u.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {u.name.toLowerCase().replace(' ', '.')}
                              @university.edu
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.role === 'Teacher'
                              ? 'bg-green-100 text-green-700'
                              : u.role === 'Student'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.status === 'Active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {u.last}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                            <Lock className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                Course Requests
              </h2>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Create New Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Advanced AI Ethics',
                  instructor: 'Prof. Garcia',
                  status: 'pending',
                  date: '2025-11-20',
                },
                {
                  title: 'Quantum Computing',
                  instructor: 'Dr. Chen',
                  status: 'pending',
                  date: '2025-11-19',
                },
                {
                  title: 'Blockchain Development',
                  instructor: 'Ms. Patel',
                  status: 'approved',
                  date: '2025-11-18',
                },
              ].map((req, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-800">
                      {req.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        req.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : req.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    by {req.instructor}
                  </p>
                  <p className="text-xs text-slate-500 mb-6">
                    Requested on {req.date}
                  </p>
                  <div className="flex space-x-3">
                    {req.status === 'pending' && (
                      <>
                        <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center justify-center space-x-2">
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'announcements':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">
              System Announcements
            </h2>

            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Send New Announcement
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Semester Break Notice"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Audience
                  </label>
                  <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option>All Users</option>
                    <option>Students Only</option>
                    <option>Teachers Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Type your announcement..."
                  ></textarea>
                </div>
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium text-lg flex items-center justify-center space-x-3">
                  <Send className="w-5 h-5" />
                  <span>Broadcast Announcement</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Previous Announcements
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: 'Maintenance Scheduled',
                    date: 'Nov 20, 2025',
                    audience: 'All Users',
                  },
                  {
                    title: 'New Grading Policy',
                    date: 'Nov 15, 2025',
                    audience: 'Students',
                  },
                ].map((ann, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {ann.title}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Sent to: {ann.audience}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">{ann.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Section Under Development
              </h2>
              <p className="text-slate-600">
                This feature will be available soon
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  EduPro Admin Portal
                </h1>
                <p className="text-xs text-slate-500">System Administration</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Administrator
                </p>
                <p className="text-xs text-slate-500">admin@university.edu</p>
              </div>
              <button className="text-red-600 hover:text-red-700 flex items-center space-x-1">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-slate-200 min-h-screen p-6 transition-all duration-300`}
        >
          <nav className="space-y-2">
            {[
              { icon: Home, label: 'Overview', id: 'overview' },
              { icon: Users, label: 'User Management', id: 'users' },
              { icon: BookOpen, label: 'Course Requests', id: 'courses' },
              { icon: Bell, label: 'Announcements', id: 'announcements' },
              { icon: BarChart3, label: 'Reports & Analytics', id: 'reports' },
              { icon: Shield, label: 'Security & Roles', id: 'security' },
              { icon: Calendar, label: 'Semester Management', id: 'semester' },
              { icon: Settings, label: 'System Settings', id: 'settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span
                  className={`font-medium ${
                    sidebarOpen ? 'block' : 'hidden lg:block'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  );
}

