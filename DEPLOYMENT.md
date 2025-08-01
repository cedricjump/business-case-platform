# Deployment Guide

This guide covers deploying the Business Case Platform to various cloud platforms.

## Prerequisites

1. **MongoDB Database**: You'll need a MongoDB instance (local or cloud)
2. **OpenAI API Key**: For AI-powered analysis features
3. **Environment Variables**: Configure your production environment

## Environment Variables

Create a `.env` file with these variables:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=production

# File Upload Configuration
MAX_FILE_SIZE=10485760

# Optional: For production
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=https://yourdomain.com
```

## Deployment Options

### 1. Railway (Recommended)

Railway is the easiest option with built-in MongoDB support.

**Steps:**
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add MongoDB plugin in Railway dashboard
5. Set environment variables in Railway dashboard
6. Deploy: `railway up`

**Benefits:**
- Free tier available
- Built-in MongoDB support
- Automatic HTTPS
- Easy environment variable management

### 2. Render

**Steps:**
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm run install-all`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### 3. Heroku

**Steps:**
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add MongoDB addon: `heroku addons:create mongolab`
5. Set environment variables
6. Deploy: `git push heroku main`

### 4. Vercel (Frontend) + Railway (Backend)

For better performance, deploy frontend and backend separately:

**Frontend (Vercel):**
1. Deploy client folder to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`

**Backend (Railway):**
1. Deploy server folder to Railway
2. Update frontend API calls to use Railway URL

## Database Setup

### MongoDB Atlas (Recommended for production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create database user
4. Get connection string
5. Add to environment variables

### Local MongoDB

For development or if you prefer self-hosted:

```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

## File Storage

The application uses local file storage by default. For production, consider:

1. **AWS S3**: For scalable file storage
2. **Cloudinary**: For image processing
3. **Railway Volumes**: For persistent storage

## SSL/HTTPS

Most platforms provide automatic SSL certificates. For custom domains:

1. **Railway**: Automatic SSL
2. **Render**: Automatic SSL
3. **Heroku**: Automatic SSL
4. **Vercel**: Automatic SSL

## Monitoring

Set up monitoring for production:

1. **Health Checks**: `/api/health` endpoint
2. **Logs**: Use platform-specific logging
3. **Error Tracking**: Consider Sentry integration

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version compatibility
2. **Database Connection**: Verify MongoDB URI format
3. **File Uploads**: Check file size limits
4. **CORS Issues**: Update CORS_ORIGIN environment variable

### Debug Commands

```bash
# Check logs
railway logs
render logs
heroku logs --tail

# Check environment variables
railway variables
render env
heroku config
```

## Performance Optimization

1. **Enable Gzip compression**
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Optimize database queries**

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Implement rate limiting
- [ ] Validate file uploads
- [ ] Use secure headers
- [ ] Regular dependency updates 