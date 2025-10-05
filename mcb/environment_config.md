# MCB Job Portal - Environment Configuration

## Environment Variables

Create a `.env` file in your backend root directory with the following variables:

```bash
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mcb_job_portal
DB_USER=mcb_job_portal_user
DB_PASSWORD=your_secure_password
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_minimum_32_characters
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@mcbjobportal.com

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,txt,jpg,jpeg,png

# AWS S3 Configuration (for production file storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=mcb-job-portal-uploads

# Redis Configuration (for caching and sessions)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=1000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret_here

# API Keys (for external services)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
LINKEDIN_API_KEY=your_linkedin_api_key

# Webhook Configuration
WEBHOOK_SECRET=your_webhook_secret
WEBHOOK_URL=https://your-domain.com/webhooks

# Monitoring
SENTRY_DSN=your_sentry_dsn
NEW_RELIC_LICENSE_KEY=your_new_relic_key
```

## Production Environment Variables

For production, use these additional variables:

```bash
# Production Database
DB_SSL=true
DB_CA_CERT=path/to/ca-certificate.pem

# Production Email
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Production File Storage
USE_S3=true

# Production Security
CORS_ORIGIN=https://mcbjobportal.com
SESSION_SECURE=true
SESSION_HTTP_ONLY=true

# Production Monitoring
LOG_LEVEL=error
ENABLE_METRICS=true
```

## Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=mcb_job_portal
      - POSTGRES_USER=mcb_job_portal_user
      - POSTGRES_PASSWORD=your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database_schema.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass your_redis_password
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start application
CMD ["npm", "start"]
```

## Nginx Configuration

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3001;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=upload:10m rate=1r/s;

    server {
        listen 80;
        server_name api.mcbjobportal.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name api.mcbjobportal.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # File upload routes
        location /api/upload {
            limit_req zone=upload burst=5 nodelay;
            client_max_body_size 10M;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /uploads/ {
            alias /app/uploads/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check
        location /health {
            proxy_pass http://app;
            access_log off;
        }
    }
}
```

## Database Setup

### 1. Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### 2. Create Database and User
```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Create database
CREATE DATABASE mcb_job_portal;

-- Create user
CREATE USER mcb_job_portal_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mcb_job_portal TO mcb_job_portal_user;

-- Connect to the database
\c mcb_job_portal

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO mcb_job_portal_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mcb_job_portal_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mcb_job_portal_user;
```

### 3. Run Database Schema
```bash
psql -h localhost -U mcb_job_portal_user -d mcb_job_portal -f database_schema.sql
```

## Redis Setup

### 1. Install Redis
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Windows
# Download from https://github.com/microsoftarchive/redis/releases
```

### 2. Configure Redis
```bash
# Edit redis.conf
sudo nano /etc/redis/redis.conf

# Set password
requirepass your_redis_password

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## SSL Certificate Setup

### 1. Using Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d api.mcbjobportal.com

# Certificates will be stored in /etc/letsencrypt/live/api.mcbjobportal.com/
```

### 2. Using Self-Signed Certificate (Development)
```bash
# Generate private key
openssl genrsa -out key.pem 2048

# Generate certificate
openssl req -new -x509 -key key.pem -out cert.pem -days 365

# Copy to nginx ssl directory
sudo cp cert.pem /etc/nginx/ssl/
sudo cp key.pem /etc/nginx/ssl/
```

## Monitoring Setup

### 1. Install PM2 (Process Manager)
```bash
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

### 2. PM2 Ecosystem Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'mcb-job-portal-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 3. Log Rotation
```bash
# Install logrotate
sudo apt-get install logrotate

# Create logrotate configuration
sudo nano /etc/logrotate.d/mcb-job-portal
```

```bash
# /etc/logrotate.d/mcb-job-portal
/path/to/your/app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 nodejs nodejs
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Backup Configuration

### 1. Database Backup Script
```bash
#!/bin/bash
# backup_db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/database"
DB_NAME="mcb_job_portal"
DB_USER="mcb_job_portal_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/mcb_job_portal_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/mcb_job_portal_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: mcb_job_portal_$DATE.sql.gz"
```

### 2. File Upload Backup Script
```bash
#!/bin/bash
# backup_uploads.sh

DATE=$(date +%Y%m%d_%H%M%S)
UPLOAD_DIR="/app/uploads"
BACKUP_DIR="/backups/uploads"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create tar backup
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $UPLOAD_DIR .

# Remove backups older than 30 days
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +30 -delete

echo "Uploads backup completed: uploads_$DATE.tar.gz"
```

### 3. Automated Backup with Cron
```bash
# Edit crontab
crontab -e

# Add backup jobs
0 2 * * * /path/to/backup_db.sh >> /var/log/backup.log 2>&1
0 3 * * * /path/to/backup_uploads.sh >> /var/log/backup.log 2>&1
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable SSL/TLS encryption
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable database encryption at rest
- [ ] Configure secure headers
- [ ] Set up monitoring and alerting
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Access logging
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection

## Performance Optimization

- [ ] Database indexing
- [ ] Query optimization
- [ ] Redis caching
- [ ] CDN for static files
- [ ] Image optimization
- [ ] Gzip compression
- [ ] Connection pooling
- [ ] Load balancing
- [ ] Horizontal scaling
- [ ] Monitoring and profiling
