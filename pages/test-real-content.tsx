import React, { useEffect, useState } from 'react';
import { ContentstackAdapter } from '../contentstackAdapter';
import { ContentPreview } from '../components/ContentPreview';
import { CMSReference, PreviewContent } from '../types';

const ref: CMSReference = {
  cmsType: 'contentstack',
  entryId: 'blt0f6ddaddb7222b8d', // Real entry ID (not asset ID)
  environment: 'preview',
  preview: false,
  contentType: 'entry'
};

export default function TestRealContent() {
  const [content, setContent] = useState<PreviewContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log('Testing with real Contentstack adapter...');
    console.log('Entry ID:', ref.entryId);
    console.log('Environment:', ref.environment);
    console.log('Content Type:', ref.contentType);
    
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Real Contentstack Test</h1>
      <p>Testing with real Contentstack adapter and entry ID: <code>{ref.entryId}</code></p>
      
      <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Configuration</h3>
        <ul>
          <li>Entry ID: {ref.entryId}</li>
          <li>Environment: {ref.environment}</li>
          <li>Content Type: {ref.contentType}</li>
          <li>Adapter: ContentstackAdapter (REST API)</li>
        </ul>
      </div>
      
      {loading && (
        <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px' }}>
          <p>Loading content from Contentstack...</p>
        </div>
      )}
      
      {error && (
        <div style={{ padding: '1rem', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px', color: '#721c24' }}>
          <h3>Error</h3>
          <p>{error}</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
            Check the browser console for detailed error information.
          </p>
        </div>
      )}
      
      {content && (
        <div>
          <h3>Content Retrieved Successfully!</h3>
          <ContentPreview content={content} />
        </div>
      )}
    </div>
  );
} 