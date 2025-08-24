import React, { useEffect, useState } from "react"

interface User {
  _id: string
  name: string
  email: string
  role: "user" | "admin"
  isActive: boolean
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editData, setEditData] = useState({ name: "", email: "", role: "user" })

  // Load users
  useEffect(() => {
    fetch("http://localhost:5000/auth/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
  }, [])

  // Add user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }

      const data = await response.json()
      if (data.user) {
        setUsers((prevUsers) => [...prevUsers, data.user])
        setNewUser({ name: "", email: "", password: "", role: "user" })
      }
    } catch (error) {
      console.error('Error adding user:', error);
      // You might want to show an error message to the user here
    }
  }

  // Edit user
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    const response = await fetch(`http://localhost:5000/auth/users/${editingUser._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(editData),
    })

    const data = await response.json()
    if (data.user) {
      setUsers(users.map((u) => (u._id === editingUser._id ? data.user : u)))
    }
    setEditingUser(null)
  }

  // Toggle active status
  const handleToggleActive = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/auth/users/${userId}/toggle`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
      })

      if (!response.ok) {
        throw new Error('Failed to toggle user status');
      }

      const data = await response.json()
      if (data.user) {
        setUsers(users.map((u) => (u._id === userId ? data.user : u)))
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  }

  return (
    <div className="contact-management-container">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="text-white mb-1">User Management</h1>
                  <p className="text-light opacity-75 mb-0">Manage system users and their permissions</p>
                </div>
                <button
                  className="btn btn-outline-light glass-btn"
                  onClick={() => (window.location.href = "/admin/dashboard")}
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add User Form */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card p-4">
              <h3 className="text-white mb-4">Add New User</h3>
              <form onSubmit={handleAddUser}>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <input
                      type="text"
                      className="form-control glass-input"
                      placeholder="Name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input
                      type="email"
                      className="form-control glass-input"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <input
                      type="password"
                      className="form-control glass-input"
                      placeholder="Password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </div>
                  <div className="col-md-2 mb-3">
                    <select
                      className="form-select glass-input"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-md-1 mb-3">
                    <button type="submit" className="btn btn-primary glass-btn w-100">
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="row">
          <div className="col-12">
            <div className="glass-card p-4">
              <h3 className="text-white mb-4">Users List</h3>
              <div className="user-list">
                {users.map((user) => (
                  <div key={user._id} className="glass-card p-3 mb-3">
                    {editingUser && editingUser._id === user._id ? (
                      <form onSubmit={handleEditUser} className="row align-items-center">
                        <div className="col-md-3 mb-2 mb-md-0">
                          <input
                            type="text"
                            className="form-control glass-input"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          />
                        </div>
                        <div className="col-md-3 mb-2 mb-md-0">
                          <input
                            type="email"
                            className="form-control glass-input"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          />
                        </div>
                        <div className="col-md-3 mb-2 mb-md-0">
                          <select
                            className="form-select glass-input"
                            value={editData.role}
                            onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <button type="submit" className="btn btn-success glass-btn me-2">
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-light glass-btn"
                            onClick={() => setEditingUser(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="row align-items-center">
                        <div className="col-md-3">
                          <h6 className="text-white mb-0">{user.name}</h6>
                        </div>
                        <div className="col-md-3">
                          <p className="text-light opacity-75 mb-0">{user.email}</p>
                        </div>
                        <div className="col-md-2">
                          <span className={`badge ${user.role === "admin" ? "bg-danger" : "bg-primary"}`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="col-md-2">
                          <span className={`badge ${user.isActive ? "bg-success" : "bg-warning"}`}>
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="col-md-2">
                          <button
                            className="btn btn-outline-light glass-btn btn-sm me-2"
                            onClick={() => {
                              setEditingUser(user)
                              setEditData({ name: user.name, email: user.email, role: user.role })
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className={`btn ${user.isActive ? "btn-warning" : "btn-success"} glass-btn btn-sm`}
                            onClick={() => handleToggleActive(user._id)}
                          >
                            {user.isActive ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
