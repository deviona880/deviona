"use client"

import type React from "react"
import { useState } from "react"

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSubmitMessage("")
    setMessageType("")

    try {
      const response = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      

      if (response.ok) {
        setSubmitMessage( "Message sent successfully!")
        setMessageType("success")
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        setSubmitMessage( "Failed to send message. Please try again.")
        setMessageType("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitMessage("Network error. Please check if the server is running on port 5000.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

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
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="glass-card p-5">
              <h1 className="display-5 fw-bold mb-4 text-center" style={{ color: "var(--text-light)" }}>
                Contact Us
              </h1>
              <p className="lead text-center mb-5" style={{ color: "var(--text-muted)" }}>
                Ready to start your next project? Get in touch with our team of experts.
              </p>

              {submitMessage && (
                <div
                  className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} glass-card border-0 mb-4`}
                  style={{
                    background: messageType === "success" ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)",
                    color: "var(--text-light)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {submitMessage}
                </div>
              )}

              <div className="row g-4">
                <div className="col-md-6">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label" style={{ color: "var(--text-light)" }}>
                        Name *
                      </label>
                      <input
                        type="text"
                        className="form-control glass-card border-0"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        style={{
                          background: "var(--glass-bg)",
                          color: "var(--text-light)",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label" style={{ color: "var(--text-light)" }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        className="form-control glass-card border-0"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        style={{
                          background: "var(--glass-bg)",
                          color: "var(--text-light)",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label" style={{ color: "var(--text-light)" }}>
                        Phone *
                      </label>
                      <input
                        type="tel"
                        className="form-control glass-card border-0"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        style={{
                          background: "var(--glass-bg)",
                          color: "var(--text-light)",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label" style={{ color: "var(--text-light)" }}>
                        Subject *
                      </label>
                      <input
                        type="text"
                        className="form-control glass-card border-0"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        style={{
                          background: "var(--glass-bg)",
                          color: "var(--text-light)",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label" style={{ color: "var(--text-light)" }}>
                        Message *
                      </label>
                      <textarea
                        className="form-control glass-card border-0"
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        style={{
                          background: "var(--glass-bg)",
                          color: "var(--text-light)",
                          backdropFilter: "blur(10px)",
                          resize: "vertical",
                        }}
                      ></textarea>
                    </div>
                    <button type="submit" className="glass-button w-100" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>

                <div className="col-md-6">
                  <div className="glass-card p-4">
                    <h5 className="fw-bold mb-4" style={{ color: "var(--text-light)" }}>
                      Get in Touch
                    </h5>
                    <div className="mb-3">
                      <h6 className="fw-bold" style={{ color: "var(--text-light)" }}>
                        Email
                      </h6>
                      <p style={{ color: "var(--text-muted)" }}>deviona880@gmail.com</p>
                    </div>
                    <div className="mb-3">
                      <h6 className="fw-bold" style={{ color: "var(--text-light)" }}>
                        Phone
                      </h6>
                      <p style={{ color: "var(--text-muted)" }}>+216 99 042 240</p>
                    </div>
                    <div className="mb-4">
                      <h6 className="fw-bold" style={{ color: "var(--text-light)" }}>
                        Office
                      </h6>
                      <p style={{ color: "var(--text-muted)" }}>
                        123 Innovation Drive
                        <br />
                        Tech City, TC 12345
                      </p>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-3" style={{ color: "var(--text-light)" }}>
                        Follow Us
                      </h6>
                      <div className="d-flex gap-3">
                        <a href="#" className="glass-button" style={{ padding: "8px 16px" }}>
                          LinkedIn
                        </a>
                        <a href="#" className="glass-button" style={{ padding: "8px 16px" }}>
                          Twitter
                        </a>
                        <a href="#" className="glass-button" style={{ padding: "8px 16px" }}>
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
