import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebaseConfig';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import SchemesList from '../schemes/SchemesList';
import AddScheme from '../schemes/AddScheme';
import UploadSchemes from '../schemes/UploadSchemes';
import Dashboard from '../dashboard/Dashboard';
import Login from '../auth/Login';
import UsersList from '../users/UsersList';
import Settings from '../settings/Settings';
import AddNews from '../news/AddNews';
import AgroCoinLayout from '../agrocoin/AgroCoinLayout';
import './Admin-Style.css'; // Import your CSS file for styling

function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>
        <ul className="admin-menu">
          <li className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={`menu-item ${location.pathname === '/schemes' ? 'active' : ''}`}>
            <Link to="/schemes">View Schemes</Link>
          </li>
          <li className={`menu-item ${location.pathname === '/add-scheme' ? 'active' : ''}`}>
            <Link to="/add-scheme">Add Scheme</Link>
          </li>
          <li className={`menu-item ${location.pathname === '/upload-schemes' ? 'active' : ''}`}>
            <Link to="/upload-schemes">Upload Schemes</Link>
          </li>
          <li className={`menu-item ${location.pathname === '/users' ? 'active' : ''}`}>
            <Link to="/users">Users</Link>
          </li>
          <li className={`menu-item ${location.pathname === '/agrocoin' ? 'active' : ''}`}>
            <Link to="/agrocoin">AgroCoin</Link>
          </li>
          <li className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`}>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-logo-header">
            <img src="/app-logo-wo-text.png" alt="AgroBoost Logo" className="header-logo" />
            <span className="app-name">AgroBoost</span>
          </div>
          <div className="admin-profile">
            <span>Welcome, {user.email}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schemes" element={<SchemesList />} />
            <Route path="/add-scheme" element={<AddScheme />} />
            <Route path="/upload-schemes" element={<UploadSchemes />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/agrocoin/*" element={<AgroCoinLayout />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/add-news" element={<AddNews />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout; 