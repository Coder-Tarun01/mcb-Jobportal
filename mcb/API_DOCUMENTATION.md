# MCB Job Portal - API Documentation

## Overview
This document provides comprehensive API documentation for the MCB Job Portal backend implementation. The API supports both job seekers (employees) and employers with role-based authentication.

## Base URL
```
Production: https://api.mcbjobportal.com/v1
Development: http://localhost:3001/api/v1
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "errors": [],
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

## Error Handling
Error responses include detailed information:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "INVALID_EMAIL"
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

---

## 1. Authentication & User Management

### 1.1 User Registration
**POST** `/auth/register`

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "role": "employee",
  "phone": "+91 98765 43210",
  "additionalData": {
    "skills": ["React", "TypeScript", "Node.js"],
    "experience": "3 years",
    "education": "BS Computer Science"
  }
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123456789",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "employee",
      "phone": "+91 98765 43210",
      "profilePicture": null,
      "createdAt": "2024-01-15T10:30:00Z",
      "isEmailVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_123456789"
  }
}
```

### 1.2 User Login
**POST** `/auth/login`

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123456789",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "employee",
      "profilePicture": "https://api.mcbjobportal.com/uploads/profiles/user_123456789.jpg",
      "lastLogin": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_123456789"
  }
}
```

### 1.3 Refresh Token
**POST** `/auth/refresh`

#### Request Body
```json
{
  "refreshToken": "refresh_token_123456789"
}
```

### 1.4 Logout
**POST** `/auth/logout`

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

---

## 2. User Profile Management

### 2.1 Get User Profile
**GET** `/users/profile`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "user_123456789",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+91 98765 43210",
    "role": "employee",
    "profilePicture": "https://api.mcbjobportal.com/uploads/profiles/user_123456789.jpg",
    "createdAt": "2024-01-15T10:30:00Z",
    "lastUpdated": "2024-01-15T10:30:00Z",
    "isEmailVerified": true,
    "profile": {
      "headline": "Experienced Frontend Developer",
      "summary": "Passionate developer with 3+ years of experience...",
      "skills": ["React", "TypeScript", "Node.js", "CSS", "JavaScript"],
      "experience": [
        {
          "id": "exp_123",
          "title": "Senior Frontend Developer",
          "company": "TechCorp Inc.",
          "location": "Mumbai, India",
          "startDate": "2022-01-01",
          "endDate": null,
          "isCurrent": true,
          "description": "Led frontend development team..."
        }
      ],
      "education": [
        {
          "id": "edu_123",
          "degree": "Bachelor of Science",
          "field": "Computer Science",
          "institution": "Mumbai University",
          "graduationYear": "2020",
          "gpa": "3.8"
        }
      ],
      "projects": [
        {
          "id": "proj_123",
          "name": "E-commerce Platform",
          "description": "Full-stack e-commerce solution",
          "technologies": ["React", "Node.js", "MongoDB"],
          "url": "https://github.com/johndoe/ecommerce",
          "startDate": "2023-01-01",
          "endDate": "2023-06-01"
        }
      ],
      "certifications": [
        {
          "id": "cert_123",
          "name": "AWS Certified Developer",
          "issuer": "Amazon Web Services",
          "issueDate": "2023-03-15",
          "expiryDate": "2026-03-15",
          "credentialId": "AWS-DEV-123456"
        }
      ]
    }
  }
}
```

### 2.2 Update User Profile
**PUT** `/users/profile`

#### Request Body
```json
{
  "name": "John Doe",
  "phone": "+91 98765 43210",
  "profilePicture": "base64_encoded_image_or_file_upload",
  "profile": {
    "headline": "Senior Frontend Developer",
    "summary": "Updated professional summary...",
    "skills": ["React", "TypeScript", "Node.js", "Vue.js"],
    "personalDetails": {
      "dateOfBirth": "1995-06-15",
      "gender": "male",
      "maritalStatus": "single",
      "languages": ["English", "Hindi"],
      "address": {
        "street": "123 Main Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "postalCode": "400001"
      }
    }
  }
}
```

### 2.3 Upload Resume
**POST** `/users/resume`

#### Request Body (multipart/form-data)
```
file: resume.pdf
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resumeId": "resume_123456789",
    "fileName": "resume.pdf",
    "fileSize": 1024000,
    "fileUrl": "https://api.mcbjobportal.com/uploads/resumes/resume_123456789.pdf",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 3. Job Management

### 3.1 Get All Jobs
**GET** `/jobs`

#### Query Parameters
```
?page=1&limit=20&search=developer&location=mumbai&type=full-time&salaryMin=500000&salaryMax=1000000&experience=3&category=technology&sortBy=postedDate&sortOrder=desc
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job_123456789",
        "title": "Senior Frontend Developer",
        "company": {
          "id": "company_123456789",
          "name": "TechCorp Solutions",
          "logo": "https://api.mcbjobportal.com/uploads/companies/techcorp_logo.png",
          "website": "https://techcorp.com",
          "size": "100-500 employees",
          "industry": "Technology"
        },
        "location": "Mumbai, India",
        "isRemote": true,
        "type": "Full-time",
        "experience": {
          "min": 3,
          "max": 6
        },
        "salary": {
          "min": 800000,
          "max": 1200000,
          "currency": "INR",
          "isNegotiable": true
        },
        "description": "We are looking for a Senior Frontend Developer...",
        "requirements": [
          "3+ years of experience in React.js",
          "Strong knowledge of TypeScript",
          "Experience with modern CSS frameworks"
        ],
        "skills": ["React", "TypeScript", "CSS", "JavaScript", "Git"],
        "benefits": [
          "Health Insurance",
          "Flexible Working Hours",
          "Remote Work",
          "Professional Development"
        ],
        "postedDate": "2024-01-15T10:30:00Z",
        "applicationDeadline": "2024-02-15T23:59:59Z",
        "category": "Technology",
        "status": "active",
        "applicantCount": 45,
        "viewCount": 234
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "filters": {
      "categories": ["Technology", "Design", "Marketing", "Sales"],
      "jobTypes": ["Full-time", "Part-time", "Contract", "Internship"],
      "locations": ["Mumbai", "Bangalore", "Delhi", "Pune"],
      "experienceRanges": ["0-1", "1-3", "3-5", "5-10", "10+"]
    }
  }
}
```

### 3.2 Get Job by ID
**GET** `/jobs/{jobId}`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "job_123456789",
    "title": "Senior Frontend Developer",
    "company": {
      "id": "company_123456789",
      "name": "TechCorp Solutions",
      "logo": "https://api.mcbjobportal.com/uploads/companies/techcorp_logo.png",
      "website": "https://techcorp.com",
      "description": "Leading technology company...",
      "size": "100-500 employees",
      "industry": "Technology",
      "foundedYear": 2015,
      "headquarters": "Mumbai, India"
    },
    "location": "Mumbai, India",
    "isRemote": true,
    "type": "Full-time",
    "experience": {
      "min": 3,
      "max": 6
    },
    "salary": {
      "min": 800000,
      "max": 1200000,
      "currency": "INR",
      "isNegotiable": true
    },
    "description": "We are looking for a Senior Frontend Developer to join our growing team...",
    "requirements": [
      "3+ years of experience in React.js",
      "Strong knowledge of TypeScript",
      "Experience with modern CSS frameworks",
      "Understanding of RESTful APIs",
      "Experience with version control systems"
    ],
    "skills": ["React", "TypeScript", "CSS", "JavaScript", "Git"],
    "benefits": [
      "Health Insurance",
      "Flexible Working Hours",
      "Remote Work",
      "Professional Development",
      "401k Matching"
    ],
    "postedDate": "2024-01-15T10:30:00Z",
    "applicationDeadline": "2024-02-15T23:59:59Z",
    "category": "Technology",
    "status": "active",
    "applicantCount": 45,
    "viewCount": 234,
    "isApplied": false,
    "isSaved": false
  }
}
```

### 3.3 Create Job (Employer Only)
**POST** `/jobs`

#### Request Body
```json
{
  "title": "Senior Frontend Developer",
  "description": "We are looking for a Senior Frontend Developer...",
  "requirements": [
    "3+ years of experience in React.js",
    "Strong knowledge of TypeScript"
  ],
  "skills": ["React", "TypeScript", "CSS", "JavaScript"],
  "location": "Mumbai, India",
  "isRemote": true,
  "type": "Full-time",
  "experience": {
    "min": 3,
    "max": 6
  },
  "salary": {
    "min": 800000,
    "max": 1200000,
    "currency": "INR",
    "isNegotiable": true
  },
  "benefits": [
    "Health Insurance",
    "Flexible Working Hours",
    "Remote Work"
  ],
  "applicationDeadline": "2024-02-15T23:59:59Z",
  "category": "Technology",
  "tags": ["frontend", "react", "typescript", "remote"]
}
```

### 3.4 Update Job (Employer Only)
**PUT** `/jobs/{jobId}`

### 3.5 Delete Job (Employer Only)
**DELETE** `/jobs/{jobId}`

---

## 4. Job Applications

### 4.1 Apply for Job
**POST** `/applications`

#### Request Body
```json
{
  "jobId": "job_123456789",
  "coverLetter": "I am excited to apply for the Senior Frontend Developer position...",
  "resumeId": "resume_123456789",
  "additionalDocuments": [
    {
      "name": "Portfolio",
      "url": "https://johndoe.dev/portfolio"
    }
  ],
  "answers": [
    {
      "questionId": "q_123",
      "answer": "I have 3 years of experience with React..."
    }
  ]
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "applicationId": "app_123456789",
    "jobId": "job_123456789",
    "applicantId": "user_123456789",
    "status": "submitted",
    "appliedAt": "2024-01-15T10:30:00Z",
    "coverLetter": "I am excited to apply for the Senior Frontend Developer position...",
    "resumeUrl": "https://api.mcbjobportal.com/uploads/resumes/resume_123456789.pdf"
  }
}
```

### 4.2 Get User Applications
**GET** `/applications`

#### Query Parameters
```
?status=submitted&page=1&limit=20&sortBy=appliedAt&sortOrder=desc
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "app_123456789",
        "job": {
          "id": "job_123456789",
          "title": "Senior Frontend Developer",
          "company": {
            "name": "TechCorp Solutions",
            "logo": "https://api.mcbjobportal.com/uploads/companies/techcorp_logo.png"
          },
          "location": "Mumbai, India",
          "type": "Full-time"
        },
        "status": "submitted",
        "appliedAt": "2024-01-15T10:30:00Z",
        "lastUpdated": "2024-01-15T10:30:00Z",
        "coverLetter": "I am excited to apply for the Senior Frontend Developer position...",
        "resumeUrl": "https://api.mcbjobportal.com/uploads/resumes/resume_123456789.pdf"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 50,
      "itemsPerPage": 20
    }
  }
}
```

### 4.3 Get Job Applications (Employer Only)
**GET** `/jobs/{jobId}/applications`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "app_123456789",
        "applicant": {
          "id": "user_123456789",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "profilePicture": "https://api.mcbjobportal.com/uploads/profiles/user_123456789.jpg",
          "headline": "Experienced Frontend Developer",
          "location": "Mumbai, India",
          "experience": "3 years",
          "skills": ["React", "TypeScript", "Node.js"]
        },
        "status": "submitted",
        "appliedAt": "2024-01-15T10:30:00Z",
        "coverLetter": "I am excited to apply for the Senior Frontend Developer position...",
        "resumeUrl": "https://api.mcbjobportal.com/uploads/resumes/resume_123456789.pdf",
        "score": 85,
        "isShortlisted": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 45,
      "itemsPerPage": 20
    }
  }
}
```

### 4.4 Update Application Status (Employer Only)
**PUT** `/applications/{applicationId}/status`

#### Request Body
```json
{
  "status": "shortlisted",
  "notes": "Strong technical background, good cultural fit",
  "nextSteps": "Schedule technical interview"
}
```

---

## 5. Saved Jobs

### 5.1 Save Job
**POST** `/saved-jobs`

#### Request Body
```json
{
  "jobId": "job_123456789"
}
```

### 5.2 Get Saved Jobs
**GET** `/saved-jobs`

### 5.3 Remove Saved Job
**DELETE** `/saved-jobs/{jobId}`

---

## 6. Job Alerts

### 6.1 Create Job Alert
**POST** `/job-alerts`

#### Request Body
```json
{
  "name": "Frontend Developer Jobs",
  "keywords": ["react", "frontend", "javascript"],
  "location": "Mumbai",
  "jobType": "full-time",
  "experience": "3-5",
  "salaryMin": 500000,
  "salaryMax": 1000000,
  "frequency": "daily",
  "isActive": true
}
```

### 6.2 Get Job Alerts
**GET** `/job-alerts`

### 6.3 Update Job Alert
**PUT** `/job-alerts/{alertId}`

### 6.4 Delete Job Alert
**DELETE** `/job-alerts/{alertId}`

---

## 7. Company Management (Employer Only)

### 7.1 Get Company Profile
**GET** `/companies/profile`

### 7.2 Update Company Profile
**PUT** `/companies/profile`

#### Request Body
```json
{
  "name": "TechCorp Solutions",
  "description": "Leading technology company specializing in...",
  "website": "https://techcorp.com",
  "industry": "Technology",
  "size": "100-500 employees",
  "foundedYear": 2015,
  "headquarters": "Mumbai, India",
  "logo": "base64_encoded_image_or_file_upload",
  "benefits": [
    "Health Insurance",
    "Flexible Working Hours",
    "Remote Work",
    "Professional Development"
  ],
  "culture": "Innovative, collaborative, and growth-oriented",
  "values": [
    "Innovation",
    "Integrity",
    "Excellence",
    "Collaboration"
  ]
}
```

---

## 8. Analytics & Reporting (Employer Only)

### 8.1 Get Dashboard Analytics
**GET** `/analytics/dashboard`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalJobs": 15,
      "activeJobs": 12,
      "totalApplications": 234,
      "newApplications": 23,
      "profileViews": 1456,
      "responseRate": 94.5
    },
    "recentActivity": [
      {
        "type": "new_application",
        "message": "New application received for Senior Developer position",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "jobStats": [
      {
        "jobId": "job_123456789",
        "title": "Senior Frontend Developer",
        "views": 234,
        "applications": 45,
        "shortlisted": 8,
        "hired": 1
      }
    ],
    "monthlyStats": {
      "applications": [12, 15, 18, 23, 19, 25],
      "views": [120, 145, 167, 189, 156, 234],
      "months": ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"]
    }
  }
}
```

---

## 9. Search & Filtering

### 9.1 Search Jobs
**GET** `/search/jobs`

#### Query Parameters
```
?q=react developer&location=mumbai&type=full-time&salaryMin=500000&salaryMax=1000000&experience=3&category=technology&sortBy=postedDate&sortOrder=desc&page=1&limit=20
```

### 9.2 Search Candidates (Employer Only)
**GET** `/search/candidates`

#### Query Parameters
```
?q=frontend developer&location=mumbai&experience=3&skills=react,typescript&availability=immediate&page=1&limit=20
```

---

## 10. File Upload

### 10.1 Upload File
**POST** `/upload`

#### Request Body (multipart/form-data)
```
file: document.pdf
type: resume
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "fileId": "file_123456789",
    "fileName": "document.pdf",
    "fileSize": 1024000,
    "fileUrl": "https://api.mcbjobportal.com/uploads/resumes/file_123456789.pdf",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 11. Notifications

### 11.1 Get Notifications
**GET** `/notifications`

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123456789",
        "type": "application_status_update",
        "title": "Application Status Updated",
        "message": "Your application for Senior Frontend Developer has been shortlisted",
        "isRead": false,
        "createdAt": "2024-01-15T10:30:00Z",
        "data": {
          "jobId": "job_123456789",
          "applicationId": "app_123456789",
          "status": "shortlisted"
        }
      }
    ],
    "unreadCount": 5
  }
}
```

### 11.2 Mark Notification as Read
**PUT** `/notifications/{notificationId}/read`

### 11.3 Mark All Notifications as Read
**PUT** `/notifications/read-all`

---

## 12. Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## 13. Rate Limiting

- **General API**: 1000 requests per hour per user
- **Authentication**: 10 requests per minute per IP
- **File Upload**: 10 requests per hour per user
- **Search**: 100 requests per hour per user

## 14. Webhooks (Future Implementation)

### 14.1 Job Application Webhook
**POST** `{webhook_url}`

#### Payload
```json
{
  "event": "application.submitted",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "applicationId": "app_123456789",
    "jobId": "job_123456789",
    "applicantId": "user_123456789",
    "companyId": "company_123456789"
  }
}
```

---

## 15. SDK Examples

### 15.1 JavaScript/Node.js
```javascript
const MCBJobPortal = require('@mcb/job-portal-sdk');

const client = new MCBJobPortal({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.mcbjobportal.com/v1'
});

// Search jobs
const jobs = await client.jobs.search({
  search: 'react developer',
  location: 'mumbai',
  type: 'full-time'
});

// Apply for job
const application = await client.applications.create({
  jobId: 'job_123456789',
  coverLetter: 'I am interested in this position...'
});
```

### 15.2 Python
```python
from mcb_job_portal import MCBJobPortal

client = MCBJobPortal(api_key='your_api_key')

# Search jobs
jobs = client.jobs.search(
    search='react developer',
    location='mumbai',
    type='full-time'
)

# Apply for job
application = client.applications.create(
    job_id='job_123456789',
    cover_letter='I am interested in this position...'
)
```

---

This API documentation provides a comprehensive guide for implementing the backend for the MCB Job Portal. All endpoints include proper authentication, validation, and error handling to ensure a robust and secure job portal platform.
