const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { validateUserInput } = require('./middleware/validation');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.log(`${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  logger.log('MongoDB connected');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  logger.error('MongoDB connection error', err);
});

// Basic Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AI-SCHOOL-NTO API',
    version: '1.0.0',
    description: 'Nâng cấp Website Trường THCS Nguyễn Trường Tộ thành nền tảng Trường học thông minh ứng dụng Trí tuệ nhân tạo (AI)',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      assignments: '/api/assignments',
      chatbot: '/api/chatbot'
    }
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes
app.use('/api/auth', validateUserInput, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/chatbot', chatbotRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} không tồn tại`,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'POST /api/auth/logout',
      'GET /api/users/profile',
      'PUT /api/users/profile',
      'PUT /api/users/change-password',
      'GET /api/courses',
      'POST /api/courses',
      'GET /api/assignments',
      'POST /api/chatbot/message'
    ]
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📝 Môi trường: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.MONGODB_URI?.split('@')[1] || 'not configured'}`);
  logger.log('Server started', { port: PORT, env: process.env.NODE_ENV });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Server shutting down...');
  mongoose.connection.close();
  process.exit(0);
});

module.exports = app;
