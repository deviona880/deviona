import type React from "react"

const Footer: React.FC = () => {
  return (
    <footer className="glass-card mt-5" style={{ margin: "20px", borderRadius: "20px" }}>
      <div className="container py-4">
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-3">
              <img src="/logo.png" alt="Deviona" width="30" height="30" className="me-2" />
              <span className="fw-bold fs-5" style={{ color: "var(--text-light)" }}>
                Deviona
              </span>
            </div>
            <p style={{ color: "var(--text-muted)" }}>Innovative development solutions for the future of technology.</p>
          </div>
          <div className="col-md-6">
            <h6 className="fw-bold mb-3" style={{ color: "var(--text-light)" }}>
              Quick Links
            </h6>
            <div className="row">
              <div className="col-6">
                <ul className="list-unstyled">
                  <li>
                    <a href="/about" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/services" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                      Services
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-6">
                <ul className="list-unstyled">
                  <li>
                    <a href="/contact" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr style={{ borderColor: "var(--glass-border)" }} />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0" style={{ color: "var(--text-muted)" }}>
              © 2025 Deviona. All rights reserved. Crafted with modern web technologies.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="social-links">
              <a href="#" className="me-3" style={{ color: "var(--text-muted)" }}>
                LinkedIn
              </a>
              <a href="#" className="me-3" style={{ color: "var(--text-muted)" }}>
                Twitter
              </a>
              <a href="#" style={{ color: "var(--text-muted)" }}>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
