/**
 * Flag preview handler for LaunchDarkly Contentstack integration
 */

/**
 * Fetches content from Contentstack and formats it for LaunchDarkly preview
 */
async function handleFlagPreview(req) {
  console.log('🎯 Flag preview request received:', {
    hasContext: !!req.context,
    hasConfig: !!req.context?.config,
    hasBody: !!req.body,
    hasVariation: !!req.body?.variation
  });

  // Runtime validation: Check request structure
  if (!req.context || !req.context.config) {
    console.error('❌ Missing context or config');
    return {
      status: 400,
      body: { 
        error: 'Invalid request structure',
        detail: 'Request must include context with configuration'
      }
    };
  }

  const { apiKey, deliveryToken, environment } = req.context.config;

  // Runtime validation: Check configuration
  if (!apiKey || !deliveryToken || !environment) {
    console.error('❌ Missing required configuration');
    return {
      status: 400,
      body: { 
        error: 'Missing required configuration',
        detail: 'apiKey, deliveryToken, and environment are required'
      }
    };
  }

  // Runtime validation: Check variation structure
  if (!req.body?.variation?.value) {
    console.error('❌ Missing variation value');
    return {
      status: 400,
      body: { 
        error: 'Invalid variation input',
        detail: 'Request must include variation.value'
      }
    };
  }

  const variation = req.body.variation.value;

  // Runtime validation: Check variation fields
  if (
    !variation ||
    typeof variation !== 'object' ||
    !variation.cmsType ||
    !variation.entryId ||
    !variation.environment
  ) {
    console.error('❌ Invalid variation structure:', variation);
    return {
      status: 400,
      body: { 
        error: 'Invalid variation structure',
        detail: 'Variation must include cmsType, entryId, and environment fields'
      }
    };
  }

  // Runtime validation: Check field types
  if (
    typeof variation.cmsType !== 'string' ||
    typeof variation.entryId !== 'string' ||
    typeof variation.environment !== 'string'
  ) {
    console.error('❌ Invalid field types in variation:', {
      cmsType: typeof variation.cmsType,
      entryId: typeof variation.entryId,
      environment: typeof variation.environment
    });
    return {
      status: 400,
      body: { 
        error: 'Invalid field types',
        detail: 'cmsType, entryId, and environment must be strings'
      }
    };
  }

  // Runtime validation: Check CMS type
  if (variation.cmsType !== 'contentstack') {
    console.error('❌ Unsupported CMS type:', variation.cmsType);
    return {
      status: 400,
      body: { 
        error: 'Unsupported CMS type',
        detail: `Only 'contentstack' is supported, got: ${variation.cmsType}`
      }
    };
  }

  console.log('✅ Runtime validation passed');
  console.log('📋 Validated variation:', {
    cmsType: variation.cmsType,
    entryId: variation.entryId,
    environment: variation.environment,
    contentType: variation.contentType,
    preview: variation.preview
  });

  // Extract content reference from variation
  const { entryId, contentType = 'page', preview = false } = variation;

  try {
    // Determine the API endpoint based on content type
    let url;
    if (contentType === 'asset') {
      url = `https://cdn.contentstack.io/v3/assets/${entryId}?environment=${environment}`;
    } else {
      url = `https://cdn.contentstack.io/v3/content_types/${contentType}/entries/${entryId}?environment=${environment}`;
    }

    // Add preview parameter if specified
    if (preview) {
      url += '&preview=true';
    }

    console.log('🌐 Fetching content from:', url);

    // Make the request to Contentstack
    const response = await fetch(url, {
      headers: {
        'api_key': apiKey,
        'access_token': deliveryToken,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Contentstack API error:', response.status, errorText);
      
      return {
        status: response.status,
        body: { 
          error: 'Failed to fetch content from Contentstack',
          detail: `HTTP ${response.status}: ${errorText}`
        }
      };
    }

    const data = await response.json();
    console.log('✅ Content fetched successfully');

    // Extract content data
    let contentData;
    if (contentType === 'asset') {
      contentData = data.asset;
    } else {
      contentData = data.entry;
    }

    if (!contentData) {
      console.error('❌ No content found in response');
      return {
        status: 404,
        body: { 
          error: 'Content not found',
          detail: 'No entry or asset found with the specified ID'
        }
      };
    }

    // Format preview data for LaunchDarkly UI
    const previewData = {
      title: contentData.title || contentData.filename || 'Untitled',
      summary: contentData.summary || contentData.description || '',
      imageUrl: contentData.image?.url,
      structuredData: contentData
    };

    // Add additional metadata for better preview
    if (contentData.content) {
      previewData.summary = contentData.content.substring(0, 200) + (contentData.content.length > 200 ? '...' : '');
    }

    console.log('📄 Preview data formatted:', {
      title: previewData.title,
      summaryLength: previewData.summary?.length || 0,
      hasImage: !!previewData.imageUrl
    });

    return {
      status: 200,
      body: { preview: previewData }
    };

  } catch (error) {
    console.error('❌ Error in flag preview handler:', error);
    
    return {
      status: 500,
      body: { 
        error: 'Failed to fetch content from Contentstack',
        detail: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

module.exports = { handleFlagPreview }; 