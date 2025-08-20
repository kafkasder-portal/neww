import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Import routes
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import beneficiariesRoutes from './routes/beneficiaries';
import meetingsRoutes from './routes/meetings';
import messagesRoutes from './routes/messages';
import tasksRoutes from './routes/tasks';
import donationsRoutes from './routes/donations';
import financialRoutes from './routes/financial';
import paymentsRoutes from './routes/payments';
import errorsRoutes from './routes/errors';
import smsRoutes from './routes/sms';
import emailRoutes from './routes/email';
import whatsappRoutes from './routes/whatsapp';
import analyticsRoutes from './routes/analytics';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import {
  validateEnvironment,
  securityHeaders,
  corsOptions,
  sanitizeInput,
  generateCSRFToken,
  validateCSRFToken,
  apiRateLimit,
  authRateLimit,
  paymentRateLimit,
} from './middleware/security';

const app = express();

// Validate environment variables on startup
try {
  validateEnvironment();
  console.log('✅ Environment validation passed');
} catch (error) {
  console.error('❌ Environment validation failed:', error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
}

// Security headers
app.use(securityHeaders);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  store: process.env.NODE_ENV === 'production' 
    ? MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
    : undefined
}));

// CSRF token endpoint
app.get('/api/csrf-token', (req, res) => {
  const token = generateCSRFToken();
  req.session.csrfToken = token;
  res.json({ csrfToken: token });
});

// CORS configuration
app.use(cors(corsOptions));

// General rate limiting
app.use('/api', apiRateLimit);

// Input sanitization
app.use(sanitizeInput);

// CSRF protection for state-changing operations
app.use(validateCSRFToken);

// Compression and parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/beneficiaries', beneficiariesRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/payments', paymentRateLimit, paymentsRoutes);
app.use('/api/errors', errorsRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;
