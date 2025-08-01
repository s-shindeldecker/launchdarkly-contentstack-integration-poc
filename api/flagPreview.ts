import type { VercelRequest, VercelResponse } from '@vercel/node';
import { CMSReference, PreviewContent } from '../types/cms';

/**
 * Contentstack configuration interface
 */
interface ContentstackConfig {
  apiKey: string;
  deliveryToken: string;
  environment: string;
}

/**
 * Contentstack API response interface
 */
interface ContentstackEntryResponse {
  entry: {
    title?: string;
    summary?: string;
    body?: string;
    image?: {
      url?: string;
    };
    [key: string]: any;
  };
}

interface ContentstackAssetResponse {
  asset: {
    title?: string;
    filename?: string;
    url?: string;
    file_size?: number;
    content_type?: string;
    dimension?: {
      width?: number;
      height?: number;
    };
    [key: string]: any;
  };
}

/**
 * Discover content type for a given entry ID
 */
async function findContentTypeForEntry(entryId: string, config: ContentstackConfig): Promise<string | null> {
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
    const contentTypes = typesData.content_types?.map((ct: any) => ct.uid) || [];

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
async function fetchContentstackContent(variation: CMSReference, config: ContentstackConfig): Promise<PreviewContent> {
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

    const data: ContentstackAssetResponse = await response.json();
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
    
    // Auto-discover content type if not provided
    if (!contentType) {
      contentType = await findContentTypeForEntry(variation.entryId, config);
      if (!contentType) {
        throw new Error('Unable to resolve content type for entry ID');
      }
    }

    const entryUrl = `${baseUrl}/content_types/${contentType}/entries/${variation.entryId}?environment=${variation.environment}`;
    const response = await fetch(entryUrl, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch entry: HTTP ${response.status}`);
    }

    const data: ContentstackEntryResponse = await response.json();
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

/**
 * Vercel API route handler for LaunchDarkly flag preview
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const config: ContentstackConfig = {
      apiKey,
      deliveryToken,
      environment
    };

    // Extract variation from request body
    const variation = req.body?.variation?.value as CMSReference;

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

    // Fetch content from Contentstack
    const preview = await fetchContentstackContent(variation, config);

    console.log(`✅ Successfully fetched preview for entry: ${variation.entryId}`);

    // Return LaunchDarkly-compatible response
    return res.status(200).json({ preview });

  } catch (error: any) {
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
        error: 'Authentication Failed',
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