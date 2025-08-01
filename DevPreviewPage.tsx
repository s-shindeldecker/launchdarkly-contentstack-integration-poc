import React, { useEffect, useState } from 'react';
import { ContentstackAdapter } from './contentstackAdapter';
import { ContentPreview } from './components/ContentPreview';
import { CMSReference, PreviewContent } from './types';

const ref: CMSReference = {
  cmsType: 'contentstack',
  entryId: 'blt0f6ddaddb7222b8d', // Real entry ID
  environment: 'preview',
  preview: false,
  contentType: 'entry'
};

export default function DevPreviewPage() {
  const [content, setContent] = useState<PreviewContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    ContentstackAdapter.fetchContent(ref)
      .then((result) => {
        console.log('Content fetched successfully:', result);
        setContent(result);
      })
      .catch((err) => {
        console.error('Failed to fetch content:', err);
        setError(err.message || 'Failed to fetch content');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem' }}>
      <h1>Content Preview (Dev)</h1>
      
      {loading && (
        <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
          <p>Loading content from Contentstack...</p>
        </div>
      )}
      
      {error && (
        <div style={{ padding: '1rem', background: '#f8d7da', borderRadius: '8px', color: '#721c24' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {content && <ContentPreview content={content} />}
    </div>
  );
} 