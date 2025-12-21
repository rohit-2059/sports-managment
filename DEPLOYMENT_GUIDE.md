# Deployment Guide - SportsPro

This guide will help you deploy the SportsPro application with:
- **Frontend**: Vercel
- **Backend**: Render

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- MongoDB Atlas account (already configured)

---

## Part 1: Deploy Backend to Render

### Step 1: Push Your Code to GitHub
Your code is already on GitHub at: `https://github.com/rohit-2059/sports-managment`

### Step 2: Create Render Web Service

1. Go to [Render.com](https://render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your repository: `rohit-2059/sports-managment`
5. Configure the service:
   - **Name**: `sportspro-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Configure Environment Variables in Render

In the Render dashboard, go to **Environment** tab and add these variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://rohitkhandelwal2059:rohit1027@rohit.mtrcijc.mongodb.net/sports-managment?appName=rohit
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
EMAIL_USER=roht.khandelwal.2059@gmail.com
EMAIL_PASSWORD=iteyraблnbdlupcs
FRONTEND_URL=https://your-app-name.vercel.app
CORS_ORIGIN=https://your-app-name.vercel.app
```

**Important Notes**: 
- Don't set PORT manually - Render provides it automatically
- You'll update `FRONTEND_URL` and `CORS_ORIGIN` after deploying frontend in Part 2
- JWT_SECRET should be a strong random string in production

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Run `npm install` in the backend folder
---

   - Start your server with `npm start`
3. Wait for the deployment to complete (usually 2-5 minutes)
4. Your backend will be available at: `https://sportspro-backend.onrender.com`

### Step 5: Test Your Backend

Once deployed, test the health endpoint:
```
https://your-backend-url.onrender.com/api/health
```

You should see: `{"status":"ok","message":"Server is healthy"}`
3. Wait for deployment to complete (2-5 minutes)
4. Railway will provide you a URL like: `https://your-backend.up.railway.app`

### Step 5: Note Your Backend URL

**Save this URL** - you'll need it for frontend deployment:
```
https://your-backend.up.railway.app
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to [Vercel.com](https://vercel.com/)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `rohit-2059/sports-managment`
4. Vercel will ask which folder - select **frontend** folder

### Step 2: Configure Build Settings

Vercel should auto-detect Vite settings, but verify:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variable

In Vercel project settings, go to **Environment Variables** and add:

**Name**: `VITE_API_URL`  
**Value**: `https://your-backend.onrender.com` (from Part 1, Step 4)

**Important**: Remove the trailing slash from URL

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your app (2-3 minutes)
3. You'll get a URL like: `https://your-app-name.vercel.app`

---

## Part 3: Update Backend with Frontend URL

### Go Back to Render

1. Open your Render dashboard
2. Select your backend web service
3. Go to **Environment** tab
4. Update these variables with your Vercel URL:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   CORS_ORIGIN=https://your-app-name.vercel.app
   ```
5. Click "Save Changes"
6. Render will automatically redeploy with new settings

---

## Part 4: Test Your Deployment

### Test Frontend
1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Landing page should load correctly
3. Navigate through all sections

### Test Backend Connection
1. Scroll to Contact form on landing page
2. Fill out the form and click "Send Message"
3. You should see "Message Sent!" confirmation
4. Check your email for the contact form submission

### Test Authentication
1. Click "Sign In" or "Register"
2. Create a test account
3. Login with credentials
4. Verify dashboard loads properly

---

## Troubleshooting

### Issue: CORS Errors
**Solution**: Make sure `FRONTEND_URL` in Render exactly matches your Vercel URL (no trailing slash)

### Issue: API Not Connecting
**Solution**: 
1. Check `VITE_API_URL` in Vercel environment variables
2. Make sure it points to your Render backend URL
3. Redeploy frontend after changing env variables

### Issue: Email Not Sending
**Solution**: Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correctly set in Render

### Issue: Database Connection Failed
**Solution**: Check `MONGODB_URI` in Render - ensure it has the correct connection string

### Issue: Render Free Tier Sleep
**Note**: Render free tier services spin down after 15 minutes of inactivity. First request after sleep may take 30-60 seconds to wake up the service. Consider upgrading to paid tier for always-on service.

---

## Custom Domain Setup (Optional)

### For Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

### For Render (Backend)
1. Go to your web service settings
2. Click on "Custom Domain"
3. Add your custom domain
4. Update `FRONTEND_URL` in environment variables to use your custom frontend domain

---

## Monitoring & Logs

### Render Logs
- Go to your Render dashboard
- Select your web service
- Click on "Logs" tab to view real-time logs
- Monitor deployment status and runtime errors

### Vercel Logs  
- Go to your Vercel project
- Click on "Logs" tab
- View function and build logs

---

## Post-Deployment Checklist

- [ ] Backend deployed to Render and running
- [ ] Frontend deployed to Vercel and accessible
- [ ] Environment variables configured correctly
- [ ] Contact form sending emails successfully
- [ ] Authentication working (register/login)
- [ ] Dashboard loading with data from MongoDB
- [ ] All API endpoints responding correctly
- [ ] CORS configured properly (no console errors)
- [ ] Health check endpoint accessible at `/api/health`

---

## Important Security Notes

### Before Going Live:
1. **Change JWT_SECRET** to a strong random string
2. **Update MongoDB credentials** if using default
3. **Enable MongoDB IP whitelist** - Allow all IPs (0.0.0.0/0) or add Render's IPs
4. **Set up rate limiting** for production
5. **Enable HTTPS only** (handled by Vercel/Render by default)

---

## Useful Commands

### Redeploy Vercel
```bash
vercel --prod
```

### Check Environment Variables
```bash
# Vercel
vercel env ls
```

### Manual Trigger Redeploy on Render
- Go to your web service → "Manual Deploy" → "Deploy latest commit"

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/

---

## Your Deployment URLs

**Frontend (Vercel)**: `https://_____________________.vercel.app`

**Backend (Render)**: `https://_____________________.onrender.com`

**Fill these in after deployment!**

---

## Next Steps After Deployment

1. Test all features thoroughly
2. Monitor error logs for first 24 hours
3. Set up uptime monitoring (e.g., UptimeRobot) - especially for Render free tier
4. Configure email alerts for crashes
5. Consider upgrading Render to paid tier to avoid cold starts
6. Share the live URL with users! 🎉
