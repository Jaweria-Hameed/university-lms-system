import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const loginTime = localStorage.getItem('loginTime');
  const isExpired =
    loginTime && Date.now() - parseInt(loginTime) > 30 * 60 * 1000; // 30 min

  if (!user || isExpired) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
    return <Navigate to="/" />;
  }

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser || isExpired) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
    return <Navigate to="/" />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}
