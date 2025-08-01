export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Test endpoint
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'API is working!',
      method: req.method,
      timestamp: new Date().toISOString(),
      env: {
        hasContentstackKey: !!process.env.CONTENTSTACK_API_KEY,
        hasDeliveryToken: !!process.env.CONTENTSTACK_DELIVERY_TOKEN,
        hasEnvironment: !!process.env.CONTENTSTACK_ENVIRONMENT,
        hasLaunchDarklyClientId: !!process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID,
        hasLaunchDarklyEnvironment: !!process.env.NEXT_PUBLIC_LAUNCHDARKLY_ENVIRONMENT
      }
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      message: 'POST request received',
      body: req.body,
      method: req.method,
      timestamp: new Date().toISOString(),
      headers: req.headers
    });
  }

  return res.status(405).json({
    error: 'Method Not Allowed',
    allowedMethods: ['GET', 'POST', 'OPTIONS']
  });
} 