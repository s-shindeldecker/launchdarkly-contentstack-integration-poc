/**
 * Shared TypeScript types for CMS integration with LaunchDarkly
 * 
 * CMSReference represents the value stored in a LaunchDarkly content flag variation
 * PreviewContent represents the result returned to LaunchDarkly's preview UI
 */

/**
 * Reference to content in a CMS system
 * This type represents the value stored in a LaunchDarkly content flag variation
 */
export type CMSReference = {
  cmsType: 'contentstack';
  entryId: string;
  environment: string;
  preview?: boolean;
  contentType?: 'entry' | 'asset' | 'page'; // Include 'page' for Contentstack
};

/**
 * Formatted content for display in LaunchDarkly's preview UI
 * This type represents the result returned to LaunchDarkly's preview UI
 */
export interface PreviewContent {
  title?: string;
  summary?: string;
  imageUrl?: string;
  html?: string;
  structuredData?: Record<string, any>;
  
  // Asset-specific fields for better preview support
  assetType?: 'image' | 'file' | 'video' | 'audio';
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  mimeType?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
}

/**
 * Adapter interface for CMS integration
 * Used by the runtime API to fetch content from different CMS systems
 */
export interface CMSAdapter {
  fetchContent(ref: CMSReference): Promise<PreviewContent>;
  getEntryMetadata(ref: CMSReference): Promise<{ title?: string; thumbnail?: string }>;
  fetchAsset(ref: CMSReference): Promise<PreviewContent>;
  getAssetMetadata(ref: CMSReference): Promise<{ title?: string; thumbnail?: string; fileUrl?: string }>;
} 