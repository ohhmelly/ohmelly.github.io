/**
 * Medical Record Model
 * Clinical documentation and patient encounters
 */

class MedicalRecord {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.encounterId = data.encounterId || this.generateEncounterId();

    // References
    this.patientId = data.patientId;
    this.providerId = data.providerId;
    this.appointmentId = data.appointmentId || null;
    this.facilityId = data.facilityId || 'MAIN-CLINIC';

    // Encounter Information
    this.encounterDate = data.encounterDate || new Date().toISOString();
    this.encounterType = data.encounterType || 'Office Visit'; // Office Visit, ER, Hospital, Telehealth, etc.

    // SOAP Notes (Subjective, Objective, Assessment, Plan)
    this.soap = {
      subjective: data.soap?.subjective || '', // Patient's description of symptoms
      objective: data.soap?.objective || '', // Physical exam findings, vital signs
      assessment: data.soap?.assessment || '', // Diagnosis/clinical impression
      plan: data.soap?.plan || '' // Treatment plan
    };

    // Vital Signs
    this.vitalSigns = {
      temperature: data.vitalSigns?.temperature || null, // Fahrenheit
      bloodPressureSystolic: data.vitalSigns?.bloodPressureSystolic || null,
      bloodPressureDiastolic: data.vitalSigns?.bloodPressureDiastolic || null,
      heartRate: data.vitalSigns?.heartRate || null, // bpm
      respiratoryRate: data.vitalSigns?.respiratoryRate || null, // breaths per minute
      oxygenSaturation: data.vitalSigns?.oxygenSaturation || null, // %
      weight: data.vitalSigns?.weight || null, // pounds
      height: data.vitalSigns?.height || null, // inches
      bmi: data.vitalSigns?.bmi || null,
      painLevel: data.vitalSigns?.painLevel || null // 0-10 scale
    };

    // Diagnoses (ICD-10 codes)
    this.diagnoses = data.diagnoses || []; // [{ code: 'E11.9', description: 'Type 2 diabetes without complications', type: 'Primary' }]

    // Procedures (CPT codes)
    this.procedures = data.procedures || []; // [{ code: '99213', description: 'Office visit, established patient', modifier: '' }]

    // Prescriptions
    this.prescriptions = data.prescriptions || []; // [{ medication: 'Metformin', dosage: '500mg', frequency: 'twice daily', duration: '30 days' }]

    // Lab Orders
    this.labOrders = data.labOrders || []; // [{ test: 'CBC', status: 'Ordered', orderedDate: '', resultDate: '', results: '' }]

    // Imaging Orders
    this.imagingOrders = data.imagingOrders || []; // [{ type: 'X-Ray', bodyPart: 'Chest', reason: '', status: 'Ordered' }]

    // Referrals
    this.referrals = data.referrals || []; // [{ specialty: 'Cardiology', provider: '', reason: '', status: 'Pending' }]

    // Clinical Notes
    this.notes = data.notes || '';
    this.followUpInstructions = data.followUpInstructions || '';
    this.followUpDate = data.followUpDate || null;

    // Colorado Specific
    this.reportedToImmunizationRegistry = data.reportedToImmunizationRegistry || false;
    this.reportedToPDMP = data.reportedToPDMP || false; // For controlled substance prescriptions

    // Status
    this.status = data.status || 'Draft'; // Draft, Signed, Amended, Final
    this.signedBy = data.signedBy || null;
    this.signedAt = data.signedAt || null;

    // System metadata
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.createdBy = data.createdBy || null;
  }

  generateId() {
    return `MR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateEncounterId() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `ENC-${date}-${random}`;
  }

  calculateBMI() {
    if (this.vitalSigns.weight && this.vitalSigns.height) {
      const bmi = (this.vitalSigns.weight / (this.vitalSigns.height * this.vitalSigns.height)) * 703;
      this.vitalSigns.bmi = Math.round(bmi * 10) / 10;
    }
  }

  sign(providerId) {
    this.status = 'Signed';
    this.signedBy = providerId;
    this.signedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  finalize() {
    if (this.status === 'Signed') {
      this.status = 'Final';
      this.updatedAt = new Date().toISOString();
    }
  }
}

module.exports = MedicalRecord;
