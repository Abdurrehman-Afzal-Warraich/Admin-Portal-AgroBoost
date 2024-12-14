import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { status: newStatus });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    );
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const UserDetailView = ({ user }) => (
    <div className="user-detail">
      <button 
        onClick={() => setViewMode('list')} 
        className="back-btn"
      >
        ← Back to Users List
      </button>
      
      <div className="user-profile">
        <div className="profile-header">
          <h2>{user.name}</h2>
          <span className={`status-badge ${user.status}`}>
            {user.status}
          </span>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h3>Basic Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Email:</label>
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{user.phone}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span>{user.role}</span>
              </div>
              <div className="info-item">
                <label>Joined:</label>
                <span>{new Date(user.registrationDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Account Statistics</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Coin Balance:</label>
                <span>{user.coinBalance || 0} coins</span>
              </div>
              <div className="info-item">
                <label>Total Transactions:</label>
                <span>{user.transactions?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {user.recentActivity?.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-date">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                  <span className="activity-description">
                    {activity.description}
                  </span>
                </div>
              )) || <p>No recent activity</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="users-container">
      {viewMode === 'list' ? (
        <>
          <div className="users-header">
            <h1>User Management</h1>
            <div className="filters-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmers</option>
                <option value="expert">Experts</option>
                <option value="buyer">Buyers</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Registration Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                      <td>
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className={`status-select ${user.status}`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="action-buttons">
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setViewMode('detail');
                          }} 
                          className="view-btn"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)} 
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <UserDetailView user={selectedUser} />
      )}
    </div>
  );
}

export default UsersList; 