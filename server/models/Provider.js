/**
 * Provider/Healthcare Professional Model
 * Represents doctors, nurses, and other medical staff
 */

class Provider {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.npi = data.npi; // National Provider Identifier (required for billing)
    this.deaNumber = data.deaNumber || ''; // DEA number for prescribing controlled substances
    this.coloradoMedicalLicense = data.coloradoMedicalLicense || '';

    // Personal Information
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.middleName = data.middleName || '';
    this.credentials = data.credentials || ''; // MD, DO, RN, PA, NP, etc.
    this.email = data.email;
    this.phone = data.phone;

    // Professional Information
    this.specialties = data.specialties || []; // Primary Care, Cardiology, Pediatrics, etc.
    this.department = data.department || '';
    this.role = data.role || 'Physician'; // Physician, Nurse, PA, NP, Admin, etc.
    this.employeeId = data.employeeId || '';

    // Practice Information
    this.practiceLocations = data.practiceLocations || [];
    this.acceptingNewPatients = data.acceptingNewPatients !== false;
    this.languages = data.languages || ['English'];

    // Scheduling
    this.schedule = data.schedule || {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: null, end: null, available: false },
      sunday: { start: null, end: null, available: false }
    };

    // Billing Information
    this.billing = {
      taxId: data.billing?.taxId || '',
      taxonomyCode: data.billing?.taxonomyCode || '',
      acceptedInsurance: data.billing?.acceptedInsurance || [
        'Colorado Medicaid',
        'Medicare',
        'Private Insurance'
      ]
    };

    // System metadata
    this.status = data.status || 'Active'; // Active, Inactive, On Leave
    this.hireDate = data.hireDate || new Date().toISOString();
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  generateId() {
    return `PRV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getFullName() {
    return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}${this.credentials ? ', ' + this.credentials : ''}`;
  }

  isAvailable(dayOfWeek) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const day = days[dayOfWeek];
    return this.schedule[day]?.available || false;
  }
}

module.exports = Provider;
