import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Bell,
  Search,
  Settings,
  ChevronDown,
  Trophy,
  Flame,
  Star,
  Upload,
  Download,
  PlayCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Send,
  Edit,
  Trash2,
  Camera,
  Award,
  TrendingUp,
  User,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  BarChart3,
  GraduationCap,
  Video,
  FileDown,
  ThumbsUp,
  ThumbsDown,
  Filter,
  ChevronRight,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { format, addDays, isToday, isBefore, startOfWeek } from 'date-fns';

const PREDEFINED_USERS = [
  {
    username: 'student1',
    password: '123',
    name: 'Alex Chen',
    dataKey: 'student-data-student1',
  },
  {
    username: 'student2',
    password: '456',
    name: 'Sarah Kim',
    dataKey: 'student-data-student2',
  },
  {
    username: 'student3',
    password: '789',
    name: 'Mike Johnson',
    dataKey: 'student-data-student3',
  },
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [badges, setBadges] = useState([]);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [recordedLectures, setRecordedLectures] = useState([]);
  const [resources, setResources] = useState([]);
  const [reviews, setReviews] = useState([]);
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
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    body: '',
  });

  /*
  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (current.role !== 'student') {
      window.location.href = '/';
      return;
    }
    setUser(current);
    loadStudentData();
  }, []);
  */
  useEffect(() => {
    const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (current.role !== 'student') {
      window.location.href = '/';
      return;
    }

    // ---- NEW: find the data-key for this user -----------------
    const userInfo = PREDEFINED_USERS.find(
      (u) => u.username === current.username
    );
    const dataKey = userInfo?.dataKey || 'student-dashboard-data'; // fallback

    setUser(current);
    loadStudentData(dataKey); // <-- pass the key
  }, []);

  const loadStudentData = useCallback(
    async (dataKey = 'student-dashboard-data') => {
      try {
        const data = await getFromStorage(dataKey);
        if (data && data.userId === user.id) {
          setEnrolledCourses(data.enrolledCourses || []);
          setAssignments(data.assignments || []);
          setSubmissions(data.submissions || []);
          setGrades(data.grades || []);
          setAttendance(data.attendance || []);
          setCalendarEvents(data.calendarEvents || []);
          setNotifications(data.notifications || []);
          setMessages(data.messages || []);
          setBadges(data.badges || []);
          setStreak(data.streak || 0);
          setPoints(data.points || 0);
          setLeaderboard(data.leaderboard || []);
          setRecordedLectures(data.recordedLectures || []);
          setResources(data.resources || []);
          setReviews(data.reviews || []);
        } else {
          const defaultData = generateDefaultStudentData();
          await saveToStorage(dataKey, { ...defaultData, userId: user.id });
          initializeStudentData(defaultData);
        }
      } catch (err) {
        const defaultData = generateDefaultStudentData();
        await saveToStorage(dataKey, { ...defaultData, userId: user.id });
        initializeStudentData(defaultData);
      }
    },
    [user.id]
  );
  /*
  const loadStudentData = useCallback(async () => {
    try {
      const data = await getFromStorage('student-dashboard-data');
      if (data && data.userId === user.id) {
        setEnrolledCourses(data.enrolledCourses || []);
        setAssignments(data.assignments || []);
        setSubmissions(data.submissions || []);
        setGrades(data.grades || []);
        setAttendance(data.attendance || []);
        setCalendarEvents(data.calendarEvents || []);
        setNotifications(data.notifications || []);
        setMessages(data.messages || []);
        setBadges(data.badges || []);
        setStreak(data.streak || 0);
        setPoints(data.points || 0);
        setLeaderboard(data.leaderboard || []);
        setRecordedLectures(data.recordedLectures || []);
        setResources(data.resources || []);
        setReviews(data.reviews || []);
      } else {
        const defaultData = generateDefaultStudentData();
        await saveToStorage('student-dashboard-data', {
          ...defaultData,
          userId: user.id,
        });
        initializeStudentData(defaultData);
      }
    } catch (err) {
      const defaultData = generateDefaultStudentData();
      await saveToStorage('student-dashboard-data', {
        ...defaultData,
        userId: user.id,
      });
      initializeStudentData(defaultData);
    }
  }, [user.id]);
  */
  const initializeStudentData = (data) => {
    setEnrolledCourses(data.enrolledCourses);
    setAssignments(data.assignments);
    setSubmissions(data.submissions);
    setGrades(data.grades);
    setAttendance(data.attendance);
    setCalendarEvents(data.calendarEvents);
    setNotifications(data.notifications);
    setMessages(data.messages);
    setBadges(data.badges);
    setStreak(data.streak);
    setPoints(data.points);
    setLeaderboard(data.leaderboard);
    setRecordedLectures(data.recordedLectures);
    setResources(data.resources);
    setReviews(data.reviews);
  };

  const generateDefaultStudentData = () => ({
    userId: user.id,
    enrolledCourses: [
      {
        id: 1,
        name: 'Advanced Mathematics',
        progress: 68,
        instructor: 'Dr. Smith',
        color: 'bg-blue-500',
        rating: 4.5,
      },
      {
        id: 2,
        name: 'Physics 101',
        progress: 82,
        instructor: 'Prof. Johnson',
        color: 'bg-purple-500',
        rating: 4.8,
      },
      {
        id: 3,
        name: 'Web Development',
        progress: 45,
        instructor: 'Ms. Lee',
        color: 'bg-green-500',
        rating: 4.9,
      },
    ],
    assignments: [
      {
        id: 1,
        title: 'Calculus Final Project',
        courseId: 1,
        dueDate: '2025-11-15',
        status: 'pending',
        file: null,
      },
      {
        id: 2,
        title: 'Physics Lab Report',
        courseId: 2,
        dueDate: '2025-11-10',
        status: 'submitted',
        file: 'lab_report.pdf',
        grade: 88,
      },
      {
        id: 3,
        title: 'React Portfolio',
        courseId: 3,
        dueDate: '2025-11-20',
        status: 'not-started',
        file: null,
      },
    ],
    submissions: [],
    grades: [
      { courseId: 1, grade: 85, total: 100 },
      { courseId: 2, grade: 92, total: 100 },
      { courseId: 3, grade: 78, total: 100 },
    ],
    attendance: [
      { date: '2025-11-08', courseId: 1, present: true },
      { date: '2025-11-07', courseId: 2, present: true },
      { date: '2025-11-06', courseId: 1, present: false },
    ],
    calendarEvents: [
      {
        id: 1,
        title: 'Math Quiz',
        date: '2025-11-12',
        type: 'quiz',
        courseId: 1,
      },
      {
        id: 2,
        title: 'Physics Midterm',
        date: '2025-11-18',
        type: 'exam',
        courseId: 2,
      },
      {
        id: 3,
        title: 'Project Demo',
        date: '2025-11-25',
        type: 'presentation',
        courseId: 3,
      },
    ],
    notifications: [
      {
        id: 1,
        text: 'New assignment posted in Physics 101',
        time: '2h ago',
        read: false,
        type: 'assignment',
      },
      {
        id: 2,
        text: 'Grade released: 88% on Lab Report',
        time: '5h ago',
        read: false,
        type: 'grade',
      },
      {
        id: 3,
        text: 'Lecture recording available',
        time: '1d ago',
        read: true,
        type: 'video',
      },
    ],
    messages: [
      {
        id: 1,
        from: 'Dr. Smith',
        subject: 'Office Hours',
        body: 'Available tomorrow 2-4pm. Let me know if you have questions.',
        time: '2h ago',
        read: false,
      },
      {
        id: 2,
        from: 'Prof. Johnson',
        subject: 'Question about Lab',
        body: 'Yes, you can use the alternative method for calculation.',
        time: '1d ago',
        read: true,
      },
      {
        id: 3,
        from: 'Ms. Lee',
        subject: 'Project Feedback',
        body: 'Great start on your React app! Consider adding state management.',
        time: '2d ago',
        read: true,
      },
    ],
    badges: [
      {
        id: 1,
        name: 'Early Bird',
        icon: '🕊️',
        desc: 'Submitted 5 assignments early',
      },
      { id: 2, name: 'Quiz Master', icon: '🏆', desc: '100% on 3 quizzes' },
      { id: 3, name: 'Perfect Week', icon: '🔥', desc: '7-day streak' },
    ],
    streak: 7,
    points: 2450,
    leaderboard: [
      { rank: 1, name: 'Emma Wilson', points: 3200, avatar: '1' },
      { rank: 2, name: 'You', points: 2450, avatar: user.avatar || '2' },
      { rank: 3, name: 'James Chen', points: 2300, avatar: '3' },
    ],
    recordedLectures: [
      {
        id: 1,
        title: 'Week 5: Derivatives',
        courseId: 1,
        duration: '1h 20m',
        date: '2025-11-05',
      },
      {
        id: 2,
        title: "Newton's Laws Deep Dive",
        courseId: 2,
        duration: '58m',
        date: '2025-11-03',
      },
      {
        id: 3,
        title: 'React Hooks Introduction',
        courseId: 3,
        duration: '45m',
        date: '2025-11-01',
      },
    ],
    resources: [
      {
        id: 1,
        title: 'Math Formula Sheet',
        type: 'pdf',
        size: '2.1 MB',
        courseId: 1,
      },
      {
        id: 2,
        title: 'Physics Cheat Sheet',
        type: 'pdf',
        size: '1.8 MB',
        courseId: 2,
      },
      {
        id: 3,
        title: 'React Documentation',
        type: 'link',
        url: 'https://react.dev',
        courseId: 3,
      },
    ],
    reviews: [],
  });

  const getFromStorage = async (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      return null;
    }
  };

  const saveToStorage = async (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  /*

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      saveToStorage('student-dashboard-data', {
        userId: user.id,
        enrolledCourses,
        assignments,
        submissions,
        grades,
        attendance,
        calendarEvents,
        notifications,
        messages,
        badges,
        streak,
        points,
        leaderboard,
        recordedLectures,
        resources,
        reviews,
      });
    }
  }, [
    enrolledCourses,
    assignments,
    submissions,
    grades,
    attendance,
    calendarEvents,
    notifications,
    messages,
    badges,
    streak,
    points,
    leaderboard,
    recordedLectures,
    resources,
    reviews,
    user.id,
  ]);
  */
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      const current = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userInfo = PREDEFINED_USERS.find(
        (u) => u.username === current.username
      );
      const dataKey = userInfo?.dataKey || 'student-dashboard-data';

      saveToStorage(dataKey, {
        userId: user.id,
        enrolledCourses,
        assignments,
        submissions,
        grades,
        attendance,
        calendarEvents,
        notifications,
        messages,
        badges,
        streak,
        points,
        leaderboard,
        recordedLectures,
        resources,
        reviews,
      });
    }
  }, [
    enrolledCourses,
    assignments,
    submissions,
    grades,
    attendance,
    calendarEvents,
    notifications,
    messages,
    badges,
    streak,
    points,
    leaderboard,
    recordedLectures,
    resources,
    reviews,
    user.id,
  ]);
  // Recommended Courses (Story #1)
  useEffect(() => {
    const allCourses = [
      {
        id: 4,
        name: 'Data Science Fundamentals',
        instructor: 'Dr. Patel',
        students: 45,
        rating: 4.9,
        level: 'Intermediate',
        tags: ['Python', 'ML'],
      },
      {
        id: 5,
        name: 'UI/UX Design',
        instructor: 'Sarah Kim',
        students: 38,
        rating: 4.7,
        level: 'Beginner',
        tags: ['Figma', 'Design'],
      },
      {
        id: 6,
        name: 'Machine Learning',
        instructor: 'Prof. Garcia',
        students: 29,
        rating: 5.0,
        level: 'Advanced',
        tags: ['Python', 'TensorFlow'],
      },
    ];
    setAvailableCourses(allCourses);
  }, []);

  const enrollInCourse = (course) => {
    const newCourse = {
      id: course.id,
      name: course.name,
      progress: 0,
      instructor: course.instructor,
      color: ['bg-red-500', 'bg-yellow-500', 'bg-pink-500'][
        Math.floor(Math.random() * 3)
      ],
      rating: course.rating,
    };
    setEnrolledCourses([...enrolledCourses, newCourse]);
    addNotification(
      `Enrolled in ${course.name}! Welcome aboard!`,
      'enrollment'
    );
    setPoints(points + 100);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSubmissionFile({ name: file.name, data: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };
  /*

  const submitAssignment = (assignmentId) => {
    if (!submissionFile) {
      alert('Please select a file to submit.');
      return;
    }
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      setAssignments(
        assignments.map((a) =>
          a.id === assignmentId
            ? { ...a, status: 'submitted', file: submissionFile.name }
            : a
        )
      );
      setSubmissions([
        ...submissions,
        {
          assignmentId,
          date: new Date().toISOString(),
          file: submissionFile.name,
          data: submissionFile.data,
        },
      ]);
      addNotification(
        `Assignment "${assignment.title}" submitted successfully with file ${submissionFile.name}!`,
        'submission'
      );
      setPoints(points + 50);
      setStreak(streak + 1);
      setSubmissionFile(null);
      setShowModal(null);
    }
  };
*/
  const submitAssignment = (assignmentId) => {
    if (!submissionFile) {
      alert('Please select a file to submit.');
      return;
    }

    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) return;

    const submission = {
      id: Date.now(),
      assignmentId,
      assignmentTitle: assignment.title,
      courseId: assignment.courseId,
      studentId: user.username, // e.g., student1
      studentName:
        PREDEFINED_USERS.find((u) => u.username === user.username)?.name ||
        user.username,
      date: new Date().toISOString(),
      file: submissionFile.name,
      grade: null,
      feedback: '',
    };

    // 1. Update local student data
    setSubmissions((prev) => [...prev, submission]);
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, status: 'submitted', file: submissionFile.name }
          : a
      )
    );

    // 2. PUSH TO GLOBAL SUBMISSIONS
    const globalSubs = JSON.parse(
      localStorage.getItem('globalSubmissions') || '[]'
    );
    globalSubs.push(submission);
    localStorage.setItem('globalSubmissions', JSON.stringify(globalSubs));

    addNotification(`Submitted: ${assignment.title}`, 'submission');
    setSubmissionFile(null);
    setShowModal(null);
  };
  const continueLearning = (courseId) => {
    const course = enrolledCourses.find((c) => c.id === courseId);
    if (course) {
      addNotification(
        `Continuing learning in ${course.name}. Progress updated!`,
        'learning'
      );
      setEnrolledCourses(
        enrolledCourses.map((c) =>
          c.id === courseId
            ? { ...c, progress: Math.min(100, c.progress + 10) }
            : c
        )
      );
    }
  };

  const watchLecture = (lecture) => {
    const query = encodeURIComponent(`${lecture.title} lecture tutorial`);
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      '_blank'
    );
    addNotification(
      `Watching lecture: ${lecture.title}. Redirected to YouTube.`,
      'video'
    );
  };

  const addNotification = (text, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      text,
      time: 'Just now',
      read: false,
      type,
    };
    setNotifications([newNotif, ...notifications]);
  };

  const markNotificationRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = users.map((u) =>
      u.id === user.id ? { ...u, password: passwordData.new } : u
    );
    localStorage.setItem('users', JSON.stringify(updated));
    setUser({ ...user, password: passwordData.new });
    alert('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({ current: '', new: '', confirm: '' });
    addNotification('Password changed successfully.', 'security');
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
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const updatedUsers = users.map((u) =>
            u.id === user.id ? updatedUser : u
          );
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          addNotification('Profile picture updated successfully.', 'profile');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  /*
  const sendMessage = () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.body) {
      alert('Please fill all fields.');
      return;
    }
    const newMsg = {
      id: Date.now(),
      from: 'You',
      to: newMessage.to,
      subject: newMessage.subject,
      body: newMessage.body,
      time: 'Just now',
      read: true,
    };
    setMessages([...messages, newMsg]);
    addNotification(
      `Message sent to ${newMessage.to}: ${newMessage.subject}`,
      'message'
    );
    setNewMessage({ to: '', subject: '', body: '' });
    setShowModal(null);
  };
  */
  const sendMessage = () => {
    if (!newMessage.to || !newMessage.subject || !newMessage.body) {
      alert('Please fill all fields.');
      return;
    }

    const message = {
      id: Date.now(),
      from: user.username,
      fromName:
        PREDEFINED_USERS.find((u) => u.username === user.username)?.name ||
        user.username,
      to: newMessage.to,
      subject: newMessage.subject,
      body: newMessage.body,
      time: new Date().toISOString(),
      read: false,
    };

    // 1. Save locally
    setMessages((prev) => [...prev, { ...message, read: true }]);

    // 2. SAVE TO GLOBAL INBOX
    const globalInbox = JSON.parse(
      localStorage.getItem('globalMessages') || '[]'
    );
    globalInbox.push(message);
    localStorage.setItem('globalMessages', JSON.stringify(globalInbox));

    addNotification(`Message sent to ${newMessage.to}`, 'message');
    setNewMessage({ to: '', subject: '', body: '' });
    setShowModal(null);
  };
  const progressData = enrolledCourses.map((c) => ({
    name: c.name.split(' ')[0],
    progress: c.progress,
  }));

  const upcomingEvents = calendarEvents
    .filter((e) => isBefore(new Date(e.date), addDays(new Date(), 7)))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'courses':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                My Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-14 h-14 ${course.color} rounded-xl flex items-center justify-center`}
                      >
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">
                          {course.rating}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">
                      {course.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Instructor: {course.instructor}
                    </p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-semibold">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div
                            className={`${course.color.replace(
                              '500',
                              '600'
                            )} h-3 rounded-full transition-all`}
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <button
                        onClick={() => continueLearning(course.id)}
                        className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition font-medium"
                      >
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Recommended For You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCourses
                  .filter((c) => !enrolledCourses.find((ec) => ec.id === c.id))
                  .map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {course.level}
                        </span>
                        <span className="text-sm text-slate-600">
                          {course.students} students
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 mb-2">
                        {course.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        by {course.instructor}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => enrollInCourse(course)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium"
                      >
                        Enroll Now
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Assignments
            </h2>
            {assignments.map((assignment) => {
              const course = enrolledCourses.find(
                (c) => c.id === assignment.courseId
              );
              const submitted = assignment.status === 'submitted';
              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            submitted ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                        ></div>
                        <h3 className="font-semibold text-lg text-slate-800">
                          {assignment.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">
                        {course?.name} • Due:{' '}
                        {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                      </p>
                      {submitted && assignment.grade && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                            Grade: {assignment.grade}%
                          </span>
                          {assignment.file && (
                            <a
                              href="#"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              View Feedback
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      {submitted ? (
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                          Submitted
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowModal('submitAssignment');
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition flex items-center space-x-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Submit Now</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Academic Calendar
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="grid grid-cols-7 gap-4 mb-6">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-slate-600"
                    >
                      {day}
                    </div>
                  )
                )}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = addDays(startOfWeek(new Date()), i);
                  const dayEvents = calendarEvents.filter(
                    (e) =>
                      format(new Date(e.date), 'yyyy-MM-dd') ===
                      format(date, 'yyyy-MM-dd')
                  );
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg border ${
                        isToday(date)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200'
                      } p-2 hover:bg-slate-50 transition cursor-pointer`}
                    >
                      <div className="text-sm font-medium">
                        {format(date, 'd')}
                      </div>
                      {dayEvents.map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-xs mt-1 px-1 py-0.5 rounded ${
                            event.type === 'quiz'
                              ? 'bg-yellow-200'
                              : event.type === 'exam'
                              ? 'bg-red-200'
                              : 'bg-green-200'
                          }`}
                        >
                          {event.title.substring(0, 10)}...
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'gamification':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white">
                <Flame className="w-12 h-12 mb-4" />
                <h3 className="text-4xl font-bold mb-2">{streak}</h3>
                <p className="text-orange-100">Day Streak</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <Trophy className="w-12 h-12 mb-4" />
                <h3 className="text-4xl font-bold mb-2">
                  {points.toLocaleString()}
                </h3>
                <p className="text-blue-100">Total Points</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
                <Award className="w-12 h-12 mb-4" />
                <h3 className="text-4xl font-bold mb-2">{badges.length}</h3>
                <p className="text-green-100">Badges Earned</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Your Badges
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-lg transition"
                  >
                    <div className="text-4xl mb-3">{badge.icon}</div>
                    <h4 className="font-semibold text-slate-800">
                      {badge.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-2">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Leaderboard
              </h3>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                {leaderboard.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 ${
                      entry.name === 'You' ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                          idx === 0
                            ? 'bg-yellow-500'
                            : idx === 1
                            ? 'bg-slate-400'
                            : idx === 2
                            ? 'bg-orange-600'
                            : 'bg-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <img
                        src={`https://i.pravatar.cc/100?img=${entry.avatar}`}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{entry.name}</p>
                        <p className="text-sm text-slate-600">
                          {entry.points.toLocaleString()} pts
                        </p>
                      </div>
                    </div>
                    {entry.name === 'You' && (
                      <span className="text-blue-600 font-medium">You</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'lectures':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Recorded Lectures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordedLectures.map((lec) => {
                const course = enrolledCourses.find(
                  (c) => c.id === lec.courseId
                );
                return (
                  <div
                    key={lec.id}
                    className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <PlayCircle className="w-12 h-12 text-blue-600" />
                      <span className="text-sm text-slate-600">
                        {lec.duration}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">
                      {lec.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {course?.name} •{' '}
                      {format(new Date(lec.date), 'MMM dd, yyyy')}
                    </p>
                    <button
                      onClick={() => watchLecture(lec)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Watch Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">Messages</h2>
              <button
                onClick={() => setShowModal('composeMessage')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Compose</span>
              </button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-6 border-b border-slate-200 last:border-b-0 ${
                    !msg.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-slate-800">{msg.from}</p>
                      <p className="text-sm text-slate-600">{msg.subject}</p>
                    </div>
                    <p className="text-sm text-slate-500">{msg.time}</p>
                  </div>
                  <p className="text-slate-700">{msg.body}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              All Notifications
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg flex items-center justify-between ${
                    notif.read ? 'bg-slate-50' : 'bg-blue-50'
                  }`}
                >
                  <div>
                    <p className="font-medium text-slate-800">{notif.text}</p>
                    <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: 'Enrolled Courses',
                  value: enrolledCourses.length,
                  icon: GraduationCap,
                  color: 'blue',
                },
                {
                  label: 'Pending Assignments',
                  value: assignments.filter((a) => a.status !== 'submitted')
                    .length,
                  icon: FileText,
                  color: 'orange',
                },
                {
                  label: 'Current Streak',
                  value: `${streak} days`,
                  icon: Flame,
                  color: 'red',
                },
                {
                  label: 'Total Points',
                  value: points.toLocaleString(),
                  icon: Trophy,
                  color: 'purple',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Progress Chart */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Course Progress
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={enrolledCourses}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Progress"
                        dataKey="progress"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Upcoming Events
                  </h3>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => {
                      const course = enrolledCourses.find(
                        (c) => c.id === event.courseId
                      );
                      return (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-10 h-10 ${
                                course?.color || 'bg-gray-500'
                              } rounded-lg flex items-center justify-center`}
                            >
                              {event.type === 'quiz'
                                ? 'Q'
                                : event.type === 'exam'
                                ? 'E'
                                : 'P'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                {event.title}
                              </p>
                              <p className="text-sm text-slate-600">
                                {course?.name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {format(new Date(event.date), 'MMM dd')}
                            </p>
                            <p className="text-xs text-slate-500">
                              {format(new Date(event.date), 'EEEE')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recorded Lectures */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Recent Recorded Lectures
                  </h3>
                  <div className="space-y-4">
                    {recordedLectures.map((lec) => {
                      const course = enrolledCourses.find(
                        (c) => c.id === lec.courseId
                      );
                      return (
                        <div
                          key={lec.id}
                          className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition"
                        >
                          <div className="flex items-center space-x-4">
                            <PlayCircle className="w-10 h-10 text-blue-600" />
                            <div>
                              <p className="font-medium text-slate-800">
                                {lec.title}
                              </p>
                              <p className="text-sm text-slate-600">
                                {course?.name} • {lec.duration}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => watchLecture(lec)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            Watch Now
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowModal('submitAssignment')}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl px-6 py-4 text-left font-medium transition"
                    >
                      Submit Assignment
                    </button>
                    <button
                      onClick={() => setShowModal('composeMessage')}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl px-6 py-4 text-left font-medium transition"
                    >
                      Ask Instructor
                    </button>
                    <button
                      onClick={() => setActiveTab('assignments')}
                      className="w-full bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl px-6 py-4 text-left font-medium transition"
                    >
                      View Grades
                    </button>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">
                    Recent Notifications
                  </h3>
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-lg ${
                          notif.read ? 'bg-slate-50' : 'bg-blue-50'
                        }`}
                      >
                        <p className="text-sm font-medium text-slate-800">
                          {notif.text}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    ))}
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
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">EduPro LMS</h1>
              <p className="text-xs text-slate-500">Student Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
              <div className="relative">
                <img
                  src={user.avatar || `https://i.pravatar.cc/100?img=2`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={uploadProfilePic}
                />
                <Camera className="w-4 h-4 text-white bg-slate-800 rounded-full p-0.5 absolute bottom-0 right-0" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {user.username || 'Student'}
                </p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('currentUser');
                  window.location.href = '/';
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen p-6">
          <nav className="space-y-2">
            {[
              { icon: Home, label: 'Overview', id: 'overview' },
              { icon: BookOpen, label: 'My Courses', id: 'courses' },
              { icon: FileText, label: 'Assignments', id: 'assignments' },
              { icon: Calendar, label: 'Calendar', id: 'calendar' },
              { icon: Trophy, label: 'Gamification', id: 'gamification' },
              { icon: Video, label: 'Lectures', id: 'lectures' },
              { icon: MessageSquare, label: 'Messages', id: 'messages' },
              { icon: Bell, label: 'Notifications', id: 'notifications' },
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
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{renderTabContent()}</main>
      </div>

      {/* Modals */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <div className="space-y-4">
              {['current', 'new', 'confirm'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)} Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[field] ? 'text' : 'password'}
                      value={passwordData[field]}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg pr-10"
                    />
                    <button
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          [field]: !showPassword[field],
                        })
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword[field] ? (
                        <EyeOff className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex space-x-3">
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium"
                >
                  Update Password
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal === 'submitAssignment' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                Submit Assignment
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
                  Select Assignment
                </label>
                <select
                  value={selectedAssignment?.id || ''}
                  onChange={(e) =>
                    setSelectedAssignment(
                      assignments.find((a) => a.id === parseInt(e.target.value))
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="">Choose assignment</option>
                  {assignments
                    .filter((a) => a.status !== 'submitted')
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Upload File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <button
                onClick={() => submitAssignment(selectedAssignment?.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal === 'composeMessage' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                Compose Message
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
                  To (Instructor)
                </label>
                <select
                  value={newMessage.to}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, to: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="">Select instructor</option>
                  {enrolledCourses.map((c) => (
                    <option key={c.id} value={c.instructor}>
                      {c.instructor}
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
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, subject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message
                </label>
                <textarea
                  value={newMessage.body}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, body: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg h-32"
                />
              </div>
              <button
                onClick={sendMessage}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
