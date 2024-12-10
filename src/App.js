import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SchemesList from './components/schemes/SchemesList';
import AddScheme from './components/schemes/AddScheme';
import UploadSchemes from './components/schemes/UploadSchemes';

function App() {
  return (
    <Router>
      <div className="admin-container">
        <nav className="admin-sidebar">
          <div className="admin-logo">
            <h2>Admin Panel</h2>
          </div>
          <ul className="admin-menu">
            <li className="menu-item">
              <Link to="/">Dashboard</Link>
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
              <span>Admin User</span>
            </div>
          </header>
          <div className="admin-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/schemes" element={<SchemesList />} />
              <Route path="/add-scheme" element={<AddScheme />} />
              <Route path="/upload-schemes" element={<UploadSchemes />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>1,234</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>856</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p>$12,345</p>
        </div>
        <div className="stat-card">
          <h3>Products</h3>
          <p>432</p>
        </div>
      </div>
    </>
  );
}

export default App;
