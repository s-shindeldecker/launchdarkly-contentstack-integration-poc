import { CMSAdapter, CMSReference, PreviewContent } from './types';
// @ts-ignore
import * as contentstack from 'contentstack';

const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'staging';

if (!apiKey || !deliveryToken) {
  console.warn('Contentstack credentials not fully configured');
}

console.log('Contentstack Config:', {
  apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'Missing',
  deliveryToken: deliveryToken ? `${deliveryToken.substring(0, 10)}...` : 'Missing',
  environment: environment
});

const stack = contentstack.Stack({
  api_key: apiKey || '',
  delivery_token: deliveryToken || '',
  environment: environment
});

// Helper function to determine asset type from MIME type
const getAssetType = (mimeType: string): 'image' | 'file' | 'video' | 'audio' => {
  if (!mimeType) return 'file';
  
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'file';
};

// Type for asset data
interface AssetData {
  uid: string;
  title?: string;
  filename?: string;
  description?: string;
  url?: string;
  file_size?: number;
  content_type?: string;
  dimension?: {
    width: number;
    height: number;
  };
  [key: string]: any;
}

export const ContentstackAdapter: CMSAdapter = {
  async fetchContent(ref: CMSReference): Promise<PreviewContent> {
    if (!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY) {
      throw new Error('Contentstack API key not configured');
    }

    console.log('Fetching content with ref:', ref);

    // Determine if this is an asset or entry
    const isAsset = ref.contentType === 'asset';
    
    if (isAsset) {
      return this.fetchAsset(ref);
    }

    // Use direct REST API call for entries since SDK methods aren't working
    try {
      const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
      const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
      const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'preview';
      
      if (!deliveryToken) {
        throw new Error('Contentstack delivery token not configured');
      }
      
      const url = `https://cdn.contentstack.io/v3/content_types/page/entries/${ref.entryId}?environment=${environment}`;
      
      const response = await fetch(url, {
        headers: {
          'api_key': apiKey,
          'access_token': deliveryToken,
          'Content-Type': 'application/json'
        } as HeadersInit
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Contentstack entry fetch successful:', result);
      
      const entryData = result.entry;
      
      return {
        title: entryData.title,
        summary: entryData.summary,
        html: entryData.html || '',
        imageUrl: entryData.image?.url || '',
        structuredData: entryData
      };
      
    } catch (error: any) {
      console.error('Contentstack entry fetch error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        ref: ref
      });
      throw new Error(`Failed to fetch content: ${error.message || 'Unknown error'}`);
    }
  },

  async fetchAsset(ref: CMSReference): Promise<PreviewContent> {
    if (!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY) {
      throw new Error('Contentstack API key not configured');
    }

    console.log('Fetching asset with ref:', ref);

    try {
      // Use direct REST API call since SDK methods aren't working
      const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
      const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
      const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'preview';
      
      if (!deliveryToken) {
        throw new Error('Contentstack delivery token not configured');
      }
      
      const url = `https://cdn.contentstack.io/v3/assets/${ref.entryId}?environment=${environment}`;
      
      const response = await fetch(url, {
        headers: {
          'api_key': apiKey,
          'access_token': deliveryToken,
          'Content-Type': 'application/json'
        } as HeadersInit
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const assetData = await response.json();
      console.log('Contentstack asset fetch successful:', assetData);
      
      return {
        title: assetData.asset.title || assetData.asset.filename,
        summary: assetData.asset.description,
        imageUrl: assetData.asset.url,
        fileUrl: assetData.asset.url,
        fileName: assetData.asset.filename,
        fileSize: assetData.asset.file_size,
        mimeType: assetData.asset.content_type,
        assetType: getAssetType(assetData.asset.content_type || ''),
        dimensions: assetData.asset.dimension ? {
          width: assetData.asset.dimension.width,
          height: assetData.asset.dimension.height
        } : undefined,
        structuredData: assetData.asset
      };
      
    } catch (error: any) {
      console.error('Contentstack asset fetch error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        ref: ref
      });
      throw new Error(`Failed to fetch asset: ${error.message || 'Unknown error'}`);
    }
  },

  async getEntryMetadata(ref: CMSReference) {
    if (!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY) {
      throw new Error('Contentstack API key not configured');
    }

    const entry = stack.ContentType('page').Entry(ref.entryId);
    return new Promise((resolve, reject) => {
      entry.fetch()
        .then((result: any) => {
          resolve({
            title: result.get('title'),
            thumbnail: result.get('image')?.url || ''
          });
        })
        .catch((error: any) => {
          console.error('Contentstack metadata fetch error:', error);
          reject(new Error(`Failed to fetch metadata: ${error.message || 'Unknown error'}`));
        });
    });
  },

  async getAssetMetadata(ref: CMSReference) {
    if (!process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY) {
      throw new Error('Contentstack API key not configured');
    }

    try {
      const assetsQuery = stack.Assets().Query().where('uid', ref.entryId);
      const result = await new Promise<any>((resolve, reject) => {
        assetsQuery.toJSON().fetch()
          .then(resolve)
          .catch(reject);
      });
      
      const assetData = result.assets && result.assets[0] as AssetData;
      
      if (!assetData) {
        throw new Error('Asset not found');
      }
      
      return {
        title: assetData.title || assetData.filename,
        thumbnail: assetData.url,
        fileUrl: assetData.url
      };
    } catch (error: any) {
      console.error('Contentstack asset metadata fetch error:', error);
      throw new Error(`Failed to fetch asset metadata: ${error.message || 'Unknown error'}`);
    }
  }
}; 