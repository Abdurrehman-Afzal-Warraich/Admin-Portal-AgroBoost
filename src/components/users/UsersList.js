"use client"

import { useState } from "react"
import { useAllUsers } from "../../components/dashboard/hooks/use-firebase-data"
import "./users-list-styles.css"

function UsersList() {
  const { users, loading, deleteUser } = useAllUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewMode, setViewMode] = useState("list")

const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  
  try {
    // Handle Firestore timestamp format
    const date = timestamp.seconds ? 
      new Date(timestamp.seconds * 1000) : // Convert Firestore timestamp
      new Date(timestamp); // Handle regular timestamp

    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    console.error("Timestamp value:", timestamp);
    return "Invalid Date";
  }
};



  // Handle user deletion
  const handleDeleteUser = async (userId, role) => {
  try {
    const success = await deleteUser(userId, role);
    if (success) {
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
        setViewMode("list");
      }
      alert("User deleted successfully!");
    } else {
      alert("Failed to delete user. Please try again.");
    }
  } catch (error) {
    console.error("Error in handleDeleteUser:", error);
    alert(`Error deleting user: ${error.message}`);
  }
};

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // User detail view component
  const UserDetailView = ({ user }) => (
    <div className="user-detail">
      <button onClick={() => setViewMode("list")} className="back-btn">
        Back to Users List
      </button>

      <div className="user-profile">
        <div className="profile-header">
          <div className="user-avatar">
            <div className="avatar-placeholder"></div>
          </div>
          <div className="user-info">
            <h2>{user.name || "Unknown User"}</h2>
            <div className="user-badges">
              
              <span className={`role-badge ${user.role}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
          <button onClick={() => handleDeleteUser(user.id, user.role)} className="delete-user-btn">
            Delete User
          </button>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h3>Basic Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <span>{user.email || "Not provided"}</span>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <span>{user.phoneNumber || "Not provided"}</span>
              </div>
              <div className="info-item">
                <label>Joined</label>
                <span>{formatDate(user.createdAt)}</span>
              </div>
              <div className="info-item">
                <label>Agro Coins</label>
                <span>{user.coins || "0"}</span>
              </div>
            </div>
          </div>

          {user.role === "farmer" && (
            <div className="profile-section">
              <h3>Farmer Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Address</label>
                  <span>{user.address || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <label>City</label>
                  <span>{user.city || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <label>Location</label>
                  <span>
                    {user.location
                      ? `Lat: ${user.location.latitude}, Long: ${user.location.longitude}`
                      : "Not specified"}
                  </span>
                </div>
                <div className="info-item">
                  <label>Budget</label>
                  <span>{user.budget ? `₹${user.budget}` : "Not specified"}</span>
                </div>
              </div>
            </div>
          )}

          {user.role === "expert" && (
            <div className="profile-section">
              <h3>Expert Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Specialization</label>
                  <span>{user.specialization || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <label>Experience</label>
                  <span>{user.experienceYears ? `${user.experienceYears} years` : "Not specified"}</span>
                </div>
                <div className="info-item">
                  <label>Rating</label>
                  <span>{user.rating ? `${user.rating}/5 (${user.numberOfRatings} ratings)` : "No ratings"}</span>
                </div>
                <div className="info-item">
                  <label>Consultation Hours</label>
                  <span>
                    {user.consultationHours
                      ? `${user.consultationHours.start} - ${user.consultationHours.end}`
                      : "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {user.role === "buyer" && (
            <div className="profile-section">
              <h3>Buyer Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Address</label>
                  <span>{user.address || "Not specified"}</span>
                </div>
                <div className="info-item">
                  <label>City</label>
                  <span>{user.city || "Not specified"}</span>
                </div>
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="users-container">
      {viewMode === "list" ? (
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
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="filter-select">
                <option value="all">All Roles</option>
                <option value="farmer">Farmers</option>
                <option value="expert">Experts</option>
                <option value="buyer">Buyers</option>
              </select>
              
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="empty-cell">
                        No users found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={`${user.role}-${user.id}`}>
                        <td>{user.name || "Unknown"}</td>
                        <td>{user.email || "Not provided"}</td>
                        <td>{user.phoneNumber || "Not provided"}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="action-buttons">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setViewMode("detail")
                            }}
                            className="view-btn"
                          >
                            View
                          </button>
                          <button onClick={() => handleDeleteUser(user.id, user.role)} className="delete-btn">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <UserDetailView user={selectedUser} />
      )}
    </div>
  )
}

export default UsersList
