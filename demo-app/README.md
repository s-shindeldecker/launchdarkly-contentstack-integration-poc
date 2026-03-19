# LaunchDarkly + Contentstack Flag Preview Demo

A React + TypeScript demo app for testing the LaunchDarkly Contentstack flag preview API.

## Features

- 🚀 **Real-time API Testing** - Test your flag preview endpoint
- 📝 **JSON Editor** - Edit CMSReference variations on the fly
- 🖼️ **Rich Content Display** - Shows images, HTML, and modular blocks
- 🧪 **Quick Test Buttons** - Pre-configured test scenarios
- 📊 **Raw Data View** - See the complete API response

## Setup

1. **Install dependencies:**
   ```bash
   cd demo-app
   npm install
   ```

2. **Create a `.env.local` file** in the `demo-app/` directory with your LaunchDarkly client-side ID:
   ```
   VITE_LAUNCHDARKLY_CLIENT_ID=<your-launchdarkly-client-side-id>
   ```
   You can find your client-side ID in the LaunchDarkly dashboard under **Account settings > Projects > your project > your environment**.

   > **Note:** This file is gitignored and must be created locally. Without it, the "Content Flag Demo" tab will not be able to connect to LaunchDarkly.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser** to the URL shown in the terminal (typically `http://localhost:5173`).

## Demo Tabs

The app has three tabs, each demonstrating the integration differently:

### Basic Demo
A raw JSON editor where you can paste any CMSReference JSON and hit "Load Content Preview." Includes quick-test buttons for entries, assets, and error cases. Does **not** require a LaunchDarkly connection.

### LaunchDarkly Editor
Simulates the LaunchDarkly flag targeting UI with hardcoded sample variations. Click any variation to preview the resolved Contentstack content. Does **not** require a LaunchDarkly connection.

### Content Flag Demo
The end-to-end demo. Uses the **live LaunchDarkly React SDK** to read a JSON flag named `content-config` and renders the corresponding Contentstack content. This tab **requires**:
- A valid `VITE_LAUNCHDARKLY_CLIENT_ID` in `.env.local`
- A JSON feature flag in LaunchDarkly with key `content-config`
- Flag variations structured as CMSReference objects, e.g.:
  ```json
  {
    "cmsType": "contentstack",
    "entryId": "bltbba25137ffbcb167",
    "environment": "preview",
    "contentType": "asset"
  }
  ```
Content updates automatically when the flag value changes in LaunchDarkly.

## API Endpoint

The demo connects to your Vercel deployment's flag preview API:

- **URL:** `https://launchdarkly-contentstack-integrati-flax.vercel.app/api/flagPreview`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** `{ "variation": { "value": <CMSReference> } }`

### Quick Test Scenarios (Basic Demo tab)

- **Test Entry** - Tests a content entry with auto-discovery
- **Test Asset** - Tests an asset with explicit content type
- **Test Error** - Tests error handling with invalid entry ID

## API Endpoint

The demo connects to your Vercel deployment's flag preview API:

- **URL:** `https://launchdarkly-contentstack-integrati-flax.vercel.app/api/flagPreview`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** `{ "variation": { "value": CMSReference } }`

## Features

### Content Display
- ✅ **Hero Images** - Full-width preview images
- ✅ **Rich Text** - HTML content rendering
- ✅ **Modular Blocks** - Contentstack modular block support
- ✅ **Layout Information** - Shows block layouts
- ✅ **Raw Data** - Complete API response view

### Error Handling
- ✅ **Network Errors** - Connection and timeout handling
- ✅ **API Errors** - Proper error message display
- ✅ **JSON Validation** - Invalid JSON detection
- ✅ **Loading States** - Visual feedback during requests

### UI/UX
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Modern Styling** - Clean, professional interface
- ✅ **Accessibility** - Proper ARIA labels and keyboard navigation
- ✅ **Dark Mode Ready** - Compatible with system preferences

## Development

### Tech Stack
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast development server
- **Tailwind CSS** - Utility-first styling
- **PostCSS** - CSS processing

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

This demo app is designed to work with your LaunchDarkly Contentstack integration. The API endpoint expects:

1. **CMSReference** - Content identification
2. **Environment** - Contentstack environment
3. **Content Type** - Optional, auto-discovered if not provided

The API returns:
- **Preview Content** - Formatted for LaunchDarkly UI
- **Structured Data** - Complete content information
- **Error Responses** - Proper HTTP status codes

## Next Steps

1. **Test the API** with different content types
2. **Configure LaunchDarkly** to use your endpoint
3. **Create content flags** in LaunchDarkly dashboard
4. **Test flag previews** in LaunchDarkly UI

---

Built for LaunchDarkly Partner Integration testing and demonstration. 