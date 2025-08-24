"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, isAuthenticated, user } = useAuth()

  const navigate = (path: string) => {
    window.history.pushState({}, "", path)
    window.dispatchEvent(new PopStateEvent("popstate"))
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard")
      } else if (user.role === "user") {
        navigate("/user/dashboard")
      }
    }
  }, [isAuthenticated, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const success = await login(formData.email, formData.password)

    if (!success) {
      setError("Invalid credentials. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="admin-login-container">
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="row w-100 justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="glass-card p-5">
              <div className="text-center mb-4">
                <h2 className="text-white mb-2">Login</h2>
                <p className="text-light opacity-75">Access your account</p>
              </div>

              {error && (
                <div className="alert alert-danger glass-card mb-4" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control glass-input"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control glass-input"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 glass-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <a href="/" className="text-light opacity-75 text-decoration-none">
                  ← Back to Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
