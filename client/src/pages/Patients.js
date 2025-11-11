import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // In production, fetch from API
    setPatients([
      {
        id: 'PAT-001',
        mrn: 'CO-20250111-0001',
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1975-06-15',
        phone: '(303) 555-0101',
        insurance: 'Colorado Medicaid',
        status: 'Active'
      },
      {
        id: 'PAT-002',
        mrn: 'CO-20250111-0002',
        firstName: 'Mary',
        lastName: 'Johnson',
        dateOfBirth: '1988-03-22',
        phone: '(720) 555-0202',
        insurance: 'Medicare',
        status: 'Active'
      },
      {
        id: 'PAT-003',
        mrn: 'CO-20250111-0003',
        firstName: 'Robert',
        lastName: 'Williams',
        dateOfBirth: '1962-11-08',
        phone: '(303) 555-0303',
        insurance: 'Private Insurance',
        status: 'Active'
      }
    ]);
  }, []);

  const filteredPatients = patients.filter(p =>
    p.firstName.toLowerCase().includes(search.toLowerCase()) ||
    p.lastName.toLowerCase().includes(search.toLowerCase()) ||
    p.mrn.includes(search) ||
    p.phone.includes(search)
  );

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="patients">
      <div className="page-header">
        <h1>Patient Management</h1>
        <div className="page-actions">
          <button className="btn btn-primary">+ New Patient</button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, MRN, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>MRN</th>
              <th>Name</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Insurance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.mrn}</td>
                <td>{patient.firstName} {patient.lastName}</td>
                <td>{calculateAge(patient.dateOfBirth)}</td>
                <td>{patient.phone}</td>
                <td>{patient.insurance}</td>
                <td>
                  <span className="badge badge-success">{patient.status}</span>
                </td>
                <td>
                  <Link to={`/patients/${patient.id}`} className="btn btn-sm btn-primary">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Patients;
