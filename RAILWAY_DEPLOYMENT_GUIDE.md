# 🚂 Railway Deployment Guide - Galleria Farms Frenzy

This guide will walk you through deploying your full-stack application (Vue.js frontend, Django backend, and PostgreSQL database) to Railway.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Railway CLI** (optional but recommended): Install from [docs.railway.app/develop/cli](https://docs.railway.app/develop/cli)

## 🗂️ Project Structure Overview

```
galleria-farms-frenzy/
├── backend/           # Django API
├── frontend/          # Vue.js App
├── railway.json       # Railway project config
└── RAILWAY_DEPLOYMENT_GUIDE.md
```

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Commit all changes** to your GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

### Step 2: Create Railway Project

1. **Login to Railway**: Go to [railway.app](https://railway.app) and sign in
2. **Create New Project**: Click "New Project"
3. **Deploy from GitHub**: Select "Deploy from GitHub repo"
4. **Select Repository**: Choose your `galleria-farms-frenzy` repository

### Step 3: Configure Initial Deployment

1. **First Service Created**: Railway will create your first service automatically
   - This will be your **Backend Service** (Django API)
   - Railway will use the `Dockerfile.backend` and `railway.json` configuration

### Step 4: Add Database Service

1. **Add Database**: In your Railway project dashboard
   - Click "+ New Service"
   - Select "Database"
   - Choose "PostgreSQL"
   - Railway will automatically provision a PostgreSQL database

2. **Note Database Variables**: Railway automatically creates these environment variables:
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`

### Step 5: Configure Backend Service

1. **Configure Environment Variables**:
   Navigate to your backend service → Variables tab and add:
   ```
   SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
   RAILWAY_ENVIRONMENT=production
   ALLOWED_HOSTS=your-backend-domain.railway.app
   ```

2. **Get Backend Domain**:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy the generated domain (e.g., `your-backend-domain.railway.app`)

### Step 6: Deploy Frontend (Vue.js App)

1. **Create Frontend Service**:
   - Click "+ New Service"  
   - Select "GitHub Repo"
   - Choose your repository (same repo as backend)
   - **IMPORTANT**: In the service settings, you need to:
     - Go to Settings → Build
     - Set **Builder**: Docker
     - Set **Dockerfile Path**: `Dockerfile.frontend`

2. **Configure Environment Variables**:
   Navigate to your frontend service → Variables tab and add:
   ```
   VITE_API_URL=https://your-backend-domain.railway.app/api
   ```
   (Replace `your-backend-domain` with the actual backend domain from Step 4)

3. **Get Frontend Domain**:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Copy the generated domain (e.g., `your-frontend-domain.railway.app`)

### Step 7: Update Backend CORS Settings

1. **Update Backend Environment Variables**:
   Add your frontend domain to the backend service variables:
   ```
   RAILWAY_PUBLIC_DOMAIN=your-frontend-domain.railway.app
   ```

2. **Redeploy Backend**: The backend will automatically redeploy and update CORS settings

### Step 8: Verify Deployment

1. **Check All Services**: Ensure all three services are running:
   - ✅ PostgreSQL Database
   - ✅ Django Backend
   - ✅ Vue.js Frontend

2. **Test Your Application**:
   - Visit your frontend domain
   - Test game functionality
   - Check leaderboard (tests backend API)
   - Submit a score (tests database)

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Backend Issues
- **500 Error**: Check logs in Railway dashboard → Backend Service → Deployments
- **Database Connection**: Ensure PostgreSQL service is running
- **Static Files**: Railway automatically handles `collectstatic`

#### Frontend Issues  
- **API Connection**: Verify `VITE_API_URL` points to correct backend domain
- **Build Errors**: Check Node.js version compatibility
- **CORS Errors**: Ensure backend has correct frontend domain in CORS settings

#### Database Issues
- **Migration Errors**: Railway runs migrations automatically during deployment
- **Connection Issues**: Check if PostgreSQL service is healthy

### Viewing Logs
1. Go to Railway Dashboard
2. Select the problematic service
3. Click "Deployments" tab
4. View logs for the latest deployment

### Manual Redeploy
1. Go to service in Railway Dashboard
2. Click "Deployments" tab  
3. Click "Deploy" on the latest deployment

## 🌐 Your Live Application

After successful deployment, you'll have:

- **Frontend**: `https://your-frontend-domain.railway.app`
- **Backend API**: `https://your-backend-domain.railway.app/api`
- **Admin Panel**: `https://your-backend-domain.railway.app/admin`
- **Database**: Managed PostgreSQL (internal access only)

## 📊 Monitoring & Maintenance

### Health Checks
- Railway automatically monitors your services
- Check service health in the Railway dashboard
- Set up notifications for downtime

### Database Management
- Use Railway's built-in database tools
- Connect via PostgreSQL clients using provided credentials
- Regular backups are handled by Railway

### Scaling
- Railway automatically handles traffic spikes
- Monitor usage in the Railway dashboard
- Upgrade plan if needed for higher limits

## 💰 Cost Optimization

### Railway Pricing Tiers
- **Hobby Plan**: $5/month per service (recommended for production)
- **Pro Plan**: Usage-based pricing for high-traffic apps

### Cost-Saving Tips
1. Use Railway's sleep feature for non-critical services
2. Monitor resource usage regularly
3. Optimize database queries to reduce CPU usage
4. Use Railway's CDN for static assets

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit secrets to Git
2. **HTTPS**: Railway provides SSL certificates automatically
3. **Database**: PostgreSQL instance is private and secure
4. **API Keys**: Store all sensitive data in Railway environment variables

## 🎯 Next Steps

After deployment:
1. Set up custom domain (optional)
2. Configure monitoring and alerts
3. Set up CI/CD for automatic deployments
4. Add database backups strategy
5. Monitor performance and optimize as needed

---

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Railway Status**: [status.railway.app](https://status.railway.app)

Happy deploying! 🚀 