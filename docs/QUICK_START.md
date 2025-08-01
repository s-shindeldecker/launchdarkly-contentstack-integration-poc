# Quick Start Guide

Get the LaunchDarkly Contentstack Integration up and running in 5 minutes.

## 🚀 Prerequisites

Before you begin, ensure you have:

- ✅ LaunchDarkly account with Partner Integration access
- ✅ Contentstack account with API credentials
- ✅ Node.js 18+ installed (for testing)

## ⚡ 5-Minute Setup

### Step 1: Get Your Contentstack Credentials

1. **Log into Contentstack Dashboard**
2. **Go to Settings → API Keys**
   - Copy your **API Key**
3. **Go to Settings → Tokens**
   - Copy your **Delivery Token**
4. **Note your Environment name** (e.g., 'preview', 'production')

### Step 2: Install the Integration

1. **Navigate to LaunchDarkly Dashboard**
2. **Go to Integrations → Partner Integrations**
3. **Search for "Contentstack"**
4. **Click "Install"**

### Step 3: Configure Credentials

In the integration configuration:

1. **API Key**: Paste your Contentstack API Key
2. **Delivery Token**: Paste your Contentstack Delivery Token
3. **Environment**: Enter your Contentstack environment name
4. **Click "Save"**

### Step 4: Create Your First Content Flag

1. **Go to Feature Flags**
2. **Create a new JSON flag** (e.g., "content-variation")
3. **Set the flag value** to:

```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page"
}
```

### Step 5: Test the Integration

1. **Click on your flag**
2. **Go to the "Preview" tab**
3. **You should see content preview** from Contentstack

## 🎯 What You Just Set Up

✅ **Content Flag**: A JSON flag that references Contentstack content
✅ **Flag Preview**: See content previews directly in LaunchDarkly UI
✅ **Content Type Discovery**: Automatically finds the correct content type
✅ **Error Handling**: Graceful handling of missing or invalid content

## 🔧 Next Steps

### Test with Real Content

1. **Find your Contentstack entry ID**
2. **Update the flag value** with your real entry ID
3. **Test the preview** to see your content

### Use in Your Application

```javascript
// Example: Using the content flag in your app
const contentFlag = useFeatureFlag('content-variation');

if (contentFlag?.title) {
  return <div>{contentFlag.title}</div>;
}
```

## 🆘 Common Issues

### "Content not found" Error

- ✅ Check that your entry ID exists in Contentstack
- ✅ Verify the entry is published
- ✅ Ensure you're using the correct environment

### "Invalid credentials" Error

- ✅ Double-check your API Key and Delivery Token
- ✅ Verify tokens are for the correct stack
- ✅ Ensure tokens have proper permissions

### "Content type not found" Error

- ✅ The integration will auto-discover content types
- ✅ Or specify the content type explicitly in the flag

## 📚 What's Next?

- **[Usage Examples](EXAMPLES.md)** - Learn how to use content flags
- **[API Reference](API.md)** - Understand the technical details
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Solve common issues
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production

## 🎉 Congratulations!

You've successfully set up the LaunchDarkly Contentstack Integration! You can now:

- ✅ Serve dynamic content through feature flags
- ✅ Preview content in LaunchDarkly UI
- ✅ Handle both entries and assets
- ✅ Target different user segments with different content

---

**Need help?** Check the [Troubleshooting Guide](TROUBLESHOOTING.md) or open an issue on GitHub. 