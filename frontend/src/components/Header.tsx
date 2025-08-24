"use client"

import type React from "react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navbar navbar-expand-lg fixed-top glass-card" style={{ margin: "20px", borderRadius: "20px" }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/logo.svg" alt="Deviona" width="40" height="40" className="me-2" />
          <span className="fw-bold fs-4" style={{ color: "var(--text-light)" }}>
            Deviona
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ color: "var(--text-light)" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                className={`nav-link px-3 d-flex align-items-center ${isActive("/") ? "active" : ""}`}
                to="/"
                style={{ color: isActive("/") ? "white" : "var(--text-muted)" }}
              >
                <div className="nav-icon-square me-2">
                  <i className="bi bi-house-fill"></i>
                </div>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link px-3 d-flex align-items-center ${isActive("/about") ? "active" : ""}`}
                to="/about"
                style={{ color: isActive("/about") ? "white" : "var(--text-muted)" }}
              >
                <div className="nav-icon-square me-2">
                  <i className="bi bi-info-circle-fill"></i>
                </div>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link px-3 d-flex align-items-center ${isActive("/services") ? "active" : ""}`}
                to="/services"
                style={{ color: isActive("/services") ? "white" : "var(--text-muted)" }}
              >
                <div className="nav-icon-square me-2">
                  <i className="bi bi-gear-fill"></i>
                </div>
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link px-3 d-flex align-items-center ${isActive("/contact") ? "active" : ""}`}
                to="/contact"
                style={{ color: isActive("/contact") ? "white" : "var(--text-muted)" }}
              >
                <div className="nav-icon-square me-2">
                  <i className="bi bi-envelope-fill"></i>
                </div>
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link px-3 d-flex align-items-center ${isActive("/login") ? "active" : ""}`}
                to="/login"
                style={{ color: isActive("/login") ? "white" : "var(--text-muted)" }}
              >
                <div className="nav-icon-square me-2">
                  <i className="bi bi-person-lock"></i>
                </div>
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
