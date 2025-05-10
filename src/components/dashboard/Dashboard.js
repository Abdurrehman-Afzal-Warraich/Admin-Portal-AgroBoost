"use client"

import { useState } from "react"
import { useUserCounts, useConsultations, useAuctions } from "./hooks/use-firebase-data"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import "./dashboard-style.css"

function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("week")
  const { userCounts, loading: loadingUsers } = useUserCounts()
  const { consultations, loading: loadingConsultations } = useConsultations(timeFilter)
  const { auctions, loading: loadingAuctions } = useAuctions(timeFilter)

  // Prepare data for user distribution pie chart
  const userDistributionData = [
    { name: "Farmers", value: userCounts.farmers, color: "#4ade80" },
    { name: "Buyers", value: userCounts.buyers, color: "#60a5fa" },
    { name: "Experts", value: userCounts.experts, color: "#f97316" },
  ]

  // Prepare data for consultation status chart
  const consultationStatusData = consultations.reduce((acc, consultation) => {
    const status = consultation.status || "unknown"
    const existingStatus = acc.find((item) => item.name === status)

    if (existingStatus) {
      existingStatus.value += 1
    } else {
      acc.push({ name: status, value: 1 })
    }

    return acc
  }, [])

  // Prepare data for consultation topics chart
  const consultationTopicsData = consultations.reduce((acc, consultation) => {
    const topic = consultation.topic || "Other"
    const existingTopic = acc.find((item) => item.name === topic)

    if (existingTopic) {
      existingTopic.value += 1
    } else {
      acc.push({ name: topic, value: 1 })
    }

    return acc
  }, [])

  // Prepare data for auction products chart
  const auctionProductsData = auctions.reduce((acc, auction) => {
    const product = auction.name || "Unknown"
    const existingProduct = acc.find((item) => item.name === product)

    if (existingProduct) {
      existingProduct.value += 1
    } else {
      acc.push({ name: product, value: 1 })
    }

    return acc
  }, [])

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <div className="time-filter">
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="filter-select">
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* User Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon user-icon"></div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p>{userCounts.total}</p>
            <div className="stat-breakdown">
              <span>Farmers: {userCounts.farmers}</span>
              <span>Experts: {userCounts.experts}</span>
              <span>Buyers: {userCounts.buyers}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon auction-icon"></div>
          <div className="stat-content">
            <h3>Active Auctions</h3>
            <p>{loadingAuctions ? "..." : auctions.length}</p>
            <div className="stat-period">Based on selected time period</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon consultation-icon"></div>
          <div className="stat-content">
            <h3>Active Consultations</h3>
            <p>{loadingConsultations ? "..." : consultations.filter((c) => c.status === "active").length}</p>
            <div className="stat-period">Based on selected time period</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* User Distribution Chart */}
        <div className="chart-container">
          <h2 className="chart-title">User Distribution</h2>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* Consultation Status Chart */}
            <div className="chart-container">
            <h2 className="chart-title">Consultations</h2>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consultationStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                tickFormatter={(value) => Math.round(value)}
                domain={[0, Math.max(...consultationStatusData.map((item) => item.value))]}
                allowDecimals={false}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Consultations" fill="#8884d8" />
              </BarChart>
              </ResponsiveContainer>
            </div>
            </div>

        
        {/* Auction Products Chart */}
        
      </div>

      {/* Recent Consultations */}
      <div className="data-section">
        <h2 className="section-title">Recent Consultations</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Farmer</th>
                <th>Expert</th>
                <th>Topic</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loadingConsultations ? (
                <tr>
                  <td colSpan={5} className="loading-cell">
                    Loading consultations...
                  </td>
                </tr>
              ) : consultations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    No consultations found
                  </td>
                </tr>
              ) : (
                consultations.slice(0, 5).map((consultation) => (
                  <tr key={consultation.id}>
                    <td>{consultation.farmerName || "Unknown"}</td>
                    <td>{consultation.expertName || "Unknown"}</td>
                    <td>{consultation.topic || "General"}</td>
                    <td>
                      <span className={`status-badge ${consultation.status || "unknown"}`}>
                        {consultation.status || "Unknown"}
                      </span>
                    </td>
                    <td>
                      {consultation.createdAt
                        ? new Date(consultation.createdAt.seconds * 1000).toLocaleDateString()
                        : "Unknown"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Auctions */}
      <div className="data-section">
        <h2 className="section-title">Recent Auctions</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Farmer</th>
                <th>Location</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loadingAuctions ? (
                <tr>
                  <td colSpan={6} className="loading-cell">
                    Loading auctions...
                  </td>
                </tr>
              ) : auctions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    No auctions found
                  </td>
                </tr>
              ) : (
                auctions.slice(0, 5).map((auction) => (
                  <tr key={auction.id}>
                    <td>{auction.name || "Unknown"}</td>
                    <td>{auction.farmerName || auction.farmerId || "Unknown"}</td>
                    <td>{auction.location || "Unknown"}</td>
                    <td>₹{auction.price || 0}</td>
                    <td>{auction.quantity || 0} kg</td>
                    <td>
                      {auction.createdAt ? new Date(auction.createdAt.seconds * 1000).toLocaleDateString() : "Unknown"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
