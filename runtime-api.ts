/**
 * LaunchDarkly Partner Integration Runtime API Handler
 * Contentstack Integration - TypeScript Version
 */

import { findContentTypeForEntry } from './utils/contentTypeDiscovery';
import { CMSReference, PreviewContent } from './types/cms';

interface RuntimeAPIRequest {
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

interface RuntimeAPIResponse {
  status: number;
  body: any;
}

/**
 * Fetches content from Contentstack based on the provided configuration
 */
async function fetchContentstackContent(params: {
  config: { apiKey: string; deliveryToken: string; environment: string };
  input: { entryId: string; contentType?: string; preview?: boolean };
}): Promise<{ success: boolean; content?: any; error?: string }> {
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
    let url: string;
    let contentType = input.contentType;

    if (contentType === 'asset') {
      url = `https://cdn.contentstack.io/v3/assets/${input.entryId}?environment=${config.environment}`;
    } else {
      // If no content type specified, try to discover it
      if (!contentType) {
        console.log('🔍 No content type specified, attempting discovery...');
        contentType = await findContentTypeForEntry(input.entryId, {
          apiKey: config.apiKey,
          deliveryToken: config.deliveryToken,
          environment: config.environment
        });
        
        if (contentType) {
          console.log(`✅ Discovered content type: ${contentType}`);
        } else {
          console.log('⚠️ Could not discover content type, using default: page');
          contentType = 'page';
        }
      }
      
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
    if (contentType === 'asset') {
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
        contentType: contentType || 'entry',
        data: contentData,
        url: contentData.url || null,
        createdAt: contentData.created_at,
        updatedAt: contentData.updated_at
      }
    };

  } catch (error) {
    console.error('❌ Error fetching content:', error instanceof Error ? error.message : 'Unknown error');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Handles flag preview requests for LaunchDarkly UI
 */
async function handleFlagPreview(req: RuntimeAPIRequest): Promise<RuntimeAPIResponse> {
  const { apiKey, deliveryToken, environment } = req.context.config;
  const variation: CMSReference = req.body.variation.value;

  console.log('🎯 Flag preview request received:', {
    variation,
    environment,
    hasApiKey: !!apiKey,
    hasDeliveryToken: !!deliveryToken
  });

  // Validate required configuration
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

  // Extract content reference from variation
  const { entryId, contentType, preview = false } = variation;

  if (!entryId) {
    console.error('❌ Missing entryId in variation');
    return {
      status: 400,
      body: { 
        error: 'Missing entryId in variation',
        detail: 'Variation must include an entryId field'
      }
    };
  }

  try {
    // Determine the API endpoint based on content type
    let url: string;
    let finalContentType = contentType;

    if (contentType === 'asset') {
      url = `https://cdn.contentstack.io/v3/assets/${entryId}?environment=${environment}`;
    } else {
      // If no content type specified, try to discover it
      if (!finalContentType) {
        console.log('🔍 No content type specified, attempting discovery...');
        finalContentType = await findContentTypeForEntry(entryId, {
          apiKey,
          deliveryToken,
          environment
        });
        
        if (finalContentType) {
          console.log(`✅ Discovered content type: ${finalContentType}`);
        } else {
          console.log('⚠️ Could not discover content type, using default: page');
          finalContentType = 'page';
        }
      }
      
      url = `https://cdn.contentstack.io/v3/content_types/${finalContentType}/entries/${entryId}?environment=${environment}`;
    }

    // Add preview parameter if specified
    if (preview) {
      url += '&preview=true';
    }

    console.log('🌐 Fetching content from:', url);

    // Make the request to Contentstack
    const response = await makeHttpRequest(url, {
      'api_key': apiKey,
      'access_token': deliveryToken,
      'Content-Type': 'application/json'
    });

    // Extract content data
    let contentData;
    if (finalContentType === 'asset') {
      contentData = response.asset;
    } else {
      contentData = response.entry;
    }

    if (!contentData) {
      return {
        status: 404,
        body: { 
          error: 'Content not found',
          detail: 'No entry or asset found with the specified ID'
        }
      };
    }

    // Format preview data for LaunchDarkly UI
    const preview: PreviewContent = {
      title: contentData.title || contentData.filename || 'Untitled',
      summary: contentData.summary || contentData.description || '',
      imageUrl: contentData.image?.url,
      structuredData: contentData
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
      status: 200,
      body: { preview }
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

/**
 * Makes an HTTP request with the given options
 */
function makeHttpRequest(url: string, headers: Record<string, string>): Promise<any> {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: headers
    };

    const req = https.request(options, (res: any) => {
      let data = '';

      res.on('data', (chunk: string) => {
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
          reject(new Error(`Failed to parse response: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });
    });

    req.on('error', (error: Error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.end();
  });
}

/**
 * Main handler function called by LaunchDarkly
 */
async function handler(params: any): Promise<any> {
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
    console.error('❌ Integration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export { handler, fetchContentstackContent, handleFlagPreview }; 