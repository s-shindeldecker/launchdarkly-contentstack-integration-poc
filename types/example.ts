/**
 * Example usage of shared CMS types for LaunchDarkly integration
 */

import { CMSReference, PreviewContent } from './cms';

/**
 * Example: Content flag variation value for LaunchDarkly
 * This would be stored in a LaunchDarkly JSON flag variation
 */
const contentFlagVariation: CMSReference = {
  cmsType: 'contentstack',
  entryId: 'blt0f6ddaddb7222b8d',
  environment: 'preview',
  preview: false,
  contentType: 'entry'
};

/**
 * Example: Asset flag variation value for LaunchDarkly
 */
const assetFlagVariation: CMSReference = {
  cmsType: 'contentstack',
  entryId: 'blt211dac063fd6e948',
  environment: 'preview',
  preview: false,
  contentType: 'asset'
};

/**
 * Example: Preview content returned to LaunchDarkly UI
 * This is what the runtime API returns for flag preview
 */
const previewContent: PreviewContent = {
  title: 'Welcome to Our Site',
  summary: 'This is a sample content entry...',
  imageUrl: 'https://example.com/image.jpg',
  html: '<h1>Welcome</h1><p>Content here...</p>',
  structuredData: {
    author: 'John Doe',
    publishDate: '2024-01-01'
  }
};

/**
 * Example: Asset preview content
 */
const assetPreviewContent: PreviewContent = {
  title: 'Product Image',
  fileName: 'product.jpg',
  fileSize: 1024000,
  fileUrl: 'https://example.com/product.jpg',
  mimeType: 'image/jpeg',
  assetType: 'image',
  dimensions: {
    width: 1920,
    height: 1080
  }
};

/**
 * Example function that processes content flag variations
 */
function processContentVariation(variation: CMSReference): Promise<PreviewContent> {
  // This would be implemented by the runtime API
  return Promise.resolve(previewContent);
}

/**
 * Example function for LaunchDarkly flag preview
 */
async function handleFlagPreview(variation: CMSReference): Promise<PreviewContent> {
  // Validate the variation
  if (!variation.entryId) {
    throw new Error('Entry ID is required');
  }
  
  // Process based on content type
  if (variation.contentType === 'asset') {
    return assetPreviewContent;
  } else {
    return previewContent;
  }
} 