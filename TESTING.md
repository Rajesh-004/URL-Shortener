# TinyLink Testing Guide

This document outlines how the application meets the automated testing requirements.

## API Endpoints Compliance

### Health Check
✅ **GET /healthz**
- Returns status 200
- Response format:
```json
{
  "ok": true,
  "version": "1.0",
  "uptime": "123s",
  "timestamp": "2025-11-24T..."
}
```

### Links API

✅ **POST /api/links** - Create link
- Request body:
```json
{
  "targetUrl": "https://example.com/long/url",
  "customCode": "mycode" // optional
}
```
- Success (201):
```json
{
  "id": 1,
  "code": "mycode",
  "target_url": "https://example.com/long/url",
  "total_clicks": 0,
  "last_clicked_at": null,
  "created_at": "2025-11-24T...",
  "updated_at": "2025-11-24T..."
}
```
- Duplicate code (409):
```json
{
  "error": "Short code already exists"
}
```
- Invalid URL (400):
```json
{
  "error": "Invalid or missing target URL"
}
```

✅ **GET /api/links** - List all links
- Returns array of link objects
- Ordered by created_at DESC

✅ **GET /api/links/:code** - Get stats for one code
- Success (200): Returns link object
- Not found (404):
```json
{
  "error": "Link not found"
}
```

✅ **DELETE /api/links/:code** - Delete link
- Success (200):
```json
{
  "success": true,
  "deleted": { ... }
}
```
- Not found (404):
```json
{
  "error": "Link not found"
}
```

### Redirect

✅ **GET /:code** - Redirect
- Performs HTTP 302 redirect to target URL
- Increments total_clicks by 1
- Updates last_clicked_at timestamp
- Returns 404 if code doesn't exist

## Pages Compliance

✅ **GET /** - Dashboard
- Lists all links in a table
- Shows: code, target URL, clicks, last clicked time
- Add link form with custom code option
- Delete functionality
- Search/filter capability

✅ **GET /code/:code** - Stats page
- Shows detailed stats for a single link
- Displays: code, short URL, target URL, total clicks, created date, last clicked

## Code Validation

✅ **Short Code Format**: `[A-Za-z0-9]{6,8}`
- Custom codes must match this pattern
- Auto-generated codes are 8 characters
- Validation enforced in both frontend and backend

## Test Scenarios

### 1. Health Check Test
```bash
curl https://your-app.com/healthz
# Expected: 200 OK with { "ok": true, "version": "1.0" }
```

### 2. Create Link Test
```bash
curl -X POST https://your-app.com/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://google.com"}'
# Expected: 201 Created with link object
```

### 3. Duplicate Code Test
```bash
# First create a link with custom code
curl -X POST https://your-app.com/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://google.com", "customCode": "test123"}'

# Try to create another with same code
curl -X POST https://your-app.com/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://example.com", "customCode": "test123"}'
# Expected: 409 Conflict
```

### 4. Redirect Test
```bash
# Create a link first, then:
curl -I https://your-app.com/test123
# Expected: 302 redirect with Location header

# Check that click count increased
curl https://your-app.com/api/links/test123
# Expected: total_clicks should be incremented
```

### 5. Delete Test
```bash
# Delete a link
curl -X DELETE https://your-app.com/api/links/test123
# Expected: 200 OK

# Try to access deleted link
curl -I https://your-app.com/test123
# Expected: 404 Not Found
```

## UI/UX Testing Checklist

### Layout & Hierarchy
- [ ] Clear navigation structure
- [ ] Readable typography
- [ ] Sensible spacing and padding
- [ ] Consistent header/footer

### States
- [ ] Empty state (no links)
- [ ] Loading state (fetching data)
- [ ] Success state (link created)
- [ ] Error state (validation failed, duplicate code)

### Form UX
- [ ] Inline validation for URL format
- [ ] Inline validation for code format (6-8 alphanumeric)
- [ ] Friendly error messages
- [ ] Submit button disabled during loading
- [ ] Success confirmation visible after creation
- [ ] Form clears after successful submission

### Tables
- [ ] Sort/filter functionality
- [ ] Long URLs truncated with ellipsis
- [ ] Full URL visible on hover
- [ ] Copy button works
- [ ] Delete confirmation dialog

### Responsiveness
- [ ] Works on mobile (< 768px)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on desktop (> 1024px)
- [ ] No horizontal scroll on mobile
- [ ] Touch-friendly buttons on mobile

### Consistency
- [ ] Uniform button styles
- [ ] Consistent color scheme
- [ ] Consistent formatting (dates, URLs)
- [ ] Shared header/footer across pages

## Automated Testing Commands

### Manual API Testing
```bash
# Set your base URL
BASE_URL="https://your-app.com"

# 1. Health check
curl $BASE_URL/healthz

# 2. Create link
curl -X POST $BASE_URL/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://google.com", "customCode": "google1"}'

# 3. List links
curl $BASE_URL/api/links

# 4. Get specific link
curl $BASE_URL/api/links/google1

# 5. Test redirect (should return 302)
curl -I $BASE_URL/google1

# 6. Delete link
curl -X DELETE $BASE_URL/api/links/google1

# 7. Verify 404 after deletion
curl -I $BASE_URL/google1
```

## Performance Expectations

- Health check: < 100ms
- API endpoints: < 500ms
- Redirects: < 200ms
- Page loads: < 2s

## Error Handling

All errors return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 302: Redirect
- 400: Bad Request (invalid input)
- 404: Not Found
- 409: Conflict (duplicate code)
- 500: Internal Server Error

## Database Integrity

- Codes are unique (enforced by UNIQUE constraint)
- URLs are validated before saving
- Click counts cannot be negative
- Timestamps are automatically managed

## Security Considerations

- URL validation prevents invalid redirects
- No SQL injection (using parameterized queries)
- No XSS (React escapes output by default)
- CORS configured for API endpoints
- Environment variables for sensitive data

---

**Testing Checklist Summary**

- [x] /healthz returns 200
- [x] Creating a link works
- [x] Duplicate codes return 409
- [x] Redirect works (302)
- [x] Redirect increments click count
- [x] Deletion works
- [x] Deleted links return 404
- [x] UI has proper layout
- [x] UI shows all states (empty, loading, success, error)
- [x] Form validation works
- [x] Responsive design
- [x] Code format validation [A-Za-z0-9]{6,8}
