"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import "./UserDashboard.css"

interface Attachment {
  _id: string
  title: string
  type: "task" | "file" | "note"
  content?: string
  fileUrl?: string
  status?: string
}

interface Project {
  _id: string
  title: string
  status: "pending" | "in-progress" | "completed"
  startDate: string
  endDate: string
  attachments: Attachment[]
}

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Profile Modal state
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [formName, setFormName] = useState(user?.name || "")
  const [formEmail, setFormEmail] = useState(user?.email || "")
  const [formPhone, setFormPhone] = useState((user as any)?.phone || "")
  const [formPassword, setFormPassword] = useState("")
  const [formConfirmPassword, setFormConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.email) return
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `https://deviona-backend.onrender.com/projects/UserProjects/${user.email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (!response.ok) throw new Error("Failed to fetch projects")
        const data: Project[] = await response.json()
        setProjects(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [user])

  const handleLogout = () => {
    logout()
  }

  const handleSaveProfile = async () => {
    if (!user?._id) return

    if (formPassword && formPassword !== formConfirmPassword) {
      alert("Passwords do not match ❌")
      return
    }

    try {
      setSaving(true)
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://deviona-backend.onrender.com/auth/update-profile/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            phone: formPhone,
            ...(formPassword && { password: formPassword }),
          }),
        }
      )
      if (!response.ok) throw new Error("Failed to update profile")
      alert("Profile updated successfully ✅")
      setShowProfileModal(false)
    } catch (err) {
      console.error(err)
      alert("Error updating profile ❌")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="user-dashboard">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row">
          <div className="col-12">
            <div className="glass-card p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="text-white mb-2">User Dashboard</h1>
                  <p className="text-light opacity-75 mb-0">
                    Welcome back, {user?.name || "USER"}!
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light glass-btn"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="row">
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="glass-card p-4 h-100">
              <h3 className="text-white mb-3">Profile</h3>
              <div className="text-light opacity-75">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <p><strong>ID:</strong> {user?._id}</p>
                <p><strong>Phone:</strong> {(user as any)?.phone || "-"}</p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4">
            <div className="glass-card p-4 h-100">
              <h3 className="text-white mb-3">Quick Actions</h3>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary glass-btn"
                  onClick={() => {
                    setFormName(user?.name || "")
                    setFormEmail(user?.email || "")
                    setFormPhone((user as any)?.phone || "")
                    setFormPassword("")
                    setFormConfirmPassword("")
                    setShowProfileModal(true)
                  }}
                >
                  Update Profile
                </button>
                <button className="btn btn-secondary glass-btn">View Services</button>
                <button className="btn btn-info glass-btn">Contact Support</button>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4">
            <div className="glass-card p-4 h-100">
              <h3 className="text-white mb-3">Recent Activity</h3>
              <div className="text-light opacity-75">
                <p>No recent activity to display.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="row">
          <div className="col-12">
            <div className="glass-card p-4">
              <h3 className="text-white mb-4">My Projects</h3>
              {loading ? (
                <p className="text-light">Loading projects...</p>
              ) : projects.length === 0 ? (
                <p className="text-light opacity-75">You have no projects yet.</p>
              ) : (
                <div className="list-group list-group-flush">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className="list-group-item glass-card border-0 mb-3"
                    >
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                          <h5 className="text-white mb-1">{project.title}</h5>
                          <p className="text-light opacity-75 mb-0">
                            Status:{" "}
                            <span
                              className={`badge ${
                                project.status === "completed"
                                  ? "bg-success"
                                  : project.status === "in-progress"
                                  ? "bg-info"
                                  : "bg-warning"
                              }`}
                            >
                              {project.status}
                            </span>
                          </p>
                          <small className="text-light opacity-50">
                            {new Date(project.startDate).toLocaleDateString()} -{" "}
                            {new Date(project.endDate).toLocaleDateString()}
                          </small>
                        </div>
                      </div>

                      {/* Attachments */}
                      {project.attachments.length > 0 && (
                        <div className="mt-3 ps-3">
                          <h6 className="text-white">Attachments:</h6>
                          <ul className="list-unstyled">
                            {project.attachments.map((att) => (
                              <li key={att._id} className="text-light opacity-75 mb-2">
                                <i
                                  className={`bi ${
                                    att.type === "task"
                                      ? "bi-check2-square text-info"
                                      : att.type === "file"
                                      ? "bi-paperclip text-warning"
                                      : "bi-sticky text-success"
                                  } me-2`}
                                ></i>
                                <strong>{att.title}</strong>
                                {att.type === "file" && att.fileUrl && (
                                  <a
                                    href={att.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary ms-2"
                                  >
                                    (Download)
                                  </a>
                                )}
                                {att.content && (
                                  <p className="small text-light opacity-50 mb-0 ms-4">
                                    {att.content}
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showProfileModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content glass-card">
              <div className="modal-header border-0">
                <h5 className="modal-title text-white">Update Profile</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowProfileModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label text-light">Name</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-light">Email</label>
                  <input
                    type="email"
                    className="form-control glass-input"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-light">Phone</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-light">Password</label>
                  <input
                    type="password"
                    className="form-control glass-input"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-light">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control glass-input"
                    value={formConfirmPassword}
                    onChange={(e) => setFormConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  {formPassword !== formConfirmPassword && formConfirmPassword && (
                    <small className="text-danger">Passwords do not match</small>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-light glass-btn"
                  onClick={() => setShowProfileModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary glass-btn"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
