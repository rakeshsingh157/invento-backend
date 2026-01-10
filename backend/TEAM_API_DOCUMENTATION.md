# Team Registration API Documentation

## Overview
Public API endpoint for team registration with automatic email notifications to all team members.

## Team Registration Endpoint

### Register a New Team
- **POST** `/api/teams/register`
- **Access:** Public (No authentication required)
- **Description:** Register a team for Invento event and send confirmation emails to all members

#### Request Body

```json
{
  "team_name": "Code Warriors",
  "idea": "AI-powered inventory management system",  // optional
  "gameName": "Space Explorer",  // optional
  "screenShot": "",  // optional - base64 encoded image
  "leader": {
    "year": "first",
    "class": "BSC",
    "name": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com"
  },
  "member2": {  // optional
    "year": "first",
    "class": "IT",
    "name": "Jane Smith",
    "phone": "2345678901",
    "email": "jane@example.com"
  },
  "member3": {  // optional
    "year": "first",
    "class": "SY-IT",
    "name": "Bob Johnson",
    "phone": "3456789012",
    "email": "bob@example.com"
  },
  "member4": {  // optional
    "year": "first",
    "class": "SY-IT",
    "name": "Alice Brown",
    "phone": "4567890123",
    "email": "alice@example.com"
  },
  "member5": {  // optional
    "year": "first",
    "class": "SY-IT",
    "name": "Charlie Davis",
    "phone": "5678901234",
    "email": "charlie@example.com"
  },
  "college_name": "XYZ College of Engineering"
}
```

#### Required Fields
- `team_name` - Team name (must be unique)
- `leader.year` - Leader's academic year (e.g., "first", "second", "third", "fourth")
- `leader.class` - Leader's class/department (e.g., "BSC", "IT", "SY-IT")
- `leader.name` - Leader's full name
- `leader.email` - Leader's email (must be valid and unique)
- `leader.phone` - Leader's phone number

**Note:** You can register with just the leader (1 member) or add up to 4 additional members (5 members total).

#### Optional Fields
- `idea` - Team's project idea or description (optional)
- `gameName` - Game name if participating in game development category (optional)
- `screenShot` - Base64 encoded screenshot/image of project or game (optional)
- `member2`, `member3`, `member4`, `member5` - Additional team members (optional)
  - Each member should include: `year`, `class`, `name`, `email`, `phone`
- `college_name` - College/Institution name (optional)

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Team registered successfully! Confirmation emails sent to all members.",
  "data": {
    "team": {
      "_id": "507f1f77bcf86cd799439011",
      "team_name": "Code Warriors",
      "leader": {
        "year": "first",
        "class": "BSC",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      },
      "member2": {
        "year": "first",
        "class": "IT",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "2345678901"
      },
      "member3": {
        "year": "first",
        "class": "SY-IT",
        "name": "Bob Johnson",
        "email": "bob@example.com",
        "phone": "3456789012"
      },
      "member4": {
        "year": "first",
        "class": "SY-IT",
        "name": "Alice Brown",
        "email": "alice@example.com",
        "phone": "4567890123"
      },
      "member5": {
        "year": "first",
        "class": "SY-IT",
        "name": "Charlie Davis",
        "email": "charlie@example.com",
        "phone": "5678901234"
      },
      "college_name": "XYZ College of Engineering",
      "idea": "AI-powered inventory management system",
      "gameName": "Space Explorer",
      "screenShot": "data:image/png;base64,iVBORw0KGg...",
      "registeredAt": "2026-01-06T10:30:00.000Z",
      "status": "registered"
    },
    "emailStatus": "sent",
    "emailsSent": 5,
    "emailsFailed": 0
  }
}
```

#### Error Responses

**400 Bad Request - Missing Required Fields**
```json
{
  "success": false,
  "message": "Team name is required"
}
```

**400 Bad Request - Invalid Email**
```json
{
  "success": false,
  "message": "Please provide a valid email for team leader"
}
```

**400 Bad Request - Duplicate Team Name**
```json
{
  "success": false,
  "message": "Team name already exists. Please choose a different name."
}
```

**400 Bad Request - Duplicate Email**
```json
{
  "success": false,
  "message": "One or more email addresses are already registered with another team"
}
```

**500 Server Error**
```json
{
  "success": false,
  "message": "Server error during team registration"
}
```

## Email Notification

After successful registration, all team members receive a beautifully designed confirmation email containing:

- ✅ Registration confirmation
- 📋 Team details (name, college, role)
- 📌 Important notices
- 🎨 Professional HTML design with gradient header
- ✓ Success icon
- 📧 Contact information

### Email Content Includes:
- Member's name and role in the team
- Team name
- College name (if provided)
- Registration confirmation
- Important notes and instructions

## Admin Endpoints (Protected)

All admin endpoints require JWT authentication token in the Authorization header.

### Get All Teams
- **GET** `/api/teams`
- **Headers:** `Authorization: Bearer <token>`

### Get Team by ID
- **GET** `/api/teams/:id`
- **Headers:** `Authorization: Bearer <token>`

### Get Team by Name
- **GET** `/api/teams/name/:teamName`
- **Headers:** `Authorization: Bearer <token>`

### Get Team Statistics
- **GET** `/api/teams/stats`
- **Headers:** `Authorization: Bearer <token>`

### Update Team
- **PUT** `/api/teams/:id`
- **Headers:** `Authorization: Bearer <token>`

### Delete Team
- **DELETE** `/api/teams/:id`
- **Headers:** `Authorization: Bearer <token>`

## Email Configuration

Update your `.env` file with your email service credentials:

```env
# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Invento Team <noreply@invento.com>
```

### Gmail Setup Instructions

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

## Testing with cURL

```bash
curl -X POST http://localhost:3000/api/teams/register \
  -H "Content-Type: application/json" \
  -d '{
    "team_name": "Code Warriors",
    "idea": "AI-powered inventory management system",
    "gameName": "Space Explorer",
    "screenShot": "data:image/png;base64,iVBORw0KGg...",
    "leader": {
      "year": "first",
      "class": "BSC",
      "name": "John Doe",
      "phone": "1234567890",
      "email": "john@example.com"
    },
    "member2": {
      "year": "first",
      "class": "IT",
      "name": "Jane Smith",
      "phone": "2345678901",
      "email": "jane@example.com"
    },
    "college_name": "XYZ College of Engineering"
  }'
```

## Frontend Integration Example

```javascript
// React/Next.js example
const registerTeam = async (teamData) => {
  try {
    const response = await fetch('http://localhost:3000/api/teams/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Team registered successfully!');
      console.log('Emails sent:', data.data.emailsSent);
    } else {
      console.error('Registration failed:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Features

✅ Public team registration (no auth required)
✅ Automatic email confirmation to all team members
✅ Beautiful HTML email template with responsive design
✅ Team name uniqueness validation
✅ Email uniqueness validation (no duplicate registrations)
✅ Support for 1-5 team members
✅ Admin dashboard endpoints for team management
✅ Team statistics and analytics
✅ CORS enabled for frontend integration
✅ Error handling and validation

## Notes

- **Team Size:** Minimum 1 member (leader only), Maximum 5 members (leader + 4 additional members)
- **Solo Registration:** Teams can register with just the leader - other members are optional
- Team name must be unique
- Email addresses must be unique across all teams
- Email notifications sent asynchronously to all registered members
- If email sending fails, team is still registered with a warning message
