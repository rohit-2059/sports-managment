# Sports Management Platform API Testing

This document shows how to test the API endpoints for user registration and authentication.

## Available Endpoints

### 1. Health Check

```http
GET http://localhost:5000/api/health
```

### 2. User Registration

#### Register as Coach

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Smith",
  "email": "coach@example.com",
  "password": "password123",
  "role": "coach"
}
```

#### Register as Player

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Mike Johnson",
  "email": "player@example.com",
  "password": "password123",
  "role": "player"
}
```

### 3. User Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@sportsmanagement.com",
  "password": "admin123"
}
```

### 4. Get Current User Profile (Protected Route)

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### 5. Get All Users (Super Admin Only)

```http
GET http://localhost:5000/api/auth/users
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

### 6. Create Team (Coach Only)

```http
POST http://localhost:5000/api/teams
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "name": "Mumbai Warriors",
  "shortName": "MUW",
  "description": "Professional cricket team",
  "homeGround": "Mumbai Stadium",
  "contactEmail": "info@mumbaiwarriors.com",
  "contactPhone": "+91-98765-43210"
}
```

### 7. Get All Teams

```http
GET http://localhost:5000/api/teams
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

## Pre-created Super Admin

- **Email**: admin@sportsmanagement.com
- **Password**: admin123
- **Role**: super_admin

## Response Examples

### Successful Registration Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "674212c8e5f8a12345678901",
      "name": "John Smith",
      "email": "coach@example.com",
      "role": "coach",
      "isActive": true,
      "registrationDate": "2024-12-05T10:30:00.000Z"
    }
  }
}
```

### Error Response:

```json
{
  "success": false,
  "error": "User already exists with this email"
}
```

## Testing Steps

1. **Test Health Check**: Verify server is running
2. **Register Users**: Create coach and player accounts
3. **Login**: Get JWT tokens for authentication
4. **Create Team**: Use coach account to create a team
5. **Manage Users**: Use super admin to view all users and approve teams

## Features Implemented

✅ **MongoDB Integration**: Full database connectivity
✅ **User Registration**: Email, password, name, role-based registration  
✅ **Role-Based Access**: Super Admin, Coach, Player roles
✅ **Authentication**: JWT-based login system
✅ **Password Security**: Bcrypt hashing
✅ **Team Management**: CRUD operations for teams
✅ **User Management**: Profile updates, user listing
✅ **Data Validation**: Input validation and sanitization
✅ **Error Handling**: Comprehensive error responses
✅ **Super Admin Seeder**: Pre-created admin account

## Next Steps

1. Create frontend registration forms
2. Add email verification
3. Implement player statistics tracking
4. Add tournament/match management
5. Implement real-time notifications
