# Job Posting Functionality

## Overview
The job posting form allows recruiters to create internships, jobs, and projects.

## Features
- Support for Internship, Job, and Project types
- Dynamic form fields based on opportunity type
- Skills management with suggestions
- Stipend configuration (Paid/Unpaid)
- Form validation with Zod
- API integration with backend
- Success/Error message handling

## API Integration
- Uses `jobPostApi.js` for backend communication
- Automatic authentication with JWT tokens
- Proper error handling and user feedback

## Form Validation
- Conditional validation based on opportunity type
- Date range validation for custom start dates
- Stipend amount validation
- Required field validation

## Usage
1. Select opportunity type
2. Fill required fields
3. Add related skills
4. Configure stipend/preferences
5. Submit form

## Error Handling

The system handles various error scenarios:
- Network errors
- Validation errors
- Backend API errors
- Authentication errors

All errors are displayed in a user-friendly format with the option to dismiss them.

## Authentication

The form requires authentication. The API client automatically includes the JWT token from localStorage in the Authorization header.

## Future Enhancements

- PRO plan features (College Name, Course restrictions)
- Draft saving functionality
- Rich text editor for descriptions
- File upload for attachments
- Advanced filtering and search 