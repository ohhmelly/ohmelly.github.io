import React from 'react';
import { useParams } from 'react-router-dom';

function PatientDetails() {
  const { id } = useParams();

  // In production, fetch patient data from API
  const patient = {
    id,
    mrn: 'CO-20250111-0001',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: '1975-06-15',
    gender: 'Male',
    phone: '(303) 555-0101',
    email: 'john.smith@example.com',
    address: '123 Main St, Denver, CO 80202',
    insurance: 'Colorado Medicaid',
    allergies: ['Penicillin', 'Latex'],
    medications: ['Metformin 500mg - Twice daily', 'Lisinopril 10mg - Once daily']
  };

  return (
    <div className="patient-details">
      <div className="page-header">
        <h1>{patient.firstName} {patient.lastName}</h1>
        <div className="page-actions">
          <button className="btn btn-primary">Edit Patient</button>
          <button className="btn btn-success">Schedule Appointment</button>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Demographics</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <strong>MRN:</strong> {patient.mrn}
            </div>
            <div>
              <strong>Date of Birth:</strong> {patient.dateOfBirth}
            </div>
            <div>
              <strong>Gender:</strong> {patient.gender}
            </div>
            <div>
              <strong>Phone:</strong> {patient.phone}
            </div>
            <div>
              <strong>Email:</strong> {patient.email}
            </div>
            <div>
              <strong>Address:</strong> {patient.address}
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Insurance Information</h2>
          <div>
            <strong>Primary Insurance:</strong>
            <p>{patient.insurance}</p>
          </div>
          <button className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            Verify Eligibility
          </button>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Allergies</h2>
          <ul>
            {patient.allergies.map((allergy, index) => (
              <li key={index} style={{ padding: '0.5rem 0' }}>
                <span className="badge badge-danger">{allergy}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2>Current Medications</h2>
          <ul>
            {patient.medications.map((med, index) => (
              <li key={index} style={{ padding: '0.5rem 0' }}>{med}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h2>Recent Encounters</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Provider</th>
              <th>Type</th>
              <th>Diagnosis</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-01-10</td>
              <td>Dr. Johnson</td>
              <td>Follow-up</td>
              <td>Type 2 Diabetes (E11.9)</td>
              <td>
                <button className="btn btn-sm btn-primary">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientDetails;
