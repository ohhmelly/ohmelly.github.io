/**
 * Billing and Claims Model
 * Integrated billing system for Colorado EHR
 */

class Billing {
  constructor(data) {
    this.id = data.id || this.generateId();
    this.claimNumber = data.claimNumber || this.generateClaimNumber();

    // References
    this.patientId = data.patientId;
    this.providerId = data.providerId;
    this.medicalRecordId = data.medicalRecordId || null;
    this.appointmentId = data.appointmentId || null;

    // Service Information
    this.serviceDate = data.serviceDate;
    this.placeOfService = data.placeOfService || '11'; // 11 = Office, 21 = Inpatient Hospital, 22 = Outpatient, 02 = Telehealth

    // Diagnosis Codes (ICD-10)
    this.diagnoses = data.diagnoses || []; // Array of ICD-10 codes
    // [{ code: 'E11.9', description: 'Type 2 diabetes without complications', pointer: '1' }]

    // Procedure Codes (CPT/HCPCS)
    this.procedures = data.procedures || [];
    // [{ code: '99213', description: 'Office visit', charge: 150.00, units: 1, modifier: '', diagnosisPointers: ['1'] }]

    // Charges and Payments
    this.totalCharges = data.totalCharges || 0;
    this.patientResponsibility = data.patientResponsibility || 0;
    this.copay = data.copay || 0;
    this.deductible = data.deductible || 0;
    this.coinsurance = data.coinsurance || 0;

    // Insurance Information
    this.primaryInsurance = {
      payerId: data.primaryInsurance?.payerId || '',
      payerName: data.primaryInsurance?.payerName || '',
      policyNumber: data.primaryInsurance?.policyNumber || '',
      groupNumber: data.primaryInsurance?.groupNumber || '',
      subscriberId: data.primaryInsurance?.subscriberId || '',
      amountBilled: data.primaryInsurance?.amountBilled || 0,
      amountPaid: data.primaryInsurance?.amountPaid || 0,
      amountAdjusted: data.primaryInsurance?.amountAdjusted || 0,
      claimStatus: data.primaryInsurance?.claimStatus || 'Ready to Submit'
      // Ready to Submit, Submitted, Accepted, Rejected, Paid, Denied, Pending
    };

    this.secondaryInsurance = data.secondaryInsurance || null;

    // Colorado Medicaid Specific
    this.medicaidClaim = {
      applicable: data.medicaidClaim?.applicable || false,
      recipientId: data.medicaidClaim?.recipientId || '',
      programType: data.medicaidClaim?.programType || '', // CHP+, Old Age Pension, etc.
      priorAuthNumber: data.medicaidClaim?.priorAuthNumber || '',
      submissionDate: data.medicaidClaim?.submissionDate || null,
      responseDate: data.medicaidClaim?.responseDate || null,
      mmisClaimId: data.medicaidClaim?.mmisClaimId || '' // MMIS = Medicaid Management Information System
    };

    // Claims Submission
    this.claimStatus = data.claimStatus || 'Draft'; // Draft, Ready, Submitted, Accepted, Rejected, Paid, Denied, Appealed
    this.submissionDate = data.submissionDate || null;
    this.clearinghouseId = data.clearinghouseId || '';
    this.clearinghouseClaimId = data.clearinghouseClaimId || '';

    // EDI Information (Electronic Data Interchange)
    this.edi = {
      format: data.edi?.format || '837', // 837 Professional, 837 Institutional
      transactionId: data.edi?.transactionId || '',
      submissionFile: data.edi?.submissionFile || '',
      responseFile: data.edi?.responseFile || '',
      errors: data.edi?.errors || []
    };

    // Payment Information
    this.payments = data.payments || [];
    // [{ date: '', amount: 0, method: 'Insurance/Patient/Copay', checkNumber: '', reference: '' }]

    this.adjustments = data.adjustments || [];
    // [{ date: '', amount: 0, reason: 'Contractual Adjustment', code: '' }]

    // Balance
    this.totalPaid = data.totalPaid || 0;
    this.totalAdjusted = data.totalAdjusted || 0;
    this.balance = data.balance || 0;
    this.patientBalance = data.patientBalance || 0;

    // Status tracking
    this.denialReason = data.denialReason || '';
    this.denialCode = data.denialCode || '';
    this.appealDate = data.appealDate || null;
    this.appealStatus = data.appealStatus || '';

    // Billing notes
    this.notes = data.notes || '';
    this.billingProvider = data.billingProvider || null;

    // System metadata
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.createdBy = data.createdBy || null;
  }

  generateId() {
    return `BILL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  generateClaimNumber() {
    // Format: COYYYYMMDD-XXXXX
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `CO${date}-${random}`;
  }

  calculateTotals() {
    // Calculate total charges from procedures
    this.totalCharges = this.procedures.reduce((sum, proc) => {
      return sum + (proc.charge * proc.units);
    }, 0);

    // Calculate balance
    this.totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
    this.totalAdjusted = this.adjustments.reduce((sum, adj) => sum + adj.amount, 0);
    this.balance = this.totalCharges - this.totalPaid - this.totalAdjusted;

    // Update patient balance
    this.patientBalance = this.copay + this.deductible + this.coinsurance -
                          this.payments.filter(p => p.method === 'Patient').reduce((sum, p) => sum + p.amount, 0);
  }

  addPayment(payment) {
    this.payments.push({
      date: payment.date || new Date().toISOString(),
      amount: payment.amount,
      method: payment.method, // Insurance, Patient, Copay, Deductible
      checkNumber: payment.checkNumber || '',
      reference: payment.reference || '',
      payer: payment.payer || ''
    });
    this.calculateTotals();
    this.updatedAt = new Date().toISOString();
  }

  addAdjustment(adjustment) {
    this.adjustments.push({
      date: adjustment.date || new Date().toISOString(),
      amount: adjustment.amount,
      reason: adjustment.reason,
      code: adjustment.code || ''
    });
    this.calculateTotals();
    this.updatedAt = new Date().toISOString();
  }

  submitClaim() {
    if (this.claimStatus === 'Ready' || this.claimStatus === 'Draft') {
      this.claimStatus = 'Submitted';
      this.submissionDate = new Date().toISOString();
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  markPaid() {
    this.claimStatus = 'Paid';
    this.updatedAt = new Date().toISOString();
  }

  markDenied(reason, code) {
    this.claimStatus = 'Denied';
    this.denialReason = reason;
    this.denialCode = code;
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Billing;
