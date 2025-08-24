"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

interface Contact {
  _id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdAt: string
  isRead: boolean
}

const ContactManagement: React.FC = () => {
  const { token } = useAuth()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">("all")

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      // Mock data for demonstration - replace with actual API call
      const mockContacts: Contact[] = [
        {
          _id: "1",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1234567890",
          subject: "Website Inquiry",
          message:
            "I'm interested in your web development services. Could you please provide more information about your pricing and timeline?",
          createdAt: new Date().toISOString(),
          isRead: false,
        },
        {
          _id: "2",
          name: "Sarah Johnson",
          email: "sarah.j@company.com",
          phone: "+1987654321",
          subject: "Partnership Opportunity",
          message:
            "We would like to discuss a potential partnership for our upcoming project. Please contact us at your earliest convenience.",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isRead: true,
        },
        {
          _id: "3",
          name: "Mike Wilson",
          email: "mike.wilson@startup.io",
          phone: "+1122334455",
          subject: "Technical Support",
          message:
            "We're experiencing some issues with our current website and would like to know if you provide maintenance services.",
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          isRead: false,
        },
      ]

      setTimeout(() => {
        setContacts(mockContacts)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to fetch contacts:", error)
      setLoading(false)
    }
  }

  const markAsRead = async (contactId: string) => {
    try {
      // Update local state
      setContacts(contacts.map((contact) => (contact._id === contactId ? { ...contact, isRead: true } : contact)))
      // In a real app, you'd make an API call here
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const deleteContact = async (contactId: string) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        setContacts(contacts.filter((contact) => contact._id !== contactId))
        setSelectedContact(null)
        // In a real app, you'd make an API call here
      } catch (error) {
        console.error("Failed to delete contact:", error)
      }
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "read" && contact.isRead) ||
      (filterStatus === "unread" && !contact.isRead)

    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="contact-management-container">
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
          <div className="glass-card p-4">
            <div className="text-center">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-light mt-3">Loading contacts...</p>
            </div>
          </div>
        </div>
      </div>
    )
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
                  <h1 className="text-white mb-1">Contact Management</h1>
                  <p className="text-light opacity-75 mb-0">Manage and respond to contact form submissions</p>
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

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card p-4">
              <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                  <input
                    type="text"
                    className="form-control glass-input"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <select
                    className="form-select glass-input"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as "all" | "read" | "unread")}
                  >
                    <option value="all">All Contacts</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact List */}
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="glass-card p-4">
              <h3 className="text-white mb-4">Contacts ({filteredContacts.length})</h3>
              <div className="contact-list" style={{ maxHeight: "600px", overflowY: "auto" }}>
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-light opacity-75">No contacts found</p>
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact._id}
                      className={`contact-item glass-card p-3 mb-3 cursor-pointer ${
                        selectedContact?._id === contact._id ? "border border-primary" : ""
                      }`}
                      onClick={() => {
                        setSelectedContact(contact)
                        if (!contact.isRead) {
                          markAsRead(contact._id)
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <h6 className="text-white mb-0 me-2">{contact.name}</h6>
                            {!contact.isRead && <span className="badge bg-primary">New</span>}
                          </div>
                          <p className="text-light opacity-75 mb-1 small">{contact.email}</p>
                          <p className="text-white mb-1">{contact.subject}</p>
                          <p className="text-light opacity-50 mb-0 small">{formatDate(contact.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="col-lg-6">
            <div className="glass-card p-4">
              {selectedContact ? (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <h3 className="text-white">Contact Details</h3>
                    <button className="btn btn-danger glass-btn" onClick={() => deleteContact(selectedContact._id)}>
                      Delete
                    </button>
                  </div>

                  <div className="contact-details">
                    <div className="mb-3">
                      <label className="form-label text-light opacity-75">Name</label>
                      <p className="text-white">{selectedContact.name}</p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-light opacity-75">Email</label>
                      <p className="text-white">
                        <a href={`mailto:${selectedContact.email}`} className="text-primary text-decoration-none">
                          {selectedContact.email}
                        </a>
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-light opacity-75">Phone</label>
                      <p className="text-white">
                        <a href={`tel:${selectedContact.phone}`} className="text-primary text-decoration-none">
                          {selectedContact.phone}
                        </a>
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-light opacity-75">Subject</label>
                      <p className="text-white">{selectedContact.subject}</p>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-light opacity-75">Message</label>
                      <div className="glass-card p-3">
                        <p className="text-white mb-0" style={{ whiteSpace: "pre-wrap" }}>
                          {selectedContact.message}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-light opacity-75">Received</label>
                      <p className="text-white">{formatDate(selectedContact.createdAt)}</p>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-primary glass-btn"
                        onClick={() =>
                          window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`)
                        }
                      >
                        Reply via Email
                      </button>
                      <button
                        className="btn btn-success glass-btn"
                        onClick={() => window.open(`tel:${selectedContact.phone}`)}
                      >
                        Call
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-envelope text-light opacity-50" style={{ fontSize: "3rem" }}></i>
                  <p className="text-light opacity-75 mt-3">Select a contact to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactManagement
