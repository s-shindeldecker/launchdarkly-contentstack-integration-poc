import { RuntimeAPIRequest, RuntimeAPIResponse } from '@launchdarkly/integration-runtime-api';
import fetch from 'node-fetch';

interface ContentstackEntry {
  uid: string;
  title?: string;
  summary?: string;
  description?: string;
  content?: string;
  image?: {
    url?: string;
    filename?: string;
  };
  [key: string]: any;
}

interface ContentstackResponse {
  entry: ContentstackEntry;
  [key: string]: any;
}

interface PreviewData {
  title: string;
  summary: string;
  imageUrl?: string;
  contentType: string;
  entryId: string;
  raw?: any;
}

export async function handleFlagPreview(req: RuntimeAPIRequest): Promise<RuntimeAPIResponse> {
  const { apiKey, deliveryToken, environment } = req.context.config;
  const variation = req.body.variation.value;

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
  const { entryId, contentType = 'page', preview = false } = variation;

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

    const data: ContentstackResponse = await response.json();
    console.log('✅ Content fetched successfully');

    // Extract content data
    let contentData: ContentstackEntry;
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
    const preview: PreviewData = {
      title: contentData.title || contentData.filename || 'Untitled',
      summary: contentData.summary || contentData.description || '',
      imageUrl: contentData.image?.url,
      contentType,
      entryId: contentData.uid || entryId,
      raw: contentData
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