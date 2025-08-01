# Vercel API Route for LaunchDarkly Contentstack Integration

This directory contains the Vercel-ready API route for the LaunchDarkly Contentstack Integration.

## 📁 Files

- **`flagPreview.ts`** - Main API route handler
- **`test-flagPreview.js`** - Test script for the API
- **`README.md`** - This documentation file

## 🚀 Deployment

### Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** - Install with `npm i -g vercel`
3. **Contentstack Credentials** - API Key, Delivery Token, and Environment

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy the project
vercel

# Follow the prompts to configure your project
```

### Step 2: Set Environment Variables

In your Vercel dashboard or using the CLI:

```bash
# Set environment variables
vercel env add CONTENTSTACK_API_KEY
vercel env add CONTENTSTACK_DELIVERY_TOKEN
vercel env add CONTENTSTACK_ENVIRONMENT

# Or set them in the Vercel dashboard:
# Settings → Environment Variables
```

**Required Environment Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `CONTENTSTACK_API_KEY` | Your Contentstack API Key | `blte0ec930fa8872913` |
| `CONTENTSTACK_DELIVERY_TOKEN` | Your Contentstack Delivery Token | `csc6b092cc4becea032e493688` |
| `CONTENTSTACK_ENVIRONMENT` | Your Contentstack Environment | `preview` |

### Step 3: Configure LaunchDarkly Integration

1. **Go to LaunchDarkly Dashboard**
2. **Navigate to Integrations → Partner Integrations**
3. **Find your Contentstack Integration**
4. **Update the Runtime API URL** to your Vercel deployment:
   ```
   https://your-project.vercel.app/api/flagPreview
   ```

## 🧪 Testing

### Local Testing

```bash
# Start the development server
npm run dev

# Test the API route
node api/test-flagPreview.js
```

### Production Testing

```bash
# Test with your Vercel deployment
VERCEL_URL=https://your-project.vercel.app node api/test-flagPreview.js
```

### Manual Testing with curl

```bash
# Test entry preview
curl -X POST https://your-project.vercel.app/api/flagPreview \
  -H "Content-Type: application/json" \
  -d '{
    "variation": {
      "value": {
        "cmsType": "contentstack",
        "entryId": "blt0f6ddaddb7222b8d",
        "environment": "preview",
        "contentType": "page"
      }
    }
  }'

# Test asset preview
curl -X POST https://your-project.vercel.app/api/flagPreview \
  -H "Content-Type: application/json" \
  -d '{
    "variation": {
      "value": {
        "cmsType": "contentstack",
        "entryId": "blt211dac063fd6e948",
        "environment": "preview",
        "contentType": "asset"
      }
    }
  }'
```

## 📋 API Specification

### Endpoint

```
POST /api/flagPreview
```

### Request Format

```json
{
  "variation": {
    "value": {
      "cmsType": "contentstack",
      "entryId": "blt0f6ddaddb7222b8d",
      "environment": "preview",
      "contentType": "page"
    }
  }
}
```

### Response Format

```json
{
  "preview": {
    "title": "Welcome Page",
    "summary": "This is a welcome page with content...",
    "imageUrl": "https://example.com/image.jpg",
    "html": "<h1>Welcome</h1><p>Content here...</p>",
    "structuredData": {
      "title": "Welcome Page",
      "content": "<h1>Welcome</h1><p>Content here...</p>",
      "metadata": {
        "author": "John Doe",
        "publishedAt": "2024-01-01T00:00:00Z"
      }
    }
  }
}
```

### Error Responses

#### 400 - Bad Request
```json
{
  "error": "Invalid Request",
  "detail": "Missing entryId in variation"
}
```

#### 404 - Content Not Found
```json
{
  "error": "Content Not Found",
  "detail": "The specified entry or asset was not found in Contentstack"
}
```

#### 422 - Content Type Error
```json
{
  "error": "Content Type Error",
  "detail": "The content type was not found or is invalid"
}
```

#### 500 - Internal Server Error
```json
{
  "error": "Internal Server Error",
  "detail": "Failed to process flag preview request"
}
```

## 🔧 Features

### ✅ Supported Features

- **Entry Preview** - Fetch and preview content entries
- **Asset Preview** - Fetch and preview assets (images, files, etc.)
- **Content Type Auto-Discovery** - Automatically find content types
- **CORS Support** - Configured for LaunchDarkly requests
- **Comprehensive Error Handling** - Detailed error messages
- **Environment Variable Validation** - Ensures proper configuration
- **Request Validation** - Validates all required fields

### 🔄 Content Type Auto-Discovery

If `contentType` is not provided in the variation, the API will:

1. **Fetch all content types** from Contentstack
2. **Try each content type** to find the entry
3. **Return the matching content type** or error if none found

### 🖼️ Asset Support

The API supports various asset types:

- **Images** - With dimensions and metadata
- **Files** - With file size and MIME type
- **Videos** - With duration and format info
- **Audio** - With duration and format info

## 🚨 Troubleshooting

### Common Issues

#### "Missing Contentstack environment variables"

**Solution:**
1. Check that all environment variables are set in Vercel
2. Verify the variable names are correct
3. Redeploy after setting environment variables

#### "Content not found"

**Solution:**
1. Verify the entry ID exists in Contentstack
2. Check that the entry is published
3. Ensure you're using the correct environment

#### "Authentication failed"

**Solution:**
1. Verify your API key and delivery token
2. Check that credentials are for the correct stack
3. Ensure tokens have proper permissions

### Debug Commands

```bash
# Check environment variables
vercel env ls

# View function logs
vercel logs

# Test locally
npm run dev
node api/test-flagPreview.js
```

## 📊 Monitoring

### Vercel Analytics

- **Function Invocations** - Track API usage
- **Response Times** - Monitor performance
- **Error Rates** - Track failures
- **Cold Starts** - Monitor function performance

### LaunchDarkly Integration Logs

1. **Go to LaunchDarkly Dashboard**
2. **Navigate to Integrations**
3. **Find your Contentstack integration**
4. **Check the logs tab**

## 🔒 Security

### Environment Variables

- **Secure Storage** - Environment variables are encrypted
- **Access Control** - Only authorized users can view/modify
- **Audit Logs** - All changes are logged

### API Security

- **CORS Headers** - Configured for LaunchDarkly
- **Input Validation** - All inputs are validated
- **Error Handling** - No sensitive data in error responses

## 📚 Next Steps

After deployment:

1. **Test the API** using the provided test script
2. **Configure LaunchDarkly** with your Vercel URL
3. **Create content flags** in LaunchDarkly
4. **Monitor performance** using Vercel analytics

## 🆘 Getting Help

### Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **LaunchDarkly Documentation**: [docs.launchdarkly.com](https://docs.launchdarkly.com)
- **Contentstack Documentation**: [contentstack.com/docs](https://contentstack.com/docs)
- **GitHub Issues**: Open an issue on the repository

---

**Deployment ready!** 🎉 Your LaunchDarkly Contentstack Integration is now deployed on Vercel and ready to serve flag previews. 