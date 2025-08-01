/**
 * LaunchDarkly Partner Integration Runtime API Handler
 * Contentstack Integration
 */

const https = require('https');

/**
 * Fetches content from Contentstack based on the provided configuration
 * @param {Object} params - Parameters from LaunchDarkly
 * @param {Object} params.config - Integration configuration
 * @param {string} params.config.apiKey - Contentstack API Key
 * @param {string} params.config.deliveryToken - Contentstack Delivery Token
 * @param {string} params.config.environment - Contentstack Environment
 * @param {Object} params.input - Input data from flag variation
 * @param {string} params.input.entryId - Contentstack Entry ID
 * @param {string} params.input.contentType - Content type ('entry' or 'asset')
 * @param {boolean} params.input.preview - Whether to fetch preview content
 * @returns {Promise<Object>} Content data from Contentstack
 */
async function fetchContentstackContent(params) {
  const { config, input } = params;
  
  console.log('📥 Fetching content from Contentstack:', {
    entryId: input.entryId,
    contentType: input.contentType,
    preview: input.preview,
    environment: config.environment
  });

  try {
    // Validate required inputs
    if (!input.entryId) {
      throw new Error('entryId is required');
    }

    if (!config.apiKey || !config.deliveryToken || !config.environment) {
      throw new Error('Missing required configuration: apiKey, deliveryToken, or environment');
    }

    // Determine the API endpoint based on content type
    let url;
    if (input.contentType === 'asset') {
      url = `https://cdn.contentstack.io/v3/assets/${input.entryId}?environment=${config.environment}`;
    } else {
      // Default to entry content type
      const contentType = input.contentType || 'page'; // Default content type
      url = `https://cdn.contentstack.io/v3/content_types/${contentType}/entries/${input.entryId}?environment=${config.environment}`;
    }

    // Add preview parameter if specified
    if (input.preview) {
      url += '&preview=true';
    }

    console.log('🌐 Making request to:', url);

    // Make the HTTP request
    const response = await makeHttpRequest(url, {
      'api_key': config.apiKey,
      'access_token': config.deliveryToken,
      'Content-Type': 'application/json'
    });

    console.log('✅ Content fetched successfully');

    // Extract the content data
    let contentData;
    if (input.contentType === 'asset') {
      contentData = response.asset;
    } else {
      contentData = response.entry;
    }

    if (!contentData) {
      throw new Error('No content found in response');
    }

    // Return structured content data
    return {
      success: true,
      content: {
        id: contentData.uid || contentData._id,
        title: contentData.title || contentData.filename,
        contentType: input.contentType || 'entry',
        data: contentData,
        url: contentData.url || null,
        createdAt: contentData.created_at,
        updatedAt: contentData.updated_at
      }
    };

  } catch (error) {
    console.error('❌ Error fetching content:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Handles flag preview requests for LaunchDarkly UI
 * @param {Object} params - Parameters from LaunchDarkly
 * @param {Object} params.config - Integration configuration
 * @param {Object} params.variation - Flag variation data
 * @returns {Promise<Object>} Preview data for LaunchDarkly UI
 */
async function handleFlagPreview(params) {
  const { config, variation } = params;
  
  console.log('🎯 Flag preview request received:', {
    variation,
    environment: config.environment
  });

  try {
    // Validate required configuration
    if (!config.apiKey || !config.deliveryToken || !config.environment) {
      return {
        success: false,
        error: 'Missing required configuration: apiKey, deliveryToken, or environment'
      };
    }

    // Extract content reference from variation
    const { entryId, contentType = 'page', preview: previewMode = false } = variation;

    if (!entryId) {
      return {
        success: false,
        error: 'Missing entryId in variation'
      };
    }

    // Determine the API endpoint based on content type
    let url;
    if (contentType === 'asset') {
      url = `https://cdn.contentstack.io/v3/assets/${entryId}?environment=${config.environment}`;
    } else {
      url = `https://cdn.contentstack.io/v3/content_types/${contentType}/entries/${entryId}?environment=${config.environment}`;
    }

    // Add preview parameter if specified
    if (previewMode) {
      url += '&preview=true';
    }

    console.log('🌐 Fetching preview from:', url);

    // Make the request to Contentstack
    const response = await makeHttpRequest(url, {
      'api_key': config.apiKey,
      'access_token': config.deliveryToken,
      'Content-Type': 'application/json'
    });

    // Extract content data
    let contentData;
    if (contentType === 'asset') {
      contentData = response.asset;
    } else {
      contentData = response.entry;
    }

    if (!contentData) {
      return {
        success: false,
        error: 'No content found in response'
      };
    }

    // Format preview data for LaunchDarkly UI
    const preview = {
      title: contentData.title || contentData.filename || 'Untitled',
      summary: contentData.summary || contentData.description || '',
      imageUrl: contentData.image?.url,
      contentType,
      entryId: contentData.uid || entryId
    };

    // Add additional metadata for better preview
    if (contentData.content) {
      preview.summary = contentData.content.substring(0, 200) + (contentData.content.length > 200 ? '...' : '');
    }

    console.log('📄 Preview data formatted:', {
      title: preview.title,
      summaryLength: preview.summary.length,
      hasImage: !!preview.imageUrl
    });

    return {
      success: true,
      preview
    };

  } catch (error) {
    console.error('❌ Error in flag preview handler:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Makes an HTTP request with the given options
 * @param {string} url - The URL to request
 * @param {Object} headers - Request headers
 * @returns {Promise<Object>} The response data
 */
function makeHttpRequest(url, headers) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: headers
    };

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${jsonData.error_message || 'Request failed'}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.end();
  });
}

/**
 * Main handler function called by LaunchDarkly
 * @param {Object} params - Parameters from LaunchDarkly
 * @returns {Promise<Object>} Result data
 */
async function handler(params) {
  console.log('🚀 LaunchDarkly Partner Integration called with params:', JSON.stringify(params, null, 2));
  
  try {
    // Check if this is a flag preview request
    if (params.variation) {
      console.log('🎯 Flag preview request detected');
      const result = await handleFlagPreview(params);
      console.log('✅ Flag preview completed');
      return result;
    }

    // Regular content fetching request
    const result = await fetchContentstackContent(params);
    console.log('✅ Integration completed successfully');
    return result;
  } catch (error) {
    console.error('❌ Integration failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export the handler function
module.exports = { handler }; 