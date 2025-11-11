import React, { useEffect, useState } from 'react';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    activePatients: 0,
    pendingClaims: 0,
    revenue: 0
  });

  useEffect(() => {
    // In production, fetch from API
    setStats({
      todayAppointments: 24,
      activePatients: 1542,
      pendingClaims: 87,
      revenue: 125000
    });
  }, []);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <div className="page-actions">
          <span className="welcome-text">Welcome back, {user.firstName}!</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card info">
          <h3>Today's Appointments</h3>
          <div className="value">{stats.todayAppointments}</div>
          <div className="change">6 checked in, 18 scheduled</div>
        </div>

        <div className="stat-card success">
          <h3>Active Patients</h3>
          <div className="value">{stats.activePatients.toLocaleString()}</div>
          <div className="change">+42 this month</div>
        </div>

        <div className="stat-card warning">
          <h3>Pending Claims</h3>
          <div className="value">{stats.pendingClaims}</div>
          <div className="change">12 need attention</div>
        </div>

        <div className="stat-card">
          <h3>Monthly Revenue</h3>
          <div className="value">${(stats.revenue / 1000).toFixed(0)}K</div>
          <div className="change">+15% from last month</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Recent Appointments</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Provider</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>09:00 AM</td>
                <td>John Smith</td>
                <td>Dr. Johnson</td>
                <td><span className="badge badge-success">Checked In</span></td>
              </tr>
              <tr>
                <td>09:30 AM</td>
                <td>Mary Davis</td>
                <td>Dr. Wilson</td>
                <td><span className="badge badge-info">Scheduled</span></td>
              </tr>
              <tr>
                <td>10:00 AM</td>
                <td>Robert Brown</td>
                <td>Dr. Johnson</td>
                <td><span className="badge badge-info">Scheduled</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-primary">Schedule New Appointment</button>
            <button className="btn btn-primary">Register New Patient</button>
            <button className="btn btn-primary">Create Medical Record</button>
            <button className="btn btn-primary">Submit Billing Claim</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>System Information</h2>
        <div className="grid grid-3">
          <div>
            <p><strong>Colorado Medicaid Integration:</strong></p>
            <p className="badge badge-success">Connected</p>
          </div>
          <div>
            <p><strong>PDMP Reporting:</strong></p>
            <p className="badge badge-success">Active</p>
          </div>
          <div>
            <p><strong>Immunization Registry:</strong></p>
            <p className="badge badge-success">Synced</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
