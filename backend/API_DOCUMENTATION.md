# Invento Backend - Admin Authentication API

## Overview
Complete admin authentication system with JWT tokens and MongoDB integration.

## Installation

```bash
npm install
```

## Environment Variables

Update the `.env` file with your configuration:

```env
MONGODB_URL=your_mongodb_connection_string
DB_NAME=invento
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=2h
PORT=3000
NODE_ENV=development
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication Routes

Base URL: `/api/auth`

#### 1. Register Admin
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin Name",  // optional
  "role": "admin"  // optional
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "admin": {
      "_id": "...",
      "email": "admin@example.com",
      "name": "Admin Name",
      "role": "admin",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "jwt_token_here"
  }
}
```

#### 2. Login Admin
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "_id": "...",
      "email": "admin@example.com",
      "name": "Admin Name",
      "role": "admin",
      "isActive": true
    },
    "token": "jwt_token_here"
  }
}
```

#### 3. Get Current Admin Profile
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "admin@example.com",
    "name": "Admin Name",
    "role": "admin",
    "isActive": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### 4. Update Admin Profile
- **PUT** `/api/auth/update`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "...",
    "email": "newemail@example.com",
    "name": "Updated Name",
    "role": "admin"
  }
}
```

## Features

✅ Admin registration with email validation
✅ Secure password hashing with bcrypt
✅ JWT token authentication
✅ Protected routes with middleware
✅ Profile management
✅ Role-based authorization support
✅ MongoDB integration
✅ Environment variable configuration
✅ Error handling

## Project Structure

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   │   └── authController.js
│   ├── db/
│   │   ├── connection/
│   │   │   └── mongodb.js
│   │   └── models/
│   │       └── Admin.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   └── routes/
│       └── authRoutes.js
├── .env
├── index.js
└── package.json
```

## Testing with cURL or Postman

### Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"test123","name":"Test Admin"}'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"test123"}'
```

### Get Profile (with token):
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Notes

- Change `JWT_SECRET` in production to a strong, random value
- Use HTTPS in production
- Implement rate limiting for authentication endpoints
- Consider adding email verification
- Add password reset functionality as needed
