"use client"
import type React from "react"
import { useState, useEffect } from "react"

import type { FC } from "react"

const About: FC = () => {
  const [projectsCount, setProjectsCount] = useState(0)
  const [clientsCount, setClientsCount] = useState(0)
  const [yearsCount, setYearsCount] = useState(0)
  const [supportCount, setSupportCount] = useState(0)

  useEffect(() => {
    const animateCounter = (setter: React.Dispatch<React.SetStateAction<number>>, target: number, duration = 2000) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const current = Math.floor(easeOutQuart * target)
        setter(current)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }

    // Start animations with slight delays for staggered effect
    setTimeout(() => animateCounter(setProjectsCount, 150), 100)
    setTimeout(() => animateCounter(setClientsCount, 50), 200)
    setTimeout(() => animateCounter(setYearsCount, 3), 300)
    setTimeout(() => animateCounter(setSupportCount, 24), 400)
  }, [])

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

      <div className="container" style={{ paddingTop: "120px", paddingBottom: "60px" }}>
        <div className="row mb-5">
          <div className="col-lg-7">
            <div className="glass-card p-5">
              <h2 className="fw-bold mb-4" style={{ color: "var(--text-light)" }}>
                About Our Vision
              </h2>
              <p className="mb-4" style={{ color: "var(--text-muted)" }}>
                We believe in creating digital experiences that feel natural and intuitive. Our glass morphism
                philosophy combines transparency, depth, and subtle animations to create interfaces that users love to
                interact with.
              </p>
              <p className="mb-4" style={{ color: "var(--text-muted)" }}>
                Founded in 2024, our team of designers and developers are passionate about pushing the boundaries of web
                design while maintaining accessibility and performance standards.
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                Every project we undertake is crafted with attention to detail, ensuring that form follows function
                while never compromising on aesthetic beauty.
              </p>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="row g-3">
              <div className="col-6">
                <div className="glass-card p-4 text-center">
                  <h3 className="fw-bold mb-2" style={{ color: "var(--accent-blue)" }}>
                    {projectsCount}+
                  </h3>
                  <p className="mb-0" style={{ color: "var(--text-muted)" }}>
                    Projects Completed
                  </p>
                </div>
              </div>
              <div className="col-6">
                <div className="glass-card p-4 text-center">
                  <h3 className="fw-bold mb-2" style={{ color: "var(--accent-blue)" }}>
                    {clientsCount}+
                  </h3>
                  <p className="mb-0" style={{ color: "var(--text-muted)" }}>
                    Happy Clients
                  </p>
                </div>
              </div>
              <div className="col-6">
                <div className="glass-card p-4 text-center">
                  <h3 className="fw-bold mb-2" style={{ color: "var(--accent-blue)" }}>
                    {yearsCount}
                  </h3>
                  <p className="mb-0" style={{ color: "var(--text-muted)" }}>
                    Years Experience
                  </p>
                </div>
              </div>
              <div className="col-6">
                <div className="glass-card p-4 text-center">
                  <h3 className="fw-bold mb-2" style={{ color: "var(--accent-blue)" }}>
                    {supportCount}/7
                  </h3>
                  <p className="mb-0" style={{ color: "var(--text-muted)" }}>
                    Support Available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-5">
          <h2 className="fw-bold" style={{ color: "var(--text-light)" }}>
            Meet Our Team
          </h2>
        </div>

        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="glass-card p-4 text-center">
              <div className="team-avatar mb-3">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "80px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <i className="fas fa-user" style={{ fontSize: "2rem", color: "var(--accent-blue)",backgroundImage: "url('/jdidi.png')", backgroundSize: 'cover', width: '80px', height: '80px', borderRadius: '50%'}}>
                    
                  </i>
                </div>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: "var(--text-light)" }}>
                Mouhamed Aziz Jdidi
              </h5>
              <p className="text-muted mb-3">CEO & Founder</p>
              <p className="small mb-3" style={{ color: "var(--text-muted)" }}>
                Visionary leader with 10+ years in digital innovation, driving our mission to create exceptional user
                experiences.
              </p>
              <div className="social-links">
                <a href="#" className="me-2">
                  <i className="fab fa-linkedin" style={{ color: "var(--accent-blue)" }}></i>
                </a>
                <a href="#" className="me-2">
                  <i className="fab fa-twitter" style={{ color: "var(--accent-blue)" }}></i>
                </a>
                <a href="#">
                  <i className="fab fa-github" style={{ color: "var(--accent-blue)" }}></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="glass-card p-4 text-center">
              <div className="team-avatar mb-3">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "80px", backgroundColor: "rgba(255, 255, 255, 0.1)"}}
                >
                  <i className="fas fa-user" style={{ fontSize: "2rem", color: "var(--accent-purple)",  backgroundImage: "url('/yakoubi.png')", backgroundSize: 'cover', width: '80px', height: '80px', borderRadius: '50%' }}></i>
                </div>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: "var(--text-light)" }}>
                Ahmed Yakoubi
              </h5>
              <p className="text-muted mb-3">Creative Director</p>
              <p className="small mb-3" style={{ color: "var(--text-muted)" }}>
                Award-winning designer specializing in modern UI/UX, bringing creative solutions to every project.
              </p>
              <div className="social-links">
                <a href="#" className="me-2">
                  <i className="fab fa-linkedin" style={{ color: "var(--accent-purple)" }}></i>
                </a>
                <a href="#" className="me-2">
                  <i className="fab fa-twitter" style={{ color: "var(--accent-purple)" }}></i>
                </a>
                <a href="#">
                  <i className="fab fa-dribbble" style={{ color: "var(--accent-purple)" }}></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="glass-card p-4 text-center">
              <div className="team-avatar mb-3">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "80px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <i className="fas fa-user" style={{ fontSize: "2rem", color: "var(--accent-blue)" ,backgroundImage: "url('/boukhris.png')", backgroundSize: 'cover', width: '80px', height: '80px', borderRadius: '50%'}}></i>
                </div>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: "var(--text-light)" }}>
                Hanin Boukhris
              </h5>
              <p className="text-muted mb-3">Tech Lead</p>
              <p className="small mb-3" style={{ color: "var(--text-muted)" }}>
                Full-stack expert passionate about clean code architecture and cutting-edge technologies.
              </p>
              <div className="social-links">
                <a href="#" className="me-2">
                  <i className="fab fa-linkedin" style={{ color: "var(--accent-blue)" }}></i>
                </a>
                <a href="#" className="me-2">
                  <i className="fab fa-twitter" style={{ color: "var(--accent-blue)" }}></i>
                </a>
                <a href="#">
                  <i className="fab fa-github" style={{ color: "var(--accent-blue)" }}></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="glass-card p-4 text-center">
              <div className="team-avatar mb-3">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "80px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <i className="fas fa-user" style={{ fontSize: "2rem", color: "var(--accent-purple)" ,backgroundImage: "url('/arfaoui.png')", backgroundSize: 'cover', width: '80px', height: '80px', borderRadius: '50%'}}></i>
                </div>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: "var(--text-light)",  }}>
                Habib Arfaoui
              </h5>
              <p className="text-muted mb-3">Fullstack Developer</p>
              <p className="small mb-3" style={{ color: "var(--text-muted)" }}>
               Versatile developer skilled in both frontend and backend technologies, building end-to-end web applications with React, Node.js, and databases.
              </p>
              <div className="social-links">
                <a href="#" className="me-2">
                  <i className="fab fa-linkedin" style={{ color: "var(--accent-purple)" }}></i>
                </a>
                <a href="#" className="me-2">
                  <i className="fab fa-twitter" style={{ color: "var(--accent-purple)" }}></i>
                </a>
                <a href="#">
                  <i className="fab fa-github" style={{ color: "var(--accent-purple)" }}></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="glass-card p-4 text-center">
              <div className="team-avatar mb-3">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "80px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <i className="fas fa-user" style={{ fontSize: "2rem", color: "var(--accent-blue)" , backgroundImage: "url('/akermi.png')", backgroundSize: 'cover', width: '80px', height: '80px', borderRadius: '50%'}}></i>
                </div>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: "var(--text-light)" }}>
                Bahe Eddine Akermi
              </h5>
              <p className="text-muted mb-3">Mobile Developer</p>
              <p className="small mb-3" style={{ color: "var(--text-muted)" }}>
                Specialist in building high-performance mobile applications for iOS and Android, delivering seamless user experiences.
              </p>
              <div className="social-links">
                <a href="#" className="me-2">
                  <i className="fab fa-linkedin" style={{ color: "var(--accent-blue)" }}></i>
                </a>
                <a href="#" className="me-2">
                  <i className="fab fa-twitter" style={{ color: "var(--accent-blue)" }}></i>
                </a>
                <a href="#">
                  <i className="fab fa-dribbble" style={{ color: "var(--accent-blue)" }}></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div className="glass-card p-4 text-center">
              <div className="team-avatar mb-3">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{ width: "80px", height: "80px", backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <i className="fas fa-user" style={{ fontSize: "2rem", color: "var(--accent-purple)" }}></i>
                </div>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: "var(--text-light)" }}>
                Lisa Martinez
              </h5>
              <p className="text-muted mb-3">Project Manager</p>
              <p className="small mb-3" style={{ color: "var(--text-muted)" }}>
                Certified PMP with a track record of delivering complex projects on time and within budget.
              </p>
              <div className="social-links">
                <a href="#" className="me-2">
                  <i className="fab fa-linkedin" style={{ color: "var(--accent-purple)" }}></i>
                </a>
                <a href="#" className="me-2">
                  <i className="fab fa-twitter" style={{ color: "var(--accent-purple)" }}></i>
                </a>
                <a href="#">
                  <i className="fab fa-github" style={{ color: "var(--accent-purple)" }}></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About
