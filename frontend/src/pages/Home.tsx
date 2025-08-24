import type React from "react"
import { Link } from "react-router-dom"

const Home: React.FC = () => {
  return (
    <>
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
      </div>

      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="glass-card p-5">
                <h1 className="display-4 fw-bold mb-4" style={{ color: "var(--text-light)" }}>
                  Welcome to the Future
                </h1>
                <p className="lead mb-4" style={{ color: "var(--text-muted)" }}>
                  Experience cutting-edge development solutions that bring innovation and elegance to modern digital
                  experiences. Clean, efficient, and beautifully crafted.
                </p>
                <Link to="/services" className="glass-button me-3">
                  Get Started
                </Link>
                <Link to="/about" className="glass-button">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <img
                  src="/home.png"
                  alt="Futuristic Technology"
                  className="img-fluid rounded-4"
                  style={{ maxHeight: "400px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="feature-icon">
                  <span>✨</span>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "var(--text-light)" }}>
                  Modern Design
                </h5>
                <p style={{ color: "var(--text-muted)" }}>
                  Beautiful glass morphism effects with backdrop blur and translucent elements that create depth and
                  visual hierarchy.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="feature-icon">
                  <span>🔥</span>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "var(--text-light)" }}>
                  Fast Performance
                </h5>
                <p style={{ color: "var(--text-muted)" }}>
                  Optimized animations and effects that maintain smooth 60fps performance across all modern browsers and
                  devices.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="feature-icon">
                  <span>📱</span>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "var(--text-light)" }}>
                  Responsive
                </h5>
                <p style={{ color: "var(--text-muted)" }}>
                  Fully responsive design that adapts beautifully to any screen size, from mobile phones to desktop
                  displays.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="feature-icon">
                  <span>🎨</span>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "var(--text-light)" }}>
                  Interactive UI
                </h5>
                <p style={{ color: "var(--text-muted)" }}>
                  Engaging hover effects, smooth transitions, and micro-animations that create delightful user
                  experiences.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="feature-icon">
                  <span>🔒</span>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "var(--text-light)" }}>
                  Secure & Safe
                </h5>
                <p style={{ color: "var(--text-muted)" }}>
                  Built with modern security standards and best practices to ensure your data and user privacy are
                  protected.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="glass-card p-4 h-100 text-center">
                <div className="feature-icon">
                  <span>🔧</span>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "var(--text-light)" }}>
                  Easy Integration
                </h5>
                <p style={{ color: "var(--text-muted)" }}>
                  Simple to implement and customize for any project with clean, well-documented code and flexible
                  components.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
