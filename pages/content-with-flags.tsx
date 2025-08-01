import React, { useState, useEffect } from 'react';
import { initialize, LDContext } from 'launchdarkly-react-client-sdk';
import { ContentstackAdapter } from '../contentstackAdapter';
import { ContentPreview } from '../components/ContentPreview';
import { CMSReference, PreviewContent } from '../types';

export default function ContentWithFlags() {
  const [client, setClient] = useState<any>(null);
  const [flags, setFlags] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userKey, setUserKey] = useState('anonymous-user');
  const [userName, setUserName] = useState('Anonymous User');
  
  // Content states
  const [primaryContent, setPrimaryContent] = useState<PreviewContent | null>(null);
  const [alternativeContent, setAlternativeContent] = useState<PreviewContent | null>(null);
  const [contentLoading, setContentLoading] = useState(false);

  // Initialize LaunchDarkly client
  useEffect(() => {
    const initClient = async () => {
      try {
        setLoading(true);
        setError(null);

        const clientSideID = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID;
        if (!clientSideID) {
          throw new Error('LaunchDarkly client ID is not configured');
        }

        const userContext: LDContext = {
          kind: 'user',
          key: userKey,
          name: userName,
        };

        const ldClient = initialize(clientSideID, userContext, {
          bootstrap: 'localStorage',
        });

        await ldClient.waitForInitialization(10000);
        const allFlags = ldClient.allFlags();
        setFlags(allFlags);
        setClient(ldClient);
      } catch (err) {
        console.error('Failed to initialize LaunchDarkly client:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize LaunchDarkly');
      } finally {
        setLoading(false);
      }
    };

    initClient();

    return () => {
      if (client) {
        try {
          client.close();
        } catch (err) {
          console.error('Error closing LaunchDarkly client:', err);
        }
      }
    };
  }, []);

  // Load content based on flags
  useEffect(() => {
    const loadContent = async () => {
      if (!flags) return;

      setContentLoading(true);
      try {
        // Primary content (default)
        const primaryRef: CMSReference = {
          cmsType: 'contentstack',
          entryId: 'blt0f6ddaddb7222b8d', // Your main content entry
          environment: 'preview',
          preview: false,
          contentType: 'entry'
        };

        // Alternative content (when flag is enabled)
        const alternativeRef: CMSReference = {
          cmsType: 'contentstack',
          entryId: 'bltb637c1254dbf0131', // You can use a different entry ID here
          environment: 'preview',
          preview: false,
          contentType: 'entry'
        };

        // Load primary content first (this should always work)
        let primary: PreviewContent;
        try {
          primary = await ContentstackAdapter.fetchContent(primaryRef);
          setPrimaryContent(primary);
        } catch (err) {
          console.error('Failed to load primary content:', err);
          setError('Failed to load primary content from Contentstack');
          setContentLoading(false);
          return;
        }

        // Try to load alternative content, but don't fail if it doesn't work
        let alternative: PreviewContent | null = null;
        try {
          alternative = await ContentstackAdapter.fetchContent(alternativeRef);
          setAlternativeContent(alternative);
        } catch (err) {
          console.error('Failed to load alternative content:', err);
          console.log('Will fall back to primary content for alternative variation');
          setAlternativeContent(null); // This will trigger fallback to primary content
        }

      } catch (err) {
        console.error('Failed to load content:', err);
        setError('Failed to load content from Contentstack');
      } finally {
        setContentLoading(false);
      }
    };

    loadContent();
  }, [flags]);

  const handleIdentify = async () => {
    if (!client) return;

    try {
      const newContext: LDContext = {
        kind: 'user',
        key: userKey,
        name: userName,
      };

      // Identify the new user
      client.identify(newContext);
      
      // Wait a moment for the client to process the new context
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get updated flags
      const allFlags = client.allFlags();
      setFlags(allFlags);
      
      // Force content reload with new flags
      setContentLoading(true);
      try {
        // Primary content (default)
        const primaryRef: CMSReference = {
          cmsType: 'contentstack',
          entryId: 'blt0f6ddaddb7222b8d', // Your main content entry
          environment: 'preview',
          preview: false,
          contentType: 'entry'
        };

        // Alternative content (when flag is enabled)
        const alternativeRef: CMSReference = {
          cmsType: 'contentstack',
          entryId: 'bltb637c1254dbf0131', // You can use a different entry ID here
          environment: 'preview',
          preview: false,
          contentType: 'entry'
        };

        // Load primary content first (this should always work)
        let primary: PreviewContent;
        try {
          primary = await ContentstackAdapter.fetchContent(primaryRef);
          setPrimaryContent(primary);
        } catch (err) {
          console.error('Failed to load primary content:', err);
          setError('Failed to load primary content from Contentstack');
          setContentLoading(false);
          return;
        }

        // Try to load alternative content, but don't fail if it doesn't work
        let alternative: PreviewContent | null = null;
        try {
          alternative = await ContentstackAdapter.fetchContent(alternativeRef);
          setAlternativeContent(alternative);
        } catch (err) {
          console.error('Failed to load alternative content:', err);
          console.log('Will fall back to primary content for alternative variation');
          setAlternativeContent(null); // This will trigger fallback to primary content
        }

      } catch (err) {
        console.error('Failed to load content:', err);
        setError('Failed to load content from Contentstack');
      } finally {
        setContentLoading(false);
      }
      
    } catch (err) {
      console.error('Error identifying user:', err);
    }
  };

  if (loading) {
    return <div>Loading LaunchDarkly...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const showAlternativeContent = flags['content-variation'] === true;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1>Content with Feature Flags</h1>
      <p>This page demonstrates how LaunchDarkly flags can control Contentstack content variations.</p>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>User Context</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={userKey}
            onChange={(e) => setUserKey(e.target.value)}
            placeholder="User Key"
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="User Name"
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <button
            onClick={handleIdentify}
            style={{
              background: '#0070f3',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Identify User
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Feature Flag Status</h2>
        <div style={{ 
          padding: '1rem', 
          background: showAlternativeContent ? '#d4edda' : '#f8d7da', 
          border: `1px solid ${showAlternativeContent ? '#c3e6cb' : '#f5c6cb'}`, 
          borderRadius: '8px' 
        }}>
          <h3>Content Variation Flag: {showAlternativeContent ? '✅ ENABLED' : '❌ DISABLED'}</h3>
          <p>
            {showAlternativeContent 
              ? 'Showing alternative content variation' 
              : 'Showing default content'
            }
          </p>
          <p><strong>Flag value:</strong> {flags['content-variation'] ? 'true' : 'false'}</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Content Display</h2>
        {contentLoading ? (
          <div>Loading content...</div>
        ) : (
          <div>
            {showAlternativeContent ? (
              <div>
                <h3>🎯 Alternative Content (Flag Enabled)</h3>
                {alternativeContent ? (
                  <ContentPreview content={alternativeContent} />
                ) : (
                  <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px' }}>
                    <p>Alternative content not available. Using primary content instead.</p>
                    {primaryContent && <ContentPreview content={primaryContent} />}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3>📄 Default Content (Flag Disabled)</h3>
                {primaryContent && <ContentPreview content={primaryContent} />}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '8px' }}>
        <h3>How to Test</h3>
        <ol>
          <li>Create a feature flag called "content-variation" in your LaunchDarkly dashboard</li>
          <li>Set it to "on" for some users or environments</li>
          <li>Refresh this page to see different content</li>
          <li>Try changing the user context to see different flag values</li>
          <li>You can create different Contentstack entries for truly different content</li>
        </ol>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Debug Information</h3>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Contentstack Entry IDs</h4>
          <ul>
            <li><strong>Primary Content:</strong> blt0f6ddaddb7222b8d</li>
            <li><strong>Alternative Content:</strong> bltb637c1254dbf0131</li>
          </ul>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            To see different content, update the alternative entry ID in the code.
          </p>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <h4>Content Status</h4>
          <ul>
            <li><strong>Primary Content:</strong> {primaryContent ? '✅ Loaded' : '❌ Failed'}</li>
            <li><strong>Alternative Content:</strong> {alternativeContent ? '✅ Loaded' : '❌ Failed (will fallback to primary)'}</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>All Flags</h3>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
          {JSON.stringify(flags, null, 2)}
        </pre>
      </div>
    </div>
  );
} 