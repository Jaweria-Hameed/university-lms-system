import React, { useState, useEffect, useCallback } from 'react';
import {
  Book,
  Users,
  FileText,
  BarChart3,
  Calendar,
  Bell,
  Search,
  Settings,
  ChevronDown,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Send,
  Edit,
  Trash2,
  Download,
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

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState({});

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUser(current);
  }, []);
  const [showModal, setShowModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    avgCompletion: 0,
    pendingReviews: 0,
  });

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    course: '',
    dueDate: '',
    description: '',
  });

  const [newCourse, setNewCourse] = useState({
    name: '',
    students: 0,
    color: 'bg-blue-500',
  });

  const [messageData, setMessageData] = useState({
    recipient: '',
    subject: '',
    message: '',
  });

  const loadData = useCallback(async () => {
    try {
      const data = await getFromBackend('dashboard-data');

      if (data) {
        setCourses(data.courses || []);
        setAssignments(data.assignments || []);
        setStudents(data.students || []);
        setRecentActivity(data.recentActivity || []);
        setSchedule(data.schedule || []);
        setNotifications(data.notifications || []);
        calculateStats(data);
      } else {
        const defaultData = getDefaultData();
        await saveToBackend('dashboard-data', defaultData);
        setCourses(defaultData.courses);
        setAssignments(defaultData.assignments);
        setStudents(defaultData.students);
        setRecentActivity(defaultData.recentActivity);
        setSchedule(defaultData.schedule);
        setNotifications(defaultData.notifications);
        calculateStats(defaultData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      const defaultData = getDefaultData();
      setCourses(defaultData.courses);
      setAssignments(defaultData.assignments);
      setStudents(defaultData.students);
      setRecentActivity(defaultData.recentActivity);
      setSchedule(defaultData.schedule);
      setNotifications(defaultData.notifications);
      calculateStats(defaultData);
    }
  }, []);

  // Then:
  useEffect(() => {
    loadData();
  }, [loadData]); // Now ESLint is happy

  const getDefaultData = () => ({
    courses: [
      {
        id: 1,
        name: 'Advanced Mathematics',
        students: 32,
        completion: 78,
        color: 'bg-blue-500',
        assignments: 12,
      },
      {
        id: 2,
        name: 'Physics 101',
        students: 28,
        completion: 65,
        color: 'bg-purple-500',
        assignments: 8,
      },
      {
        id: 3,
        name: 'Chemistry Fundamentals',
        students: 24,
        completion: 82,
        color: 'bg-green-500',
        assignments: 10,
      },
    ],
    assignments: [
      {
        id: 1,
        title: 'Calculus Problem Set',
        course: 'Advanced Mathematics',
        dueDate: '2025-11-12',
        submissions: 28,
        total: 32,
      },
      {
        id: 2,
        title: "Newton's Laws Lab",
        course: 'Physics 101',
        dueDate: '2025-11-10',
        submissions: 24,
        total: 28,
      },
      {
        id: 3,
        title: 'Chemical Reactions Quiz',
        course: 'Chemistry Fundamentals',
        dueDate: '2025-11-15',
        submissions: 20,
        total: 24,
      },
    ],
    students: [
      {
        id: 1,
        name: 'Emma Wilson',
        email: 'emma.w@email.com',
        course: 'Advanced Mathematics',
        grade: 92,
        avatar: '1',
      },
      {
        id: 2,
        name: 'James Chen',
        email: 'james.c@email.com',
        course: 'Physics 101',
        grade: 85,
        avatar: '2',
      },
      {
        id: 3,
        name: 'Sofia Rodriguez',
        email: 'sofia.r@email.com',
        course: 'Chemistry Fundamentals',
        grade: 98,
        avatar: '3',
      },
      {
        id: 4,
        name: 'Marcus Johnson',
        email: 'marcus.j@email.com',
        course: 'Advanced Mathematics',
        grade: 88,
        avatar: '4',
      },
      {
        id: 5,
        name: 'Olivia Brown',
        email: 'olivia.b@email.com',
        course: 'Physics 101',
        grade: 91,
        avatar: '5',
      },
      {
        id: 6,
        name: 'Liam Davis',
        email: 'liam.d@email.com',
        course: 'Chemistry Fundamentals',
        grade: 87,
        avatar: '6',
      },
    ],
    recentActivity: [
      {
        id: 1,
        student: 'Emma Wilson',
        action: 'Submitted assignment',
        course: 'Advanced Mathematics',
        time: '2 hours ago',
        type: 'success',
      },
      {
        id: 2,
        student: 'James Chen',
        action: 'Missed deadline',
        course: 'Physics 101',
        time: '3 hours ago',
        type: 'warning',
      },
      {
        id: 3,
        student: 'Sofia Rodriguez',
        action: 'Achieved 100% on quiz',
        course: 'Chemistry Fundamentals',
        time: '5 hours ago',
        type: 'success',
      },
      {
        id: 4,
        student: 'Marcus Johnson',
        action: 'Requested help',
        course: 'Advanced Mathematics',
        time: '1 day ago',
        type: 'info',
      },
    ],
    schedule: [
      {
        id: 1,
        course: 'Advanced Mathematics',
        time: '9:00 AM',
        room: 'Room 204',
        students: 32,
      },
      {
        id: 2,
        course: 'Physics 101',
        time: '11:30 AM',
        room: 'Lab 3',
        students: 28,
      },
      {
        id: 3,
        course: 'Chemistry Fundamentals',
        time: '2:00 PM',
        room: 'Room 105',
        students: 24,
      },
    ],
    notifications: [
      {
        id: 1,
        text: 'Emma Wilson submitted assignment',
        time: '2h ago',
        read: false,
      },
      {
        id: 2,
        text: 'New enrollment in Physics 101',
        time: '5h ago',
        read: false,
      },
      { id: 3, text: 'James Chen requested help', time: '1d ago', read: true },
    ],
  });

  const getFromBackend = async (key) => {
    try {
      const result = await window.storage.get(key);
      return result ? JSON.parse(result.value) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  };

  const saveToBackend = async (key, data) => {
    try {
      await window.storage.set(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  const updateBackend = useCallback(async () => {
    const data = {
      courses,
      assignments,
      students,
      recentActivity,
      schedule,
      notifications,
    };
    await saveToBackend('dashboard-data', data);
  }, [courses, assignments, students, recentActivity, schedule, notifications]);

  useEffect(() => {
    if (courses.length > 0) {
      updateBackend();
      calculateStats({ courses, assignments, students });
    }
  }, [updateBackend, courses, assignments, students]);

  const calculateStats = (data) => {
    const totalStudents = data.students?.length || 0;
    const activeCourses = data.courses?.length || 0;
    const avgCompletion =
      data.courses?.length > 0
        ? Math.round(
            data.courses.reduce((acc, c) => acc + c.completion, 0) /
              data.courses.length
          )
        : 0;
    const pendingReviews =
      data.assignments?.reduce(
        (acc, a) => acc + (a.total - a.submissions),
        0
      ) || 0;

    setStats({ totalStudents, activeCourses, avgCompletion, pendingReviews });
  };

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.course && newAssignment.dueDate) {
      const courseData = courses.find((c) => c.name === newAssignment.course);
      const newA = {
        id: Date.now(),
        title: newAssignment.title,
        course: newAssignment.course,
        dueDate: newAssignment.dueDate,
        submissions: 0,
        total: courseData ? courseData.students : 0,
      };
      setAssignments([...assignments, newA]);
      setNewAssignment({ title: '', course: '', dueDate: '', description: '' });
      setShowModal(null);
      addActivity(
        'You created new assignment: ' + newAssignment.title,
        newAssignment.course,
        'info'
      );
      addNotification('New assignment created: ' + newAssignment.title);
    }
  };

  const handleCreateCourse = () => {
    if (newCourse.name) {
      const colors = [
        'bg-blue-500',
        'bg-purple-500',
        'bg-green-500',
        'bg-red-500',
        'bg-yellow-500',
        'bg-pink-500',
      ];
      const newC = {
        id: Date.now(),
        name: newCourse.name,
        students: parseInt(newCourse.students) || 0,
        completion: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        assignments: 0,
      };
      setCourses([...courses, newC]);
      setNewCourse({ name: '', students: 0, color: 'bg-blue-500' });
      setShowModal(null);
      addActivity(
        'You created new course: ' + newCourse.name,
        newCourse.name,
        'info'
      );
      addNotification('New course created: ' + newCourse.name);
    }
  };

  const handleDeleteAssignment = (id) => {
    const assignment = assignments.find((a) => a.id === id);
    setAssignments(assignments.filter((a) => a.id !== id));
    if (assignment) {
      addActivity(
        'You deleted assignment: ' + assignment.title,
        assignment.course,
        'warning'
      );
    }
  };

  const handleDeleteCourse = (id) => {
    const course = courses.find((c) => c.id === id);
    setCourses(courses.filter((c) => c.id !== id));
    if (course) {
      setAssignments(assignments.filter((a) => a.course !== course.name));
      addActivity('You deleted course: ' + course.name, '', 'warning');
    }
  };

  const handleSendMessage = () => {
    if (messageData.recipient && messageData.message) {
      addActivity('Sent message to ' + messageData.recipient, '', 'info');
      addNotification('Message sent to ' + messageData.recipient);
      setMessageData({ recipient: '', subject: '', message: '' });
      setShowModal(null);
    }
  };

  const addActivity = (action, course, type) => {
    const newActivity = {
      id: Date.now(),
      student: 'You',
      action,
      course,
      time: 'Just now',
      type,
    };
    setRecentActivity([newActivity, ...recentActivity]);
  };

  const addNotification = (text) => {
    const newNotif = {
      id: Date.now(),
      text,
      time: 'Just now',
      read: false,
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleScheduleClass = () => {
    if (newAssignment.course && newAssignment.dueDate) {
      const newClass = {
        id: Date.now(),
        course: newAssignment.course,
        time: newAssignment.dueDate,
        room: 'TBA',
        students:
          courses.find((c) => c.name === newAssignment.course)?.students || 0,
      };
      setSchedule([...schedule, newClass]);
      setNewAssignment({ title: '', course: '', dueDate: '', description: '' });
      setShowModal(null);
      addActivity(
        'Scheduled new class: ' + newAssignment.course,
        newAssignment.course,
        'info'
      );
      addNotification('Class scheduled: ' + newAssignment.course);
    }
  };

  /*
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);
  */
  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const coursePerformanceData = courses.map((c) => ({
    name: c.name.split(' ')[0],
    completion: c.completion,
    students: c.students,
  }));

  const gradeDistributionData = [
    {
      name: 'A (90-100)',
      value: students.filter((s) => s.grade >= 90).length,
      color: '#10b981',
    },
    {
      name: 'B (80-89)',
      value: students.filter((s) => s.grade >= 80 && s.grade < 90).length,
      color: '#3b82f6',
    },
    {
      name: 'C (70-79)',
      value: students.filter((s) => s.grade >= 70 && s.grade < 80).length,
      color: '#f59e0b',
    },
    {
      name: 'D (60-69)',
      value: students.filter((s) => s.grade >= 60 && s.grade < 70).length,
      color: '#ef4444',
    },
    {
      name: 'F (<60)',
      value: students.filter((s) => s.grade < 60).length,
      color: '#dc2626',
    },
  ].filter((d) => d.value > 0);

  const weeklyActivityData = [
    { day: 'Mon', submissions: 12, assignments: 3 },
    { day: 'Tue', submissions: 19, assignments: 5 },
    { day: 'Wed', submissions: 15, assignments: 2 },
    { day: 'Thu', submissions: 22, assignments: 6 },
    { day: 'Fri', submissions: 18, assignments: 4 },
    { day: 'Sat', submissions: 8, assignments: 1 },
    { day: 'Sun', submissions: 5, assignments: 0 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">My Courses</h2>
              <button
                onClick={() => setShowModal('createCourse')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>New Course</span>
              </button>
            </div>
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 ${course.color} rounded-lg flex items-center justify-center`}
                    >
                      <Book className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">
                        {course.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {course.students} students • {course.assignments}{' '}
                        assignments
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition">
                      Manage
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Avg. Completion</span>
                    <span className="font-semibold text-slate-800">
                      {course.completion}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`${course.color} h-2 rounded-full transition-all`}
                      style={{ width: `${course.completion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'students':
        return (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Students</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={`https://i.pravatar.cc/100?img=${student.avatar}`}
                            alt={student.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-slate-800">
                              {student.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {student.course}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            student.grade >= 90
                              ? 'bg-green-100 text-green-700'
                              : student.grade >= 80
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {student.grade}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setMessageData({
                              ...messageData,
                              recipient: student.name,
                            });
                            setShowModal('message');
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'assignments':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Assignments</h2>
              <button
                onClick={() => setShowModal('createAssignment')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create Assignment</span>
              </button>
            </div>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-lg mb-1">
                        {assignment.title}
                      </h3>
                      <p className="text-sm text-slate-500 mb-3">
                        {assignment.course}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-slate-600">
                          Due: {assignment.dueDate}
                        </span>
                        <span className="text-slate-600">
                          Submissions: {assignment.submissions}/
                          {assignment.total}
                        </span>
                        <div className="flex-1 max-w-xs">
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  (assignment.submissions / assignment.total) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Schedule</h2>
              <button
                onClick={() => setShowModal('scheduleClass')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Class</span>
              </button>
            </div>
            <div className="space-y-4">
              {schedule.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 text-lg">
                          {cls.course}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {cls.room} • {cls.students} students
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {cls.time}
                      </p>
                      <p className="text-sm text-slate-500">Today</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: 'Total Students',
                  value: stats.totalStudents,
                  change: '+12%',
                  icon: Users,
                  color: 'blue',
                },
                {
                  label: 'Active Courses',
                  value: stats.activeCourses,
                  change: '+1',
                  icon: Book,
                  color: 'purple',
                },
                {
                  label: 'Avg. Completion',
                  value: `${stats.avgCompletion}%`,
                  change: '+5%',
                  icon: TrendingUp,
                  color: 'green',
                },
                {
                  label: 'Pending Reviews',
                  value: stats.pendingReviews,
                  change: '-3',
                  icon: FileText,
                  color: 'orange',
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    Weekly Activity
                  </h2>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                    <Download className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="submissions"
                      fill="#3b82f6"
                      name="Submissions"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="assignments"
                      fill="#8b5cf6"
                      name="New Assignments"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                  Grade Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">
                    Course Performance
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={coursePerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="completion"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="Completion %"
                      />
                      <Line
                        type="monotone"
                        dataKey="students"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Students"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">
                    Recent Activity
                  </h2>
                  <div className="space-y-3">
                    {recentActivity.slice(0, 5).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'success'
                              ? 'bg-green-100'
                              : activity.type === 'warning'
                              ? 'bg-orange-100'
                              : 'bg-blue-100'
                          }`}
                        >
                          {activity.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : activity.type === 'warning' ? (
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">
                            {activity.student}
                          </p>
                          <p className="text-sm text-slate-600">
                            {activity.action}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {activity.course} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">
                    Today's Schedule
                  </h2>
                  <div className="space-y-3">
                    {schedule.map((cls) => (
                      <div
                        key={cls.id}
                        className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-slate-800 text-sm">
                            {cls.course}
                          </p>
                          <span className="text-xs font-medium text-blue-600">
                            {cls.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {cls.room} • {cls.students} students
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                  <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowModal('createAssignment')}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg px-4 py-3 text-left text-sm font-medium transition"
                    >
                      Create Assignment
                    </button>
                    <button
                      onClick={() => setShowModal('scheduleClass')}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg px-4 py-3 text-left text-sm font-medium transition"
                    >
                      Schedule Class
                    </button>
                    <button
                      onClick={() => setShowModal('message')}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg px-4 py-3 text-left text-sm font-medium transition"
                    >
                      Message Students
                    </button>
                    <button
                      onClick={() => setActiveTab('assignments')}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg px-4 py-3 text-left text-sm font-medium transition"
                    >
                      View Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">EduPro LMS</h1>
              <p className="text-xs text-slate-500">Teacher Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* USER MENU — ADD THIS */}
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <span className="text-sm text-slate-700">
                Hello, <strong>{user?.username || 'Teacher'}</strong>
              </span>

              <button
                onClick={() => {
                  const newPass = prompt('Enter new password:');
                  if (newPass) {
                    const users = JSON.parse(
                      localStorage.getItem('users') || '[]'
                    );
                    const updated = users.map((u) =>
                      u.username === user.username
                        ? { ...u, password: newPass }
                        : u
                    );
                    localStorage.setItem('users', JSON.stringify(updated));
                    alert('Password changed!');
                  }
                }}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Change Password
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('currentUser');
                  localStorage.removeItem('loginTime');
                  window.location.href = '/';
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen p-6">
          <nav className="space-y-2">
            {[
              { icon: BarChart3, label: 'Overview', id: 'overview' },
              { icon: Book, label: 'My Courses', id: 'courses' },
              { icon: Users, label: 'Students', id: 'students' },
              { icon: FileText, label: 'Assignments', id: 'assignments' },
              { icon: Calendar, label: 'Schedule', id: 'schedule' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">{renderTabContent()}</main>
      </div>

      {showModal === 'createAssignment' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                Create Assignment
              </h3>
              <button
                onClick={() => setShowModal(null)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Course
                </label>
                <select
                  value={newAssignment.course}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      course: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      dueDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Assignment description..."
                />
              </div>
              <button
                onClick={handleCreateAssignment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'createCourse' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                Create Course
              </h3>
              <button
                onClick={() => setShowModal(null)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Introduction to Biology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Number of Students
                </label>
                <input
                  type="number"
                  value={newCourse.students}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, students: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <button
                onClick={handleCreateCourse}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'message' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Send Message</h3>
              <button
                onClick={() => setShowModal(null)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  To
                </label>
                <select
                  value={messageData.recipient}
                  onChange={(e) =>
                    setMessageData({
                      ...messageData,
                      recipient: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select recipient</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={messageData.subject}
                  onChange={(e) =>
                    setMessageData({ ...messageData, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Message subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message
                </label>
                <textarea
                  value={messageData.message}
                  onChange={(e) =>
                    setMessageData({ ...messageData, message: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Type your message..."
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'scheduleClass' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                Schedule Class
              </h3>
              <button
                onClick={() => setShowModal(null)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Course
                </label>
                <select
                  value={newAssignment.course}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      course: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={newAssignment.dueDate}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      dueDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleScheduleClass}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Schedule Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
