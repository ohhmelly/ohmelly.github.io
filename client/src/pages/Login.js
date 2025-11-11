import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In production, call actual API
      // const response = await fetch('/api/auth/login', { ... });

      // Demo login
      if (email && password) {
        const demoUser = {
          id: 'USER-DEMO-001',
          email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'Doctor',
          username: email.split('@')[0]
        };
        const demoToken = 'demo-jwt-token-' + Date.now();

        setTimeout(() => {
          onLogin(demoUser, demoToken);
        }, 500);
      } else {
        setError('Please enter email and password');
        setLoading(false);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🏥 Colorado EHR System</h1>
          <p>Electronic Health Records with Integrated Billing</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@colorado-ehr.gov"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p className="security-notice">
            🔒 HIPAA Compliant • Secure Authentication • 256-bit Encryption
          </p>
          <p className="demo-notice">
            Demo Mode: Use any email/password to login
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
