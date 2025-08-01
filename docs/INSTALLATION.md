# Installation Guide

Complete installation instructions for the LaunchDarkly Contentstack Integration.

## 📋 Prerequisites

### LaunchDarkly Requirements
- LaunchDarkly account with Partner Integration access
- Environment configured for Partner Integrations
- API access tokens

### Contentstack Requirements
- Contentstack account
- API Key (Management Token)
- Delivery Token
- Environment name (e.g., 'preview', 'production')

### Development Requirements
- Node.js 18+
- npm or yarn
- Git

## 🔧 Installation Methods

### Method 1: LaunchDarkly Partner Integration (Recommended)

#### Step 1: Prepare the Integration

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/launchdarkly-contentstack-integration.git
   cd launchdarkly-contentstack-integration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```

4. **Edit `.env.local` with your credentials**
   ```bash
   CONTENTSTACK_API_KEY=your_api_key_here
   CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
   CONTENTSTACK_ENVIRONMENT=preview
   ```

#### Step 2: Test the Integration

1. **Run the test suite**
   ```bash
   npm run test:comprehensive
   ```

2. **Verify all tests pass**
   ```
   🎉 All tests passed! Integration is production-ready.
   ```

#### Step 3: Upload to LaunchDarkly

1. **Navigate to LaunchDarkly Dashboard**
2. **Go to Integrations → Partner Integrations**
3. **Click "Upload Integration"**
4. **Upload the `integration-manifest.json` file**
5. **Configure your Contentstack credentials**

### Method 2: Local Development Setup

#### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-org/launchdarkly-contentstack-integration.git
cd launchdarkly-contentstack-integration

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
```

#### Step 2: Configure Environment

Edit `.env.local` with your credentials:

```bash
# Contentstack Configuration
CONTENTSTACK_API_KEY=blte0ec930fa8872913
CONTENTSTACK_DELIVERY_TOKEN=csc6b092cc4becea032e493688
CONTENTSTACK_ENVIRONMENT=preview

# LaunchDarkly Configuration (for testing)
NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID=your_client_id
NEXT_PUBLIC_LAUNCHDARKLY_ENVIRONMENT=production
```

#### Step 3: Start Development Server

```bash
# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

#### Step 4: Test the Integration

1. **Test connection**: Visit `/test-connection`
2. **Test content discovery**: Visit `/find-content-type`
3. **Test assets**: Visit `/test-assets`
4. **Test flags**: Visit `/content-json-flags`

### Method 3: Docker Installation

#### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

#### Step 2: Build and Run

```bash
# Build the Docker image
docker build -t launchdarkly-contentstack .

# Run the container
docker run -p 3000:3000 \
  -e CONTENTSTACK_API_KEY=your_api_key \
  -e CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token \
  -e CONTENTSTACK_ENVIRONMENT=preview \
  launchdarkly-contentstack
```

## 🔑 Credential Setup

### Finding Your Contentstack Credentials

#### API Key
1. **Log into Contentstack Dashboard**
2. **Go to Settings → API Keys**
3. **Copy your Stack API Key**

#### Delivery Token
1. **Go to Settings → Tokens**
2. **Find your Delivery Token**
3. **Copy the token value**

#### Environment Name
1. **Check your stack settings**
2. **Note the environment name** (e.g., 'preview', 'production')

### Setting Up LaunchDarkly Credentials

#### For Testing
1. **Get your LaunchDarkly Client ID**
2. **Set the environment** (e.g., 'production')
3. **Add to `.env.local`**:
   ```bash
   NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID=your_client_id
   NEXT_PUBLIC_LAUNCHDARKLY_ENVIRONMENT=production
   ```

## 🧪 Verification Steps

### Step 1: Test Connection

```bash
# Run connection test
npm run test:connection

# Expected output: Connection successful
```

### Step 2: Test Content Discovery

```bash
# Run content type discovery
npm run test:content-type

# Expected output: Content types found
```

### Step 3: Test Flag Preview

```bash
# Run flag preview tests
npm run test:flag-preview

# Expected output: All tests passed
```

### Step 4: Run Comprehensive Tests

```bash
# Run all tests
npm run test:comprehensive

# Expected output: All tests passed
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `CONTENTSTACK_API_KEY` | Contentstack API Key | Yes | - |
| `CONTENTSTACK_DELIVERY_TOKEN` | Contentstack Delivery Token | Yes | - |
| `CONTENTSTACK_ENVIRONMENT` | Contentstack Environment | Yes | - |
| `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID` | LaunchDarkly Client ID | No | - |
| `NEXT_PUBLIC_LAUNCHDARKLY_ENVIRONMENT` | LaunchDarkly Environment | No | production |

### Integration Configuration

The integration supports these configuration options:

```json
{
  "apiKey": "your_contentstack_api_key",
  "deliveryToken": "your_contentstack_delivery_token",
  "environment": "preview"
}
```

## 🚀 Post-Installation

### Create Your First Flag

1. **Go to LaunchDarkly Dashboard**
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

### Test the Integration

1. **Click on your flag**
2. **Go to the "Preview" tab**
3. **Verify content preview appears**

## 🆘 Troubleshooting Installation

### Common Issues

#### "Missing environment variables"
```bash
# Solution: Set environment variables
export CONTENTSTACK_API_KEY="your-api-key"
export CONTENTSTACK_DELIVERY_TOKEN="your-delivery-token"
export CONTENTSTACK_ENVIRONMENT="preview"
```

#### "Connection failed"
- ✅ Verify your API key and delivery token
- ✅ Check that credentials are for the correct stack
- ✅ Ensure tokens have proper permissions

#### "Tests failing"
- ✅ Check that all environment variables are set
- ✅ Verify your Contentstack credentials
- ✅ Ensure you have test content in your stack

### Getting Help

1. **Check the [Troubleshooting Guide](TROUBLESHOOTING.md)**
2. **Run the debug tools** in the application
3. **Open an issue** on GitHub
4. **Contact LaunchDarkly support** for integration issues

## 📚 Next Steps

- **[Configuration Guide](CONFIGURATION.md)** - Advanced configuration options
- **[Usage Examples](EXAMPLES.md)** - Learn how to use the integration
- **[API Reference](API.md)** - Understand the technical details
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production

---

**Installation complete!** 🎉 You're ready to start using the LaunchDarkly Contentstack Integration. 