// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Download,
  Upload,
  MessageCircle,
  Bell,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  Star,
  User,
  LogOut,
  Search,
  Filter,
  ChevronRight,
  X,
} from 'lucide-react';

export default function StudentDashboard() {
  const [user, setUser] = useState({});
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [profilePic, setProfilePic] = useState('');

  // Load data
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUser(currentUser);

    const load = async () => {
      const data = await window.storage.get('student-data');
      if (data && data.value) {
        const parsed = JSON.parse(data.value);
        setCourses(parsed.courses || []);
        setAssignments(parsed.assignments || []);
        setNotifications(parsed.notifications || []);
        setSchedule(parsed.schedule || []);
        setProfilePic(parsed.profilePic || '');
      } else {
        const defaultData = getDefaultStudentData();
        await window.storage.set('student-data', JSON.stringify(defaultData));
        setCourses(defaultData.courses);
        setAssignments(defaultData.assignments);
        setNotifications(defaultData.notifications);
        setSchedule(defaultData.schedule);
      }
    };
    load();
  }, []);

  const saveData = async () => {
    const data = { courses, assignments, notifications, schedule, profilePic };
    await window.storage.set('student-data', JSON.stringify(data));
  };

  useEffect(() => {
    if (courses.length > 0) saveData();
  }, [courses, assignments, notifications, schedule, profilePic]);

  const getDefaultStudentData = () => ({
    courses: [
      {
        id: 1,
        name: 'Mathematics 101',
        instructor: 'Dr. Smith',
        progress: 75,
        rating: 4.5,
      },
      {
        id: 2,
        name: 'Physics 201',
        instructor: 'Prof. Jones',
        progress: 60,
        rating: 4.2,
      },
    ],
    assignments: [
      {
        id: 1,
        title: 'Calculus Homework',
        due: '2025-04-15',
        status: 'submitted',
        grade: 'A-',
      },
      {
        id: 2,
        title: 'Lab Report',
        due: '2025-04-20',
        status: 'pending',
        grade: null,
      },
    ],
    notifications: [
      {
        id: 1,
        type: 'deadline',
        message: 'Assignment due in 2 days',
        time: '2h ago',
      },
      {
        id: 2,
        type: 'grade',
        message: 'Grade posted for Quiz 3',
        time: '1d ago',
      },
    ],
    schedule: [
      { day: 'Mon', time: '10:00', course: 'Math 101' },
      { day: 'Wed', time: '14:00', course: 'Physics 201' },
    ],
    profilePic: '',
  });

  const handleFileSubmit = async (assignmentId) => {
    if (!selectedFile) return;
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, status: 'submitted', submittedAt: new Date().toISOString() }
          : a
      )
    );
    setSelectedFile(null);
    alert('Assignment submitted!');
  };

  const uploadProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePic(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-800">
                Student Portal
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={uploadProfilePic}
                  />
                  <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-dashed border-slate-400 flex items-center justify-center overflow-hidden">
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </label>
                <span className="text-sm font-medium text-slate-700">
                  {user.username}
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem('currentUser');
                    window.location.href = '/';
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Courses */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" /> My Courses
            </h2>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-slate-800">
                        {course.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {course.instructor}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="text-xs text-slate-600 mb-1">
                        Progress
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                      View <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm flex items-center justify-center space-x-1">
                      <Download className="w-4 h-4" /> <span>Notes</span>
                    </button>
                    <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm flex items-center justify-center space-x-1">
                      <Video className="w-4 h-4" /> <span>Lectures</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" /> Upcoming
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              {schedule.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{item.course}</p>
                    <p className="text-xs text-slate-600">
                      {item.day} • {item.time}
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assignments & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assignments */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" /> Assignments
            </h2>
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-slate-800">
                        {assignment.title}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Due: {assignment.due}
                      </p>
                    </div>
                    {assignment.status === 'submitted' ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Submitted
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" /> Pending
                      </span>
                    )}
                  </div>
                  {assignment.grade && (
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-green-600">
                        Grade: {assignment.grade}
                      </span>
                      <button
                        onClick={() => setFeedbackModal(assignment)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Feedback
                      </button>
                    </div>
                  )}
                  {assignment.status === 'pending' && (
                    <div className="mt-3">
                      <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <button
                        onClick={() => handleFileSubmit(assignment.id)}
                        disabled={!selectedFile}
                        className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-sm flex items-center justify-center space-x-1"
                      >
                        <Upload className="w-4 h-4" /> <span>Submit</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2" /> Notifications
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No new notifications
                </p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start space-x-3 py-3 border-b border-slate-100 last:border-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notif.type === 'deadline' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-800">{notif.message}</p>
                      <p className="text-xs text-slate-500">{notif.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        {feedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Feedback</h3>
                <button
                  onClick={() => setFeedbackModal(null)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-2xl font-bold text-green-600 text-center">
                  {feedbackModal.grade}
                </p>
                <p className="text-sm text-slate-700">
                  Great work on your submission! You demonstrated strong
                  understanding of the core concepts. Consider adding more
                  examples in future assignments.
                </p>
                <button
                  onClick={() => setFeedbackModal(null)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
