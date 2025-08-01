import { CMSAdapter, CMSReference, PreviewContent } from './types';

export const MockAdapter: CMSAdapter = {
  async fetchContent(ref: CMSReference): Promise<PreviewContent> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      title: 'Sample Content Title',
      summary: 'This is a sample content summary for testing purposes. It demonstrates how the content preview component works.',
      html: '<p>This is <strong>sample HTML content</strong> that would normally come from Contentstack.</p><p>You can include <em>formatted text</em>, <a href="#">links</a>, and other HTML elements.</p>',
      imageUrl: 'https://via.placeholder.com/400x200/0070f3/ffffff?text=Sample+Image',
      structuredData: {
        title: 'Sample Content Title',
        summary: 'This is a sample content summary for testing purposes.',
        content: {
          html: '<p>This is sample HTML content...</p>',
          text: 'This is sample HTML content...'
        },
        image: {
          url: 'https://via.placeholder.com/400x200/0070f3/ffffff?text=Sample+Image',
          alt: 'Sample Image'
        },
        metadata: {
          contentType: 'article',
          publishDate: '2024-01-15T10:00:00Z',
          author: 'Sample Author'
        }
      }
    };
  },

  async getEntryMetadata(ref: CMSReference) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      title: 'Sample Content Title',
      thumbnail: 'https://via.placeholder.com/200x100/0070f3/ffffff?text=Thumbnail'
    };
  },

  async fetchAsset(ref: CMSReference): Promise<PreviewContent> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      title: 'Sample Asset',
      summary: 'This is a sample asset for testing purposes.',
      imageUrl: 'https://via.placeholder.com/400x200/0070f3/ffffff?text=Sample+Asset',
      fileUrl: 'https://via.placeholder.com/400x200/0070f3/ffffff?text=Sample+Asset',
      fileName: 'sample-asset.jpg',
      fileSize: 1024000,
      mimeType: 'image/jpeg',
      assetType: 'image',
      dimensions: {
        width: 400,
        height: 200
      },
      structuredData: {
        title: 'Sample Asset',
        filename: 'sample-asset.jpg',
        url: 'https://via.placeholder.com/400x200/0070f3/ffffff?text=Sample+Asset',
        file_size: 1024000,
        content_type: 'image/jpeg',
        dimension: {
          width: 400,
          height: 200
        }
      }
    };
  },

  async getAssetMetadata(ref: CMSReference) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      title: 'Sample Asset',
      thumbnail: 'https://via.placeholder.com/200x100/0070f3/ffffff?text=Asset+Thumbnail',
      fileUrl: 'https://via.placeholder.com/400x200/0070f3/ffffff?text=Sample+Asset'
    };
  }
}; 