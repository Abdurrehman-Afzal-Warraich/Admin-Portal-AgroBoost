import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCoins: 0,
    ongoingAuctions: 0,
    completedTransactions: 0,
    pendingConsultations: 0,
    totalRevenue: 0
  });

  const [userMetrics, setUserMetrics] = useState({
    farmers: 0,
    experts: 0,
    buyers: 0
  });

  const [timeFilter, setTimeFilter] = useState('week'); // 'day', 'week', 'month'

  useEffect(() => {
    fetchDashboardData();
  }, [timeFilter]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user statistics
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      // Calculate user metrics
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const userStats = users.reduce((acc, user) => {
        acc[user.role.toLowerCase()]++;
        return acc;
      }, { farmers: 0, experts: 0, buyers: 0 });

      setUserMetrics(userStats);

      // Calculate active users based on time filter
      const now = new Date();
      let filterDate = new Date();
      switch(timeFilter) {
        case 'day':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default: // week
          filterDate.setDate(now.getDate() - 7);
      }

      const activeUsers = users.filter(user => 
        user.lastLoginDate && new Date(user.lastLoginDate) > filterDate
      ).length;

      // Update all stats
      setStats({
        totalUsers: users.length,
        activeUsers,
        totalCoins: users.reduce((sum, user) => sum + (user.coinBalance || 0), 0),
        ongoingAuctions: 0, // Add actual auction counting logic
        completedTransactions: 0, // Add actual transaction counting logic
        pendingConsultations: 0, // Add actual consultation counting logic
        totalRevenue: 0 // Add actual revenue calculation
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <div className="time-filter">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stats-section">
          <h2>User Statistics</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
              <div className="stat-breakdown">
                <span>Farmers: {userMetrics.farmers}</span>
                <span>Experts: {userMetrics.experts}</span>
                <span>Buyers: {userMetrics.buyers}</span>
              </div>
            </div>
            <div className="stat-card">
              <h3>Active Users</h3>
              <p>{stats.activeUsers}</p>
              <div className="stat-period">Last {timeFilter}</div>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>Transaction Metrics</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Agro Coins</h3>
              <p>{stats.totalCoins.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Ongoing Auctions</h3>
              <p>{stats.ongoingAuctions}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Transactions</h3>
              <p>{stats.completedTransactions}</p>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>Consultation Status</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Pending Consultations</h3>
              <p>{stats.pendingConsultations}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p>${stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 