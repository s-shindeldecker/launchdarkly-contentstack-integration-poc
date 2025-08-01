export type CMSReference = {
  cmsType: 'contentstack';
  entryId: string;
  environment?: string;
  preview?: boolean;
  contentType?: 'entry' | 'asset'; // New field to distinguish between entries and assets
};

export interface PreviewContent {
  title?: string;
  summary?: string;
  html?: string;
  imageUrl?: string;
  structuredData?: Record<string, any>;
  // Asset-specific fields
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

export interface CMSAdapter {
  fetchContent(ref: CMSReference): Promise<PreviewContent>;
  getEntryMetadata(ref: CMSReference): Promise<{ title?: string; thumbnail?: string }>;
  // New methods for asset support
  fetchAsset(ref: CMSReference): Promise<PreviewContent>;
  getAssetMetadata(ref: CMSReference): Promise<{ title?: string; thumbnail?: string; fileUrl?: string }>;
} 