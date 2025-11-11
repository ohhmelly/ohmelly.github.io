const crypto = require('crypto-js');

/**
 * Patient Model - HIPAA Compliant
 * Stores patient demographic and insurance information
 */

class Patient {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.mrn = data.mrn || this.generateMRN(); // Medical Record Number

    // Demographics (PHI - Protected Health Information)
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.middleName = data.middleName || '';
    this.dateOfBirth = data.dateOfBirth;
    this.ssn = data.ssn ? this.encryptPHI(data.ssn) : null; // Encrypted
    this.gender = data.gender; // Male, Female, Other, Unknown
    this.race = data.race;
    this.ethnicity = data.ethnicity;
    this.preferredLanguage = data.preferredLanguage || 'English';

    // Contact Information
    this.address = {
      street: data.address?.street || '',
      city: data.address?.city || '',
      state: data.address?.state || 'Colorado',
      zipCode: data.address?.zipCode || '',
      county: data.address?.county || ''
    };
    this.phone = data.phone;
    this.email = data.email;
    this.emergencyContact = {
      name: data.emergencyContact?.name || '',
      relationship: data.emergencyContact?.relationship || '',
      phone: data.emergencyContact?.phone || ''
    };

    // Insurance Information (Colorado Medicaid Integration)
    this.insurance = {
      primary: {
        provider: data.insurance?.primary?.provider || '',
        policyNumber: data.insurance?.primary?.policyNumber || '',
        groupNumber: data.insurance?.primary?.groupNumber || '',
        subscriberId: data.insurance?.primary?.subscriberId || '',
        relationship: data.insurance?.primary?.relationship || 'Self',
        effectiveDate: data.insurance?.primary?.effectiveDate || null,
        terminationDate: data.insurance?.primary?.terminationDate || null
      },
      secondary: data.insurance?.secondary || null,
      medicaid: {
        eligible: data.insurance?.medicaid?.eligible || false,
        id: data.insurance?.medicaid?.id || '',
        programType: data.insurance?.medicaid?.programType || '' // CHP+, Old Age Pension, etc.
      },
      medicare: {
        eligible: data.insurance?.medicare?.eligible || false,
        id: data.insurance?.medicare?.id || ''
      }
    };

    // Clinical Information
    this.primaryCareProvider = data.primaryCareProvider || null;
    this.allergies = data.allergies || [];
    this.chronicConditions = data.chronicConditions || [];
    this.medications = data.medications || [];
    this.bloodType = data.bloodType || 'Unknown';

    // Colorado Specific
    this.coloradoResident = data.coloradoResident !== false;
    this.immunizationRegistryConsent = data.immunizationRegistryConsent || false;
    this.pdmpConsent = data.pdmpConsent || false; // Prescription Drug Monitoring Program

    // System metadata
    this.status = data.status || 'Active'; // Active, Inactive, Deceased
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.createdBy = data.createdBy || null;
    this.lastModifiedBy = data.lastModifiedBy || null;
  }

  generateId() {
    return `PAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateMRN() {
    // Colorado EHR format: CO-YYYYMMDD-XXXX
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `CO-${date}-${random}`;
  }

  encryptPHI(data) {
    const key = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    return crypto.AES.encrypt(data, key).toString();
  }

  decryptPHI(encryptedData) {
    const key = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    const bytes = crypto.AES.decrypt(encryptedData, key);
    return bytes.toString(crypto.enc.Utf8);
  }

  getAge() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getFullName() {
    return `${this.firstName} ${this.middleName ? this.middleName + ' ' : ''}${this.lastName}`;
  }

  // HIPAA Compliant - Return sanitized data (remove encrypted fields)
  toJSON() {
    const obj = { ...this };
    // Don't expose encrypted SSN in API responses
    if (obj.ssn) {
      obj.ssn = '***-**-' + obj.ssn.slice(-4);
    }
    return obj;
  }
}

module.exports = Patient;
