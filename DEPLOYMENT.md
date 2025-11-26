# TinyLink Deployment Guide

## Prerequisites

1. **Neon Postgres Database**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string from the dashboard

2. **Vercel Account** (recommended)
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub account

## Step-by-Step Deployment

### 1. Set Up Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://user:password@host/database`)
4. Save this for later

### 2. Prepare Your Code

1. Create a GitHub repository
2. Push your TinyLink code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add the following:
     - `DATABASE_URL` = Your Neon connection string
     - `NEXT_PUBLIC_BASE_URL` = Your Vercel deployment URL (e.g., `https://tinylink.vercel.app`)

6. Click "Deploy"

### 4. Initialize Database

After deployment, you need to initialize the database schema:

**Option A: Run locally**
```bash
# In your local project
npm run init-db
```

**Option B: Use Neon SQL Editor**
1. Go to your Neon dashboard
2. Open the SQL Editor
3. Run this SQL:
```sql
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  total_clicks INTEGER DEFAULT 0,
  last_clicked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
```

### 5. Test Your Deployment

1. Visit your Vercel URL
2. Test the health check: `https://your-app.vercel.app/healthz`
3. Create a test link
4. Try redirecting with the short code
5. Check the stats page

## Alternative: Deploy to Render

1. Go to [render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables (same as Vercel)
6. Deploy

## Alternative: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Railway can provision a Postgres database for you automatically
5. Add environment variables
6. Deploy

## Environment Variables Reference

```env
# Required
DATABASE_URL=postgresql://user:password@host/database

# Required for production
NEXT_PUBLIC_BASE_URL=https://your-deployment-url.com
```

## Post-Deployment Checklist

- [ ] Health check endpoint works (`/healthz`)
- [ ] Can create new links
- [ ] Redirects work correctly
- [ ] Click tracking increments
- [ ] Stats page displays correctly
- [ ] Can delete links
- [ ] 404 returns after deletion
- [ ] Duplicate codes return 409

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your Neon database is active
- Ensure the connection string includes the password

### Build Failures
- Check that all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build`
- Check Vercel build logs for specific errors

### Redirect Not Working
- Ensure database is initialized
- Check that the link exists in the database
- Verify the route structure is correct

## Monitoring

- **Vercel**: Check Analytics and Logs in the Vercel dashboard
- **Neon**: Monitor database usage in the Neon dashboard
- **Health Check**: Set up uptime monitoring using the `/healthz` endpoint

## Scaling Considerations

- Neon free tier: 0.5 GB storage, 1 GB transfer
- Vercel free tier: 100 GB bandwidth, unlimited requests
- For higher traffic, consider upgrading to paid tiers

## Security Notes

- Never commit `.env.local` or `.env` files
- Use environment variables for all secrets
- Keep your database credentials secure
- Consider adding rate limiting for production

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Next.js Docs: https://nextjs.org/docs
