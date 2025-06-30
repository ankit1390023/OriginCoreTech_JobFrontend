# User Details API Implementation

## Overview
This implementation provides a complete API integration for the user details form, including skill uploads. The frontend is designed to work with the existing backend structure.

## API Endpoints

### Create User Details
- **URL**: `POST {{BASE_URL}}/user-details/detail`
- **Description**: Creates user details with all form data except skills

### Get User Details
- **URL**: `GET {{BASE_URL}}/user-details/detail/:userId`
- **Description**: Retrieves user details by userId

### Update User Details
- **URL**: `PUT {{BASE_URL}}/user-details/detail/:userId`
- **Description**: Updates existing user details

### Upload Skill Certificates
- **URL**: `POST http://212.95.51.83:3000/upload-skill`
- **Description**: Uploads multiple skill certificates for a single user
- **Content-Type**: `multipart/form-data`

## Data Structure

### User Details API
The API expects the following data structure based on the existing backend:

```json
{
  "firstName": "Megha",
  "lastName": "Gupta",
  "email": "megha123@gmail.com",
  "phone": "58798598",
  "dob": "1990-01-01",
  "currentLocation": "Delhi",
  "gender": "Female",
  "userType": "Working Professional",
  "jobLocation": "San Francisco",
  "salaryDetails": "100000",
  "currentlyLookingFor": "job",
  "workMode": "Remote",
  "experiences": [
    {
      "currentJobRole": "Software Engineer",
      "currentCompany": "OriginCore",
      "totalExperience": "1-2 years"
    }
  ]
}
```

### Skill Upload API
The skill upload API expects multipart form data:

**Form Data:**
- `user_id` (Integer): References User.id
- `skills` (JSON string): Array of skill objects
- `certificate_image_<index>` (File): Certificate image for each skill

**Skills Array Example:**
```json
[
  {
    "skill_id": 101,
    "skill": "JavaScript",
    "authority": "Udemy"
  },
  {
    "skill_id": 102,
    "skill": "Node.js",
    "authority": "Coursera"
  }
]
```

## Field Mappings

The frontend maps form fields to the correct UserDetail model fields:

- `formData.city` → `currentLocation` (not `city`)
- `formData.college` → `college` (not `collegeName`)
- `formData.standard` → `Standard` (not `educationStandard`)

## Form Components Integrated

1. **PersonalInfo.jsx** - Collects basic user information
2. **EducationInfo.jsx** - Collects education and work experience details
3. **PreferencesForm.jsx** - Collects job preferences and work mode
4. **SkillsForm.jsx** - Collects skills and certificates (separate API)

## Files Modified/Created

### Frontend
- `src/api/userDetailsApi.js` - User details API service
- `src/api/skillApi.js` - Skill upload API service (NEW)
- `src/components/studentFillAccountDetails/StudentFillAccountDetails.jsx` - Updated form submission logic
- `src/components/studentFillAccountDetails/PreferencesForm.jsx` - Added form field registration
- `src/components/studentFillAccountDetails/SkillsForm.jsx` - Added skill upload functionality (UPDATED)
- `src/api/educationApi.js` - Added fallback URL

## Usage

### User Details Form
1. Fill out the form through the UI
2. Click "Submit" on the final step
3. The form data will be automatically collected and sent to the backend
4. The backend will:
   - Find the user by email
   - Create user details record
   - Create associated experience records if provided

### Skills Upload
1. Add domains/skills in the SkillsForm
2. Upload certificate files for each skill
3. Fill in the authority/company name
4. Click "Upload Skills" button
5. Skills and certificates will be uploaded to the skill API

## Backend Integration

The frontend works with the existing backend structure:
- Uses email to find the user (no userId required in request)
- Backend automatically handles user lookup and ID assignment
- Supports all existing UserDetail model fields
- Creates Experience records with proper associations
- Separate skill upload API for certificates

## Notes

- The backend finds the user by email address
- Skills data is handled separately via dedicated upload API
- Array fields (currentlyLookingFor, workMode) are converted to comma-separated strings for storage
- Education fields are conditionally included based on user type
- Experience records are created for working professionals
- Skill certificates are uploaded as multipart form data 