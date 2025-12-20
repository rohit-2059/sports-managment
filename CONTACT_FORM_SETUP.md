# Contact Form Email Setup

The contact form on the landing page is now fully functional using Nodemailer.

## Setup Instructions

### 1. Configure Email Credentials

Create a `.env` file in the `backend` directory (copy from `.env.example`):

```bash
cd backend
cp .env.example .env
```

### 2. Gmail Setup (Recommended)

If using Gmail:

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Enable 2-factor authentication

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env file**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

### 3. Using Other Email Services

You can use other email services by modifying `backend/controllers/contactController.js`:

**Outlook/Hotmail:**
```javascript
service: 'hotmail'
```

**Yahoo:**
```javascript
service: 'yahoo'
```

**Custom SMTP:**
```javascript
host: 'smtp.your-domain.com',
port: 587,
secure: false,
```

## Features

- ✅ Sports management themed content
- ✅ Form validation (name, email, message required)
- ✅ Email sent to configured address
- ✅ Auto-reply capability
- ✅ Loading states and success messages
- ✅ Error handling with user feedback
- ✅ Responsive design
- ✅ Animated UI with sparkles effect

## Testing

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Navigate to the Contact section** on the landing page
4. **Fill out the form** and click "Send Message"
5. **Check your configured email** for the message

## API Endpoint

**POST** `/api/contact`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

Response (success):
```json
{
  "success": true,
  "message": "Message sent successfully! We will get back to you soon."
}
```

Response (error):
```json
{
  "success": false,
  "message": "Error message"
}
```

## Navigation

The contact section is accessible via:
- Header navigation link: "Contact"
- Direct URL: `#contact`
- Smooth scroll from any section

## Troubleshooting

1. **"Failed to send message" error**
   - Check EMAIL_USER and EMAIL_PASSWORD in .env
   - Verify 2FA is enabled and app password is correct
   - Ensure backend server is running

2. **CORS errors**
   - Backend CORS is configured to allow all origins in development
   - For production, update CORS settings in `backend/index.js`

3. **Email not received**
   - Check spam/junk folder
   - Verify EMAIL_USER matches the destination email
   - Check backend console for error messages
