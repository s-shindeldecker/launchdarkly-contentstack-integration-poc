# LaunchDarkly Integration Guide

Complete guide for understanding how the LaunchDarkly Contentstack Integration works as a Partner Integration.

## 🎯 Overview

The LaunchDarkly Contentstack Integration is a **Partner Integration** that enables LaunchDarkly to serve dynamic content from Contentstack CMS through feature flags. This integration provides flag preview capabilities and runtime content fetching.

## 🏗️ Integration Architecture

### How It Works

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   LaunchDarkly  │    │   Integration    │    │   Contentstack  │
│                 │    │                  │    │                 │
│ • Feature Flags │───▶│ • Runtime API    │───▶│ • Content API   │
│ • Flag Preview  │    │ • Flag Preview   │    │ • Assets API    │
│ • User Context  │    │ • Validation     │    │ • Entries API   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Integration Components

1. **Integration Manifest** - Defines capabilities and configuration
2. **Runtime API** - Handles content fetching requests
3. **Flag Preview** - Provides content previews in LaunchDarkly UI
4. **Configuration** - Per-environment credential management

## 📄 Integration Manifest

### What is `integration-manifest.json`?

The integration manifest defines the capabilities and configuration of the Partner Integration:

```json
{
  "id": "contentstack",
  "name": "Contentstack Integration",
  "description": "Serve dynamic content from Contentstack through LaunchDarkly flags",
  "icon": "https://example.com/icon.png",
  "configurations": {
    "scopes": ["environment"],
    "fields": [
      {
        "key": "apiKey",
        "name": "API Key",
        "type": "string",
        "required": true,
        "description": "Contentstack Stack API Key"
      },
      {
        "key": "deliveryToken",
        "name": "Delivery Token",
        "type": "string",
        "required": true,
        "description": "Contentstack Delivery Token"
      },
      {
        "key": "environment",
        "name": "Environment",
        "type": "string",
        "required": true,
        "description": "Contentstack Environment (e.g., 'preview', 'production')"
      }
    ]
  },
  "capabilities": {
    "webhook": false,
    "runtimeApi": true,
    "flagPreview": true
  },
  "flagPreview": {
    "variationSchema": {
      "type": "object",
      "properties": {
        "cmsType": {
          "type": "string",
          "enum": ["contentstack"]
        },
        "entryId": {
          "type": "string",
          "description": "Contentstack entry or asset ID"
        },
        "environment": {
          "type": "string",
          "description": "Contentstack environment"
        },
        "contentType": {
          "type": "string",
          "enum": ["entry", "asset", "page"],
          "description": "Content type (optional, auto-discovered)"
        },
        "preview": {
          "type": "boolean",
          "description": "Enable preview mode for draft content"
        }
      },
      "required": ["cmsType", "entryId", "environment"]
    }
  }
}
```

### Manifest Components

#### Basic Information
- **`id`**: Unique identifier for the integration
- **`name`**: Display name in LaunchDarkly UI
- **`description`**: What the integration does
- **`icon`**: Icon displayed in LaunchDarkly UI

#### Configuration
- **`scopes`**: Where configuration is stored (`environment` = per-environment)
- **`fields`**: Configuration fields users must provide
- **`required`**: Whether fields are mandatory

#### Capabilities
- **`webhook`**: Whether the integration supports webhooks
- **`runtimeApi`**: Whether the integration has a runtime API
- **`flagPreview`**: Whether the integration supports flag previews

#### Flag Preview Schema
- **`variationSchema`**: JSON schema for flag variations
- **`properties`**: Required and optional fields
- **`required`**: Mandatory fields for flag variations

## 🔧 Integration Capabilities

### 1. Runtime API

The integration provides a Runtime API that LaunchDarkly calls to fetch content:

#### API Endpoint
```
POST /api/runtime
```

#### Request Format
```json
{
  "config": {
    "apiKey": "your_contentstack_api_key",
    "deliveryToken": "your_contentstack_delivery_token",
    "environment": "preview"
  },
  "input": {
    "cmsType": "contentstack",
    "entryId": "blt0f6ddaddb7222b8d",
    "environment": "preview",
    "contentType": "page"
  }
}
```

#### Response Format
```json
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

### 2. Flag Preview

The integration provides flag preview functionality that shows content previews directly in the LaunchDarkly UI:

#### Preview Endpoint
```
POST /api/flag-preview
```

#### Request Format
```json
{
  "context": {
    "config": {
      "apiKey": "your_contentstack_api_key",
      "deliveryToken": "your_contentstack_delivery_token",
      "environment": "preview"
    }
  },
  "body": {
    "variation": {
      "value": {
        "cmsType": "contentstack",
        "entryId": "blt0f6ddaddb7222b8d",
        "environment": "preview",
        "contentType": "page"
      }
    }
  }
}
```

#### Preview Response
```json
{
  "status": 200,
  "body": {
    "preview": {
      "title": "Welcome Page",
      "summary": "This is a welcome page with content...",
      "imageUrl": "https://example.com/image.jpg",
      "contentType": "entry",
      "entryId": "blt0f6ddaddb7222b8d"
    }
  }
}
```

## 🎯 Where Users See the Integration

### 1. Integration Installation

Users install the integration from the LaunchDarkly Partner Integrations marketplace:

1. **Navigate to LaunchDarkly Dashboard**
2. **Go to Integrations → Partner Integrations**
3. **Search for "Contentstack"**
4. **Click "Install"**

### 2. Configuration

After installation, users configure the integration per environment:

1. **Go to Integrations → Partner Integrations**
2. **Find "Contentstack Integration"**
3. **Click "Configure"**
4. **Enter Contentstack credentials**:
   - API Key
   - Delivery Token
   - Environment

### 3. Flag Creation

Users create JSON flags with content references:

1. **Go to Feature Flags**
2. **Create a new JSON flag**
3. **Set the flag value**:
   ```json
   {
     "cmsType": "contentstack",
     "entryId": "blt0f6ddaddb7222b8d",
     "environment": "preview",
     "contentType": "page"
   }
   ```

### 4. Flag Preview

Users see content previews in the LaunchDarkly UI:

1. **Click on a content flag**
2. **Go to the "Preview" tab**
3. **See content preview** from Contentstack

## ⚙️ Per-Environment Configuration

### Environment Scoping

The integration uses **environment-scoped configuration**, meaning:

- **Each environment** has its own Contentstack credentials
- **Development** can use preview environment
- **Production** can use production environment
- **Staging** can use staging environment

### Configuration Fields

| Field | Description | Required | Example |
|-------|-------------|----------|---------|
| `apiKey` | Contentstack Stack API Key | Yes | `blte0ec930fa8872913` |
| `deliveryToken` | Contentstack Delivery Token | Yes | `csc6b092cc4becea032e493688` |
| `environment` | Contentstack Environment | Yes | `preview` |

### Environment Setup

#### Development Environment
```json
{
  "apiKey": "dev_api_key",
  "deliveryToken": "dev_delivery_token",
  "environment": "development"
}
```

#### Staging Environment
```json
{
  "apiKey": "staging_api_key",
  "deliveryToken": "staging_delivery_token",
  "environment": "staging"
}
```

#### Production Environment
```json
{
  "apiKey": "prod_api_key",
  "deliveryToken": "prod_delivery_token",
  "environment": "production"
}
```

## 🔄 How LaunchDarkly Calls the Integration

### Flag Evaluation Flow

1. **User requests content** from your application
2. **Application evaluates flag** using LaunchDarkly SDK
3. **LaunchDarkly calls Runtime API** with flag variation
4. **Integration fetches content** from Contentstack
5. **Integration returns content** to LaunchDarkly
6. **LaunchDarkly returns content** to your application

### Flag Preview Flow

1. **User configures flag** in LaunchDarkly UI
2. **User clicks "Preview"** tab
3. **LaunchDarkly calls Flag Preview API** with variation
4. **Integration fetches content** from Contentstack
5. **Integration returns preview data** to LaunchDarkly
6. **LaunchDarkly displays preview** in UI

### Example Flag Evaluation

```javascript
// Your application code
const contentFlag = useFeatureFlag('content-variation');

// LaunchDarkly calls the integration
// POST /api/runtime
{
  "config": {
    "apiKey": "your_api_key",
    "deliveryToken": "your_delivery_token",
    "environment": "preview"
  },
  "input": {
    "cmsType": "contentstack",
    "entryId": "blt0f6ddaddb7222b8d",
    "environment": "preview",
    "contentType": "page"
  }
}

// Integration returns content
{
  "success": true,
  "content": {
    "title": "Welcome Page",
    "structuredData": {
      "content": "<h1>Welcome</h1><p>Content here...</p>"
    }
  }
}
```

## 🛠️ Integration Development

### Local Development

1. **Set up environment variables**
   ```bash
   export CONTENTSTACK_API_KEY="your_api_key"
   export CONTENTSTACK_DELIVERY_TOKEN="your_delivery_token"
   export CONTENTSTACK_ENVIRONMENT="preview"
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Test integration endpoints**
   ```bash
   # Test runtime API
   curl -X POST http://localhost:3000/api/runtime \
        -H "Content-Type: application/json" \
        -d '{"config": {...}, "input": {...}}'

   # Test flag preview
   curl -X POST http://localhost:3000/api/flag-preview \
        -H "Content-Type: application/json" \
        -d '{"context": {...}, "body": {...}}'
   ```

### Testing Integration

1. **Run comprehensive tests**
   ```bash
   npm run test:comprehensive
   ```

2. **Test flag preview**
   ```bash
   npm run test:flag-preview
   ```

3. **Test with real content**
   - Use `/test-assets` page
   - Use `/content-json-flags` page
   - Use `/find-content-type` page

## 🔒 Security Considerations

### Credential Management

- **Per-environment credentials** - Each environment has its own secure credential storage
- **Encrypted storage** - Credentials are encrypted and stored securely
- **Access control** - Limit credential access to authorized personnel

### API Security

- **HTTPS only** - All API calls use HTTPS
- **Input validation** - All inputs are validated
- **Error handling** - Graceful error responses without exposing sensitive data

### Best Practices

1. **Use environment-specific credentials**
2. **Rotate API keys regularly**
3. **Monitor API usage**
4. **Implement audit logging**

## 📊 Monitoring and Logging

### Integration Logs

LaunchDarkly provides integration logs:

1. **Go to LaunchDarkly Dashboard**
2. **Navigate to Integrations**
3. **Find your Contentstack integration**
4. **Check the logs tab**

### Performance Metrics

- **Request count** - Number of API calls
- **Response time** - API response latency
- **Error rate** - Percentage of failed requests
- **Success rate** - Percentage of successful requests

### Health Checks

```bash
# Check integration health
curl https://your-domain.com/health

# Check integration-specific health
curl https://your-domain.com/health/integration
```

## 🚨 Troubleshooting

### Common Issues

1. **"Integration not found"**
   - Verify integration is installed
   - Check integration configuration

2. **"Invalid credentials"**
   - Verify API key and delivery token
   - Check environment configuration

3. **"Content not found"**
   - Verify entry ID exists
   - Check content is published
   - Verify environment is correct

### Debug Tools

1. **Test connection**
   ```bash
   npm run test:connection
   ```

2. **Test flag preview**
   ```bash
   npm run test:flag-preview
   ```

3. **Check integration logs**
   - Go to LaunchDarkly Dashboard → Integrations
   - Find your integration
   - Check logs tab

## 📚 Next Steps

After understanding the integration:

1. **[Setup Guide](SETUP.md)** - Set up the integration locally
2. **[Usage Examples](EXAMPLES.md)** - Learn how to use the integration
3. **[API Reference](API.md)** - Understand the technical details
4. **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production

## 🆘 Getting Help

### Support Resources

- **LaunchDarkly Documentation**: [Partner Integration Guide](https://docs.launchdarkly.com/guides/integrations)
- **Contentstack Documentation**: [API Reference](https://www.contentstack.com/docs/)
- **GitHub Issues**: Open an issue on the repository
- **LaunchDarkly Support**: Contact LaunchDarkly for integration issues

### Useful Links

- **[Integration Manifest](integration-manifest.json)** - Complete manifest file
- **[Runtime API](runtime-api.ts)** - Runtime API implementation
- **[Flag Preview](runtime/flagPreview.ts)** - Flag preview implementation
- **[Test Suite](test/)** - Comprehensive test suite

---

**Integration ready!** 🎉 Your LaunchDarkly Contentstack Integration is now fully configured and ready to serve dynamic content through feature flags. 