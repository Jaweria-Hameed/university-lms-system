// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const loginTime = localStorage.getItem('loginTime');
  const isExpired =
    loginTime && Date.now() - parseInt(loginTime) > 30 * 60 * 1000;

  if (!currentUser || isExpired) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
    return <Navigate to="/" />;
  }

  // Compare lowercase
  const userRole = currentUser.role?.toLowerCase();
  if (!allowedRoles.map((r) => r.toLowerCase()).includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}
