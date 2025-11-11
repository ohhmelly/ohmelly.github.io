import React, { useState } from 'react';

function MedicalRecords() {
  const [records] = useState([
    {
      id: 'MR-001',
      encounterId: 'ENC-20250110-00001',
      date: '2025-01-10',
      patient: 'John Smith',
      provider: 'Dr. Johnson',
      type: 'Office Visit',
      diagnosis: 'Type 2 Diabetes (E11.9)',
      status: 'Signed'
    }
  ]);

  return (
    <div className="medical-records">
      <div className="page-header">
        <h1>Medical Records</h1>
        <div className="page-actions">
          <button className="btn btn-primary">+ New Record</button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by patient name, encounter ID..."
        />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Encounter ID</th>
              <th>Date</th>
              <th>Patient</th>
              <th>Provider</th>
              <th>Type</th>
              <th>Diagnosis</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td>{record.encounterId}</td>
                <td>{record.date}</td>
                <td>{record.patient}</td>
                <td>{record.provider}</td>
                <td>{record.type}</td>
                <td>{record.diagnosis}</td>
                <td>
                  <span className="badge badge-success">{record.status}</span>
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

export default MedicalRecords;
