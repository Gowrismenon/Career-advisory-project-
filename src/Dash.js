import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useIdleTimer from './useIdleTimer'; // Import the hook
//import './Dashboard.css';
import MentalSupportChat from './mental.js';
import Lead from "./Lead.js";
import Reskill from "./Reskill.js";

const Dashboard = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();
  const [reply, setReply] = useState("");
  // Add idle timer (5 minutes of inactivity)
  useIdleTimer(5); // Set to 5 minutes, change to 10 for 10 minutes

  useEffect(() => {
    const loggedInEmployee = localStorage.getItem('loggedInEmployee');
    
    if (!loggedInEmployee) {
      navigate('/login');
    } else {
      setEmployee(JSON.parse(loggedInEmployee));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInEmployee');
    navigate('/login');
  };
  const generateAIResponse =  async (userInput) => {
    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      
      const data = await response.json();
      setReply(data.reply); 
    } catch (err) {
      console.error("Error:", err);
    }
  };

  


  if (!employee) return <div className="loading">Loading...</div>;



  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📊 Employee Portal</h1>
        </div>
        <div className="user-section">
          <span className="user-name">{employee.name}</span>
          <button onClick={handleLogout} className="logout-btn" >
            Logout 🚪
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2 className='welcome-titlee'>👋 Welcome back, {employee.name}!</h2>
          <p className="welcome-subtitle">Here's your employee information</p>
          
          <div className="employee-info-grid">
            <div className="info-item">
              <span className="info-label">🆔 Employee ID : </span>
              <span className="info-value">{employee.employeeId}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">👤 Full Name : </span>
              <span className="info-value">{employee.name}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">📧 Email : </span>
              <span className="info-value">{employee.email}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">💼 Role : </span>
              <span className="info-value role-badge">{employee.role}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">🏢 Department : </span>
              <span className="info-value">{employee.department}</span>
            </div>
          </div>
        <button className='reskill-badge' onClick ={()=>generateAIResponse(`Reskill plan for ${employee.role}.`)}>Recommend Reskill Plan</button>
        </div>

        {employee.role === 'Admin' && (
          <div className="admin-panel">
            <h3>🔑 Admin Panel</h3>
            <p>You have administrative access to manage employees and settings.</p>
          </div>
        )}
        
        {<div className="section-card" style={{ marginTop: "20px" }}>
            <b></b> {reply.split('\n').map((line, idx) => (
    <p key={idx}>{line}</p>
  ))}
          </div>
        }

        <div className='section-card'>
        <h3 className='section-title'> LeaderShip Qualities to be developed : </h3>
        <div><Lead employee = {employee} /></div>
        </div>

        <div className='section-card'>
        <h3 className='section-title'>Career PathWay : </h3>
        <div><Reskill employee = {employee} /></div>
        </div>
      </div>
      <div><MentalSupportChat/></div>
    </div>
  );
};

export default Dashboard;