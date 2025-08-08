# Student Fill Account Details Form

This is a multi-step form component for students to fill in their account details. The form consists of 4 steps:

## Form Steps

### Step 1: Personal Information
- First Name (required)
- Last Name (required)
- Email ID (required, read-only)
- Phone Number (required)
- Date of Birth (required, age validation 16-100)
- City (required)
- Gender (required)

### Step 2: Education Information
- Type selection (required):
  - School Student
  - College Student
  - Fresher
  - Working Professional

**Conditional fields based on type:**
- **School Student**: Standard (Class XII, Class XI, Class X or below)
- **College Student/Fresher**: Course, College Name, Specialization, Start Year, End Year
- **Working Professional**: Experience, Job Role, Company, Start Year, End Year, Salary

### Step 3: Skills
- Domain selection with search functionality
- Skill selection for each domain
- Certificate upload for each domain
- Company/Institution where skills were learned

### Step 4: Preferences
- Currently looking for: Jobs, Internship, Project (multiple selection)
- Work mode: In-office, Hybrid, Work from home (multiple selection)

## Form Submission Flow

1. **Authentication Check**: Verifies user is logged in and has valid token
2. **Form Validation**: Validates all required fields using Zod schema
3. **Data Preparation**: Formats form data according to API requirements
4. **User Details Check**: Checks if user details already exist
5. **API Call**: Creates or updates user details via API
6. **Success Handling**: Shows success message and redirects to jobs page
7. **Error Handling**: Shows specific error messages for different failure scenarios

## Key Features

- **Multi-step navigation**: Back/Next buttons with step validation
- **Conditional validation**: Different validation rules based on user type
- **Form state management**: Uses react-hook-form with FormProvider
- **API integration**: Handles create/update operations
- **Error handling**: Comprehensive error handling with user feedback
- **Loading states**: Shows loading indicators during API calls
- **Authentication**: Requires valid user session

## Technical Implementation

- **Form Library**: react-hook-form with zod validation
- **State Management**: Redux for user authentication
- **API Integration**: Custom API service with axios
- **UI Components**: Custom UI components with Tailwind CSS
- **File Upload**: Image upload for certificates
- **Responsive Design**: Mobile-first responsive layout

## Usage

```jsx
import StudentFillAccountDetails from './StudentFillAccountDetails';

// The component automatically handles:
// - User authentication check
// - Form validation
// - API submission
// - Navigation after completion
```

## API Endpoints Used

- `POST /user-details/detail` - Create user details
- `PUT /user-details/detail/:userId` - Update user details
- `GET /user-details/detail/:userId` - Check if user details exist

## Error Handling

The form handles various error scenarios:
- Authentication errors (redirects to login)
- Validation errors (shows field-specific messages)
- API errors (shows backend error messages)
- Network errors (shows generic error message) 