import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

// Import routes
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import beneficiariesRoutes from './routes/beneficiaries.js';
import meetingsRoutes from './routes/meetings.js';
import messagesRoutes from './routes/messages.js';
import tasksRoutes from './routes/tasks.js';
import donationsRoutes from './routes/donations.js';
import financialRoutes from './routes/financial.js';
import paymentsRoutes from './routes/payments.js';
import errorsRoutes from './routes/errors.js';
import smsRoutes from './routes/sms.js';
import emailRoutes from './routes/email.js';
import whatsappRoutes from './routes/whatsapp.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.supabase.co", "wss://realtime.supabase.co"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://dernek-panel.vercel.app', 'https://dernek-panel.netlify.app']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

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
app.use('/api/auth', authRoutes);
app.use('/api/beneficiaries', beneficiariesRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/errors', errorsRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/whatsapp', whatsappRoutes);

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
