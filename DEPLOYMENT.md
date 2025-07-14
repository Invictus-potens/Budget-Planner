# Railway Deployment Guide

## Prerequisites
- Railway account
- GitHub repository with your code
- Supabase account (for database and authentication)

## Deployment Steps

1. **Connect to Railway**
   - Go to [Railway.app](https://railway.app)
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"

2. **Select Repository**
   - Choose your Budget-Planner repository
   - Railway will automatically detect it's a Next.js project

3. **Environment Variables (Required)**
   - In Railway dashboard, go to your project → Variables
   - Add the following environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     NEXT_PUBLIC_APP_URL=https://your-app-name.railway.app
     ```
   - See `SUPABASE_SETUP.md` for detailed Supabase setup instructions

4. **Deploy**
   - Railway will automatically build and deploy your app
   - The build process will run `npm run build`
   - The app will start with `npm start`

## Current Configuration

✅ **Compatible with Railway:**
- Node.js version specified (>=18.0.0)
- Start script uses `$PORT` environment variable
- Static export removed for server-side rendering
- Railway configuration file added
- Supabase client gracefully handles missing environment variables during build
- PostCSS and Tailwind dependencies moved to production dependencies
- Both CommonJS and ES module PostCSS configs provided for compatibility

✅ **Data Storage:**
- Supabase database integration
- User authentication and data isolation
- Persistent data storage across devices
- Row Level Security for data protection

## Custom Domain (Optional)
- In Railway dashboard, go to Settings → Domains
- Add your custom domain
- Update `NEXT_PUBLIC_APP_URL` environment variable

## Monitoring
- Railway provides built-in logs and monitoring
- Check the "Deployments" tab for build status
- Use "Logs" tab to debug issues

## Troubleshooting

### Build Errors
If you encounter build errors related to `autoprefixer` or PostCSS:
1. Ensure all dependencies are properly installed
2. Check that environment variables are set correctly
3. Verify that the PostCSS configuration is valid

### Common Issues
- **"Cannot find module 'autoprefixer'"**: Dependencies are now properly configured in `package.json`
- **Supabase connection errors**: Ensure environment variables are set in Railway
- **Authentication issues**: Check Supabase project settings and redirect URLs 