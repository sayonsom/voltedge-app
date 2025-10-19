# Vercel Deployment Guide

This guide explains how to deploy your VoltEdge application to Vercel with Supabase backend.

## Architecture Overview

Your application uses:
- **Frontend**: Next.js app (React)
- **API Routes**: Next.js serverless API routes (`/app/api/*`)
- **Database**: Supabase PostgreSQL
- **Deployment**: Vercel (serverless)

All backend logic runs as serverless functions via Next.js API routes - no separate Express server needed!

## Local Development

```bash
npm run dev
# or
./start.sh
```

This starts Next.js on http://localhost:3000 with built-in API routes at `/api/*`

## Deployment Steps

### 1. Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (sign up at https://vercel.com)
- Supabase project with your data migrated

### 2. Push Code to Git

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Add Next.js API routes for Vercel deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/voltedge-app.git

# Push
git push -u origin main
```

### 3. Deploy to Vercel

#### Via Vercel Dashboard:

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://mmzapzvfjzhfzdrvnixx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1temFwenZmanpoZnpkcnZuaXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTEwMzgsImV4cCI6MjA3NjM2NzAzOH0.uCXaZErP0Sd_whKZ0NEoPO2H2jSttbqXnZllyfC_zTo
   SUPABASE_DATABASE_URL=postgresql://postgres:62QdpnkAVbfmybjK@db.mmzapzvfjzhfzdrvnixx.supabase.co:5432/postgres
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoic2F5b25tYXBib3giLCJhIjoiY2xxdjFrOHk4NW43bjJpcGE2MDE1ZnljaSJ9.G0GeWKSlyl2vcE7tEUW46g
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBkix7QfvPU_rAZDA_KvfKEwz2T7ykQlZQ
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCmLizTlOhDz_-Z1CtMUGFAJIwR2nWntPw
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=voltedge-dev.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=voltedge-dev
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=voltedge-dev.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1016283042395
   NEXT_PUBLIC_FIREBASE_APP_ID=1:1016283042395:web:0c3bbbf3f20d9ebff0257e
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-6WPJW3N7K2
   NEXT_PUBLIC_API_URL=/api
   ```

5. Click **Deploy**

#### Via Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### 4. Configure Domain (Optional)

1. Go to your project on Vercel dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed

## API Routes

Your application exposes these API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/parcels` | GET | Get all parcels (paginated) |
| `/api/parcels/:id` | GET | Get single parcel with details |
| `/api/parcels/:id/financials` | GET | Get financial projections |
| `/api/parcels/:id/power` | GET | Get power infrastructure |
| `/api/parcels/search` | GET | Search parcels |
| `/api/cities` | GET | Get all cities with stats |
| `/api/consultants` | GET | Get consultant firms |
| `/api/dashboard/stats` | GET | Get dashboard statistics |
| `/api/health` | GET | Health check |

## Environment Variables

### Required for Production:

- `SUPABASE_DATABASE_URL` - PostgreSQL connection string (server-side only)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key (public)
- `NEXT_PUBLIC_API_URL` - API base URL (use `/api` for Vercel)

### Optional:

- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - Mapbox maps
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps
- Firebase configuration (if using Firebase Auth)

## Database Connection

The application uses:
- **Development**: PostgreSQL Pool connection via `pg` library
- **Production**: Same PostgreSQL Pool connection, but serverless-optimized

Each API route creates a database pool connection that's reused across requests within the same serverless function instance.

## Troubleshooting

### API Routes Not Working

1. Check environment variables are set in Vercel dashboard
2. Verify `NEXT_PUBLIC_API_URL=/api` in production
3. Check Vercel function logs for errors

### Database Connection Issues

1. Verify `SUPABASE_DATABASE_URL` is correct
2. Check Supabase project is active
3. Verify SSL connection settings (required for Supabase)
4. Check Vercel function logs

### Build Failures

1. Run `npm run build` locally to test
2. Check for TypeScript errors
3. Verify all dependencies are in `package.json`
4. Check Node.js version compatibility

## Monitoring

- **Vercel Analytics**: Enable in project settings
- **Vercel Logs**: View real-time logs in dashboard
- **Supabase Dashboard**: Monitor database queries and performance

## Performance Optimization

1. **Edge Functions**: Consider using Vercel Edge Functions for faster response times
2. **Caching**: Implement caching for frequently accessed data
3. **Database Indexes**: Ensure proper indexes in Supabase
4. **Connection Pooling**: Already implemented in [lib/db.js](lib/db.js)

## Next Steps

1. Set up continuous deployment (auto-deploy on git push)
2. Configure preview deployments for branches
3. Add monitoring and error tracking (e.g., Sentry)
4. Implement rate limiting for API routes
5. Add API authentication if needed

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
- Supabase Docs: https://supabase.com/docs
