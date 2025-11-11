# Colorado EHR System

A modern, HIPAA-compliant Electronic Health Records (EHR) system designed specifically for the State of Colorado with integrated billing capabilities.

## 🏥 Features

### Core EHR Functionality
- **Patient Management** - Complete patient demographics, insurance information, and medical history
- **Provider Management** - Healthcare professional profiles, schedules, and credentials
- **Appointment Scheduling** - Advanced scheduling with telehealth support
- **Medical Records** - SOAP notes, vital signs, diagnoses (ICD-10), procedures (CPT)
- **E-Prescribing** - Digital prescriptions with controlled substance tracking

### Integrated Billing System
- **Claims Management** - Create, submit, and track insurance claims
- **CPT/ICD-10 Coding** - Automated procedure and diagnosis coding
- **EDI Integration** - Electronic Data Interchange for claim submission
- **Payment Processing** - Track payments, adjustments, and patient balances
- **Denial Management** - Handle claim denials and appeals

### Colorado-Specific Features
- **Medicaid Integration** - Direct integration with Colorado MMIS (Medicaid Management Information System)
- **CHP+ Support** - Child Health Plan Plus eligibility verification
- **PDMP Reporting** - Prescription Drug Monitoring Program compliance
- **Immunization Registry** - Colorado Immunization Information System (CIIS) integration
- **State Reporting** - Automated compliance reporting for Colorado Department of Public Health

### Security & Compliance
- **HIPAA Compliant** - Full compliance with HIPAA Privacy and Security Rules
- **256-bit Encryption** - AES-256 encryption for PHI (Protected Health Information)
- **Role-Based Access Control** - Granular permissions based on user roles
- **Audit Logging** - Complete audit trail for all system activities
- **Secure Authentication** - JWT-based authentication with password hashing

## 🚀 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **crypto-js** - PHI encryption
- **Helmet** - Security headers
- **Rate Limiting** - API protection

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Modern CSS** - Responsive design with CSS variables

### Data Storage
- Designed for **MongoDB** integration (currently using in-memory storage for demo)
- Ready for production database implementation

## 📋 System Requirements

- Node.js 14.x or higher
- npm 6.x or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/colorado-ehr-system.git
cd colorado-ehr-system
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/colorado-ehr
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-256-bit-encryption-key
COLORADO_MEDICAID_API_KEY=your-medicaid-api-key
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
npm run dev
```
Server runs on http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```
Frontend runs on http://localhost:3000

### Production Mode

```bash
# Build frontend
cd client
npm run build
cd ..

# Start server
npm start
```

## 👤 User Roles & Permissions

### Admin
- Full system access
- User management
- System configuration
- All reporting features

### Doctor
- Patient management (create, view, edit)
- Medical records (create, sign, finalize)
- Appointments
- Prescriptions
- View billing information

### Nurse
- Patient management (view, edit)
- Vital signs entry
- Appointment check-in
- Medical records (create, view)

### Receptionist
- Patient registration
- Appointment scheduling
- Check-in/check-out
- Insurance verification

### Billing
- Claims management
- Payment processing
- Insurance verification
- Financial reporting

## 🔐 Security Features

### HIPAA Compliance
- **PHI Encryption** - All Protected Health Information encrypted at rest and in transit
- **Access Controls** - Role-based access with minimum necessary principle
- **Audit Trails** - Comprehensive logging of all PHI access
- **Session Management** - Automatic timeout after inactivity
- **Secure Communication** - HTTPS/TLS for all data transmission

### Authentication
- Bcrypt password hashing (10 salt rounds)
- JWT tokens with 8-hour expiration
- Token refresh mechanism
- Failed login attempt tracking

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting to prevent abuse

## 📊 API Documentation

### Authentication Endpoints

```
POST /api/auth/register - Register new user
POST /api/auth/login - User login
GET /api/auth/verify - Verify JWT token
```

### Patient Endpoints

```
GET /api/patients - Get all patients (paginated)
GET /api/patients/:id - Get single patient
GET /api/patients/mrn/:mrn - Search by MRN
POST /api/patients - Create new patient
PUT /api/patients/:id - Update patient
PATCH /api/patients/:id/deactivate - Deactivate patient
POST /api/patients/:id/check-medicaid - Verify Medicaid eligibility
```

### Appointment Endpoints

```
GET /api/appointments - Get all appointments
GET /api/appointments/:id - Get single appointment
POST /api/appointments - Create appointment
PUT /api/appointments/:id - Update appointment
POST /api/appointments/:id/check-in - Check-in patient
POST /api/appointments/:id/complete - Complete appointment
POST /api/appointments/:id/cancel - Cancel appointment
GET /api/appointments/availability/:providerId - Get available time slots
```

### Medical Records Endpoints

```
GET /api/medical-records/patient/:patientId - Get patient's records
GET /api/medical-records/:id - Get single record
POST /api/medical-records - Create medical record
PUT /api/medical-records/:id - Update record
POST /api/medical-records/:id/sign - Sign record
POST /api/medical-records/:id/prescriptions - Add prescription
```

### Billing Endpoints

```
GET /api/billing - Get all billing records
GET /api/billing/:id - Get single claim
POST /api/billing - Create billing record
POST /api/billing/:id/payment - Add payment
POST /api/billing/:id/submit - Submit claim
POST /api/billing/:id/submit-medicaid - Submit Medicaid claim
GET /api/billing/dashboard/summary - Get billing dashboard
GET /api/billing/reference/cpt-codes - Get common CPT codes
```

### Reporting Endpoints

```
POST /api/reporting/immunization-registry - Report to CIIS
POST /api/reporting/pdmp - Report to PDMP
GET /api/reporting/quality-metrics - Get quality metrics
GET /api/reporting/financial - Get financial report
GET /api/reporting/demographics - Get demographics report
```

## 🏗️ Project Structure

```
colorado-ehr-system/
├── server/
│   ├── index.js              # Express server entry point
│   ├── models/               # Data models
│   │   ├── Patient.js
│   │   ├── Provider.js
│   │   ├── Appointment.js
│   │   ├── MedicalRecord.js
│   │   └── Billing.js
│   └── routes/               # API routes
│       ├── auth.js
│       ├── patients.js
│       ├── providers.js
│       ├── appointments.js
│       ├── medicalRecords.js
│       ├── billing.js
│       └── reporting.js
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/       # React components
│       │   ├── Header.js
│       │   └── Sidebar.js
│       ├── pages/            # Page components
│       │   ├── Login.js
│       │   ├── Dashboard.js
│       │   ├── Patients.js
│       │   ├── Appointments.js
│       │   ├── MedicalRecords.js
│       │   ├── Billing.js
│       │   └── Reporting.js
│       ├── App.js
│       └── index.js
├── package.json
├── .env.example
└── README.md
```

## 📱 User Interface

### Dashboard
- Real-time statistics and metrics
- Today's appointments
- Quick action buttons
- System status indicators

### Patient Management
- Search and filter patients
- Complete demographic information
- Insurance verification
- Medical history view
- Allergy and medication tracking

### Appointment Scheduling
- Calendar view
- Provider availability
- Telehealth support
- Check-in workflow
- Status tracking

### Medical Records
- SOAP note documentation
- Vital signs entry
- ICD-10 diagnosis coding
- CPT procedure coding
- E-prescribing
- Lab and imaging orders

### Billing
- Claim creation and submission
- Payment tracking
- Denial management
- Financial reporting
- Medicaid claim submission

### Reporting
- Colorado state compliance reports
- Quality metrics (HEDIS, PQRS)
- Financial analytics
- Provider productivity
- Demographics analysis

## 🔄 Colorado Integration Points

### Medicaid MMIS
- Real-time eligibility verification
- Electronic claim submission
- Remittance advice processing
- CHP+ program support

### CIIS (Colorado Immunization Information System)
- Immunization record reporting
- Registry synchronization
- Patient consent management

### PDMP (Prescription Drug Monitoring Program)
- Controlled substance reporting
- Prescriber queries
- Patient history access

## 🧪 Testing

Run tests:
```bash
npm test
```

## 🚀 Deployment

### Production Checklist

1. **Environment Configuration**
   - Set `NODE_ENV=production`
   - Configure production database
   - Set secure JWT secret
   - Configure encryption keys
   - Set up Colorado API keys

2. **Security**
   - Enable HTTPS/TLS
   - Configure CORS properly
   - Set up firewall rules
   - Enable rate limiting
   - Configure CSP headers

3. **Database**
   - Set up MongoDB replica set
   - Configure automated backups
   - Enable encryption at rest
   - Set up monitoring

4. **Monitoring**
   - Error logging
   - Performance monitoring
   - Uptime monitoring
   - Security event logging

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📞 Support

For support and questions:
- Email: support@colorado-ehr.gov
- Documentation: https://docs.colorado-ehr.gov
- Issues: https://github.com/yourusername/colorado-ehr-system/issues

## ⚠️ Important Notes

### Demo Mode
This system includes demo/development mode for testing purposes. **DO NOT** use demo mode in production environments.

### HIPAA Compliance
While this system is designed with HIPAA compliance in mind, organizations must:
- Conduct proper security risk assessments
- Implement Business Associate Agreements (BAAs)
- Provide staff training
- Maintain proper policies and procedures
- Perform regular security audits

### Colorado Certification
Before deploying for clinical use:
- Obtain necessary state certifications
- Complete required testing
- Establish agreements with Colorado HCPF (Health Care Policy & Financing)
- Register with Colorado Immunization Registry
- Complete PDMP integration

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core EHR functionality
- ✅ Integrated billing
- ✅ Colorado Medicaid integration
- ✅ HIPAA compliance features

### Phase 2 (Planned)
- Lab integration (HL7/FHIR)
- Imaging integration (DICOM)
- Patient portal
- Mobile applications
- Advanced analytics and AI

### Phase 3 (Future)
- Interoperability (CommonWell, Carequality)
- Population health management
- Value-based care reporting
- Predictive analytics

---

**Built with ❤️ for Colorado Healthcare Providers**

For the latest updates and documentation, visit our website or contact the development team.