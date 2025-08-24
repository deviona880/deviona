"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Alert from '../components/Alert';
import ConfirmDialog from '../components/ConfirmDialog';

interface Attachment {
  _id: string
  title: string
  type: "task" | "file" | "note"
  content?: string
  fileUrl?: string
  status: "pending" | "in-progress" | "completed"
  projectId: string
  createdAt: string
  updatedAt: string
}

interface Project {
  _id: string
  title: string
  description: string
  userEmail: string
  startDate: string
  endDate: string
  status: "pending" | "in-progress" | "completed"
  createdBy: string
  createdAt: string
  updatedAt: string
  attachments?: Attachment[]
}

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    userEmail: "",
    startDate: "",
    endDate: "",
    status: "pending" as "pending" | "in-progress" | "completed",
  })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [attachmentForm, setAttachmentForm] = useState({
    title: "",
    type: "task" as "task" | "file" | "note",
    content: "",
    fileUrl: ""
  })
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ show: false, message: '', type: 'info' });
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) throw new Error("Failed to load projects")
      const data = await response.json()
      console.log('Loaded projects:', data) // Debug
      setProjects(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to load projects:", error)
      setLoading(false)
    }
  }

  const handleUpdateProjectStatus = async (projectId: string, newStatus: "pending" | "in-progress" | "completed") => {
    const statusText = newStatus === 'completed' ? 'complete' : 'start';
    setConfirmDialog({
      isOpen: true,
      title: `${statusText.charAt(0).toUpperCase() + statusText.slice(1)} Project`,
      message: `Are you sure you want to ${statusText} this project?`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token")
          const response = await fetch(`http://localhost:5000/projects/${projectId}/status`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          })

          if (!response.ok) throw new Error("Failed to update project status")
          
          const updatedProject = await response.json()
          setProjects(projects.map(p => p._id === projectId ? updatedProject : p))
          showAlert(`Project ${statusText}ed successfully`, 'success');
        } catch (error) {
          showAlert(`Failed to ${statusText} project`, 'error');
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setSelectedProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      userEmail: project.userEmail,
      startDate: new Date(project.startDate).toISOString().split('T')[0],
      endDate: new Date(project.endDate).toISOString().split('T')[0],
      status: project.status,
    })
    setShowModal(true)
  }

  const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const method = editingProject ? "PUT" : "POST"
      const url = editingProject 
        ? `http://localhost:5000/projects/${editingProject._id}`
        : "http://localhost:5000/projects"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString()
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save project')
      }

      const data = await response.json()
      if (editingProject) {
        setProjects(projects.map(p => p._id === editingProject._id ? data : p))
      } else {
        setProjects([...projects, data])
      }

      setShowModal(false)
      setEditingProject(null)
      setSelectedProject(null)
      setFormData({
        title: "",
        description: "",
        userEmail: "",
        startDate: "",
        endDate: "",
        status: "pending",
      })
      showAlert(editingProject ? 'Project updated successfully' : 'Project created successfully', 'success');
    } catch (error) {
      console.error("Failed to save project:", error)
      showAlert(error instanceof Error ? error.message : 'Failed to save project', 'error');
    }
  }

  const handleDelete = async (projectId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This will also delete all attachments.',
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token")
          const response = await fetch(`http://localhost:5000/projects/${projectId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          })

          if (response.ok) {
            setProjects(projects.filter((p) => p._id !== projectId))
            showAlert('Project deleted successfully', 'success');
          }
        } catch (error) {
          showAlert('Failed to delete project', 'error');
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  }

  const handleAddAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/attachments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ...attachmentForm, 
          projectId: selectedProject._id, // Now TypeScript knows selectedProject is not null
          content: attachmentForm.type === "file" ? undefined : attachmentForm.content,
          fileUrl: attachmentForm.type === "file" ? attachmentForm.fileUrl : undefined
        }),
      })

      if (!response.ok) throw new Error("Failed to add attachment")
      
      const newAttachment = await response.json()
      setSelectedProject(prev => prev ? {
        ...prev,
        attachments: [...(prev.attachments || []), newAttachment]
      } : null)

      setProjects(projects.map(p => {
        if (p._id === selectedProject._id) {
          return {
            ...p,
            attachments: [...(p.attachments || []), newAttachment]
          }
        }
        return p
      }))

      setAttachmentForm({
        title: "",
        type: "task",
        content: "",
        fileUrl: ""
      })
    } catch (error) {
      console.error("Failed to add attachment:", error)
    }
  }

  const handleUpdateAttachmentStatus = async (attachmentId: string, status: "in-progress" | "completed") => {
    const statusText = status === 'completed' ? 'complete' : 'start';
    if (!window.confirm(`Are you sure you want to ${statusText} this attachment?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/attachments/${attachmentId}/${status === "in-progress" ? "start" : "finish"}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to update attachment status")
      
      const updatedAttachment = await response.json()
      setProjects(projects.map(p => ({
        ...p,
        attachments: p.attachments?.map(a => 
          a._id === attachmentId ? updatedAttachment : a
        )
      })))
      showAlert(`Attachment ${statusText}ed successfully`, 'success');
    } catch (error) {
      showAlert(`Failed to ${statusText} attachment`, 'error');
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-warning",
      "in-progress": "bg-info",
      completed: "bg-success",
    }
    return badges[status as keyof typeof badges] || "bg-secondary"
  }

  const renderProjectActions = (project: Project) => (
    <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
      {project.status !== "completed" && (
        <>
          {project.status === "pending" && (
            <button
              className="btn btn-info glass-btn btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateProjectStatus(project._id, "in-progress");
              }}
            >
              Start
            </button>
          )}
          {project.status === "in-progress" && (
            <button
              className="btn btn-success glass-btn btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateProjectStatus(project._id, "completed");
              }}
            >
              Complete
            </button>
          )}
        </>
      )}
      <button 
        className="btn btn-outline-primary glass-btn btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(project);
        }}
      >
        <i className="bi bi-pencil me-1"></i>
        Edit
      </button>
      <button 
        className="btn btn-outline-danger glass-btn btn-sm"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(project._id);
        }}
      >
        <i className="bi bi-trash me-1"></i>
        Delete
      </button>
    </div>
  )

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
          <div className="glass-card p-4">
            <div className="text-center">
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-light mt-3">Loading Projects...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAttachmentsSection = () => {
    if (!editingProject) return null;

    return (
      <div className="mt-4">
        <h6 className="text-white mb-3">Attachments</h6>
        {editingProject.attachments?.map(attachment => (
          <div key={attachment._id} className="glass-card p-2 mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className={`badge me-2 ${
                  attachment.status === 'completed' ? 'bg-success' : 
                  attachment.status === 'in-progress' ? 'bg-info' : 
                  'bg-warning'
                }`}>
                  {attachment.status}
                </span>
                <span className="badge bg-secondary me-2">{attachment.type}</span>
                <span className="text-white">{attachment.title}</span>
              </div>
              <div>
                {attachment.status !== 'completed' && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleUpdateAttachmentStatus(attachment._id, "in-progress")}
                      disabled={attachment.status === "in-progress"}
                    >
                      Start
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => handleUpdateAttachmentStatus(attachment._id, "completed")}
                    >
                      Complete
                    </button>
                  </>
                )}
              </div>
            </div>
            {(attachment.content || attachment.fileUrl) && (
              <div className="mt-2 ps-4">
                {attachment.type === 'file' ? (
                  <a href={attachment.fileUrl} className="text-info" target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                ) : (
                  <p className="text-light mb-0 small">{attachment.content}</p>
                )}
              </div>
            )}
          </div>
        ))}
        
        <form onSubmit={handleAddAttachment} className="mt-3">
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control glass-input"
                placeholder="Title"
                value={attachmentForm.title}
                onChange={(e) => setAttachmentForm({...attachmentForm, title: e.target.value})}
                required
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select glass-input"
                value={attachmentForm.type}
                onChange={(e) => setAttachmentForm({...attachmentForm, type: e.target.value as "task" | "file" | "note"})}
                required
              >
                <option value="task">Task</option>
                <option value="file">File</option>
                <option value="note">Note</option>
              </select>
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control glass-input"
                placeholder={attachmentForm.type === "file" ? "File URL" : "Content"}
                value={attachmentForm.type === "file" ? attachmentForm.fileUrl : attachmentForm.content}
                onChange={(e) => setAttachmentForm({
                  ...attachmentForm, 
                  [attachmentForm.type === "file" ? "fileUrl" : "content"]: e.target.value
                })}
                required
              />
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-primary glass-btn w-100">Add</button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setShowAttachmentsModal(true);
  };

  const renderAttachmentsModal = () => {
    if (!selectedProject) return null;

    return (
      <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content glass-card">
            <div className="modal-header border-0">
              <h5 className="modal-title text-white">
                Project Attachments: {selectedProject.title}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowAttachmentsModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              {/* Attachments List */}
              <div className="mb-4">
                <h6 className="text-white mb-3">Current Attachments</h6>
                {selectedProject.attachments?.length === 0 ? (
                  <p className="text-light opacity-75">No attachments yet</p>
                ) : (
                  selectedProject.attachments?.map(attachment => (
                    <div key={attachment._id} className="glass-card p-3 mb-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className={`badge me-2 ${
                            attachment.status === 'completed' ? 'bg-success' : 
                            attachment.status === 'in-progress' ? 'bg-info' : 
                            'bg-warning'
                          }`}>
                            {attachment.status}
                          </span>
                          <span className="badge bg-secondary me-2">{attachment.type}</span>
                          <span className="text-white">{attachment.title}</span>
                        </div>
                        <div className="d-flex gap-2">
                          {attachment.status !== 'completed' && (
                            <>
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateAttachmentStatus(attachment._id, "in-progress");
                                }}
                                disabled={attachment.status === "in-progress"}
                              >
                                <i className="bi bi-play-fill me-1"></i>
                                Start
                              </button>
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateAttachmentStatus(attachment._id, "completed");
                                }}
                              >
                                <i className="bi bi-check-lg me-1"></i>
                                Complete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {(attachment.content || attachment.fileUrl) && (
                        <div className="mt-2">
                          {attachment.type === 'file' ? (
                            <a href={attachment.fileUrl} className="text-info" target="_blank" rel="noopener noreferrer">
                              View File
                            </a>
                          ) : (
                            <p className="text-light mb-0 small">{attachment.content}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add New Attachment Form */}
              <form onSubmit={handleAddAttachment} className="glass-card p-3">
                <h6 className="text-white mb-3">Add New Attachment</h6>
                <div className="row g-3">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control glass-input"
                      placeholder="Title"
                      value={attachmentForm.title}
                      onChange={(e) => setAttachmentForm({...attachmentForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select glass-input"
                      value={attachmentForm.type}
                      onChange={(e) => setAttachmentForm({...attachmentForm, type: e.target.value as "task" | "file" | "note"})}
                      required
                    >
                      <option value="task">Task</option>
                      <option value="file">File</option>
                      <option value="note">Note</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control glass-input"
                      placeholder={attachmentForm.type === "file" ? "File URL" : "Content"}
                      value={attachmentForm.type === "file" ? attachmentForm.fileUrl : attachmentForm.content}
                      onChange={(e) => setAttachmentForm({
                        ...attachmentForm, 
                        [attachmentForm.type === "file" ? "fileUrl" : "content"]: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div className="col-md-1">
                    <button type="submit" className="btn btn-primary glass-btn w-100">Add</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectsList = () => {
    return projects.map((project) => (
      <div 
        key={project._id} 
        className="glass-card p-3 mb-3"
        style={{ cursor: 'pointer' }}
        onClick={() => handleProjectClick(project)}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <h5 className="text-white mb-0 me-2">{project.title}</h5>
              <span className={`badge ${getStatusBadge(project.status)}`}>
                {project.status.replace("-", " ")}
              </span>
            </div>
            <p className="text-light opacity-75 mb-2">{project.description}</p>
            <div className="d-flex flex-wrap gap-3 mb-2">
              <small className="text-light">
                <i className="bi bi-envelope me-1"></i>
                {project.userEmail}
              </small>
              <small className="text-light">
                <i className="bi bi-calendar-event me-1"></i>
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </small>
              <small className="text-light">
                <i className="bi bi-paperclip me-1"></i>
                {project.attachments?.length || 0} attachments
              </small>
            </div>
          </div>
          {renderProjectActions(project)}
        </div>
      </div>
    ));
  };

  return (
    <div className="admin-dashboard-container">
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="text-white mb-1">Project Management</h1>
                  <p className="text-light opacity-75 mb-0">Manage client projects and track progress</p>
                </div>
                <div className="d-flex gap-3">
                  
                  <button
                    className="btn btn-outline-light glass-btn"
                    onClick={() => (window.location.href = "/admin/dashboard")}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        {alert.show && (
          <div className="row mb-4">
            <div className="col-12">
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ show: false, message: '', type: 'info' })}
              />
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="row">
          <div className="col-12">
            <div className="glass-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="text-white mb-0">Projects ({projects.length})</h3>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary glass-btn"
                    onClick={() => {
                      setEditingProject(null)
                      setFormData({
                        title: "",
                        description: "",
                        userEmail: "",
                        startDate: "",
                        endDate: "",
                        status: "pending",
                      })
                      setShowModal(true)
                    }}
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    New Project
                  </button>
                </div>
              </div>
              
              <div className="projects-list" style={{ maxHeight: "700px", overflowY: "auto" }}>
                {projects.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-folder text-light opacity-50" style={{ fontSize: "3rem" }}></i>
                    <p className="text-light opacity-75 mt-3">No projects found</p>
                  </div>
                ) : (
                  renderProjectsList()
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content glass-card">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-white">{editingProject ? "Edit Project" : "Add New Project"}</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label text-light">Project Title</label>
                      <input
                        type="text"
                        className="form-control glass-input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-light">Description</label>
                      <textarea
                        className="form-control glass-input"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-light">Client Email</label>
                      <input
                        type="email"
                        className="form-control glass-input"
                        value={formData.userEmail}
                        onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                        required
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label text-light">Start Date</label>
                        <input
                          type="date"
                          className="form-control glass-input"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label text-light">End Date</label>
                        <input
                          type="date"
                          className="form-control glass-input"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-light">Status</label>
                      <select
                        className="form-select glass-input"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as "pending" | "in-progress" | "completed",
                          })
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    {editingProject && renderAttachmentsSection()}
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-secondary glass-btn" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary glass-btn">
                      {editingProject ? "Update" : "Create"} Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {showAttachmentsModal && renderAttachmentsModal()}
        
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        />
      </div>
    </div>
  )
}

export default AdminProjects
