# Deployment Guide

Complete guide for deploying the LaunchDarkly Contentstack Integration to production.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Production Setup](#production-setup)
3. [LaunchDarkly Integration](#launchdarkly-integration)
4. [Environment Configuration](#environment-configuration)
5. [Security Considerations](#security-considerations)
6. [Monitoring & Logging](#monitoring--logging)
7. [Performance Optimization](#performance-optimization)
8. [Rollback Procedures](#rollback-procedures)

## 🎯 Prerequisites

### LaunchDarkly Requirements
- LaunchDarkly account with Partner Integration access
- Production environment configured
- API access tokens with proper permissions

### Contentstack Requirements
- Contentstack production account
- Production API Key
- Production Delivery Token
- Production environment name

### Infrastructure Requirements
- Node.js 18+ runtime
- HTTPS endpoint for integration
- Monitoring and logging capabilities
- Backup and disaster recovery plan

## 🚀 Production Setup

### Step 1: Prepare the Integration

1. **Clone and Setup**
   ```bash
   git clone https://github.com/your-org/launchdarkly-contentstack-integration.git
   cd launchdarkly-contentstack-integration
   npm install
   ```

2. **Build the Integration**
   ```bash
   # Build for production
   npm run build
   
   # Test the build
   npm run test:comprehensive
   ```

3. **Verify Integration Files**
   ```bash
   # Check required files exist
   ls -la integration-manifest.json
   ls -la runtime-api.js
   ls -la runtime/flagPreview.js
   ```

### Step 2: Environment Configuration

1. **Create Production Environment File**
   ```bash
   # Create production environment file
   cat > .env.production << EOF
   CONTENTSTACK_API_KEY=your_production_api_key
   CONTENTSTACK_DELIVERY_TOKEN=your_production_delivery_token
   CONTENTSTACK_ENVIRONMENT=production
   NODE_ENV=production
   EOF
   ```

2. **Set Production Environment Variables**
   ```bash
   # Set production variables
   export CONTENTSTACK_API_KEY="your_production_api_key"
   export CONTENTSTACK_DELIVERY_TOKEN="your_production_delivery_token"
   export CONTENTSTACK_ENVIRONMENT="production"
   export NODE_ENV="production"
   ```

### Step 3: Deploy Integration Files

1. **Upload to LaunchDarkly**
   - Go to LaunchDarkly Dashboard
   - Navigate to Integrations → Partner Integrations
   - Click "Upload Integration"
   - Upload `integration-manifest.json`

2. **Configure Production Credentials**
   - Add your production Contentstack credentials
   - Test the connection
   - Verify flag preview functionality

## 🔧 LaunchDarkly Integration

### Integration Configuration

1. **Upload Integration Manifest**
   ```json
   {
     "id": "contentstack",
     "name": "Contentstack Integration",
     "description": "Serve dynamic content from Contentstack through LaunchDarkly flags",
     "capabilities": {
       "webhook": false,
       "runtimeApi": true,
       "flagPreview": true
     }
   }
   ```

2. **Configure Credentials**
   - **API Key**: Your production Contentstack API Key
   - **Delivery Token**: Your production Contentstack Delivery Token
   - **Environment**: Your production environment name

3. **Test Integration**
   - Test connection to Contentstack
   - Test flag preview functionality
   - Verify error handling

### Flag Configuration

1. **Create Production Flags**
   ```json
   {
     "cmsType": "contentstack",
     "entryId": "your_production_entry_id",
     "environment": "production",
     "contentType": "page"
   }
   ```

2. **Set Up Targeting Rules**
   - Configure user segments
   - Set up percentage rollouts
   - Define custom targeting rules

3. **Test Flag Variations**
   - Test with different user contexts
   - Verify content loading
   - Check error scenarios

## ⚙️ Environment Configuration

### Production Environment Variables

```bash
# Contentstack Configuration
CONTENTSTACK_API_KEY=your_production_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_production_delivery_token
CONTENTSTACK_ENVIRONMENT=production

# Application Configuration
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Security Configuration
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Environment-Specific Configuration

#### Development
```bash
CONTENTSTACK_ENVIRONMENT=development
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

#### Staging
```bash
CONTENTSTACK_ENVIRONMENT=staging
LOG_LEVEL=info
CORS_ORIGIN=https://staging.your-domain.com
```

#### Production
```bash
CONTENTSTACK_ENVIRONMENT=production
LOG_LEVEL=warn
CORS_ORIGIN=https://your-domain.com
```

## 🔒 Security Considerations

### Credential Management

1. **Secure Storage**
   ```bash
   # Use environment variables (not hardcoded)
   export CONTENTSTACK_API_KEY="your_api_key"
   export CONTENTSTACK_DELIVERY_TOKEN="your_delivery_token"
   ```

2. **Access Control**
   - Limit credential access to authorized personnel
   - Use role-based access control
   - Implement audit logging

3. **Credential Rotation**
   - Rotate API keys regularly
   - Monitor credential usage
   - Implement automated rotation

### Network Security

1. **HTTPS Only**
   ```javascript
   // Ensure HTTPS in production
   if (process.env.NODE_ENV === 'production' && !req.secure) {
     return res.redirect(`https://${req.headers.host}${req.url}`);
   }
   ```

2. **CORS Configuration**
   ```javascript
   const corsOptions = {
     origin: process.env.CORS_ORIGIN,
     credentials: true,
     optionsSuccessStatus: 200
   };
   ```

3. **Rate Limiting**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000,
     max: process.env.RATE_LIMIT_MAX || 100
   });
   ```

### Data Protection

1. **Input Validation**
   ```javascript
   // Validate all inputs
   const validateCMSReference = (ref) => {
     if (!ref.cmsType || ref.cmsType !== 'contentstack') {
       throw new Error('Invalid CMS type');
     }
     if (!ref.entryId || !ref.environment) {
       throw new Error('Missing required fields');
     }
   };
   ```

2. **Output Sanitization**
   ```javascript
   // Sanitize output data
   const sanitizeContent = (content) => {
     return {
       title: content.title,
       summary: content.summary,
       // Remove sensitive data
     };
   };
   ```

## 📊 Monitoring & Logging

### Logging Configuration

1. **Structured Logging**
   ```javascript
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: process.env.LOG_LEVEL || 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   ```

2. **Request Logging**
   ```javascript
   app.use((req, res, next) => {
     logger.info('API Request', {
       method: req.method,
       url: req.url,
       userAgent: req.get('User-Agent'),
       timestamp: new Date().toISOString()
     });
     next();
   });
   ```

3. **Error Logging**
   ```javascript
   app.use((err, req, res, next) => {
     logger.error('API Error', {
       error: err.message,
       stack: err.stack,
       url: req.url,
       timestamp: new Date().toISOString()
     });
     res.status(500).json({ error: 'Internal server error' });
   });
   ```

### Health Checks

1. **Health Check Endpoint**
   ```javascript
   app.get('/health', (req, res) => {
     res.json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       version: process.env.npm_package_version
     });
   });
   ```

2. **Integration Health Check**
   ```javascript
   app.get('/health/integration', async (req, res) => {
     try {
       // Test Contentstack connection
       const testResult = await testContentstackConnection();
       res.json({
         status: 'healthy',
         contentstack: testResult,
         timestamp: new Date().toISOString()
       });
     } catch (error) {
       res.status(500).json({
         status: 'unhealthy',
         error: error.message
       });
     }
   });
   ```

### Metrics Collection

1. **Performance Metrics**
   ```javascript
   const metrics = {
     requestCount: 0,
     errorCount: 0,
     responseTime: []
   };
   
   app.use((req, res, next) => {
     const start = Date.now();
     metrics.requestCount++;
     
     res.on('finish', () => {
       const duration = Date.now() - start;
       metrics.responseTime.push(duration);
       
       if (res.statusCode >= 400) {
         metrics.errorCount++;
       }
     });
     
     next();
   });
   ```

2. **Metrics Endpoint**
   ```javascript
   app.get('/metrics', (req, res) => {
     const avgResponseTime = metrics.responseTime.length > 0
       ? metrics.responseTime.reduce((a, b) => a + b, 0) / metrics.responseTime.length
       : 0;
     
     res.json({
       requestCount: metrics.requestCount,
       errorCount: metrics.errorCount,
       avgResponseTime,
       errorRate: metrics.requestCount > 0 ? metrics.errorCount / metrics.requestCount : 0
     });
   });
   ```

## ⚡ Performance Optimization

### Caching Strategy

1. **Content Caching**
   ```javascript
   const NodeCache = require('node-cache');
   const contentCache = new NodeCache({ stdTTL: 300 }); // 5 minutes
   
   const getCachedContent = async (key, fetchFunction) => {
     const cached = contentCache.get(key);
     if (cached) return cached;
     
     const content = await fetchFunction();
     contentCache.set(key, content);
     return content;
   };
   ```

2. **Content Type Discovery Caching**
   ```javascript
   const contentTypeCache = new NodeCache({ stdTTL: 3600 }); // 1 hour
   
   const getCachedContentType = async (entryId) => {
     const cacheKey = `contentType:${entryId}`;
     return getCachedContent(cacheKey, () => findContentTypeForEntry(entryId));
   };
   ```

### Connection Pooling

1. **HTTP Agent Configuration**
   ```javascript
   const https = require('https');
   
   const agent = new https.Agent({
     keepAlive: true,
     maxSockets: 50,
     maxFreeSockets: 10,
     timeout: 60000
   });
   ```

2. **Request Optimization**
   ```javascript
   const makeOptimizedRequest = async (url, options) => {
     return new Promise((resolve, reject) => {
       const req = https.request(url, { ...options, agent }, (res) => {
         let data = '';
         res.on('data', chunk => data += chunk);
         res.on('end', () => resolve(JSON.parse(data)));
       });
       
       req.on('error', reject);
       req.end();
     });
   };
   ```

### Load Balancing

1. **Multiple Instances**
   ```bash
   # Run multiple instances
   pm2 start ecosystem.config.js
   ```

2. **Ecosystem Configuration**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'contentstack-integration',
       script: 'runtime-api.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production'
       }
     }]
   };
   ```

## 🔄 Rollback Procedures

### Emergency Rollback

1. **Revert to Previous Version**
   ```bash
   # Check out previous version
   git checkout HEAD~1
   
   # Restart services
   pm2 restart all
   ```

2. **Disable Integration**
   - Go to LaunchDarkly Dashboard
   - Navigate to Integrations
   - Disable the Contentstack integration
   - Re-enable when issues are resolved

3. **Fallback Content**
   ```javascript
   // Implement fallback content
   const getFallbackContent = () => ({
     title: 'Content Unavailable',
     summary: 'We\'re experiencing technical difficulties.',
     structuredData: {
       content: '<p>Please try again later.</p>'
     }
   });
   ```

### Monitoring Rollback

1. **Health Check Monitoring**
   ```bash
   # Monitor health checks
   curl -f https://your-domain.com/health || echo "Service down"
   ```

2. **Error Rate Monitoring**
   ```bash
   # Monitor error rates
   curl https://your-domain.com/metrics | jq '.errorRate'
   ```

3. **Alert Configuration**
   ```javascript
   // Set up alerts for high error rates
   if (metrics.errorRate > 0.1) { // 10% error rate
     sendAlert('High error rate detected');
   }
   ```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Security review completed
- [ ] Monitoring configured
- [ ] Backup procedures in place

### Deployment
- [ ] Deploy to staging environment
- [ ] Run integration tests
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Monitor error rates

### Post-Deployment
- [ ] Verify flag preview functionality
- [ ] Test with real content
- [ ] Monitor performance metrics
- [ ] Document any issues

## 🆘 Emergency Procedures

### Service Outage

1. **Immediate Actions**
   ```bash
   # Check service status
   curl -f https://your-domain.com/health
   
   # Restart service if needed
   pm2 restart contentstack-integration
   
   # Check logs
   pm2 logs contentstack-integration
   ```

2. **Fallback Plan**
   - Disable integration in LaunchDarkly
   - Serve static fallback content
   - Notify stakeholders

### Data Breach

1. **Immediate Response**
   - Rotate all API keys
   - Review access logs
   - Notify security team

2. **Investigation**
   - Analyze logs for suspicious activity
   - Review credential access
   - Implement additional security measures

## 📚 Next Steps

- **[Security Best Practices](SECURITY.md)** - Security guidelines
- **[Monitoring Guide](MONITORING.md)** - Advanced monitoring setup
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Production issues

---

**Production ready!** 🎉 Your LaunchDarkly Contentstack Integration is now deployed and ready for production use. 