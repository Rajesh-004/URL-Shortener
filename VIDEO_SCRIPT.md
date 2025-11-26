# Video Walkthrough Script

Use this script to create your video explanation of the TinyLink project.

## Introduction (30 seconds)

"Hi! I'm [Your Name], and I'm going to walk you through my TinyLink URL shortener project. This is a full-stack web application built with Next.js, TypeScript, and Neon Postgres that allows users to create short links, track clicks, and manage URLs."

## Technology Overview (1 minute)

"Let me start by explaining my technology choices:

1. **Next.js 15** - I chose Next.js because it provides both frontend and backend in one framework. The App Router makes routing simple, and I can create API endpoints right alongside my pages.

2. **TypeScript** - For type safety and better developer experience. It helps catch errors before runtime.

3. **Neon Postgres** - A serverless Postgres database that's perfect for this project. It has a free tier and doesn't require connection pooling management.

4. **Tailwind CSS** - For rapid UI development with a modern, gradient-based design system."

## Architecture Walkthrough (2 minutes)

"Let me show you the project structure:

[Open file explorer or VS Code]

- The `app` directory contains all our routes
- `app/page.tsx` is the main dashboard
- `app/api/links` contains our REST API endpoints
- `app/[code]` handles redirects
- `app/code/[code]` shows detailed stats
- The `lib` folder has our database connection and utilities
- `scripts` contains the database initialization script

The database schema is simple but effective:
[Show lib/db.ts]

We have a links table with:
- A unique short code
- The target URL
- Click tracking (total_clicks and last_clicked_at)
- Timestamps for creation and updates"

## Feature Demonstration (3 minutes)

"Now let me demonstrate the key features:

[Open browser to localhost:3000]

### 1. Dashboard
'This is the main dashboard. It shows all shortened links in a beautiful table with a gradient background. Notice the glassmorphism effect with the backdrop blur.'

### 2. Creating a Link
'Let me create a new link. I'll click Add Link...'
[Click Add Link button]

'I can enter any URL - let me use https://github.com'
[Enter URL]

'I can optionally provide a custom code. The code must be 6-8 alphanumeric characters. Let me use "github1"'
[Enter custom code]

'Click Create Short Link...'
[Submit form]

'Great! The link is created and appears in the table. Notice the success message at the top.'

### 3. Testing the Redirect
'Now let me test the redirect. I'll copy the short URL...'
[Click Copy button]

'And paste it in a new tab...'
[Open new tab, paste URL]

'Perfect! It redirects to GitHub with a 302 redirect. Let me go back to the dashboard...'
[Go back]

'Notice the click count has increased to 1, and the last clicked time is updated.'

### 4. Stats Page
'Let me click on the Stats button to see detailed information...'
[Click Stats button]

'This page shows comprehensive stats: the short code, the full short URL with a copy button, the target URL, total clicks, creation date, and last clicked time. The design is consistent with the dashboard.'

### 5. Search and Filter
[Go back to dashboard]

'The dashboard has search functionality. Let me search for "github"...'
[Type in search box]

'It filters in real-time, showing only matching links.'

### 6. Deleting a Link
'Finally, let me demonstrate deletion. I'll click the Delete button...'
[Click Delete]

'It asks for confirmation to prevent accidents...'
[Confirm]

'The link is removed. Now if I try to visit that short URL...'
[Try to visit the deleted link]

'It returns a 404 error, as expected.'"

## Code Walkthrough (3 minutes)

"Let me walk through some key parts of the code:

### API Endpoints
[Open app/api/links/route.ts]

'This is the main API endpoint for links. The GET handler fetches all links from the database, ordered by creation date.

The POST handler creates new links. Notice the validation:
- We check if the URL is valid
- If a custom code is provided, we validate its format
- We check for duplicates and return 409 if the code exists
- If no custom code is provided, we generate a random one

All errors return appropriate HTTP status codes and descriptive messages.'

### Redirect Handler
[Open app/[code]/page.tsx]

'This handles the redirect. It:
1. Fetches the link from the database
2. Updates the click count and timestamp
3. Returns a 302 redirect to the target URL
4. Returns 404 if the link doesn't exist'

### Dashboard Component
[Open app/page.tsx]

'The dashboard is a client component because it needs interactivity. It has:
- State management for links, loading, and errors
- Form handling for creating links
- Real-time search/filter
- Copy to clipboard functionality
- Delete with confirmation

Notice the beautiful UI with gradient backgrounds, glassmorphism effects, and smooth transitions.'

### Utilities
[Open lib/utils.ts]

'I created utility functions for:
- Generating random codes using nanoid
- Validating short codes with regex
- Validating URLs
- Formatting dates
- Truncating long URLs for display'

### Database
[Open lib/db.ts]

'The database connection uses Neon's serverless driver. The initDatabase function creates the table and index if they don't exist. This is called by the init-db script before first run.'"

## Testing & Compliance (1 minute)

"The application meets all the automated testing requirements:

[Open browser to /healthz]

'The health check endpoint returns 200 with the required format.'

[Open TESTING.md]

'I've documented all the test scenarios here. The application:
- Returns 409 for duplicate codes
- Performs 302 redirects
- Increments click counts
- Returns 404 for deleted links
- Validates code format [A-Za-z0-9]{6,8}
- Has proper error handling throughout'

The UI also meets all requirements:
- Clear layout and hierarchy
- Loading, error, success, and empty states
- Form validation with friendly messages
- Responsive design
- Search/filter functionality
- Copy buttons that work'"

## Deployment (1 minute)

"For deployment, I've created comprehensive documentation:

[Show DEPLOYMENT.md]

'The app is ready to deploy to Vercel with these steps:
1. Create a Neon database
2. Push code to GitHub
3. Import to Vercel
4. Set environment variables
5. Initialize the database
6. Deploy

I've also included instructions for Render and Railway as alternatives.

The .env.example file shows what environment variables are needed:
- DATABASE_URL for the Neon connection
- NEXT_PUBLIC_BASE_URL for the deployment URL'"

## Challenges & Learnings (1 minute)

"Some interesting challenges I encountered:

1. **Client vs Server Components** - Understanding when to use 'use client' in Next.js App Router. The dashboard needs client-side interactivity, but the redirect handler should be server-side for performance.

2. **Database Initialization** - Creating a script to initialize the schema that can be run both locally and in production.

3. **Error Handling** - Ensuring all edge cases return appropriate status codes and messages for automated testing.

4. **UI/UX** - Creating a beautiful, modern interface that's also functional and meets all the requirements. I used gradients, glassmorphism, and smooth animations to make it feel premium.

5. **Code Uniqueness** - Implementing both auto-generated and custom codes while ensuring global uniqueness."

## Conclusion (30 seconds)

"In summary, TinyLink is a production-ready URL shortener that:
- Meets all assignment requirements
- Has a beautiful, responsive UI
- Includes comprehensive error handling
- Is fully documented
- Is ready for deployment
- Passes all automated testing requirements

Thank you for watching! The code is available on GitHub, and I'm happy to answer any questions about the implementation."

---

## Tips for Recording

1. **Preparation**
   - Have the app running locally
   - Open all relevant files in VS Code
   - Clear browser history/cookies
   - Test your microphone

2. **Recording**
   - Use screen recording software (OBS, Loom, etc.)
   - Record in 1080p if possible
   - Speak clearly and at a moderate pace
   - Show your face if comfortable (builds connection)

3. **Editing**
   - Cut out long pauses
   - Add timestamps in description
   - Include GitHub link in description
   - Upload to YouTube (unlisted is fine)

4. **What to Show**
   - File structure
   - Key code sections
   - Live demo of all features
   - Browser DevTools for API calls
   - Database (optional)

5. **Time Management**
   - Aim for 10-15 minutes total
   - Don't rush, but stay focused
   - Practice once before recording
   - It's okay to have multiple takes

## Video Checklist

- [ ] Introduction and overview
- [ ] Technology stack explanation
- [ ] Architecture walkthrough
- [ ] Live demo of all features
- [ ] Code walkthrough
- [ ] Testing compliance
- [ ] Deployment readiness
- [ ] Challenges and learnings
- [ ] Conclusion
- [ ] GitHub link in description
- [ ] Clear audio
- [ ] Readable screen resolution
