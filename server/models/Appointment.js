/**
 * Appointment Model
 * Manages patient appointments and scheduling
 */

class Appointment {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.appointmentNumber = data.appointmentNumber || this.generateAppointmentNumber();

    // References
    this.patientId = data.patientId;
    this.providerId = data.providerId;
    this.facilityId = data.facilityId || 'MAIN-CLINIC';

    // Appointment Details
    this.appointmentDate = data.appointmentDate;
    this.appointmentTime = data.appointmentTime;
    this.duration = data.duration || 30; // minutes
    this.type = data.type || 'Office Visit'; // Office Visit, Follow-up, New Patient, Telehealth, etc.
    this.reasonForVisit = data.reasonForVisit || '';
    this.visitType = data.visitType || 'In-Person'; // In-Person, Telehealth, Phone

    // Status Management
    this.status = data.status || 'Scheduled'; // Scheduled, Confirmed, Checked-In, In-Progress, Completed, Cancelled, No-Show
    this.checkInTime = data.checkInTime || null;
    this.checkOutTime = data.checkOutTime || null;

    // Telehealth (Colorado specific - expanded access in rural areas)
    this.telehealth = {
      enabled: data.telehealth?.enabled || false,
      platform: data.telehealth?.platform || '', // Zoom, Teams, etc.
      meetingLink: data.telehealth?.meetingLink || '',
      meetingId: data.telehealth?.meetingId || ''
    };

    // Clinical Notes (brief)
    this.chiefComplaint = data.chiefComplaint || '';
    this.notes = data.notes || '';

    // Billing
    this.copay = data.copay || 0;
    this.copayCollected = data.copayCollected || false;
    this.billingCodes = data.billingCodes || []; // CPT codes assigned during visit

    // Reminders
    this.reminderSent = data.reminderSent || false;
    this.reminderSentAt = data.reminderSentAt || null;

    // System metadata
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.createdBy = data.createdBy || null;
    this.cancelledAt = data.cancelledAt || null;
    this.cancelledBy = data.cancelledBy || null;
    this.cancellationReason = data.cancellationReason || '';
  }

  generateId() {
    return `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateAppointmentNumber() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${date}-${random}`;
  }

  checkIn() {
    this.status = 'Checked-In';
    this.checkInTime = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  start() {
    this.status = 'In-Progress';
    this.updatedAt = new Date().toISOString();
  }

  complete() {
    this.status = 'Completed';
    this.checkOutTime = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  cancel(reason, userId) {
    this.status = 'Cancelled';
    this.cancelledAt = new Date().toISOString();
    this.cancelledBy = userId;
    this.cancellationReason = reason;
    this.updatedAt = new Date().toISOString();
  }

  noShow() {
    this.status = 'No-Show';
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Appointment;
