# Quick Start Guide

Get TinyLink running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Neon Postgres database (free at [neon.tech](https://neon.tech))

## Step 1: Get Your Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:password@host/database`)

## Step 2: Set Up Environment

Create a `.env.local` file in the project root:

```env
DATABASE_URL=your_neon_connection_string_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important**: Replace `your_neon_connection_string_here` with your actual Neon connection string!

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Initialize Database

```bash
npm run init-db
```

You should see: `✓ Database initialized successfully!`

## Step 5: Run the App

```bash
npm run dev
```

## Step 6: Open in Browser

Go to [http://localhost:3000](http://localhost:3000)

## What to Try

1. **Create a link**: Click "+ Add Link" and enter a URL
2. **Use custom code**: Try creating a link with code "test123"
3. **Test redirect**: Visit `http://localhost:3000/test123`
4. **View stats**: Click "📊 Stats" on any link
5. **Copy link**: Click "📋 Copy" to copy the short URL
6. **Delete link**: Click "🗑️ Delete" to remove a link

## Troubleshooting

### "Failed to fetch links"
- Check that your `DATABASE_URL` is correct in `.env.local`
- Make sure you ran `npm run init-db`
- Verify your Neon database is active

### "Module not found"
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then run `npm install`

### Port 3000 already in use
- Stop other apps using port 3000
- Or run on different port: `npm run dev -- -p 3001`

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Review [TESTING.md](./TESTING.md) for testing guidelines

## Quick Commands

```bash
# Development
npm run dev          # Start dev server

# Database
npm run init-db      # Initialize database schema

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

**Need Help?** Check the full [README.md](./README.md) or open an issue.
