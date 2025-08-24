"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from "react"
import { Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface DashboardStats {
  overview: {
    totalContacts: number
    todayContacts: number
    totalUsers: number
    totalProjects: number
  }
  projectStats: Array<{ _id: string; count: number }>
  contactStats: Array<{ _id: string; count: number }>
  userStats: Array<{ _id: string; count: number }>
  activities: {
    latestContacts: Array<any>
    latestProjects: Array<any>
    latestUsers: Array<any>
  }
  systemStatus: string
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    overview: {
      totalContacts: 0,
      todayContacts: 0,
      totalUsers: 0,
      totalProjects: 0,
    },
    projectStats: [],
    contactStats: [],
    userStats: [],
    activities: {
      latestContacts: [],
      latestProjects: [],
      latestUsers: [],
    },
    systemStatus: "Online",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/stats/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) throw new Error("Failed to load stats")
        const data = await response.json()
        setStats(data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load dashboard stats:", error)
        setLoading(false)
      }
    }

    loadStats()
    // Real-time updates every 30 seconds
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Chart data for project status
  const pieChartData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: stats.projectStats?.map((s) => s.count) || [],
        backgroundColor: ["#ffc107", "#0dcaf0", "#198754"],
      },
    ],
  }

  // Chart data for monthly projects
  const lineChartData = {
    labels: stats.userStats?.map((s) => `${s._id}`) || [],
    datasets: [
      {
        label: "Projects Created",
        data: stats.userStats?.map((s) => s.count) || [],
        borderColor: "#0dcaf0",
        tension: 0.1,
      },
    ],
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  // Update renderProjectsList to use real data
  const renderProjectsList = () => (
    <div className="list-group list-group-flush">
      {stats.activities.latestProjects.map((project: any) => (
        <div key={project._id} className="list-group-item glass-card border-0 mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-white mb-1">{project.title}</h6>
              <p className="text-light opacity-75 mb-0">Status: {project.status}</p>
            </div>
            <small className="text-light opacity-50">
              {new Date(project.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  )

  // Update renderContactsList
  const renderContactsList = () => (
    <div className="list-group list-group-flush">
      {stats.activities.latestContacts.map((contact: any) => (
        <div key={contact._id} className="list-group-item glass-card border-0 mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-white mb-1">New contact: {contact.name}</h6>
              <p className="text-light opacity-75 mb-0">From: {contact.email}</p>
            </div>
            <small className="text-light opacity-50">
              {new Date(contact.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      ))}
    </div>
  )

  // Add this function to check if a project is in danger zone (within a week of end date)
  const getDangerZoneProjects = () => {
    const oneWeek = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    const now = new Date().getTime()

    return stats.activities.latestProjects
      .filter((project) => {
        const endDate = new Date(project.endDate).getTime()
        const timeLeft = endDate - now
        return timeLeft > 0 && timeLeft <= oneWeek
      })
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
  }

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
          <div className="glass-card p-4">
            <div className="text-center">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-light mt-3">Loading Dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-container">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="text-white mb-1">Admin Dashboard</h1>
                  <p className="text-light opacity-75 mb-0">Welcome back, {user?.name || "Admin"}</p>
                </div>
                <div className="d-flex gap-3">
                  <button className="btn btn-outline-light glass-btn" onClick={() => (window.location.href = "/")}>
                    View Website
                  </button>
                  <button className="btn btn-danger glass-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="glass-card p-4 text-center">
              <div className="mb-3">
                <i className="bi bi-envelope-fill text-primary" style={{ fontSize: "2rem" }}></i>
              </div>
              <h3 className="text-white mb-1">{stats.overview.totalContacts}</h3>
              <p className="text-light opacity-75 mb-0">Total Contacts</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="glass-card p-4 text-center">
              <div className="mb-3">
                <i className="bi bi-calendar-day text-success" style={{ fontSize: "2rem" }}></i>
              </div>
              <h3 className="text-white mb-1">{stats.overview.todayContacts}</h3>
              <p className="text-light opacity-75 mb-0">Today's Contacts</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="glass-card p-4 text-center">
              <div className="mb-3">
                <i className="bi bi-people-fill text-info" style={{ fontSize: "2rem" }}></i>
              </div>
              <h3 className="text-white mb-1">{stats.overview.totalUsers}</h3>
              <p className="text-light opacity-75 mb-0">Total Users</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="glass-card p-4 text-center">
              <div className="mb-3">
                <i className="bi bi-folder-fill text-warning" style={{ fontSize: "2rem" }}></i>
              </div>
              <h3 className="text-white mb-1">{stats.overview.totalProjects}</h3>
              <p className="text-light opacity-75 mb-0">Total Projects</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="glass-card p-4 text-center">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "2rem" }}></i>
              </div>
              <h3 className="text-white mb-1">{stats.systemStatus}</h3>
              <p className="text-light opacity-75 mb-0">System Status</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card p-4">
              <h3 className="text-white mb-4">Management Panel</h3>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <button
                    className="btn btn-primary w-100 glass-btn p-3"
                    onClick={() => (window.location.href = "/admin/contacts")}
                  >
                    <i className="bi bi-envelope-fill me-2"></i>
                    Manage Contacts
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button
                    className="btn btn-info w-100 glass-btn p-3"
                    onClick={() => (window.location.href = "/admin/users")}
                  >
                    <i className="bi bi-people-fill me-2"></i>
                    Manage Users
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button
                    className="btn btn-warning w-100 glass-btn p-3"
                    onClick={() => (window.location.href = "/admin/projects")}
                  >
                    <i className="bi bi-folder-fill me-2"></i>
                    Manage Projects
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button
                    className="btn btn-success w-100 glass-btn p-3"
                    onClick={() => (window.location.href = "/admin/settings")}
                  >
                    <i className="bi bi-gear-fill me-2"></i>
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row mb-4">
          <div className="col-md-6 mb-4">
            <div className="glass-card p-4">
              <h3 className="text-white mb-4">Project Status Distribution</h3>
              <Pie
                data={pieChartData}
                options={{
                  plugins: {
                    legend: {
                      labels: { color: "#fff" },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="glass-card p-4">
              <h3 className="text-white mb-4">Monthly Project Trends</h3>
              <Line
                data={lineChartData}
                options={{
                  scales: {
                    y: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#fff" } },
                    x: { grid: { color: "rgba(255,255,255,0.1)" }, ticks: { color: "#fff" } },
                  },
                  plugins: {
                    legend: {
                      labels: { color: "#fff" },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Danger Zone - Projects Due Soon */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card p-4" style={{ borderLeft: '4px solid #dc3545' }}>
              <div className="d-flex align-items-center mb-4">
                <div className="danger-icon-wrapper me-3">
                  <i className="bi bi-exclamation-triangle-fill text-danger" 
                     style={{ 
                       fontSize: "2rem",
                       filter: 'drop-shadow(0 0 10px rgba(220, 53, 69, 0.5))'
                     }}></i>
                </div>
                <div>
                  <h3 className="text-white mb-1">Danger Zone</h3>
                  <p className="text-danger mb-0">Projects requiring immediate attention</p>
                </div>
              </div>
              
              <div className="danger-zone-grid">
                {getDangerZoneProjects().length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-check-circle-fill text-success mb-3" style={{ fontSize: "2rem" }}></i>
                    <p className="text-light opacity-75 mb-0">All projects are on track</p>
                  </div>
                ) : (
                  <div className="danger-projects-list">
                    {getDangerZoneProjects().map((project) => {
                      const timeLeft = new Date(project.endDate).getTime() - new Date().getTime();
                      const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
                      
                      return (
                        <div key={project._id} className="danger-project-card glass-card mb-3 p-3">
                          <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div className="project-info me-3">
                              <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-clock-history text-danger me-2"></i>
                                <h5 className="text-white mb-0">{project.title}</h5>
                              </div>
                              <div className="d-flex align-items-center mt-2 gap-3">
                                <span className={`badge ${
                                  project.status === "completed" ? "bg-success" :
                                  project.status === "in-progress" ? "bg-info" :
                                  "bg-warning"
                                } glass-btn`}>
                                  {project.status}
                                </span>
                                <span className="text-light opacity-75">
                                  <i className="bi bi-calendar-event me-2"></i>
                                  {new Date(project.endDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="d-flex align-items-center gap-3">
                              <div className="time-left-indicator">
                                <span className="badge bg-danger glass-btn px-3 py-2" 
                                      style={{ 
                                        animation: 'pulse 1.5s infinite',
                                        boxShadow: '0 0 10px rgba(220, 53, 69, 0.5)'
                                      }}>
                                  <i className="bi bi-alarm-fill me-2"></i>
                                  {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                                </span>
                              </div>
                              <button
                                className="btn btn-outline-danger glass-btn"
                                onClick={() => window.location.href = `/admin/projects#${project._id}`}
                              >
                                <i className="bi bi-arrow-right-circle-fill me-2"></i>
                                View Project
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="row">
          <div className="col-12">
            <div className="glass-card p-4">
              <h3 className="text-white mb-4">Recent Activity</h3>
              {renderContactsList()}
              {renderProjectsList()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default AdminDashboard
