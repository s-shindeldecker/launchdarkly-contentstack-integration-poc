# LaunchDarkly Contentstack Partner Integration

Use Contentstack content entries as feature flag variations in LaunchDarkly. This integration allows you to dynamically serve different content based on user context and feature flags.

## 📚 Documentation

**📖 [Comprehensive Documentation](docs/README.md)** - Complete documentation with guides, examples, and troubleshooting.

**Quick Links:**
- **[Quick Start Guide](docs/QUICK_START.md)** - Get up and running in 5 minutes
- **[Installation Guide](docs/INSTALLATION.md)** - Detailed setup instructions
- **[Usage Examples](docs/EXAMPLES.md)** - Real-world usage scenarios
- **[API Reference](docs/API.md)** - Complete technical documentation
- **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions

## 🚀 Features

- **Dynamic Content Delivery**: Serve different Contentstack entries based on LaunchDarkly flags
- **User Context Targeting**: Personalize content based on user attributes
- **Real-time Updates**: Content changes automatically when flags are updated
- **Preview Mode Support**: Access both published and draft content
- **Asset Support**: Handle both content entries and assets
- **Secure Credentials**: Per-environment credential storage
- **Flag Preview**: See content previews directly in LaunchDarkly UI
- **Content Type Discovery**: Automatically find correct content types
- **Comprehensive Testing**: Full test suite with error handling

## 📋 Prerequisites

- LaunchDarkly account with Partner Integration access
- Contentstack account with API access
- Contentstack Stack API Key
- Contentstack Delivery Token
- Contentstack Environment name

## 🔧 Quick Installation

### 1. Install the Integration

1. Navigate to your LaunchDarkly dashboard
2. Go to **Integrations** → **Partner Integrations**
3. Search for "Contentstack" and click **Install**

### 2. Configure Credentials

For each environment where you want to use the integration:

1. **API Key**: Your Contentstack Stack API Key
2. **Delivery Token**: Your Contentstack Delivery Token for accessing published content
3. **Environment**: The Contentstack environment name (e.g., 'staging', 'production')

### 3. Create a Flag

Create a JSON flag with the following structure:

```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page"
}
```

## 🎯 Quick Usage Examples

### Basic Content Variation

```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page"
}
```

### Asset Content

```json
{
  "cmsType": "contentstack",
  "entryId": "blt211dac063fd6e948",
  "environment": "preview",
  "contentType": "asset"
}
```

### Preview Mode (Draft Content)

```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page",
  "preview": true
}
```

## 🧪 Testing

```bash
# Run comprehensive test suite
npm run test:comprehensive

# Run individual test components
npm run test:flag-preview
npm run test:content-type
```

## 🔄 Runtime API

The integration provides a Runtime API that can be called from your application:

### Request Format

```javascript
{
  "config": {
    "apiKey": "your_api_key",
    "deliveryToken": "your_delivery_token", 
    "environment": "production"
  },
  "input": {
    "cmsType": "contentstack",
    "entryId": "blt0f6ddaddb7222b8d",
    "environment": "preview",
    "contentType": "page"
  }
}
```

### Response Format

```javascript
{
  "success": true,
  "content": {
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

## 🎯 Flag Preview

The integration supports flag preview functionality, allowing you to see content previews directly in the LaunchDarkly UI when configuring flags.

### Flag Preview Schema

When creating a JSON flag, use the following schema:

```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page"
}
```

### Preview Data Format

The integration returns formatted preview data for LaunchDarkly UI:

```javascript
{
  "success": true,
  "preview": {
    "title": "Welcome Page",
    "summary": "This is a welcome page with content...",
    "imageUrl": "https://example.com/image.jpg",
    "contentType": "entry",
    "entryId": "blt0f6ddaddb7222b8d"
  }
}
```

### Preview Features

- **Title**: Content title or filename
- **Summary**: Content summary or truncated content
- **Image**: Featured image URL if available
- **Content Type**: Entry or asset type
- **Entry ID**: Contentstack entry identifier

### Preview Modes

- **Published Content**: `"preview": false` (default)
- **Draft Content**: `"preview": true` (requires preview mode access)

## 🛠️ Development

### Local Testing

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```
   CONTENTSTACK_API_KEY=your_api_key
   CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
   CONTENTSTACK_ENVIRONMENT=preview
   ```
4. Run the development server: `npm run dev`
5. Test the integration at `/content-json-flags`

### Testing Different Scenarios

- **Content Discovery**: Use `/find-content-type` to discover your content types
- **Connection Testing**: Use `/test-connection` to verify credentials
- **Asset Testing**: Use `/test-assets` to test both entries and assets
- **User Context**: Use `/content-json-flags` to test user targeting

## 🔒 Security

- **Per-environment credentials**: Each environment has its own secure credential storage
- **Token-based authentication**: No OAuth required for MVP
- **Secure credential handling**: Credentials are encrypted and stored securely
- **Environment isolation**: Credentials are scoped to specific environments

## 📊 Monitoring

The integration provides comprehensive logging:

- **Request logging**: All API calls are logged
- **Error tracking**: Detailed error messages for debugging
- **Performance metrics**: Response times and success rates
- **User context tracking**: Logs user targeting decisions

## 🚀 Production Deployment

### Best Practices

1. **Use production environment**: Set environment to 'production' for live sites
2. **Disable preview mode**: Set `preview: false` for published content only
3. **Implement caching**: Cache content responses for better performance
4. **Monitor errors**: Set up alerts for integration failures
5. **Test thoroughly**: Use staging environment for testing

### Performance Optimization

- **Content caching**: Implement client-side caching for frequently accessed content
- **Lazy loading**: Load content only when needed
- **CDN integration**: Use Contentstack's CDN for faster delivery
- **Error handling**: Implement graceful fallbacks for failed requests

## 🆘 Troubleshooting

### Common Issues

1. **"Missing entryId"**: Ensure the flag contains a valid entryId
2. **"Invalid credentials"**: Verify API key and delivery token
3. **"Content not found"**: Check that the entry exists in the specified environment
4. **"Preview mode error"**: Ensure preview mode is enabled in Contentstack

### Debug Tools

- **Connection test**: Use `/test-connection` to verify credentials
- **Content discovery**: Use `/find-content-type` to find your content types
- **Flag testing**: Use `/content-json-flags` to test flag variations
- **User context**: Test different user contexts for targeting

## 📚 API Reference

### Contentstack API

- **Entries**: `GET /v3/content_types/{content_type}/entries/{entry_id}`
- **Assets**: `GET /v3/assets/{asset_id}`
- **Preview**: Add `&preview=true` parameter for draft content

### LaunchDarkly Integration

- **Runtime API**: Called automatically by LaunchDarkly
- **Flag Preview**: Available for testing flag variations
- **User Context**: Supports user targeting and personalization

## 🤝 Support

For issues and questions:

1. Check the [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. Review the debug tools in the application
3. Contact LaunchDarkly support for integration issues
4. Contact Contentstack support for API issues

## 📄 License

This integration is provided as-is for use with LaunchDarkly Partner Integrations. 