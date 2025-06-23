# 📋 Railway Deployment Checklist

## Pre-Deployment Setup ✅

- [ ] All code committed and pushed to GitHub
- [ ] Railway account created
- [ ] Empty Railway project created

## Railway Services Setup ✅

### 1. Database Service
- [ ] PostgreSQL database created
- [ ] Database is running and healthy

### 2. Backend Service (Django)
- [ ] Service created from GitHub repo
- [ ] `backend/` path selected during service creation
- [ ] Environment variables configured:
  - [ ] `SECRET_KEY` (generate a secure one)
  - [ ] `RAILWAY_ENVIRONMENT=production`
  - [ ] `ALLOWED_HOSTS` (with backend domain)
- [ ] Domain generated and copied
- [ ] Service deployed successfully

### 3. Frontend Service (Vue.js)
- [ ] Service created from GitHub repo
- [ ] `frontend/` path selected during service creation
- [ ] Environment variables configured:
  - [ ] `VITE_API_URL` (pointing to backend domain)
- [ ] Domain generated and copied
- [ ] Service deployed successfully

## Cross-Service Configuration ✅

- [ ] Backend CORS updated with frontend domain:
  - [ ] `RAILWAY_PUBLIC_DOMAIN` variable added to backend
- [ ] Backend redeployed after CORS update

## Testing ✅

- [ ] Frontend loads without errors
- [ ] Game functionality works
- [ ] API calls succeed (check browser network tab)
- [ ] Leaderboard displays data
- [ ] Score submission works
- [ ] Database stores data correctly

## Final Steps ✅

- [ ] All services show "Active" status
- [ ] No error logs in any service
- [ ] Application fully functional
- [ ] Performance acceptable
- [ ] Security headers enabled (automatic in production)

## Environment Variables Summary

### Backend Service
```
SECRET_KEY=your-long-random-secret-key
RAILWAY_ENVIRONMENT=production
ALLOWED_HOSTS=your-backend-domain.railway.app
RAILWAY_PUBLIC_DOMAIN=your-frontend-domain.railway.app
```

### Frontend Service
```
VITE_API_URL=https://your-backend-domain.railway.app/api
```

### Database Service
(Automatically configured by Railway)

---

## 🚨 If Something Goes Wrong

1. **Check Service Logs**: Railway Dashboard → Service → Deployments → View Logs
2. **Verify Environment Variables**: Ensure all variables are set correctly
3. **Check Service Health**: All services should show "Active" status
4. **Test API Endpoints**: Use browser or Postman to test backend directly
5. **Redeploy if Needed**: Sometimes a fresh deployment fixes issues

## 📞 Need Help?

- Review the full deployment guide: `RAILWAY_DEPLOYMENT_GUIDE.md`
- Check Railway documentation: [docs.railway.app](https://docs.railway.app)
- Join Railway Discord: [discord.gg/railway](https://discord.gg/railway) 