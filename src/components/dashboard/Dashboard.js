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

export default Dashboard; 