# Local Setup Guide

Complete guide for setting up the LaunchDarkly Contentstack Integration locally for development and testing.

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** installed
- ✅ **Git** installed
- ✅ **Contentstack account** with API credentials
- ✅ **LaunchDarkly account** (for testing)

## 🚀 Quick Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/launchdarkly-contentstack-integration.git
cd launchdarkly-contentstack-integration

# Verify you're in the right directory
ls -la
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### Step 3: Set Up Environment Variables

```bash
# Copy the example environment file
cp env.example .env.local

# Edit the environment file with your credentials
nano .env.local
```

**Required Environment Variables:**

```bash
# Contentstack Configuration
CONTENTSTACK_API_KEY=your_contentstack_api_key_here
CONTENTSTACK_DELIVERY_TOKEN=your_contentstack_delivery_token_here
CONTENTSTACK_ENVIRONMENT=preview

# LaunchDarkly Configuration (for testing)
NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID=your_launchdarkly_client_id_here
NEXT_PUBLIC_LAUNCHDARKLY_ENVIRONMENT=production
```

### Step 4: Get Your Contentstack Credentials

1. **Log into Contentstack Dashboard**
2. **Go to Settings → API Keys**
   - Copy your **Stack API Key**
3. **Go to Settings → Tokens**
   - Copy your **Delivery Token**
4. **Note your Environment name** (e.g., 'preview', 'production')

### Step 5: Get Your LaunchDarkly Credentials

1. **Log into LaunchDarkly Dashboard**
2. **Go to Account Settings → Projects**
3. **Find your Client ID** (for testing)
4. **Note your Environment name** (e.g., 'production')

## 🧪 Running Tests

### Test 1: Connection Test

```bash
# Test basic connectivity to Contentstack
npm run test:connection

# Expected output:
# ✅ Connection successful
# ✅ Credentials verified
# ✅ Environment accessible
```

### Test 2: Content Discovery

```bash
# Test content type discovery
npm run test:content-type

# Expected output:
# ✅ Content types found
# ✅ Discovery working
```

### Test 3: Flag Preview Test

```bash
# Test flag preview functionality
npm run test:flag-preview

# Expected output:
# 🚀 Starting Comprehensive Flag Preview Test Suite
# ✅ All tests passed
```

### Test 4: Comprehensive Test Suite

```bash
# Run all tests
npm run test:comprehensive

# Expected output:
# 🎉 All tests passed! Integration is production-ready.
```

## 🎯 Sample LaunchDarkly Flag Variation

### Basic Content Flag

```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page"
}
```

### Asset Flag

```json
{
  "cmsType": "contentstack",
  "entryId": "blt211dac063fd6e948",
  "environment": "preview",
  "contentType": "asset"
}
```

### Preview Mode Flag

```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page",
  "preview": true
}
```

## 🔍 Testing with Real Content

### Step 1: Find Your Contentstack Entry ID

1. **Go to Contentstack Dashboard**
2. **Navigate to Content**
3. **Find an entry you want to test with**
4. **Copy the Entry ID** (starts with `blt`)

### Step 2: Test with Your Entry

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Step 3: Use the Test Pages

1. **Test Connection**: Visit `/test-connection`
2. **Find Content Type**: Visit `/find-content-type`
3. **Test Assets**: Visit `/test-assets`
4. **Test Flags**: Visit `/content-json-flags`

### Step 4: Test with Real Entry ID

Replace the example entry ID with your real one:

```json
{
  "cmsType": "contentstack",
  "entryId": "YOUR_REAL_ENTRY_ID_HERE",
  "environment": "preview",
  "contentType": "page"
}
```

## 🛠️ Development Workflow

### Starting the Development Server

```bash
# Start the development server
npm run dev

# The server will start on http://localhost:3000
```

### Available Test Pages

- **`/test-connection`** - Test basic connectivity
- **`/find-content-type`** - Discover content types
- **`/test-assets`** - Test both entries and assets
- **`/content-json-flags`** - Test flag functionality
- **`/test-launchdarkly`** - Test LaunchDarkly integration

### Debugging

```bash
# Check environment variables
echo $CONTENTSTACK_API_KEY
echo $CONTENTSTACK_DELIVERY_TOKEN
echo $CONTENTSTACK_ENVIRONMENT

# Test with curl
curl -H "api_key: YOUR_API_KEY" \
     -H "access_token: YOUR_DELIVERY_TOKEN" \
     "https://cdn.contentstack.io/v3/content_types/page/entries"
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `CONTENTSTACK_API_KEY` | Contentstack API Key | Yes | `blte0ec930fa8872913` |
| `CONTENTSTACK_DELIVERY_TOKEN` | Contentstack Delivery Token | Yes | `csc6b092cc4becea032e493688` |
| `CONTENTSTACK_ENVIRONMENT` | Contentstack Environment | Yes | `preview` |
| `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID` | LaunchDarkly Client ID | No | `your_client_id` |
| `NEXT_PUBLIC_LAUNCHDARKLY_ENVIRONMENT` | LaunchDarkly Environment | No | `production` |

### Package.json Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test:comprehensive    # Run all tests
npm run test:flag-preview    # Test flag preview
npm run test:content-type    # Test content discovery
npm run test:connection      # Test connection

# Utilities
npm run lint              # Run linting
npm run type-check        # Run TypeScript type checking
```

## 🚨 Common Setup Issues

### Issue 1: "Missing environment variables"

**Solution:**
```bash
# Set environment variables
export CONTENTSTACK_API_KEY="your_api_key"
export CONTENTSTACK_DELIVERY_TOKEN="your_delivery_token"
export CONTENTSTACK_ENVIRONMENT="preview"
```

### Issue 2: "Connection failed"

**Solution:**
1. Verify your API key and delivery token
2. Check that credentials are for the correct stack
3. Ensure tokens have proper permissions

### Issue 3: "Content not found"

**Solution:**
1. Verify your entry ID exists in Contentstack
2. Check that the entry is published
3. Ensure you're using the correct environment

### Issue 4: "Tests failing"

**Solution:**
1. Check that all environment variables are set
2. Verify your Contentstack credentials
3. Ensure you have test content in your stack

## 📊 Testing Checklist

### Pre-Testing
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Contentstack credentials verified
- [ ] LaunchDarkly credentials obtained

### Basic Tests
- [ ] Connection test passes
- [ ] Content discovery works
- [ ] Flag preview test passes
- [ ] Comprehensive test suite passes

### Real Content Tests
- [ ] Found real entry ID
- [ ] Tested with real content
- [ ] Verified flag preview works
- [ ] Tested with different content types

### Development Tests
- [ ] Development server starts
- [ ] Test pages accessible
- [ ] Debug tools working
- [ ] Error handling verified

## 🎉 Success Indicators

You know your setup is working when:

- ✅ **All tests pass** without errors
- ✅ **Development server** starts successfully
- ✅ **Test pages** load and function
- ✅ **Real content** loads from Contentstack
- ✅ **Flag preview** shows content in LaunchDarkly UI

## 📚 Next Steps

After successful setup:

1. **[Usage Examples](EXAMPLES.md)** - Learn how to use the integration
2. **[API Reference](API.md)** - Understand the technical details
3. **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Solve common issues
4. **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production

## 🆘 Getting Help

### Debug Commands

```bash
# Check environment
env | grep CONTENTSTACK

# Test connection
curl -v -H "api_key: YOUR_API_KEY" \
     -H "access_token: YOUR_DELIVERY_TOKEN" \
     "https://cdn.contentstack.io/v3/content_types/page/entries"

# Check logs
npm run dev 2>&1 | tee setup.log
```

### Support Resources

- **Documentation**: Check the guides above
- **GitHub Issues**: Open an issue on the repository
- **Debug Tools**: Use the built-in test pages
- **Community**: Check GitHub Discussions

---

**Setup complete!** 🎉 You're ready to start developing with the LaunchDarkly Contentstack Integration. 