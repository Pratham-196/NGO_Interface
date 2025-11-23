# World Literacy Foundation - Sun Books Backend

This is the backend API for the World Literacy Foundation's Sun Books program, providing solar-powered tablet management and analytics.

## Features

- **Device Management**: Track and manage Sun Book devices deployed worldwide
- **Real-time Analytics**: Monitor usage statistics, battery levels, and performance
- **Location Tracking**: View device deployments by country and region
- **Maintenance Management**: Track device issues and maintenance schedules
- **Usage Statistics**: Detailed analytics on reading sessions and user engagement

## API Endpoints

### Sun Books Devices
- `GET /api/sunbooks` - Get all devices (with filtering and pagination)
- `GET /api/sunbooks/:deviceId` - Get specific device details
- `POST /api/sunbooks` - Create new device
- `PUT /api/sunbooks/:deviceId` - Update device
- `DELETE /api/sunbooks/:deviceId` - Delete device

### Analytics
- `GET /api/sunbooks/stats/global` - Global statistics
- `GET /api/sunbooks/:deviceId/analytics` - Device-specific analytics

### Usage Tracking
- `POST /api/sunbooks/:deviceId/usage` - Record usage session
- `POST /api/sunbooks/:deviceId/maintenance` - Report maintenance issue

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd wlf/backend
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/wlf_db
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. **Database Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Ensure MongoDB is running on the configured URI

4. **Start the Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Test the API**
   - Health check: `GET http://localhost:3001/api/health`
   - Global stats: `GET http://localhost:3001/api/sunbooks/stats/global`

## Data Models

### Sun Book Device
- Device ID and location information
- Battery level and solar panel efficiency
- Content library and usage statistics
- Maintenance history and performance metrics

### Usage Analytics
- Session tracking and reading time
- User engagement metrics
- Popular content analysis
- Performance indicators

## Frontend Integration

The frontend connects to this backend through:
- Real-time statistics display
- Device location mapping
- Usage analytics dashboard
- Maintenance request system

## Development

- Uses Express.js for the API framework
- MongoDB with Mongoose for data persistence
- CORS enabled for frontend integration
- Rate limiting for API protection
- Comprehensive error handling

## Production Deployment

- Set `NODE_ENV=production`
- Configure proper MongoDB connection string
- Set up SSL/TLS for secure communication
- Configure proper CORS origins
- Set up monitoring and logging
