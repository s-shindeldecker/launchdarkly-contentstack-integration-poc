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
 * Fetches content from Contentstack based on the provided parameters
 */
async function fetchContentstackContent(params: {
  config: { apiKey: string; deliveryToken: string; environment: string };
  input: { entryId: string; contentType?: string; preview?: boolean };
}): Promise<{ success: boolean; content?: any; error?: string }> {
  const { config, input } = params;

  try {
    console.log('🚀 Fetching content from Contentstack:', {
      entryId: input.entryId,
      contentType: input.contentType,
      environment: config.environment,
      preview: input.preview
    });

    // Determine the content type and build the URL
    let contentType = input.contentType;
    let url: string;

    if (contentType === 'asset') {
      // Fetch asset
      url = `https://cdn.contentstack.io/v3/assets/${input.entryId}?environment=${config.environment}`;
    } else {
      // If no content type specified, try to discover it
      if (!contentType) {
        console.log('🔍 No content type specified, attempting discovery...');
        const discoveredType = await findContentTypeForEntry(input.entryId, {
          apiKey: config.apiKey,
          deliveryToken: config.deliveryToken,
          environment: config.environment
        });
        
        if (discoveredType) {
          console.log(`✅ Discovered content type: ${discoveredType}`);
          contentType = discoveredType;
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
  const contentRef: CMSReference = {
    cmsType: 'contentstack',
    entryId: variation.entryId,
    environment: variation.environment,
    contentType: variation.contentType,
    preview: variation.preview
  };

  console.log('📋 Content reference:', contentRef);

  try {
    // Fetch content from Contentstack
    const result = await fetchContentstackContent({
      config: { apiKey, deliveryToken, environment },
      input: {
        entryId: contentRef.entryId,
        contentType: contentRef.contentType,
        preview: contentRef.preview
      }
    });

    if (!result.success) {
      console.error('❌ Failed to fetch content:', result.error);
      return {
        status: 404,
        body: {
          error: 'Content not found',
          detail: result.error || 'Failed to fetch content from Contentstack'
        }
      };
    }

    // Format the response for LaunchDarkly preview
    const content = result.content;
    const preview: PreviewContent = {
      title: content.title || 'Untitled',
      summary: content.data?.summary || content.data?.description || '',
      imageUrl: content.data?.image?.url || content.data?.banner?.url || null,
      html: content.data?.body || content.data?.content || '',
      structuredData: content.data
    };

    console.log('✅ Flag preview response prepared');

    return {
      status: 200,
      body: { preview }
    };

  } catch (error) {
    console.error('💥 Error in flag preview handler:', error);
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        detail: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Handles runtime API requests for content fetching
 */
async function handleRuntimeAPI(req: RuntimeAPIRequest): Promise<RuntimeAPIResponse> {
  const { apiKey, deliveryToken, environment } = req.context.config;
  const input = req.body.variation.value;

  console.log('🚀 Runtime API request received:', {
    entryId: input.entryId,
    contentType: input.contentType,
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

  try {
    // Fetch content from Contentstack
    const result = await fetchContentstackContent({
      config: { apiKey, deliveryToken, environment },
      input: {
        entryId: input.entryId,
        contentType: input.contentType,
        preview: input.preview
      }
    });

    if (!result.success) {
      console.error('❌ Failed to fetch content:', result.error);
      return {
        status: 404,
        body: {
          error: 'Content not found',
          detail: result.error || 'Failed to fetch content from Contentstack'
        }
      };
    }

    console.log('✅ Runtime API response prepared');

    return {
      status: 200,
      body: result
    };

  } catch (error) {
    console.error('💥 Error in runtime API handler:', error);
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        detail: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

/**
 * Makes HTTP requests with proper error handling
 */
function makeHttpRequest(url: string, headers: Record<string, string>): Promise<any> {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const http = require('http');

    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: headers
    };

    const req = client.request(options, (res: any) => {
      let data = '';

      res.on('data', (chunk: any) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON response: ${error}`));
        }
      });
    });

    req.on('error', (error: any) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Main handler function for the runtime API
 */
async function handler(params: any): Promise<any> {
  console.log('🎯 Runtime API handler called');

  try {
    // Validate input
    if (!params || !params.context || !params.body) {
      console.error('❌ Invalid request structure');
      return {
        status: 400,
        body: {
          error: 'Invalid request structure',
          detail: 'Request must include context and body'
        }
      };
    }

    const request: RuntimeAPIRequest = params;

    // Determine the type of request and route accordingly
    if (request.body.variation && request.body.variation.value) {
      // This is a flag preview request
      return await handleFlagPreview(request);
    } else {
      // This is a runtime API request
      return await handleRuntimeAPI(request);
    }

  } catch (error) {
    console.error('💥 Unhandled error in runtime API:', error);
    return {
      status: 500,
      body: {
        error: 'Internal server error',
        detail: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

export default handler; 
export { handler, fetchContentstackContent, handleFlagPreview }; 