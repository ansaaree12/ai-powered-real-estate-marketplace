import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import "./AgentDetails.css";

const AgentDetail = () => {
    const { id } = useParams();
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messageForm, setMessageForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        const fetchAgentDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://localhost:8000/api/agents/${id}`);
                setAgent(response.data);
            } catch (error) {
                console.error("Error fetching agent details:", error);
                setError(error.response?.data?.message || "Failed to fetch agent details");
                toast.error("Failed to fetch agent details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAgentDetails();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMessageForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form data
        if (!messageForm.name || !messageForm.email || !messageForm.phone || !messageForm.message) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(messageForm.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Phone validation (basic)
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(messageForm.phone)) {
            toast.error("Please enter a valid phone number");
            return;
        }

        try {
            setSubmitStatus('sending');
            
            const messageData = {
                ...messageForm,
                agentId: id,
                agentName: agent.name,
                timestamp: new Date().toISOString()
            };

            const response = await axios.post(
                'http://localhost:8000/api/messages/create',
                messageData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setSubmitStatus('success');
                toast.success("Message sent successfully!");
                setMessageForm({
                    name: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            } else {
                throw new Error(response.data.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setSubmitStatus('error');
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setTimeout(() => setSubmitStatus(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <PulseLoader color="#4066ff" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="not-found-container">
                <h2>Agent not found</h2>
            </div>
        );
    }

    return (
        <div className="agent-page-wrapper">
            <div className="agent-main-container">
                <div className="agent-content-card">
                    {/* Hero Section */}
                    <div className="agent-hero-section">
                        <div className="agent-profile-container">
                            {agent.profilePicture && (
                                <img 
                                    src={agent.profilePicture} 
                                    alt={agent.name}
                                    className="agent-profile-image"
                                />
                            )}
                            <div className="agent-header-info">
                                <h1>{agent.name}</h1>
                                <p className="agent-title">{agent.specialties}</p>
                                <p className="agent-experience">{agent.experience} Years of Experience</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Contact Links */}
                    <div className="quick-contact-section">
                        <div className="quick-contact-links">
                            <a href={`tel:${agent.phone}`}>
                                <i className="fas fa-phone"></i>
                                {agent.phone}
                            </a>
                            <a href={`mailto:${agent.email}`}>
                                <i className="fas fa-envelope"></i>
                                {agent.email}
                            </a>
                            <a href="https://www.HomeVista123.com/" target="_blank" rel="noopener noreferrer">
                                <i className="fas fa-globe"></i>
                                www.HomeVista.com
                            </a>
                        </div>
                    </div>

                    {/* Vision Statement */}
                    <div className="agent-vision-section">
                        <i className="fas fa-comment vision-icon"></i>
                        <p>Our vision is to make all people the best place to live for them.</p>
                    </div>

                    {/* About Section */}
                    <div className="agent-about-section">
                        <h2>About Me</h2>
                        <p>{agent.description}</p>
                    </div>

                    {/* Contact Information */}
                    <div className="agent-contact-section">
                        <h2>Contact Information</h2>
                        <div className="contact-grid">
                            <div className="contact-item">
                                <i className="fas fa-envelope contact-icon"></i>
                                <div className="contact-info">
                                    <label>Email</label>
                                    <p>{agent.email}</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-phone contact-icon"></i>
                                <div className="contact-info">
                                    <label>Phone</label>
                                    <p>{agent.phone}</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-award contact-icon"></i>
                                <div className="contact-info">
                                    <label>Specialization</label>
                                    <p>{agent.specialties}</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-calendar contact-icon"></i>
                                <div className="contact-info">
                                    <label>Member Since</label>
                                    <p>
                                        {new Date(agent.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Section */}
                    <div className="contact-form-section">
                        <h2>Contact {agent.name}</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Name*</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={messageForm.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email*</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={messageForm.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone*</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={messageForm.phone}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message*</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={messageForm.message}
                                    onChange={handleInputChange}
                                    required
                                    rows="4"
                                    placeholder="Write your message here"
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={submitStatus === 'sending'}
                            >
                                {submitStatus === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>
                            {submitStatus === 'success' && (
                                <p className="success-message">Message sent successfully!</p>
                            )}
                            {submitStatus === 'error' && (
                                <p className="error-message">Failed to send message. Please try again.</p>
                            )}
                        </form>
                    </div>

                    {/* Location Information */}
                    <div className="agent-location-section">
                        <i className="fas fa-map-marker-alt location-icon"></i>
                        <p>Mumbai,  Maharashtra,  INDIA</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDetail;