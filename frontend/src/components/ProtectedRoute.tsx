"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

export interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: "user" | "admin"
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
          <div className="glass-card p-4">
            <div className="text-center">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-light mt-3">Checking authentication...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    const redirectPath = user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
    return <Navigate to={redirectPath} replace />
  }

  // Render protected content if authenticated and authorized
  return <>{children}</>
}

export default ProtectedRoute
