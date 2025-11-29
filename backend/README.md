# Backend API for The Elephant Production

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_PASSWORD=elephant2024
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Login with admin password
```json
{
  "password": "elephant2024"
}
```
Response:
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": { "id": "admin", "role": "admin" }
}
```

#### GET `/api/auth/verify`
Verify JWT token (requires Authorization header)

#### POST `/api/auth/logout`
Logout (client-side token removal)

### Content Management

#### GET `/api/content`
Get all site content (public)

#### PUT `/api/content`
Update all site content (requires auth)
```json
{
  "site": { ... },
  "home": { ... },
  "about": { ... }
}
```

#### GET `/api/content/:section`
Get specific section (e.g., `/api/content/home`)

#### PUT `/api/content/:section`
Update specific section (requires auth)

### Media Management

#### GET `/api/media`
Get all uploaded media (requires auth)

#### POST `/api/media/upload`
Upload files (requires auth)
- Form-data with field name `files`
- Supports multiple files
- Max 10 files per request

#### DELETE `/api/media/:id`
Delete media file (requires auth)

#### GET `/api/media/stats`
Get media statistics (requires auth)

### Static Files

#### GET `/uploads/:filename`
Access uploaded media files

## Project Structure

```
backend/
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env               # Environment variables
├── middleware/
│   └── auth.js        # JWT authentication middleware
├── routes/
│   ├── auth.js        # Authentication routes
│   ├── content.js     # Content management routes
│   └── media.js       # Media upload routes
├── data/
│   ├── content.json   # Site content database
│   └── media.json     # Media metadata database
└── uploads/           # Uploaded files directory
```

## Frontend Integration

Update your AdminContext to use the API:

```typescript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password })
});

// Get content
const response = await fetch('http://localhost:5000/api/content');

// Update content (with auth)
const response = await fetch('http://localhost:5000/api/content', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(content)
});
```

## Security Notes

- Change `JWT_SECRET` in production to a strong random string
- Use environment variables for sensitive data
- Implement rate limiting in production
- Add HTTPS in production
- Consider adding MongoDB for better scalability
- Implement proper user management system for multiple admins

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Update CORS origin to your domain
3. Use process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name elephant-backend
pm2 save
pm2 startup
```

4. Set up reverse proxy with Nginx
5. Enable HTTPS with Let's Encrypt
