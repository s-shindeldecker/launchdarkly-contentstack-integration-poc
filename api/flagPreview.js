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
    // Extract variation and config from request body
    const variation = req.body?.variation?.value;
    const contentstackConfig = req.body?.config?.contentstack;

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

    // Determine Contentstack configuration
    let config;
    
    if (contentstackConfig) {
      // Use LaunchDarkly-provided configuration
      if (!contentstackConfig.apiKey || !contentstackConfig.deliveryToken || !contentstackConfig.environment) {
        console.error('❌ Invalid Contentstack configuration from LaunchDarkly');
        return res.status(400).json({ 
          error: 'Configuration Error',
          detail: 'Missing required Contentstack configuration (apiKey, deliveryToken, environment)'
        });
      }
      
      config = {
        apiKey: contentstackConfig.apiKey,
        deliveryToken: contentstackConfig.deliveryToken,
        environment: contentstackConfig.environment
      };
      
      console.log('🔧 Using LaunchDarkly-provided Contentstack configuration');
    } else {
      // Fallback to environment variables for testing
      const apiKey = process.env.CONTENTSTACK_API_KEY;
      const deliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;
      const environment = process.env.CONTENTSTACK_ENVIRONMENT;

      if (!apiKey || !deliveryToken || !environment) {
        console.error('❌ Missing Contentstack configuration');
        return res.status(500).json({ 
          error: 'Configuration Error',
          detail: 'Missing Contentstack configuration. Either provide config in request body or set environment variables.'
        });
      }

      config = {
        apiKey,
        deliveryToken,
        environment
      };
      
      console.log('🔧 Using environment variables for Contentstack configuration (testing mode)');
    }

    console.log(`🚀 Processing flag preview request for entry: ${variation.entryId}`);

    // Fetch content from Contentstack
    const preview = await fetchContentstackContent(variation, config);

    console.log(`✅ Successfully fetched preview for entry: ${variation.entryId}`);

    // Return LaunchDarkly-compatible response
    return res.status(200).json({ preview });

  } catch (error) {
    console.error('💥 Error processing flag preview request:', error);

    // Handle specific error types
    if (error.message.includes('HTTP 404')) {
      return res.status(404).json({
        error: 'Content Not Found',
        detail: 'The specified entry or asset was not found in Contentstack'
      });
    }

    if (error.message.includes('HTTP 422')) {
      return res.status(422).json({
        error: 'Content Type Error',
        detail: 'The content type was not found or is invalid'
      });
    }

    if (error.message.includes('HTTP 401') || error.message.includes('HTTP 403')) {
      return res.status(401).json({
        error: 'Authentication Error',
        detail: 'Invalid Contentstack credentials'
      });
    }

    // Generic error response
    return res.status(500).json({
      error: 'Internal Server Error',
      detail: 'Failed to process flag preview request'
    });
  }
}

/**
 * Discover content type for a given entry ID
 */
async function findContentTypeForEntry(entryId, config) {
  const baseUrl = 'https://cdn.contentstack.io/v3';
  const headers = {
    api_key: config.apiKey,
    access_token: config.deliveryToken
  };

  try {
    console.log(`🔍 Discovering content type for entry: ${entryId}`);

    // Step 1: Fetch all content types
    const typesRes = await fetch(`${baseUrl}/content_types?environment=${config.environment}`, { 
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });

    if (!typesRes.ok) {
      console.error(`❌ Failed to fetch content types: HTTP ${typesRes.status}`);
      return null;
    }

    const typesData = await typesRes.json();
    const contentTypes = typesData.content_types?.map((ct) => ct.uid) || [];

    console.log(`📋 Found ${contentTypes.length} content types`);

    if (contentTypes.length === 0) {
      return null;
    }

    // Step 2: Try fetching the entry using each content type
    for (const type of contentTypes) {
      const entryUrl = `${baseUrl}/content_types/${type}/entries/${entryId}?environment=${config.environment}`;
      const res = await fetch(entryUrl, { 
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 200) {
        console.log(`✅ Found matching content type: ${type}`);
        return type;
      }
    }

    console.log('❌ No matching content type found for entry');
    return null;

  } catch (error) {
    console.error('💥 Error during content type discovery:', error);
    return null;
  }
}

/**
 * Fetch content from Contentstack
 */
async function fetchContentstackContent(variation, config) {
  const baseUrl = 'https://cdn.contentstack.io/v3';
  const headers = {
    api_key: config.apiKey,
    access_token: config.deliveryToken
  };

  // Determine if this is an asset or entry
  const isAsset = variation.contentType === 'asset';
  
  if (isAsset) {
    // Fetch asset
    const assetUrl = `${baseUrl}/assets/${variation.entryId}?environment=${variation.environment}`;
    const response = await fetch(assetUrl, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: HTTP ${response.status}`);
    }

    const data = await response.json();
    const asset = data.asset;

    return {
      title: asset.title || asset.filename || 'Asset',
      summary: `Asset: ${asset.filename}`,
      imageUrl: asset.url,
      fileUrl: asset.url,
      fileName: asset.filename,
      fileSize: asset.file_size,
      mimeType: asset.content_type,
      assetType: asset.content_type?.startsWith('image/') ? 'image' : 'file',
      dimensions: asset.dimension ? {
        width: asset.dimension.width,
        height: asset.dimension.height
      } : undefined,
      structuredData: asset
    };
  } else {
    // Fetch entry
    let contentType = variation.contentType;
    let apiContentType;
    
    // Auto-discover content type if not provided
    if (!contentType) {
      const discoveredType = await findContentTypeForEntry(variation.entryId, config);
      if (!discoveredType) {
        throw new Error('Unable to resolve content type for entry ID');
      }
      apiContentType = discoveredType;
    } else {
      apiContentType = contentType;
    }

    const entryUrl = `${baseUrl}/content_types/${apiContentType}/entries/${variation.entryId}?environment=${variation.environment}`;
    const response = await fetch(entryUrl, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch entry: HTTP ${response.status}`);
    }

    const data = await response.json();
    const entry = data.entry;

    return {
      title: entry.title || 'Entry',
      summary: entry.summary || '',
      html: entry.body || '',
      imageUrl: entry.image?.url,
      structuredData: entry
    };
  }
} 