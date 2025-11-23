// AdminDashboard.jsx
// Single-file full LMS Admin Panel (frontend-only).
// - Preserves your original admin login logic and theme.
// - Adds: admin password change, reports, system monitor simulation,
//   role management, semester auto status, messaging inbox, CSV exports,
//   announcements, CRUD departments, course approvals, instructor verification,
//   password reset simulation, charts, and persistent localStorage state.

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Users,
  Home,
  BookOpen,
  Bell,
  Shield,
  CheckCircle,
  XCircle,
  Send,
  FileText,
  Calendar,
  Building2,
  RefreshCw,
  Database,
  Server,
  Cpu,
  HardDrive,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  X,
  Trash2,
  Lock,
  Unlock,
  UserCheck,
  Search,
  Settings,
  FileDown,
  Activity,
  BarChart,
  PieChart as LucidePie,
} from 'lucide-react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  LineChart,
  Line,
  Legend,
} from 'recharts';

/* ------------------------------
   ORIGINAL ADMIN CONSTANTS - kept EXACT
   (I did NOT modify these constants)
   ------------------------------ */
const ADMINS = [
  { username: 'admin1', password: 'admin123', name: 'John Admin' },
  { username: 'admin2', password: 'admin456', name: 'Jane Manager' },
];
const CL = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981'];

const initData = {
  users: [
    {
      id: 1,
      name: 'Alex Chen',
      email: 'alex@edu.com',
      role: 'student',
      status: 'active',
      dept: 'CS',
    },
    {
      id: 2,
      name: 'Sarah Kim',
      email: 'sarah@edu.com',
      role: 'student',
      status: 'active',
      dept: 'Math',
    },
    {
      id: 3,
      name: 'Dr. Smith',
      email: 'smith@edu.com',
      role: 'teacher',
      status: 'active',
      dept: 'Math',
    },
    {
      id: 4,
      name: 'Prof. Johnson',
      email: 'johnson@edu.com',
      role: 'teacher',
      status: 'active',
      dept: 'Physics',
    },
    {
      id: 5,
      name: 'Mike Brown',
      email: 'mike@edu.com',
      role: 'student',
      status: 'inactive',
      dept: 'Physics',
    },
    {
      id: 6,
      name: 'Ms. Lee',
      email: 'lee@edu.com',
      role: 'teacher',
      status: 'pending',
      dept: 'CS',
    },
  ],
  courses: [
    {
      id: 1,
      title: 'Machine Learning',
      instr: 'Dr. Patel',
      dept: 'CS',
      status: 'pending',
      desc: 'Intro to ML',
    },
    {
      id: 2,
      title: 'Quantum Physics',
      instr: 'Prof. Garcia',
      dept: 'Physics',
      status: 'pending',
      desc: 'Advanced quantum',
    },
    {
      id: 3,
      title: 'Data Structures',
      instr: 'Dr. Smith',
      dept: 'CS',
      status: 'approved',
      desc: 'CS fundamentals',
    },
  ],
  depts: [
    {
      id: 1,
      name: 'Computer Science',
      head: 'Dr. Williams',
      courses: 12,
      students: 450,
      teachers: 8,
    },
    {
      id: 2,
      name: 'Mathematics',
      head: 'Dr. Smith',
      courses: 8,
      students: 280,
      teachers: 5,
    },
    {
      id: 3,
      name: 'Physics',
      head: 'Prof. Johnson',
      courses: 6,
      students: 180,
      teachers: 4,
    },
  ],
  anns: [
    {
      id: 1,
      title: 'System Maintenance',
      msg: 'Nov 25 maintenance scheduled',
      target: 'all',
      priority: 'high',
      date: '2024-11-20',
    },
    {
      id: 2,
      title: 'Registration Open',
      msg: 'Spring 2025 registration now open',
      target: 'students',
      priority: 'normal',
      date: '2024-11-18',
    },
  ],
  notifs: [
    {
      id: 1,
      text: 'New course request from Dr. Patel',
      time: '2h ago',
      read: false,
    },
    {
      id: 2,
      text: 'Instructor verification pending',
      time: '5h ago',
      read: false,
    },
  ],
  sems: [
    {
      id: 1,
      name: 'Fall 2024',
      start: '2024-09-01',
      end: '2024-12-20',
      regStart: '2024-08-01',
      regEnd: '2024-08-31',
      status: 'active',
    },
    {
      id: 2,
      name: 'Spring 2025',
      start: '2025-01-15',
      end: '2025-05-15',
      regStart: '2024-12-01',
      regEnd: '2024-12-31',
      status: 'upcoming',
    },
  ],
  verifs: [
    {
      id: 1,
      name: 'Ms. Lee',
      email: 'lee@edu.com',
      dept: 'CS',
      quals: 'PhD MIT',
      exp: '5 years',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Dr. Kumar',
      email: 'kumar@edu.com',
      dept: 'Math',
      quals: 'PhD Stanford',
      exp: '8 years',
      status: 'pending',
    },
  ],
  metrics: {
    cpu: 45,
    mem: 62,
    storage: 38,
    uptime: '99.9%',
    growth: [
      { m: 'Jul', v: 800 },
      { m: 'Aug', v: 950 },
      { m: 'Sep', v: 1100 },
      { m: 'Oct', v: 1200 },
      { m: 'Nov', v: 1350 },
    ],
    logins: [
      { d: 'Mon', v: 420 },
      { d: 'Tue', v: 380 },
      { d: 'Wed', v: 450 },
      { d: 'Thu', v: 400 },
      { d: 'Fri', v: 350 },
    ],
  },
};

/* ---------------------------------------------------------------------
   Helper utilities
   --------------------------------------------------------------------- */
const uid = () => Date.now() + Math.floor(Math.random() * 1000);

const downloadCSV = (filename, rows) => {
  const csv = rows
    .map((r) =>
      r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const todayISO = () => new Date().toISOString().slice(0, 10);

/* ---------------------------------------------------------------------
   The big AdminDashboard component
   --------------------------------------------------------------------- */
export default function AdminDashboard() {
  // --- ORIGINAL STATE (kept as you provided) ---
  const [logged, setLogged] = useState(false);
  const [creds, setCreds] = useState({ u: '', p: '' });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('overview');
  const [admin, setAdmin] = useState({});
  const [data, setData] = useState(() => {
    // load if in localStorage adminSession
    try {
      const saved = localStorage.getItem('adminSession');
      if (saved) {
        const s = JSON.parse(saved);
        return s.data || initData;
      }
    } catch (e) {
      /* ignore */
    }
    return initData;
  });
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [newDept, setNewDept] = useState({ name: '', head: '' });
  const [newAnn, setNewAnn] = useState({
    title: '',
    msg: '',
    target: 'all',
    priority: 'normal',
  });
  const [newSem, setNewSem] = useState({
    name: '',
    start: '',
    end: '',
    regStart: '',
    regEnd: '',
  });

  // extra admin-password change modal state (to match student change password logic)
  const [showAdminPwdModal, setShowAdminPwdModal] = useState(false);
  const [adminPwdData, setAdminPwdData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showAdminPw, setShowAdminPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // messaging / global inbox
  const [globalMessages, setGlobalMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('globalMessages') || '[]');
    } catch {
      return [];
    }
  });

  // system simulation controls (for story #3)
  const [simMetrics, setSimMetrics] = useState(data.metrics);

  // filters / UI state
  const [userFilterRole, setUserFilterRole] = useState('all');
  const [courseFilterStatus, setCourseFilterStatus] = useState('all');

  // reports / generated stats preview
  const [reportPreview, setReportPreview] = useState(null);

  // quick references
  const searchRef = useRef(null);

  // --- keep your original session load behavior (unchanged) ---
  useEffect(() => {
    const saved = localStorage.getItem('adminSession');
    if (saved) {
      const s = JSON.parse(saved);
      setLogged(true);
      setAdmin(s.admin);
      setData(s.data || initData);
    } else {
      // also check if admin-auth saved (to allow "remembered" admin)
      const sa = JSON.parse(localStorage.getItem('rememberedAdmin') || 'null');
      if (sa && sa.username) {
        setAdmin(sa);
      }
    }
  }, []);

  // persist session when logged in
  useEffect(() => {
    if (logged)
      localStorage.setItem('adminSession', JSON.stringify({ admin, data }));
  }, [logged, admin, data]);

  // persist global messages
  useEffect(() => {
    localStorage.setItem('globalMessages', JSON.stringify(globalMessages));
  }, [globalMessages]);

  // persist simMetrics into data.metrics for visibility
  useEffect(() => {
    setData((d) => ({ ...d, metrics: simMetrics }));
  }, [simMetrics]);

  // keep semester statuses updated automatically based on current date
  useEffect(() => {
    const today = new Date();
    setData((d) => {
      const sems = d.sems.map((s) => {
        try {
          const start = new Date(s.start);
          const end = new Date(s.end);
          if (start <= today && today <= end) {
            if (s.status !== 'active') return { ...s, status: 'active' };
            return s;
          }
          if (today < start && s.status !== 'upcoming')
            return { ...s, status: 'upcoming' };
          if (today > end && s.status !== 'finished')
            return { ...s, status: 'finished' };
        } catch (e) {
          // ignore parse errors
        }
        return s;
      });
      return { ...d, sems };
    });
    // run once at mount, future changes occur when sems updated via create/edit
  }, []);

  /* -------------------------
     Authentication / Login
     ------------------------- */

  // Check admin credentials:
  // - First check 'customAdmins' in localStorage (if admin changed password),
  // - then fallback to ADMINS constant, so original demo credentials remain valid.
  const checkAdminCreds = (username, password) => {
    try {
      const custom = JSON.parse(localStorage.getItem('customAdmins') || '[]');
      const foundCustom = custom.find(
        (c) => c.username === username && c.password === password
      );
      if (foundCustom) return foundCustom;
    } catch (e) {
      /* ignore */
    }
    const a = ADMINS.find(
      (x) => x.username === username && x.password === password
    );
    return a || null;
  };

  const login = () => {
    const a = checkAdminCreds(creds.u, creds.p);
    if (a) {
      setAdmin(a);
      setLogged(true);
      setErr('');
      // Remember admin info for small convenience (not password)
      localStorage.setItem(
        'rememberedAdmin',
        JSON.stringify({ username: a.username, name: a.name })
      );
    } else {
      setErr('Invalid credentials');
    }
  };

  // logout - same behavior kept the same (unchanged)
  const logout = () => {
    localStorage.removeItem('adminSession');
    setLogged(false);
    setAdmin({});
    setCreds({ u: '', p: '' });
  };

  /* -------------------------
     Notifications & Messaging
     ------------------------- */
  const notify = (t) =>
    setData((d) => ({
      ...d,
      notifs: [
        { id: Date.now(), text: t, time: 'Now', read: false },
        ...d.notifs,
      ],
    }));

  const addAnnouncement = () => {
    if (!newAnn.title) {
      alert('Title required');
      return;
    }
    setData((d) => ({
      ...d,
      anns: [...d.anns, { id: Date.now(), ...newAnn, date: todayISO() }],
    }));
    setNewAnn({ title: '', msg: '', target: 'all', priority: 'normal' });
    setModal(null);
    notify('Announcement sent');
  };

  const sendGlobalMessage = (to, subject, body) => {
    const m = {
      id: uid(),
      from: admin.name || admin.username || 'Admin',
      fromAdmin: true,
      to,
      subject,
      body,
      time: new Date().toISOString(),
      read: false,
    };
    setGlobalMessages((prev) => [m, ...prev]);
    notify(`Message sent: ${subject}`);
  };

  /* -------------------------
     User Management (roles, status)
     ------------------------- */
  const updateUser = (id, field, val) => {
    setData((d) => ({
      ...d,
      users: d.users.map((u) => (u.id === id ? { ...u, [field]: val } : u)),
    }));
    notify(`User ${field} updated`);
  };

  // Reset user password: simulates sending reset link and optionally updates local storage "users" store
  const resetPw = (email) => {
    // If we have a 'users' store in localStorage, update it; otherwise just notify
    try {
      const usersStore = JSON.parse(localStorage.getItem('users') || '[]');
      const idx = usersStore.findIndex((u) => u.email === email);
      if (idx >= 0) {
        usersStore[idx].password = 'reset123'; // temporary/reset placeholder
        localStorage.setItem('users', JSON.stringify(usersStore));
        notify(`Password reset for ${email} to 'reset123' (local dev)`); // development behavior
        alert(
          `Password reset link sent to ${email}. (Simulated, new default: reset123)`
        );
        return;
      }
    } catch (e) {
      /* ignore */
    }
    // fallback: notify only
    notify(`Reset link sent to ${email}`);
    alert(`Password reset link sent to ${email}`);
  };

  /* -------------------------
     Courses: approve/reject & reports
     ------------------------- */
  const updateCourse = (id, status) => {
    setData((d) => ({
      ...d,
      courses: d.courses.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
    notify(`Course ${status}`);
  };

  /* -------------------------
     Departments CRUD
     ------------------------- */
  const delDept = (id) => {
    if (!window.confirm('Delete department?')) return;
    setData((d) => ({ ...d, depts: d.depts.filter((x) => x.id !== id) }));
    notify('Department deleted');
  };

  const addDept = () => {
    if (!newDept.name) {
      alert('Department name required');
      return;
    }
    setData((d) => ({
      ...d,
      depts: [
        ...d.depts,
        { id: Date.now(), ...newDept, courses: 0, students: 0, teachers: 0 },
      ],
    }));
    setNewDept({ name: '', head: '' });
    setModal(null);
    notify('Department created');
  };

  /* -------------------------
     Semester management
     ------------------------- */
  const addSem = () => {
    if (!newSem.name) {
      alert('Semester name required');
      return;
    }
    setData((d) => ({
      ...d,
      sems: [...d.sems, { id: Date.now(), ...newSem, status: 'upcoming' }],
    }));
    setNewSem({ name: '', start: '', end: '', regStart: '', regEnd: '' });
    setModal(null);
    notify('Semester created');
  };

  /* -------------------------
     Instructor verification (keeps original behavior)
     ------------------------- */
  const verifyInstr = (id, ok) => {
    setData((d) => ({
      ...d,
      verifs: d.verifs.map((v) =>
        v.id === id ? { ...v, status: ok ? 'approved' : 'rejected' } : v
      ),
      users: ok
        ? d.users.map((u) =>
            u.email === d.verifs.find((v) => v.id === id)?.email
              ? { ...u, status: 'active' }
              : u
          )
        : d.users,
    }));
    notify(ok ? 'Instructor verified' : 'Instructor rejected');
  };

  /* -------------------------
     Reports generation: CSV downloads & aggregated stats
     ------------------------- */
  const generateReports = (type = 'courseStats') => {
    if (type === 'courseStats') {
      // course id, title, instructor, dept, status
      const rows = [['ID', 'Title', 'Instructor', 'Dept', 'Status']];
      data.courses.forEach((c) =>
        rows.push([c.id, c.title, c.instr, c.dept, c.status])
      );
      downloadCSV(`course-stats-${todayISO()}.csv`, rows);
      notify('Course stats exported');
    } else if (type === 'userActivity') {
      const rows = [['ID', 'Name', 'Email', 'Role', 'Status', 'Dept']];
      data.users.forEach((u) =>
        rows.push([u.id, u.name, u.email, u.role, u.status, u.dept])
      );
      downloadCSV(`user-activity-${todayISO()}.csv`, rows);
      notify('User activity exported');
    } else if (type === 'gradeDist') {
      // We'll generate fake grade distribution based on gradeData
      const gradeData = [
        { g: 'A', v: 25 },
        { g: 'B', v: 35 },
        { g: 'C', v: 25 },
        { g: 'D', v: 10 },
        { g: 'F', v: 5 },
      ];
      const rows = [['Grade', 'Count']];
      gradeData.forEach((g) => rows.push([g.g, g.v]));
      downloadCSV(`grade-distribution-${todayISO()}.csv`, rows);
      notify('Grade distribution exported');
    }
  };

  /* -------------------------
     System performance simulation controls
     ------------------------- */
  const setMetric = (k, v) => {
    setSimMetrics((prev) => ({ ...prev, [k]: Number(v) }));
  };

  const simulateSpike = () => {
    setSimMetrics((prev) => ({
      ...prev,
      cpu: Math.min(100, prev.cpu + 25),
      mem: Math.min(100, prev.mem + 30),
    }));
    notify('Simulated spike: CPU & Memory increased');
  };

  /* -------------------------
     Admin change password (persist to localStorage 'customAdmins')
     - This follows your student change password behavior but for admin.
     - It does NOT alter ADMINS constant; instead it stores in customAdmins.
     ------------------------- */
  const handleAdminPasswordChange = () => {
    if (adminPwdData.new !== adminPwdData.confirm) {
      alert('New passwords do not match!');
      return;
    }
    // validate current password
    const cur =
      admin.password ||
      ADMINS.find((a) => a.username === admin.username)?.password;
    if (adminPwdData.current !== cur) {
      alert('Current password incorrect');
      return;
    }
    // Save new password into customAdmins store
    try {
      const custom = JSON.parse(localStorage.getItem('customAdmins') || '[]');
      const existing = custom.findIndex((x) => x.username === admin.username);
      if (existing >= 0) {
        custom[existing].password = adminPwdData.new;
        custom[existing].name = admin.name || admin.username;
      } else {
        custom.push({
          username: admin.username,
          password: adminPwdData.new,
          name: admin.name || admin.username,
        });
      }
      localStorage.setItem('customAdmins', JSON.stringify(custom));
      // update rememberedAdmin and admin state
      const updatedAdmin = { ...admin, password: adminPwdData.new };
      setAdmin(updatedAdmin);
      localStorage.setItem(
        'rememberedAdmin',
        JSON.stringify({
          username: updatedAdmin.username,
          name: updatedAdmin.name,
        })
      );
      alert('Admin password changed successfully!');
      setShowAdminPwdModal(false);
      setAdminPwdData({ current: '', new: '', confirm: '' });
      notify('Admin password changed');
    } catch (e) {
      alert('Unable to save password (localStorage error)');
    }
  };

  /* -------------------------
     Utility: search / filtered lists used in rendering
     ------------------------- */
  const filteredUsers = data.users
    .filter((u) =>
      userFilterRole === 'all' ? true : u.role === userFilterRole
    )
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

  const filteredCourses = data.courses
    .filter((c) =>
      courseFilterStatus === 'all' ? true : c.status === courseFilterStatus
    )
    .filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instr.toLowerCase().includes(search.toLowerCase())
    );

  const unread = data.notifs.filter((n) => !n.read).length;

  /* -------------------------
     Reports preview: small aggregated computations
     ------------------------- */
  const reportsSummary = useMemo(() => {
    const totalUsers = data.users.length;
    const students = data.users.filter((u) => u.role === 'student').length;
    const teachers = data.users.filter((u) => u.role === 'teacher').length;
    const admins = data.users.filter((u) => u.role === 'admin').length;
    const pendingCourses = data.courses.filter(
      (c) => c.status === 'pending'
    ).length;
    const approved = data.courses.filter((c) => c.status === 'approved').length;
    const deptCount = data.depts.length;
    return {
      totalUsers,
      students,
      teachers,
      admins,
      pendingCourses,
      approved,
      deptCount,
    };
  }, [data]);

  /* -------------------------
     Small UI components built inline (single file)
     ------------------------- */

  const SmallStat = ({ label, value, icon }) => (
    <div className="bg-white rounded-xl p-5 border border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({ title, actions }) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );

  /* -------------------------
     Rendering: Login screen (keeps identical visuals & logic)
     ------------------------- */
  if (!logged)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
            <p className="text-slate-500 mt-2">EduPro LMS</p>
          </div>
          {err && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {err}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                value={creds.u}
                onChange={(e) => setCreds({ ...creds, u: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={creds.p}
                  onChange={(e) => setCreds({ ...creds, p: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && login()}
                  className="w-full px-4 py-3 border rounded-lg pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter password"
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPw ? (
                    <EyeOff className="w-5 h-5 text-slate-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
            <button
              onClick={login}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Sign In
            </button>
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-slate-500">Demo Credentials:</div>
              <div className="text-sm font-mono text-slate-700">
                admin1 / admin123
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-50 rounded-lg text-center">
            <p className="text-xs text-slate-500 mb-2">Alternative demo:</p>
            <p className="text-sm font-mono text-slate-700">
              admin2 / admin456
            </p>
          </div>
        </div>
      </div>
    );

  /* -------------------------
     Main App UI (single page app inside main)
     ------------------------- */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-800">EduPro Admin</h1>
            <div className="ml-4 text-sm text-slate-500">
              Single-file LMS Admin
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg">
              <Bell className="w-5 h-5 text-slate-600" />
              {unread > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                className="px-3 py-2 border rounded-lg flex items-center gap-2"
                onClick={() => setShowAdminPwdModal(true)}
              >
                <Settings className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">Change Password</span>
              </button>
            </div>

            <div className="text-sm font-medium text-slate-700">
              {admin.name}
            </div>
            <button
              onClick={logout}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Layout: sidebar + main */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r min-h-screen p-4">
          <nav className="space-y-1">
            {[
              { id: 'overview', icon: Home, label: 'Overview' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'courses', icon: BookOpen, label: 'Courses' },
              { id: 'departments', icon: Building2, label: 'Departments' },
              { id: 'verification', icon: UserCheck, label: 'Verification' },
              { id: 'announcements', icon: Send, label: 'Announcements' },
              { id: 'semesters', icon: Calendar, label: 'Semesters' },
              { id: 'system', icon: Server, label: 'System' },
              { id: 'reports', icon: FileText, label: 'Reports' },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  tab === n.id
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <n.icon className="w-5 h-5" />
                {n.label}
              </button>
            ))}
          </nav>

          <div className="mt-6">
            <div className="text-xs text-slate-400 mb-2">Quick actions</div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setModal('dept')}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                + Add Dept
              </button>
              <button
                onClick={() => setModal('ann')}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                + Announcement
              </button>
              <button
                onClick={() => setModal('sem')}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                + Semester
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          {/* Overview */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <SectionHeader
                title="Dashboard Overview"
                actions={
                  <div className="flex gap-2">
                    <button
                      onClick={() => generateReports('courseStats')}
                      className="px-3 py-2 bg-slate-100 rounded"
                    >
                      Export courses
                    </button>
                    <button
                      onClick={() => generateReports('userActivity')}
                      className="px-3 py-2 bg-slate-100 rounded"
                    >
                      Export users
                    </button>
                  </div>
                }
              />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SmallStat
                  label="Total Users"
                  value={data.users.length}
                  icon={<Users className="w-5 h-5 text-indigo-600" />}
                />
                <SmallStat
                  label="Pending Courses"
                  value={
                    data.courses.filter((c) => c.status === 'pending').length
                  }
                  icon={<BookOpen className="w-5 h-5 text-indigo-600" />}
                />
                <SmallStat
                  label="Departments"
                  value={data.depts.length}
                  icon={<Building2 className="w-5 h-5 text-indigo-600" />}
                />
                <SmallStat
                  label="Pending Verifications"
                  value={
                    data.verifs.filter((v) => v.status === 'pending').length
                  }
                  icon={<UserCheck className="w-5 h-5 text-indigo-600" />}
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border">
                  <h3 className="font-semibold mb-4">User Growth</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data.metrics.growth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="m" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 border">
                  <h3 className="font-semibold mb-4">Recent Notifications</h3>
                  <div className="space-y-3 max-h-48 overflow-auto">
                    {data.notifs.slice(0, 8).map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-lg text-sm ${
                          n.read ? 'bg-slate-50' : 'bg-indigo-50'
                        }`}
                      >
                        <p className="font-medium text-slate-700">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border">
                  <h3 className="font-semibold mb-4">Quick Reports</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          Courses pending
                        </p>
                        <p className="font-bold">
                          {reportsSummary.pendingCourses}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => generateReports('courseStats')}
                          className="px-3 py-1 bg-indigo-600 text-white rounded"
                        >
                          Export CSV
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Total users</p>
                        <p className="font-bold">{reportsSummary.totalUsers}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => generateReports('userActivity')}
                          className="px-3 py-1 bg-indigo-600 text-white rounded"
                        >
                          Export CSV
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Depts</p>
                        <p className="font-bold">{reportsSummary.deptCount}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => generateReports('gradeDist')}
                          className="px-3 py-1 bg-indigo-600 text-white rounded"
                        >
                          Grade CSV
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border">
                  <h3 className="font-semibold mb-4">System Snapshot</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500">CPU</p>
                      <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full bg-indigo-600"
                          style={{ width: `${simMetrics.cpu}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {simMetrics.cpu}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Memory</p>
                      <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full bg-indigo-600"
                          style={{ width: `${simMetrics.mem}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {simMetrics.mem}%
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => simulateSpike()}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg"
                      >
                        Simulate Spike
                      </button>
                      <button
                        onClick={() => {
                          setSimMetrics({
                            ...simMetrics,
                            cpu: 45,
                            mem: 62,
                            storage: 38,
                          });
                          notify('Metrics reset');
                        }}
                        className="px-3 py-2 bg-slate-100 rounded-lg"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setModal('dept')}
                      className="px-3 py-2 bg-indigo-600 text-white rounded"
                    >
                      Add Department
                    </button>
                    <button
                      onClick={() => setModal('ann')}
                      className="px-3 py-2 bg-indigo-600 text-white rounded"
                    >
                      Send Announcement
                    </button>
                    <button
                      onClick={() => setModal('sem')}
                      className="px-3 py-2 bg-indigo-600 text-white rounded"
                    >
                      Create Semester
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div className="space-y-6">
              <SectionHeader
                title="User Management"
                actions={
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        ref={searchRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-64"
                      />
                    </div>
                    <select
                      value={userFilterRole}
                      onChange={(e) => setUserFilterRole(e.target.value)}
                      className="px-3 py-2 border rounded"
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Students</option>
                      <option value="teacher">Teachers</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                }
              />

              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      {[
                        'Name',
                        'Email',
                        'Role',
                        'Status',
                        'Dept',
                        'Actions',
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-sm font-semibold text-slate-600"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {u.email}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              updateUser(u.id, 'role', e.target.value)
                            }
                            className="px-2 py-1 border rounded text-sm"
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              u.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : u.status === 'inactive'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{u.dept}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateUser(
                                  u.id,
                                  'status',
                                  u.status === 'active' ? 'inactive' : 'active'
                                )
                              }
                              className={`p-1.5 rounded ${
                                u.status === 'active'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-green-100 text-green-600'
                              }`}
                            >
                              {u.status === 'active' ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <Unlock className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => resetPw(u.email)}
                              className="p-1.5 bg-blue-100 text-blue-600 rounded"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Courses */}
          {tab === 'courses' && (
            <div className="space-y-6">
              <SectionHeader
                title="Course Requests"
                actions={
                  <div className="text-sm text-slate-500">
                    Filter:{' '}
                    <select
                      value={courseFilterStatus}
                      onChange={(e) => setCourseFilterStatus(e.target.value)}
                      className="ml-2 border rounded px-2 py-1"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                }
              />
              <div className="space-y-4">
                {filteredCourses.map((c) => (
                  <div key={c.id} className="bg-white rounded-xl border p-6">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{c.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              c.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : c.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          {c.instr} • {c.dept}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">{c.desc}</p>
                      </div>

                      {c.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateCourse(c.id, 'approved')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => updateCourse(c.id, 'rejected')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Departments */}
          {tab === 'departments' && (
            <div className="space-y-6">
              <SectionHeader
                title="Departments"
                actions={
                  <button
                    onClick={() => setModal('dept')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Department
                  </button>
                }
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.depts.map((d) => (
                  <div key={d.id} className="bg-white rounded-xl border p-6">
                    <div className="flex justify-between mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <button
                        onClick={() => delDept(d.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-lg">{d.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Head: {d.head}
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                      {[
                        { v: d.courses, l: 'Courses' },
                        { v: d.students, l: 'Students' },
                        { v: d.teachers, l: 'Teachers' },
                      ].map((x, i) => (
                        <div key={i} className="text-center">
                          <p className="font-bold">{x.v}</p>
                          <p className="text-xs text-slate-500">{x.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification */}
          {tab === 'verification' && (
            <div className="space-y-6">
              <SectionHeader title="Instructor Verification" />
              <div className="space-y-4">
                {data.verifs.map((v) => (
                  <div key={v.id} className="bg-white rounded-xl border p-6">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{v.name}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              v.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : v.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {v.status}
                          </span>
                        </div>
                        <p className="text-slate-600">
                          {v.email} • {v.dept}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          Qualifications: {v.quals} | Experience: {v.exp}
                        </p>
                      </div>

                      {v.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => verifyInstr(v.id, true)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Verify
                          </button>
                          <button
                            onClick={() => verifyInstr(v.id, false)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements */}
          {tab === 'announcements' && (
            <div className="space-y-6">
              <SectionHeader
                title="Announcements"
                actions={
                  <button
                    onClick={() => setModal('ann')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    New Announcement
                  </button>
                }
              />
              <div className="space-y-3">
                {data.anns.map((a) => (
                  <div
                    key={a.id}
                    className={`bg-white rounded-xl border p-6 ${
                      a.priority === 'high' ? 'border-red-300' : ''
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-lg">{a.title}</h3>
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            a.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {a.priority}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                          {a.target}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600">{a.msg}</p>
                    <p className="text-xs text-slate-400 mt-3">{a.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Semesters */}
          {tab === 'semesters' && (
            <div className="space-y-6">
              <SectionHeader
                title="Semester Management"
                actions={
                  <button
                    onClick={() => setModal('sem')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Semester
                  </button>
                }
              />
              <div className="space-y-4">
                {data.sems.map((s) => (
                  <div key={s.id} className="bg-white rounded-xl border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="font-bold text-lg">{s.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          s.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">
                          Semester Period
                        </p>
                        <p className="font-medium">
                          {s.start} to {s.end}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">
                          Registration Window
                        </p>
                        <p className="font-medium">
                          {s.regStart} to {s.regEnd}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System */}
          {tab === 'system' && (
            <div className="space-y-6">
              <SectionHeader title="System Performance" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { l: 'CPU', v: simMetrics.cpu, i: Cpu },
                  { l: 'Memory', v: simMetrics.mem, i: Database },
                  { l: 'Storage', v: simMetrics.storage, i: HardDrive },
                  { l: 'Uptime', v: simMetrics.uptime, i: Server, t: true },
                ].map((m, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border">
                    <div className="flex justify-between items-center mb-2">
                      <m.i className="w-6 h-6 text-indigo-600" />
                      <span className="text-xl font-bold">
                        {m.t ? m.v : `${m.v}%`}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{m.l}</p>
                    {!m.t && (
                      <div className="bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${m.v}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border">
                  <h3 className="font-semibold mb-4">User Growth (Logins)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={simMetrics.logins}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="d" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="v" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 border">
                  <h3 className="font-semibold mb-4">Storage Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Used', value: simMetrics.storage },
                          { name: 'Free', value: 100 - simMetrics.storage },
                        ]}
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                      >
                        <Cell fill="#6366f1" />
                        <Cell fill="#e5e7eb" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Reports */}
          {tab === 'reports' && (
            <div className="space-y-6">
              <SectionHeader
                title="Reports"
                actions={
                  <div className="flex gap-2">
                    <button
                      onClick={() => generateReports('courseStats')}
                      className="px-3 py-2 bg-indigo-600 text-white rounded"
                    >
                      Export Course CSV
                    </button>
                    <button
                      onClick={() => generateReports('userActivity')}
                      className="px-3 py-2 bg-indigo-600 text-white rounded"
                    >
                      Export User CSV
                    </button>
                    <button
                      onClick={() => generateReports('gradeDist')}
                      className="px-3 py-2 bg-indigo-600 text-white rounded"
                    >
                      Export Grade CSV
                    </button>
                  </div>
                }
              />
              <div className="bg-white rounded-xl p-6 border">
                <h3 className="font-semibold mb-4">Generated Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Students</p>
                    <p className="font-bold text-lg">
                      {reportsSummary.students}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Teachers</p>
                    <p className="font-bold text-lg">
                      {reportsSummary.teachers}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Pending Courses</p>
                    <p className="font-bold text-lg">
                      {reportsSummary.pendingCourses}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Approved Courses</p>
                    <p className="font-bold text-lg">
                      {reportsSummary.approved}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* -------------------------
          Modals (single-file)
          ------------------------- */}

      {/* Department Modal */}
      {modal === 'dept' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Create Department</h3>
              <button onClick={() => setModal(null)} className="p-2">
                <X />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  value={newDept.name}
                  onChange={(e) =>
                    setNewDept({ ...newDept, name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Head</label>
                <input
                  value={newDept.head}
                  onChange={(e) =>
                    setNewDept({ ...newDept, head: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={addDept}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {modal === 'ann' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">New Announcement</h3>
              <button onClick={() => setModal(null)} className="p-2">
                <X />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  value={newAnn.title}
                  onChange={(e) =>
                    setNewAnn({ ...newAnn, title: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  value={newAnn.msg}
                  onChange={(e) =>
                    setNewAnn({ ...newAnn, msg: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={newAnn.target}
                  onChange={(e) =>
                    setNewAnn({ ...newAnn, target: e.target.value })
                  }
                  className="border px-3 py-2 rounded"
                >
                  <option value="all">All</option>
                  <option value="students">Students</option>
                  <option value="teachers">Teachers</option>
                </select>
                <select
                  value={newAnn.priority}
                  onChange={(e) =>
                    setNewAnn({ ...newAnn, priority: e.target.value })
                  }
                  className="border px-3 py-2 rounded"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={addAnnouncement}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Semester Modal */}
      {modal === 'sem' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Create Semester</h3>
              <button onClick={() => setModal(null)} className="p-2">
                <X />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  value={newSem.name}
                  onChange={(e) =>
                    setNewSem({ ...newSem, name: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Start</label>
                  <input
                    type="date"
                    value={newSem.start}
                    onChange={(e) =>
                      setNewSem({ ...newSem, start: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End</label>
                  <input
                    type="date"
                    value={newSem.end}
                    onChange={(e) =>
                      setNewSem({ ...newSem, end: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Reg Start</label>
                  <input
                    type="date"
                    value={newSem.regStart}
                    onChange={(e) =>
                      setNewSem({ ...newSem, regStart: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reg End</label>
                  <input
                    type="date"
                    value={newSem.regEnd}
                    onChange={(e) =>
                      setNewSem({ ...newSem, regEnd: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={addSem}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Modal (for changing admin password) */}
      {showAdminPwdModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Change Admin Password</h3>
              <button
                onClick={() => setShowAdminPwdModal(false)}
                className="p-2"
              >
                <X />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <div className="relative">
                  <input
                    type={showAdminPw.current ? 'text' : 'password'}
                    value={adminPwdData.current}
                    onChange={(e) =>
                      setAdminPwdData({
                        ...adminPwdData,
                        current: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                  <button
                    onClick={() =>
                      setShowAdminPw({
                        ...showAdminPw,
                        current: !showAdminPw.current,
                      })
                    }
                    className="absolute right-2 top-2"
                  >
                    {showAdminPw.current ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">New Password</label>
                <div className="relative">
                  <input
                    type={showAdminPw.new ? 'text' : 'password'}
                    value={adminPwdData.new}
                    onChange={(e) =>
                      setAdminPwdData({ ...adminPwdData, new: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                  <button
                    onClick={() =>
                      setShowAdminPw({ ...showAdminPw, new: !showAdminPw.new })
                    }
                    className="absolute right-2 top-2"
                  >
                    {showAdminPw.new ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showAdminPw.confirm ? 'text' : 'password'}
                    value={adminPwdData.confirm}
                    onChange={(e) =>
                      setAdminPwdData({
                        ...adminPwdData,
                        confirm: e.target.value,
                      })
                    }
                    className="w-full border px-3 py-2 rounded"
                  />
                  <button
                    onClick={() =>
                      setShowAdminPw({
                        ...showAdminPw,
                        confirm: !showAdminPw.confirm,
                      })
                    }
                    className="absolute right-2 top-2"
                  >
                    {showAdminPw.confirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAdminPwdModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminPasswordChange}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating quick-message composer (sends to globalMessages) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setModal('compose')}
          className="bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2"
        >
          <Send className="w-4 h-4" /> Compose
        </button>
      </div>

      {modal === 'compose' && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Send Message</h3>
              <button onClick={() => setModal(null)} className="p-2">
                <X />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">
                  To (email or 'all')
                </label>
                <input
                  id="compose-to"
                  className="w-full border px-3 py-2 rounded"
                  placeholder="all or user@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <input
                  id="compose-subject"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  id="compose-body"
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModal(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const to =
                      document.getElementById('compose-to').value || 'all';
                    const subject =
                      document.getElementById('compose-subject').value ||
                      '(no subject)';
                    const body =
                      document.getElementById('compose-body').value || '';
                    sendGlobalMessage(to, subject, body);
                    setModal(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
