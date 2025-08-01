# LaunchDarkly Contentstack Integration Documentation

Welcome to the comprehensive documentation for the LaunchDarkly Contentstack Integration. This integration enables you to serve dynamic content from Contentstack CMS through LaunchDarkly feature flags.

## 📚 Documentation Index

### 🚀 Getting Started
- **[Quick Start Guide](QUICK_START.md)** - Get up and running in 5 minutes
- **[Setup Guide](SETUP.md)** - Complete local development setup
- **[Installation Guide](INSTALLATION.md)** - Detailed setup instructions
- **[Configuration Guide](CONFIGURATION.md)** - Environment and credential setup

### 📖 User Guides
- **[Usage Examples](EXAMPLES.md)** - Real-world usage scenarios
- **[API Reference](API.md)** - Complete API documentation
- **[Flag Preview Guide](FLAG_PREVIEW.md)** - Using flag preview functionality

### 🛠️ Development
- **[Development Setup](DEVELOPMENT.md)** - Local development environment
- **[Testing Guide](TESTING.md)** - Running tests and test coverage
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project

### 🚀 Deployment
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions
- **[Security Best Practices](SECURITY.md)** - Security considerations and best practices

### 🔧 Troubleshooting
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Common issues and solutions
- **[Debug Tools](DEBUG_TOOLS.md)** - Available debugging utilities

### 🔌 Integration
- **[LaunchDarkly Integration Guide](LAUNCHDARKLY_INTEGRATION.md)** - How the integration works with LaunchDarkly

## 🎯 What This Integration Does

The LaunchDarkly Contentstack Integration enables you to:

- **Serve dynamic content** from Contentstack through LaunchDarkly feature flags
- **Preview content** directly in the LaunchDarkly UI
- **Handle both entries and assets** from Contentstack
- **Discover content types** automatically
- **Validate inputs** with comprehensive error handling

## ✨ Key Features

- ✅ **Flag Preview** - See content previews in LaunchDarkly UI
- ✅ **Content Type Discovery** - Automatically find correct content types
- ✅ **Asset Support** - Handle images, files, and other assets
- ✅ **Entry Support** - Handle structured content entries
- ✅ **Runtime Validation** - Comprehensive input validation
- ✅ **Error Handling** - Graceful error responses
- ✅ **Test Coverage** - Comprehensive test suite

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   LaunchDarkly  │    │   Integration    │    │   Contentstack  │
│                 │    │                  │    │                 │
│ • Feature Flags │───▶│ • Runtime API    │───▶│ • Content API   │
│ • Flag Preview  │    │ • Flag Preview   │    │ • Assets API    │
│ • User Context  │    │ • Validation     │    │ • Entries API   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

1. **Install the integration** in your LaunchDarkly dashboard
2. **Configure your Contentstack credentials**
3. **Create a JSON flag** with content reference
4. **Test the integration** using the provided test suite

For detailed instructions, see the [Quick Start Guide](QUICK_START.md) or [Setup Guide](SETUP.md).

## 📋 Prerequisites

- LaunchDarkly account with Partner Integration access
- Contentstack account with API credentials
- Node.js 18+ (for development and testing)

## 🔗 Useful Links

- **[GitHub Repository](https://github.com/your-org/launchdarkly-contentstack-integration)**
- **[LaunchDarkly Documentation](https://docs.launchdarkly.com/)**
- **[Contentstack Documentation](https://www.contentstack.com/docs/)**
- **[Partner Integration Guide](https://docs.launchdarkly.com/guides/integrations)**

## 🆘 Getting Help

- **Documentation**: Check the guides above
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Support**: Contact LaunchDarkly support for integration issues

---

**Built with ❤️ for the LaunchDarkly and Contentstack communities** 