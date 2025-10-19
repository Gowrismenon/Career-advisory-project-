import React, { useState } from 'react';
import employeesData from './employees.json';
import './style/Login.css';
//console.log(employeesData);
function EmployeeLogin() {
  const [credentials, setCredentials] = useState({
    employeeId: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Find employee by ID and Name match
    const employee = employeesData.find(
      emp => emp.employee_id.toLowerCase() === credentials.employeeId.toLowerCase() && 
             emp.personal_info.name.toLowerCase() === credentials.name.toLowerCase()
    );

    if (employee) {
      //console.log(employee);
      // Store employee data in localStorage
      localStorage.setItem('loggedInEmployee', JSON.stringify({
        employeeId: employee.employee_id,
        name: employee.personal_info.name,
        email: employee.personal_info.email,
        role: employee.employment_info.job_title,
        department: employee.employment_info.department
      }));
      
      // Success message (optional)
      console.log('Login successful for:', employee.personal_info.name);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      setError('Invalid Employee ID or Name. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo-section">
          <div className="logo-circle">👤</div>
          <h2>Employee Login</h2>
          <p className="subtitle">Enter your Employee ID and Name</p>
        </div>
        
        {error && <div className="error-message">⚠️ {error}</div>}
        
        <div className="form-group">
          <label htmlFor="employeeId">
            <span className="icon">🆔</span> Employee ID
          </label>
          <input
            id="employeeId"
            type="text"
            name="employeeId"
            value={credentials.employeeId}
            onChange={handleChange}
            placeholder="EMP"
            required
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">
            <span className="icon">👤</span> Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={credentials.name}
            onChange={handleChange}
            placeholder="Name"
            required
            autoComplete="off"
          />
        </div>

        <button type="submit" className="login-button">
          Login →
        </button>

        <div className="help-text">
        </div>
      </form>
    </div>
  );
};

export default EmployeeLogin;