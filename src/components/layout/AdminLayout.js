import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebaseConfig';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import SchemesList from '../schemes/SchemesList';
import AddScheme from '../schemes/AddScheme';
import UploadSchemes from '../schemes/UploadSchemes';
import Dashboard from '../dashboard/Dashboard';

function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

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
          <li className="menu-item">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="menu-item">
            <Link to="/schemes">View Schemes</Link>
          </li>
          <li className="menu-item">
            <Link to="/add-scheme">Add Scheme</Link>
          </li>
          <li className="menu-item">
            <Link to="/upload-schemes">Upload Schemes</Link>
          </li>
          <li className="menu-item">Users</li>
          <li className="menu-item">Settings</li>
        </ul>
      </nav>
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-search">
            <input type="search" placeholder="Search..." />
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schemes" element={<SchemesList />} />
            <Route path="/add-scheme" element={<AddScheme />} />
            <Route path="/upload-schemes" element={<UploadSchemes />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default AdminLayout; 