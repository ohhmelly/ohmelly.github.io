import React, { useState } from 'react';

function Billing() {
  const [claims] = useState([
    {
      id: 'BILL-001',
      claimNumber: 'CO20250110-00001',
      date: '2025-01-10',
      patient: 'John Smith',
      provider: 'Dr. Johnson',
      totalCharges: 150.00,
      insurance: 'Colorado Medicaid',
      status: 'Submitted'
    },
    {
      id: 'BILL-002',
      claimNumber: 'CO20250110-00002',
      date: '2025-01-10',
      patient: 'Mary Davis',
      provider: 'Dr. Wilson',
      totalCharges: 200.00,
      insurance: 'Medicare',
      status: 'Paid'
    }
  ]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'Draft': 'badge-secondary',
      'Ready': 'badge-info',
      'Submitted': 'badge-warning',
      'Paid': 'badge-success',
      'Denied': 'badge-danger'
    };
    return statusMap[status] || 'badge-info';
  };

  return (
    <div className="billing">
      <div className="page-header">
        <h1>Billing & Claims Management</h1>
        <div className="page-actions">
          <button className="btn btn-primary">+ New Claim</button>
          <button className="btn btn-success">Submit Batch</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Claims</h3>
          <div className="value">247</div>
          <div className="change">This month</div>
        </div>
        <div className="stat-card success">
          <h3>Paid Claims</h3>
          <div className="value">189</div>
          <div className="change">76.5% success rate</div>
        </div>
        <div className="stat-card warning">
          <h3>Pending Claims</h3>
          <div className="value">45</div>
          <div className="change">Under review</div>
        </div>
        <div className="stat-card danger">
          <h3>Denied Claims</h3>
          <div className="value">13</div>
          <div className="change">Need attention</div>
        </div>
      </div>

      <div className="filter-group">
        <select>
          <option>All Statuses</option>
          <option>Draft</option>
          <option>Ready</option>
          <option>Submitted</option>
          <option>Paid</option>
          <option>Denied</option>
        </select>
        <select>
          <option>All Insurance</option>
          <option>Colorado Medicaid</option>
          <option>Medicare</option>
          <option>Private Insurance</option>
        </select>
        <input type="date" />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Claim #</th>
              <th>Date</th>
              <th>Patient</th>
              <th>Provider</th>
              <th>Insurance</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.map(claim => (
              <tr key={claim.id}>
                <td>{claim.claimNumber}</td>
                <td>{claim.date}</td>
                <td>{claim.patient}</td>
                <td>{claim.provider}</td>
                <td>{claim.insurance}</td>
                <td>${claim.totalCharges.toFixed(2)}</td>
                <td>
                  <span className={`badge ${getStatusBadge(claim.status)}`}>
                    {claim.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-primary">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Billing;
