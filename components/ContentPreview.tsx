import React from 'react';
import { PreviewContent } from '../types';

type Props = {
  content: PreviewContent;
};

export const ContentPreview: React.FC<Props> = ({ content }) => {
  if (!content) return <div>No content loaded.</div>;

  const isAsset = content.assetType || content.fileUrl || content.fileName;

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      {/* Asset-specific display */}
      {isAsset && (
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#e7f3ff', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0056b3' }}>📁 Asset Information</h3>
          {content.assetType && (
            <p><strong>Type:</strong> {content.assetType.toUpperCase()}</p>
          )}
          {content.fileName && (
            <p><strong>File:</strong> {content.fileName}</p>
          )}
          {content.fileSize && (
            <p><strong>Size:</strong> {(content.fileSize / 1024).toFixed(1)} KB</p>
          )}
          {content.mimeType && (
            <p><strong>MIME Type:</strong> {content.mimeType}</p>
          )}
          {content.dimensions && (
            <p><strong>Dimensions:</strong> {content.dimensions.width} × {content.dimensions.height}px</p>
          )}
          {content.fileUrl && (
            <div style={{ marginTop: '0.5rem' }}>
              <a 
                href={content.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  background: '#0070f3', 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px', 
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                📥 Download File
              </a>
            </div>
          )}
        </div>
      )}

      {/* Image preview */}
      {content.imageUrl && (
        <div style={{ marginBottom: '1rem' }}>
          <img 
            src={content.imageUrl} 
            alt="Preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px', 
              objectFit: 'contain',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }} 
          />
        </div>
      )}

      {/* Content display */}
      {content.title && <h2>{content.title}</h2>}
      {content.summary && <p>{content.summary}</p>}
      {content.html && (
        <div
          dangerouslySetInnerHTML={{ __html: content.html }}
          style={{ background: '#f9f9f9', padding: '1rem', marginTop: '1rem', borderRadius: '4px' }}
        />
      )}

      {/* Raw data */}
      <details style={{ marginTop: '1rem' }}>
        <summary>Raw JSON Data</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#eee', padding: '1rem', borderRadius: '4px', fontSize: '0.9rem' }}>
          {JSON.stringify(content.structuredData, null, 2)}
        </pre>
      </details>
    </div>
  );
}; 