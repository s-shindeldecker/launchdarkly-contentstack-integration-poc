export default async function handler(req, res) {
  // Set CORS headers for LaunchDarkly
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      detail: 'Only POST requests are supported'
    });
  }

  try {
    // Validate environment variables
    const apiKey = process.env.CONTENTSTACK_API_KEY;
    const deliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;
    const environment = process.env.CONTENTSTACK_ENVIRONMENT;

    if (!apiKey || !deliveryToken || !environment) {
      console.error('❌ Missing required environment variables');
      return res.status(500).json({ 
        error: 'Configuration Error',
        detail: 'Missing Contentstack environment variables. Please check CONTENTSTACK_API_KEY, CONTENTSTACK_DELIVERY_TOKEN, and CONTENTSTACK_ENVIRONMENT.'
      });
    }

    const config = {
      apiKey,
      deliveryToken,
      environment
    };

    // Extract variation from request body
    const variation = req.body?.variation?.value;

    if (!variation) {
      console.error('❌ Missing variation in request body');
      return res.status(400).json({ 
        error: 'Invalid Request',
        detail: 'Missing variation in request body'
      });
    }

    // Validate required fields
    if (!variation.entryId) {
      console.error('❌ Missing entryId in variation');
      return res.status(400).json({ 
        error: 'Invalid Request',
        detail: 'Missing entryId in variation'
      });
    }

    if (!variation.environment) {
      console.error('❌ Missing environment in variation');
      return res.status(400).json({ 
        error: 'Invalid Request',
        detail: 'Missing environment in variation'
      });
    }

    if (variation.cmsType !== 'contentstack') {
      console.error('❌ Invalid cmsType in variation');
      return res.status(400).json({ 
        error: 'Invalid Request',
        detail: 'Invalid cmsType. Only "contentstack" is supported.'
      });
    }

    console.log(`🚀 Processing flag preview request for entry: ${variation.entryId}`);

    // Simple test response for now
    const preview = {
      title: 'Test Content',
      summary: 'This is a test response from the API',
      imageUrl: null,
      html: '<p>Test content from flagPreview API</p>',
      structuredData: {
        entryId: variation.entryId,
        environment: variation.environment,
        contentType: variation.contentType || 'entry'
      }
    };

    console.log(`✅ Successfully created preview for entry: ${variation.entryId}`);

    // Return LaunchDarkly-compatible response
    return res.status(200).json({ preview });

  } catch (error) {
    console.error('💥 Error processing flag preview request:', error);

    // Generic error response
    return res.status(500).json({
      error: 'Internal Server Error',
      detail: 'Failed to process flag preview request'
    });
  }
} 