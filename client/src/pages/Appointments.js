import React, { useState } from 'react';

function Appointments() {
  const [appointments] = useState([
    {
      id: 'APT-001',
      date: '2025-01-11',
      time: '09:00',
      patient: 'John Smith',
      provider: 'Dr. Johnson',
      type: 'Follow-up',
      status: 'Scheduled'
    },
    {
      id: 'APT-002',
      date: '2025-01-11',
      time: '09:30',
      patient: 'Mary Davis',
      provider: 'Dr. Wilson',
      type: 'New Patient',
      status: 'Confirmed'
    },
    {
      id: 'APT-003',
      date: '2025-01-11',
      time: '10:00',
      patient: 'Robert Brown',
      provider: 'Dr. Johnson',
      type: 'Annual Physical',
      status: 'Checked-In'
    }
  ]);

  const getStatusBadge = (status) => {
    const statusMap = {
      'Scheduled': 'badge-info',
      'Confirmed': 'badge-primary',
      'Checked-In': 'badge-success',
      'Completed': 'badge-success',
      'Cancelled': 'badge-danger',
      'No-Show': 'badge-warning'
    };
    return statusMap[status] || 'badge-info';
  };

  return (
    <div className="appointments">
      <div className="page-header">
        <h1>Appointment Schedule</h1>
        <div className="page-actions">
          <button className="btn btn-primary">+ New Appointment</button>
        </div>
      </div>

      <div className="filter-group">
        <select>
          <option>All Providers</option>
          <option>Dr. Johnson</option>
          <option>Dr. Wilson</option>
        </select>
        <select>
          <option>All Statuses</option>
          <option>Scheduled</option>
          <option>Confirmed</option>
          <option>Checked-In</option>
          <option>Completed</option>
        </select>
        <input type="date" defaultValue="2025-01-11" />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Patient</th>
              <th>Provider</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(apt => (
              <tr key={apt.id}>
                <td>{apt.date}</td>
                <td>{apt.time}</td>
                <td>{apt.patient}</td>
                <td>{apt.provider}</td>
                <td>{apt.type}</td>
                <td>
                  <span className={`badge ${getStatusBadge(apt.status)}`}>
                    {apt.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-primary">Check In</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;
