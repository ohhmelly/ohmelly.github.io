#!/bin/bash

# Colorado EHR System - Quick Test Script
echo "🏥 Colorado EHR System - API Test"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Health Check
echo -e "${BLUE}1. Testing Backend Health...${NC}"
curl -s http://localhost:5000/api/health | jq .
echo ""

# 2. Login
echo -e "${BLUE}2. User Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "doctor@test.com", "password": "test123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
echo $LOGIN_RESPONSE | jq .
echo ""

# 3. Create a Patient
echo -e "${BLUE}3. Creating a Patient...${NC}"
curl -s -X POST http://localhost:5000/api/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "1985-03-15",
    "gender": "Female",
    "phone": "(720) 555-1234",
    "email": "jane.smith@example.com",
    "address": {
      "street": "789 Oak Ave",
      "city": "Denver",
      "state": "Colorado",
      "zipCode": "80202"
    },
    "insurance": {
      "primary": {
        "provider": "Colorado Medicaid",
        "policyNumber": "MED123456"
      },
      "medicaid": {
        "eligible": true,
        "id": "CO-MED-2024-001"
      }
    }
  }' | jq .
echo ""

# 4. Get All Patients
echo -e "${BLUE}4. Fetching All Patients...${NC}"
curl -s http://localhost:5000/api/patients \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 5. Get CPT Codes (Billing Reference)
echo -e "${BLUE}5. Getting Common CPT Codes (Billing)...${NC}"
curl -s http://localhost:5000/api/billing/reference/cpt-codes \
  -H "Authorization: Bearer $TOKEN" | jq '.[0:3]'
echo ""

# 6. Get Quality Metrics
echo -e "${BLUE}6. Getting Quality Metrics (Reporting)...${NC}"
curl -s 'http://localhost:5000/api/reporting/quality-metrics?startDate=2025-01-01&endDate=2025-01-31' \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo -e "${GREEN}✅ All Tests Complete!${NC}"
echo ""
echo "🌐 Frontend is running at: http://localhost:3000"
echo "🔌 Backend API is running at: http://localhost:5000"
echo ""
echo "To access the web interface:"
echo "1. Use VS Code port forwarding for port 3000"
echo "2. Or use 'gh codespace ports forward 3000:3000' if in GitHub Codespaces"
