import { Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import About from "./pages/About"
import Services from "./pages/Services"
import Contact from "./pages/Contact"
import Login from "./pages/Login" // Updated import from AdminLogin to Login
import AdminDashboard from "./pages/AdminDashboard"
import UserDashboard from "./pages/UserDashboard" // Added UserDashboard import

import AdminContacts from "./pages/AdminContacts"
import AdminUsers from "./pages/AdminUsers"
import AdminProjects from "./pages/AdminProjects"

function App() {
  const location = useLocation()
  const isProtectedPage =
    location.pathname.startsWith("/admin") || location.pathname.startsWith("/user") || location.pathname === "/login"

  return (
    <div className="App">
      {!isProtectedPage && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} /> {/* Updated route path and component */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminContacts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requiredRole="admin">
                <div className="container-fluid py-4">
                  <div className="glass-card p-4">
                    <h2 className="text-white">System Settings</h2>
                    <p className="text-light opacity-75">Coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isProtectedPage && <Footer />}
    </div>
  )
}

export default App
