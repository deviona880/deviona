import type React from "react"

const Services: React.FC = () => {
  const services = [
    {
      icon: "💻",
      title: "Web Development",
      description:
        "Modern, responsive websites built with the latest technologies and frameworks for optimal performance and user experience.",
    },
    {
      icon: "📱",
      title: "Mobile Apps",
      description:
        "Native and cross-platform mobile applications that deliver seamless experiences across iOS and Android devices.",
    },
    {
      icon: "☁️",
      title: "Cloud Solutions",
      description:
        "Scalable cloud infrastructure and deployment solutions that ensure your applications are fast, secure, and reliable.",
    },
    {
      icon: "🎨",
      title: "UI/UX Design",
      description: "Beautiful, intuitive user interfaces and experiences that engage users and drive business results.",
    },
    {
      icon: "🔧",
      title: "API Development",
      description:
        "Robust, scalable APIs and backend services that power your applications and integrate with third-party systems.",
    },
    {
      icon: "📊",
      title: "Analytics & Insights",
      description:
        "Data-driven solutions that provide valuable insights into user behavior and application performance.",
    },
  ]

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
          <div className="col-lg-8 text-center mb-5">
            <div className="glass-card p-4">
              <h1 className="display-5 fw-bold mb-4" style={{ color: "var(--text-light)" }}>
                Our Services
              </h1>
              <p className="lead" style={{ color: "var(--text-muted)" }}>
                Comprehensive development solutions tailored to meet your unique business needs and drive digital
                transformation.
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {services.map((service, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="glass-card p-4 h-100">
                <div className="feature-icon">
                  <span>{service.icon}</span>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "var(--text-light)" }}>
                  {service.title}
                </h5>
                <p style={{ color: "var(--text-muted)" }}>{service.description}</p>
                <div className="mt-auto pt-3">
                  <a href="/contact" className="glass-button">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <div className="glass-card p-5 text-center">
              <h3 className="fw-bold mb-3" style={{ color: "var(--text-light)" }}>
                Ready to Start Your Project?
              </h3>
              <p className="mb-4" style={{ color: "var(--text-muted)" }}>
                Let's discuss how we can help bring your vision to life with our innovative development solutions.
              </p>
              <a href="/contact" className="glass-button">
                Get Started Today
              </a>
            </div>
          </div>
        </div>
      </div>
      
    </>
  )
}

export default Services
