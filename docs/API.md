# API Reference

Complete technical documentation for the LaunchDarkly Contentstack Integration API.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Flag Preview Handler](#flag-preview-handler)
3. [Runtime API](#runtime-api)
4. [Type Definitions](#type-definitions)
5. [Error Handling](#error-handling)
6. [Content Type Discovery](#content-type-discovery)
7. [Testing API](#testing-api)

## 🎯 Overview

The LaunchDarkly Contentstack Integration provides two main APIs:

- **Flag Preview Handler**: Called by LaunchDarkly to preview content in the UI
- **Runtime API**: Called by your application to fetch content

## 🔍 Flag Preview Handler

### Endpoint

```
POST /api/flag-preview
```

### Request Format

```typescript
interface FlagPreviewRequest {
  context: {
    config: {
      apiKey: string;
      deliveryToken: string;
      environment: string;
    };
  };
  body: {
    variation: {
      value: CMSReference;
    };
  };
}
```

### Response Format

```typescript
interface FlagPreviewResponse {
  status: number;
  body: {
    preview?: PreviewContent;
    error?: string;
    detail?: string;
  };
}
```

### Example Request

```json
{
  "context": {
    "config": {
      "apiKey": "blte0ec930fa8872913",
      "deliveryToken": "csc6b092cc4becea032e493688",
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

### Example Response

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

## 🔄 Runtime API

### Endpoint

```
POST /api/runtime
```

### Request Format

```typescript
interface RuntimeRequest {
  config: {
    apiKey: string;
    deliveryToken: string;
    environment: string;
  };
  input: CMSReference;
}
```

### Response Format

```typescript
interface RuntimeResponse {
  success: boolean;
  content?: PreviewContent;
  error?: string;
  detail?: string;
}
```

### Example Request

```json
{
  "config": {
    "apiKey": "blte0ec930fa8872913",
    "deliveryToken": "csc6b092cc4becea032e493688",
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

### Example Response

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

## 📝 Type Definitions

### CMSReference

```typescript
type CMSReference = {
  cmsType: 'contentstack';
  entryId: string;
  environment: string;
  preview?: boolean;
  contentType?: 'entry' | 'asset' | 'page';
};
```

**Properties:**
- `cmsType`: Must be 'contentstack'
- `entryId`: Contentstack entry or asset ID
- `environment`: Contentstack environment name
- `preview`: Optional, enables preview mode for draft content
- `contentType`: Optional, content type (auto-discovered if not specified)

### PreviewContent

```typescript
interface PreviewContent {
  title?: string;
  summary?: string;
  imageUrl?: string;
  html?: string;
  structuredData?: Record<string, any>;
  
  // Asset-specific fields
  assetType?: 'image' | 'file' | 'video' | 'audio';
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  mimeType?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
}
```

**Properties:**
- `title`: Content title or filename
- `summary`: Content summary or description
- `imageUrl`: Featured image URL
- `html`: HTML content (for entries)
- `structuredData`: Full content data
- `assetType`: Type of asset (for assets)
- `fileName`: Original filename (for assets)
- `fileSize`: File size in bytes (for assets)
- `fileUrl`: Download URL (for assets)
- `mimeType`: MIME type (for assets)
- `dimensions`: Image dimensions (for image assets)

### CMSAdapter

```typescript
interface CMSAdapter {
  fetchContent(ref: CMSReference): Promise<PreviewContent>;
  fetchAsset(ref: CMSReference): Promise<PreviewContent>;
}
```

## ⚠️ Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  status: number;
  body: {
    error: string;
    detail?: string;
  };
}
```

### Common Error Codes

#### 400 - Bad Request

```json
{
  "status": 400,
  "body": {
    "error": "Invalid variation structure",
    "detail": "Variation must include cmsType, entryId, and environment fields"
  }
}
```

**Causes:**
- Missing required fields
- Invalid field types
- Malformed JSON

#### 401 - Unauthorized

```json
{
  "status": 401,
  "body": {
    "error": "Authentication failed",
    "detail": "Invalid API key or delivery token"
  }
}
```

**Causes:**
- Invalid API key
- Invalid delivery token
- Expired credentials

#### 404 - Content Not Found

```json
{
  "status": 404,
  "body": {
    "error": "Content not found",
    "detail": "No entry or asset found with the specified ID"
  }
}
```

**Causes:**
- Entry ID doesn't exist
- Asset ID doesn't exist
- Content not published

#### 422 - Content Type Error

```json
{
  "status": 422,
  "body": {
    "error": "Failed to fetch content from Contentstack",
    "detail": "HTTP 422: Content type not found"
  }
}
```

**Causes:**
- Content type doesn't exist
- Invalid content type
- Permission issues

#### 500 - Internal Server Error

```json
{
  "status": 500,
  "body": {
    "error": "Internal server error",
    "detail": "Failed to process request"
  }
}
```

**Causes:**
- Network issues
- Contentstack API errors
- Integration errors

## 🔍 Content Type Discovery

### Automatic Discovery

The integration automatically discovers content types when not specified:

```typescript
async function findContentTypeForEntry(
  entryId: string,
  config: ContentstackConfig
): Promise<string | null>
```

### Manual Specification

You can specify the content type explicitly:

```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page"
}
```

### Supported Content Types

- `'entry'`: Generic content entry
- `'asset'`: File, image, or media asset
- `'page'`: Page content type
- Auto-discovered: Any content type in your stack

## 🧪 Testing API

### Test Configuration

```typescript
interface TestConfig {
  apiKey: string;
  deliveryToken: string;
  environment: string;
}
```

### Test Cases

#### Valid Asset Test

```typescript
{
  name: "Valid Asset Variation",
  input: {
    cmsType: "contentstack",
    entryId: "blt211dac063fd6e948",
    environment: "preview",
    contentType: "asset"
  },
  expected: {
    success: true,
    hasContent: true,
    hasAssetData: true
  }
}
```

#### Valid Entry Test

```typescript
{
  name: "Valid Entry Variation",
  input: {
    cmsType: "contentstack",
    entryId: "blt0f6ddaddb7222b8d",
    environment: "preview",
    contentType: "page"
  },
  expected: {
    success: true,
    hasContent: true,
    hasEntryData: true
  }
}
```

#### Invalid Entry Test

```typescript
{
  name: "Invalid Entry ID",
  input: {
    cmsType: "contentstack",
    entryId: "invalid-entry-id",
    environment: "preview",
    contentType: "page"
  },
  expected: {
    success: false,
    error: "Content not found"
  }
}
```

### Running Tests

```bash
# Run comprehensive test suite
npm run test:comprehensive

# Run specific test
npm run test:flag-preview

# Run with custom config
CONTENTSTACK_API_KEY=your_key npm run test:comprehensive
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `CONTENTSTACK_API_KEY` | Contentstack API Key | Yes | - |
| `CONTENTSTACK_DELIVERY_TOKEN` | Contentstack Delivery Token | Yes | - |
| `CONTENTSTACK_ENVIRONMENT` | Contentstack Environment | Yes | - |

### Integration Configuration

```json
{
  "apiKey": "your_contentstack_api_key",
  "deliveryToken": "your_contentstack_delivery_token",
  "environment": "preview"
}
```

## 📊 Response Examples

### Entry Response

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
        "publishedAt": "2024-01-01T00:00:00Z",
        "tags": ["welcome", "homepage"]
      }
    }
  }
}
```

### Asset Response

```json
{
  "success": true,
  "content": {
    "title": "hero-image.jpg",
    "summary": "Hero image for homepage",
    "imageUrl": "https://example.com/hero-image.jpg",
    "assetType": "image",
    "fileName": "hero-image.jpg",
    "fileSize": 245760,
    "fileUrl": "https://example.com/hero-image.jpg",
    "mimeType": "image/jpeg",
    "dimensions": {
      "width": 1920,
      "height": 1080
    },
    "structuredData": {
      "url": "https://example.com/hero-image.jpg",
      "filename": "hero-image.jpg",
      "size": 245760
    }
  }
}
```

## 🔒 Security

### Authentication

- **API Key**: Required for Contentstack access
- **Delivery Token**: Required for content delivery
- **Environment**: Scoped to specific environment

### Best Practices

1. **Secure Storage**: Store credentials securely
2. **Environment Isolation**: Use separate environments
3. **Access Control**: Limit credential access
4. **Audit Logs**: Monitor API usage

## 📚 Next Steps

- **[Usage Examples](EXAMPLES.md)** - See real-world usage
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Solve common issues
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production

---

**Need help?** Check the [Troubleshooting Guide](TROUBLESHOOTING.md) or open an issue on GitHub. 