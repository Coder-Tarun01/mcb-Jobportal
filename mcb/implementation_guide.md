# MCB Job Portal - Backend Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing the MCB Job Portal backend based on the API documentation and database schema.

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL 15+
- Redis 7+
- Git

## Project Structure
```
backend/
├── src/
│   ├── controllers/          # Route controllers
│   ├── middleware/           # Custom middleware
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   ├── validators/          # Input validation
│   └── server.js            # Application entry point
├── tests/                   # Test files
├── uploads/                 # File uploads directory
├── logs/                    # Application logs
├── docs/                    # Documentation
├── package.json
├── .env
└── README.md
```

## Step 1: Project Setup

### 1.1 Initialize Project
```bash
mkdir mcb-job-portal-backend
cd mcb-job-portal-backend
npm init -y
```

### 1.2 Install Dependencies
```bash
# Core dependencies
npm install express cors helmet morgan compression
npm install pg sequelize sequelize-cli
npm install redis ioredis
npm install jsonwebtoken bcryptjs
npm install multer sharp
npm install nodemailer
npm install joi express-rate-limit
npm install winston winston-daily-rotate-file
npm install dotenv

# Development dependencies
npm install -D nodemon jest supertest
npm install -D eslint prettier
```

### 1.3 Create Project Structure
```bash
mkdir -p src/{controllers,middleware,models,routes,services,utils,config,validators}
mkdir -p {tests,uploads,logs,docs}
```

## Step 2: Database Setup

### 2.1 Configure Sequelize
```bash
npx sequelize-cli init
```

### 2.2 Update config/config.js
```javascript
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_test',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    ssl: process.env.DB_SSL === 'true',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
};
```

### 2.3 Create Database Models
Create model files in `src/models/` directory:

#### User Model (`src/models/User.js`)
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash'
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  role: {
    type: DataTypes.ENUM('employee', 'employer'),
    allowNull: false
  },
  profilePicture: {
    type: DataTypes.STRING(500),
    field: 'profile_picture'
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_email_verified'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  lastLogin: {
    type: DataTypes.DATE,
    field: 'last_login'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;
```

#### Job Model (`src/models/Job.js`)
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'company_id',
    references: {
      model: 'companies',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  isRemote: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_remote'
  },
  type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance', 'temporary'),
    allowNull: false
  },
  experienceMin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'experience_min'
  },
  experienceMax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'experience_max'
  },
  salaryMin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'salary_min'
  },
  salaryMax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'salary_max'
  },
  salaryCurrency: {
    type: DataTypes.ENUM('INR', 'USD', 'EUR', 'GBP', 'CAD', 'AUD'),
    allowNull: false,
    field: 'salary_currency'
  },
  salaryNegotiable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'salary_negotiable'
  },
  benefits: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  postedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'posted_date'
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    field: 'application_deadline'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'closed', 'expired'),
    defaultValue: 'draft'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  applicantCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'applicant_count'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'view_count'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Job;
```

## Step 3: Authentication Implementation

### 3.1 JWT Service (`src/services/authService.js`)
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthService {
  async register(userData) {
    const { password, ...userInfo } = userData;
    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      ...userInfo,
      passwordHash
    });
    
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    return {
      user: this.sanitizeUser(user),
      token,
      refreshToken
    };
  }
  
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
    
    await user.update({ lastLogin: new Date() });
    
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    return {
      user: this.sanitizeUser(user),
      token,
      refreshToken
    };
  }
  
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
  
  generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
  }
  
  sanitizeUser(user) {
    const { passwordHash, ...sanitizedUser } = user.toJSON();
    return sanitizedUser;
  }
}

module.exports = new AuthService();
```

### 3.2 Auth Middleware (`src/middleware/auth.js`)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};
```

## Step 4: API Routes Implementation

### 4.1 Auth Routes (`src/routes/auth.js`)
```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const authService = require('../services/authService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['employee', 'employer']).withMessage('Role must be employee or employer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const result = await authService.register(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const result = await authService.login(req.body.email, req.body.password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;
```

### 4.2 Jobs Routes (`src/routes/jobs.js`)
```javascript
const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Job = require('../models/Job');
const Company = require('../models/Company');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all jobs
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('location').optional().isString(),
  query('type').optional().isIn(['full-time', 'part-time', 'contract', 'internship']),
  query('category').optional().isString(),
  query('salaryMin').optional().isInt({ min: 0 }),
  query('salaryMax').optional().isInt({ min: 0 }),
  query('experience').optional().isInt({ min: 0 }),
  query('sortBy').optional().isIn(['postedDate', 'salary', 'title']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const {
      page = 1,
      limit = 20,
      search,
      location,
      type,
      category,
      salaryMin,
      salaryMax,
      experience,
      sortBy = 'postedDate',
      sortOrder = 'desc'
    } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = { status: 'active' };
    
    // Apply filters
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { skills: { [Op.contains]: [search] } }
      ];
    }
    
    if (location) {
      whereClause.location = { [Op.iLike]: `%${location}%` };
    }
    
    if (type) {
      whereClause.type = type;
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (salaryMin) {
      whereClause.salaryMin = { [Op.gte]: salaryMin };
    }
    
    if (salaryMax) {
      whereClause.salaryMax = { [Op.lte]: salaryMax };
    }
    
    if (experience) {
      whereClause.experienceMin = { [Op.lte]: experience };
      whereClause.experienceMax = { [Op.gte]: experience };
    }
    
    const { count, rows: jobs } = await Job.findAndCountAll({
      where: whereClause,
      include: [{
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'logo', 'website', 'size', 'industry']
      }],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{
        model: Company,
        as: 'company'
      }]
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Increment view count
    await job.increment('viewCount');
    
    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create job (Employer only)
router.post('/', authenticateToken, requireRole(['employer']), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('requirements').isArray({ min: 1 }).withMessage('At least one requirement is required'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('type').isIn(['full-time', 'part-time', 'contract', 'internship']).withMessage('Invalid job type'),
  body('experienceMin').isInt({ min: 0 }).withMessage('Minimum experience must be a positive integer'),
  body('experienceMax').isInt({ min: 0 }).withMessage('Maximum experience must be a positive integer'),
  body('salaryMin').isInt({ min: 0 }).withMessage('Minimum salary must be a positive integer'),
  body('salaryMax').isInt({ min: 0 }).withMessage('Maximum salary must be a positive integer'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const jobData = {
      ...req.body,
      createdBy: req.user.id,
      companyId: req.user.companyId // Assuming user has companyId
    };
    
    const job = await Job.create(jobData);
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
```

## Step 5: Server Configuration

### 5.1 Main Server File (`src/server.js`)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/applications');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

## Step 6: Testing

### 6.1 Install Testing Dependencies
```bash
npm install -D jest supertest
```

### 6.2 Create Test Files
Create test files in the `tests/` directory:

#### Auth Tests (`tests/auth.test.js`)
```javascript
const request = require('supertest');
const app = require('../src/server');

describe('Authentication', () => {
  test('POST /api/v1/auth/register - should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'employee'
    };
    
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.token).toBeDefined();
  });
  
  test('POST /api/v1/auth/login - should login user', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(loginData)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
  });
});
```

## Step 7: Deployment

### 7.1 Create Production Build Script
Add to `package.json`:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "migrate": "npx sequelize-cli db:migrate",
    "seed": "npx sequelize-cli db:seed:all"
  }
}
```

### 7.2 Environment Setup
1. Copy `.env.example` to `.env`
2. Update environment variables for production
3. Set up database and Redis
4. Configure SSL certificates
5. Set up monitoring and logging

## Step 8: Monitoring and Maintenance

### 8.1 Logging Configuration
```javascript
// src/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### 8.2 Health Monitoring
```javascript
// src/middleware/healthCheck.js
const { Pool } = require('pg');
const Redis = require('ioredis');

const healthCheck = async (req, res) => {
  const checks = {
    database: false,
    redis: false,
    timestamp: new Date().toISOString()
  };
  
  try {
    // Check database
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    await pool.query('SELECT 1');
    checks.database = true;
    await pool.end();
  } catch (error) {
    console.error('Database health check failed:', error);
  }
  
  try {
    // Check Redis
    const redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    });
    
    await redis.ping();
    checks.redis = true;
    redis.disconnect();
  } catch (error) {
    console.error('Redis health check failed:', error);
  }
  
  const isHealthy = checks.database && checks.redis;
  
  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'All systems operational' : 'Some systems are down',
    checks
  });
};

module.exports = healthCheck;
```

## Next Steps

1. **Complete all model definitions** based on the database schema
2. **Implement remaining API endpoints** (applications, notifications, etc.)
3. **Add comprehensive error handling** and validation
4. **Set up automated testing** with good coverage
5. **Configure CI/CD pipeline** for deployment
6. **Implement caching strategy** with Redis
7. **Add API documentation** with Swagger/OpenAPI
8. **Set up monitoring and alerting**
9. **Implement backup and recovery procedures**
10. **Performance optimization** and load testing

This implementation guide provides a solid foundation for building the MCB Job Portal backend. Follow the steps sequentially and customize based on your specific requirements.
