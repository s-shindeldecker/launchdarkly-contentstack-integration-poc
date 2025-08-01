# Troubleshooting Guide

Common issues and solutions for the LaunchDarkly Contentstack Integration.

## 📋 Table of Contents

1. [Quick Diagnosis](#quick-diagnosis)
2. [Common Issues](#common-issues)
3. [Error Messages](#error-messages)
4. [Debug Tools](#debug-tools)
5. [Performance Issues](#performance-issues)
6. [Getting Help](#getting-help)

## 🔍 Quick Diagnosis

### Step 1: Check Environment Variables

```bash
# Verify environment variables are set
echo $CONTENTSTACK_API_KEY
echo $CONTENTSTACK_DELIVERY_TOKEN
echo $CONTENTSTACK_ENVIRONMENT
```

### Step 2: Test Connection

```bash
# Run connection test
npm run test:connection

# Expected output: Connection successful
```

### Step 3: Run Comprehensive Tests

```bash
# Run all tests
npm run test:comprehensive

# Expected output: All tests passed
```

## 🚨 Common Issues

### Issue 1: "Content not found" Error

**Error Message:**
```
HTTP 422: The requested object doesn't exist
```

**Causes:**
- Entry ID doesn't exist in Contentstack
- Entry is not published
- Wrong environment specified
- Invalid entry ID format

**Solutions:**

1. **Verify Entry ID**
   ```bash
   # Check if entry exists in Contentstack dashboard
   # Look for the entry ID: blt0f6ddaddb7222b8d
   ```

2. **Check Publication Status**
   - Go to Contentstack Dashboard
   - Find the entry
   - Ensure it's published

3. **Verify Environment**
   ```json
   {
     "cmsType": "contentstack",
     "entryId": "blt0f6ddaddb7222b8d",
     "environment": "preview"  // Check this matches your environment
   }
   ```

4. **Test with Content Discovery**
   ```bash
   # Run content type discovery
   npm run test:content-type
   ```

### Issue 2: "Invalid credentials" Error

**Error Message:**
```
HTTP 412: We can't find that Stack
```

**Causes:**
- Invalid API key
- Invalid delivery token
- Wrong stack credentials
- Expired credentials

**Solutions:**

1. **Verify API Key**
   - Go to Contentstack Dashboard → Settings → API Keys
   - Copy the correct API key
   - Ensure it's for the right stack

2. **Verify Delivery Token**
   - Go to Contentstack Dashboard → Settings → Tokens
   - Copy the correct delivery token
   - Ensure it has proper permissions

3. **Check Stack Configuration**
   ```bash
   # Set correct credentials
   export CONTENTSTACK_API_KEY="your_correct_api_key"
   export CONTENTSTACK_DELIVERY_TOKEN="your_correct_delivery_token"
   export CONTENTSTACK_ENVIRONMENT="preview"
   ```

4. **Test Credentials**
   ```bash
   # Test with curl
   curl -H "api_key: YOUR_API_KEY" \
        -H "access_token: YOUR_DELIVERY_TOKEN" \
        "https://cdn.contentstack.io/v3/content_types/page/entries"
   ```

### Issue 3: "Content type not found" Error

**Error Message:**
```
HTTP 422: Content type not found
```

**Causes:**
- Content type doesn't exist
- Wrong content type name
- Permission issues

**Solutions:**

1. **Discover Content Types**
   ```bash
   # Run content type discovery
   npm run test:content-type
   ```

2. **Check Content Type Names**
   - Go to Contentstack Dashboard → Content Types
   - Note the exact content type names
   - Use exact names in your flag

3. **Use Auto-Discovery**
   ```json
   {
     "cmsType": "contentstack",
     "entryId": "blt0f6ddaddb7222b8d",
     "environment": "preview"
     // Don't specify contentType - let it auto-discover
   }
   ```

### Issue 4: "Missing environment variables" Error

**Error Message:**
```
Missing required environment variables
```

**Causes:**
- Environment variables not set
- Wrong variable names
- Variables not loaded

**Solutions:**

1. **Set Environment Variables**
   ```bash
   export CONTENTSTACK_API_KEY="your_api_key"
   export CONTENTSTACK_DELIVERY_TOKEN="your_delivery_token"
   export CONTENTSTACK_ENVIRONMENT="preview"
   ```

2. **Create .env.local File**
   ```bash
   # Create .env.local file
   echo "CONTENTSTACK_API_KEY=your_api_key" > .env.local
   echo "CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token" >> .env.local
   echo "CONTENTSTACK_ENVIRONMENT=preview" >> .env.local
   ```

3. **Load Environment Variables**
   ```bash
   # Source the file
   source .env.local
   
   # Or use dotenv
   npm install dotenv
   ```

### Issue 5: Flag Preview Not Working

**Symptoms:**
- No preview in LaunchDarkly UI
- Preview shows "Error loading preview"
- Preview shows empty content

**Solutions:**

1. **Check Flag Configuration**
   ```json
   {
     "cmsType": "contentstack",
     "entryId": "blt0f6ddaddb7222b8d",
     "environment": "preview",
     "contentType": "page"
   }
   ```

2. **Test Flag Preview API**
   ```bash
   # Test the flag preview handler
   npm run test:flag-preview
   ```

3. **Check Integration Credentials**
   - Verify credentials in LaunchDarkly integration settings
   - Test connection in LaunchDarkly dashboard

### Issue 6: Slow Performance

**Symptoms:**
- Content takes long to load
- Timeout errors
- Slow flag evaluation

**Solutions:**

1. **Enable Caching**
   ```javascript
   // Implement content caching
   const contentCache = new Map();
   
   if (contentCache.has(cacheKey)) {
     return contentCache.get(cacheKey);
   }
   ```

2. **Optimize Content Types**
   - Use specific content types instead of auto-discovery
   - Cache content type discovery results

3. **Check Network**
   ```bash
   # Test Contentstack API response time
   curl -w "@curl-format.txt" \
        -H "api_key: YOUR_API_KEY" \
        -H "access_token: YOUR_DELIVERY_TOKEN" \
        "https://cdn.contentstack.io/v3/content_types/page/entries"
   ```

## ⚠️ Error Messages

### HTTP 400 - Bad Request

**Message:** `Invalid variation structure`

**Solution:**
```json
// Ensure flag has required fields
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview"
}
```

### HTTP 401 - Unauthorized

**Message:** `Authentication failed`

**Solution:**
```bash
# Verify credentials
export CONTENTSTACK_API_KEY="your_correct_api_key"
export CONTENTSTACK_DELIVERY_TOKEN="your_correct_delivery_token"
```

### HTTP 404 - Not Found

**Message:** `Content not found`

**Solution:**
1. Verify entry ID exists
2. Check entry is published
3. Verify environment is correct

### HTTP 422 - Unprocessable Entity

**Message:** `Content type not found`

**Solution:**
1. Use content type discovery
2. Check content type name
3. Use auto-discovery feature

### HTTP 500 - Internal Server Error

**Message:** `Internal server error`

**Solution:**
1. Check network connectivity
2. Verify Contentstack API status
3. Check integration logs

## 🛠️ Debug Tools

### 1. Connection Test

Visit `/test-connection` to test basic connectivity:

```bash
# Start development server
npm run dev

# Visit http://localhost:3000/test-connection
```

### 2. Content Discovery

Visit `/find-content-type` to discover content types:

```bash
# Visit http://localhost:3000/find-content-type
# Enter your entry ID and test
```

### 3. Asset Testing

Visit `/test-assets` to test both entries and assets:

```bash
# Visit http://localhost:3000/test-assets
# Test with your entry and asset IDs
```

### 4. Flag Testing

Visit `/content-json-flags` to test flag functionality:

```bash
# Visit http://localhost:3000/content-json-flags
# Test with different user contexts
```

### 5. Environment Test

Visit `/environment-test` to verify environment setup:

```bash
# Visit http://localhost:3000/environment-test
# Check all environment variables
```

## 📊 Performance Issues

### Issue: Slow Content Loading

**Diagnosis:**
```bash
# Test API response time
time curl -H "api_key: YOUR_API_KEY" \
         -H "access_token: YOUR_DELIVERY_TOKEN" \
         "https://cdn.contentstack.io/v3/content_types/page/entries"
```

**Solutions:**
1. **Implement Caching**
   ```javascript
   const cache = new Map();
   const cacheKey = `${entryId}-${environment}`;
   
   if (cache.has(cacheKey)) {
     return cache.get(cacheKey);
   }
   ```

2. **Use CDN**
   - Contentstack provides CDN for faster delivery
   - Use asset URLs from CDN

3. **Optimize Requests**
   - Use specific content types
   - Cache content type discovery
   - Implement lazy loading

### Issue: High Memory Usage

**Diagnosis:**
```bash
# Monitor memory usage
node --inspect your-app.js
```

**Solutions:**
1. **Implement Cleanup**
   ```javascript
   // Clear cache periodically
   setInterval(() => {
     cache.clear();
   }, 300000); // 5 minutes
   ```

2. **Limit Cache Size**
   ```javascript
   const MAX_CACHE_SIZE = 100;
   
   if (cache.size > MAX_CACHE_SIZE) {
     const firstKey = cache.keys().next().value;
     cache.delete(firstKey);
   }
   ```

## 🔧 Advanced Troubleshooting

### Debug Mode

Enable detailed logging:

```javascript
// In your application
console.log('Flag value:', flagValue);
console.log('Content data:', contentData);
console.log('Error details:', error);
```

### Network Debugging

```bash
# Test Contentstack API directly
curl -v -H "api_key: YOUR_API_KEY" \
     -H "access_token: YOUR_DELIVERY_TOKEN" \
     "https://cdn.contentstack.io/v3/content_types/page/entries"
```

### Integration Logs

Check LaunchDarkly integration logs:

1. Go to LaunchDarkly Dashboard
2. Navigate to Integrations
3. Find your Contentstack integration
4. Check the logs tab

## 🆘 Getting Help

### Before Asking for Help

1. **Check this guide** for your specific error
2. **Run the debug tools** to gather information
3. **Test with curl** to isolate the issue
4. **Check Contentstack status** at status.contentstack.com

### Gathering Information

When reporting an issue, include:

1. **Error Message**: Exact error text
2. **Environment**: Development/production
3. **Steps to Reproduce**: Detailed steps
4. **Debug Output**: Results from debug tools
5. **Configuration**: Flag configuration (without sensitive data)

### Contact Information

- **GitHub Issues**: Open an issue on the repository
- **LaunchDarkly Support**: Contact LaunchDarkly for integration issues
- **Contentstack Support**: Contact Contentstack for API issues

### Useful Commands

```bash
# Test connection
npm run test:connection

# Run all tests
npm run test:comprehensive

# Test flag preview
npm run test:flag-preview

# Test content type discovery
npm run test:content-type

# Check environment variables
env | grep CONTENTSTACK
```

## 📚 Next Steps

- **[API Reference](API.md)** - Understand the technical details
- **[Usage Examples](EXAMPLES.md)** - See working examples
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production

---

**Still having issues?** Open an issue on GitHub with the information gathered from the debug tools. 