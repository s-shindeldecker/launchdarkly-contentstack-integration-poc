import React, { useEffect, useState } from 'react';
import { ContentstackAdapter } from '../contentstackAdapter';
import { CMSReference } from '../types';

export default function TestConnection() {
  const [status, setStatus] = useState<string>('Testing connection...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('Testing Contentstack connection...');
      
      // Test with a real entry ID
      const testRef: CMSReference = {
        cmsType: 'contentstack',
        entryId: 'blt0f6ddaddb7222b8d', // Use the real entry ID
        environment: 'preview',
        preview: false,
        contentType: 'entry'
      };

      try {
        await ContentstackAdapter.fetchContent(testRef);
        setStatus('✅ Connection successful! Content fetched successfully.');
      } catch (err: any) {
        // If we get a 404 or 422, the connection is working but entry might not exist
        if (err.message.includes('404') || err.message.includes('422')) {
          setStatus('✅ Connection successful! (Entry not found, but API is working)');
        } else {
          throw err;
        }
      }
      
    } catch (err: any) {
      console.error('Connection test failed:', err);
      setError(err.message || 'Unknown error');
      setStatus('❌ Connection failed');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Contentstack Connection Test</h1>
      
      <div style={{ 
        padding: '1rem', 
        background: error ? '#fee' : '#efe', 
        border: `1px solid ${error ? '#fcc' : '#cfc'}`,
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <h3>Status: {status}</h3>
        {error && (
          <div style={{ color: 'red', marginTop: '1rem' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Environment Variables Check</h3>
        <ul>
          <li>API Key: {process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY ? '✅ Set' : '❌ Missing'}</li>
          <li>Delivery Token: {process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN ? '✅ Set' : '❌ Missing'}</li>
          <li>Environment: {process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'preview'}</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Test Details</h3>
        <ul>
          <li><strong>Entry ID:</strong> blt0f6ddaddb7222b8d</li>
          <li><strong>Content Type:</strong> page</li>
          <li><strong>Environment:</strong> preview</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Next Steps</h3>
        <ol>
          <li>If connection is successful, proceed to find your content types</li>
          <li>If connection failed, check your environment variables</li>
          <li>Visit your Contentstack dashboard to find entry IDs</li>
          <li>Try the <a href="/test-assets" style={{ color: '#0070f3' }}>interactive test page</a> for more detailed testing</li>
        </ol>
      </div>
    </div>
  );
} 