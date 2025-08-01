import React, { useState, useEffect } from 'react';
import { initialize, LDContext } from 'launchdarkly-react-client-sdk';
import { ContentstackAdapter } from '../contentstackAdapter';
import { ContentPreview } from '../components/ContentPreview';
import { CMSReference, PreviewContent } from '../types';

interface ContentConfig {
  entryId: string;
  contentType: 'entry' | 'asset';
  environment?: string;
  preview?: boolean;
}

export default function ContentJsonFlags() {
  const [client, setClient] = useState<any>(null);
  const [flags, setFlags] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Content states
  const [content, setContent] = useState<PreviewContent | null>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<ContentConfig | null>(null);

  // User context state
  const [userKey, setUserKey] = useState('anonymous-test-user');
  const [userName, setUserName] = useState('Anonymous Test User');
  const [isIdentifying, setIsIdentifying] = useState(false);

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

        // Anonymous user for testing
        const userContext: LDContext = {
          kind: 'user',
          key: userKey,
          name: userName,
        };

        // Initialize client
        const ldClient = initialize(clientSideID, userContext, {
          bootstrap: 'localStorage',
        });

        // Wait for initialization
        await ldClient.waitForInitialization(10000);
        
        // Get initial flags
        const initialFlags = ldClient.allFlags();
        setFlags(initialFlags);

        // Set up flag change listener
        ldClient.on('change', (changes) => {
          console.log('🚨 Flag change event received:', changes);
          console.log('🚨 Changes object:', JSON.stringify(changes, null, 2));
          
          // Check if content-config flag is in the changes
          if (changes['content-config'] !== undefined) {
            console.log('🎯 content-config flag changed to:', changes['content-config']);
          }
          
          // Add a longer delay to ensure flag value is fully updated
          setTimeout(() => {
            // Get fresh flags from client to ensure we have the latest values
            const freshFlags = ldClient.allFlags();
            console.log('🔄 Fresh flags from client:', freshFlags);
            
            setFlags(freshFlags);
          }, 300);
        });

        setClient(ldClient);
      } catch (err) {
        console.error('Failed to initialize LaunchDarkly client:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize LaunchDarkly');
      } finally {
        setLoading(false);
      }
    };

    initClient();

    // Cleanup
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

  // Handle user context change
  const handleIdentify = async () => {
    if (!client) return;

    try {
      setIsIdentifying(true);
      console.log('🔄 Identifying user with new context...');

      const newContext: LDContext = {
        kind: 'user',
        key: userKey,
        name: userName,
      };

      console.log('👤 New user context:', newContext);

      // Identify with new context
      await client.identify(newContext);
      
      // Wait a moment for flags to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get updated flags
      const updatedFlags = client.allFlags();
      console.log('🔄 Flags after identify:', updatedFlags);
      setFlags(updatedFlags);

      console.log('✅ User context updated successfully');
    } catch (err) {
      console.error('❌ Failed to identify user:', err);
      setError('Failed to update user context');
    } finally {
      setIsIdentifying(false);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    if (!client) return;

    try {
      console.log('🔄 Manual refresh triggered...');
      
      // Get current flags
      const currentFlags = client.allFlags();
      console.log('📊 Current flags:', currentFlags);
      setFlags(currentFlags);
      
      console.log('✅ Manual refresh completed');
    } catch (err) {
      console.error('❌ Failed to refresh flags:', err);
      setError('Failed to refresh flags');
    }
  };

  // Load content when flags change
  useEffect(() => {
    const loadContent = async () => {
      if (!flags || Object.keys(flags).length === 0) return;

      console.log('🔄 Content loading triggered');
      console.log('📊 Current flags state:', flags);
      
      // Get content configuration from JSON flag
      const contentFlag = flags['content-config'];
      console.log('🎯 Content config flag:', contentFlag);

      if (!contentFlag) {
        console.log('❌ No content-config flag found');
        // Don't set error here, just return - this might be temporary during flag changes
        return;
      }

      // Additional validation for flag value
      if (contentFlag === null || contentFlag === undefined) {
        console.log('❌ Content flag is null or undefined');
        return;
      }

      let config: ContentConfig;
      try {
        // Parse JSON flag value
        if (typeof contentFlag === 'string') {
          // Check if it's a valid JSON string
          if (contentFlag.trim() === '') {
            console.log('❌ Content flag is empty string');
            return;
          }
          config = JSON.parse(contentFlag);
        } else {
          config = contentFlag;
        }
        console.log('📋 Parsed content config:', config);
      } catch (err) {
        console.error('❌ Failed to parse content config:', err);
        console.error('❌ Raw flag value:', contentFlag);
        console.error('❌ Flag type:', typeof contentFlag);
        // Don't set error immediately - this might be a temporary parsing issue during flag changes
        console.log('⚠️ Skipping content load due to parsing error');
        return;
      }

      // Validate config
      if (!config.entryId) {
        console.error('❌ Missing entryId in content config');
        console.error('❌ Config object:', config);
        // Don't set error immediately - this might be a temporary validation issue during flag changes
        console.log('⚠️ Skipping content load due to missing entryId');
        return;
      }

      setContentLoading(true);
      setCurrentConfig(config);

      try {
        // Create CMS reference from config
        const contentRef: CMSReference = {
          cmsType: 'contentstack',
          entryId: config.entryId,
          environment: config.environment || 'preview',
          preview: config.preview || false,
          contentType: config.contentType || 'entry'
        };

        console.log('📥 Loading content from Contentstack...');
        console.log('📄 Content ref:', contentRef);

        // Load content
        const loadedContent = await ContentstackAdapter.fetchContent(contentRef);
        console.log('✅ Content loaded successfully:', loadedContent ? 'Success' : 'Failed');

        setContent(loadedContent);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('❌ Failed to load content:', err);
        setError('Failed to load content from Contentstack');
      } finally {
        setContentLoading(false);
        console.log('🏁 Content loading completed');
      }
    };

    // Add a small delay to handle rapid flag changes
    const timeoutId = setTimeout(loadContent, 50);
    
    return () => clearTimeout(timeoutId);
  }, [flags]);

  if (loading) {
    return <div>Loading LaunchDarkly...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1>Content with JSON Flags</h1>
      <p>Dynamic content loading using JSON flags to specify Contentstack content references.</p>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '8px' }}>
        <h3>🎯 How to Test</h3>
        <ol>
          <li>Create a JSON flag called "content-config" in LaunchDarkly</li>
          <li>Set the flag value to a JSON object with content information</li>
          <li>Example: <code>{'{"entryId": "blt0f6ddaddb7222b8d", "contentType": "entry"}'}</code></li>
          <li>Change the flag value to point to different content</li>
          <li>Watch the content change automatically!</li>
        </ol>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px' }}>
        <h3>👤 User Context Testing</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              User Key:
            </label>
            <input
              type="text"
              value={userKey}
              onChange={(e) => setUserKey(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Enter user key"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              User Name:
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Enter user name"
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleIdentify}
            disabled={isIdentifying}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isIdentifying ? 'not-allowed' : 'pointer',
              opacity: isIdentifying ? 0.6 : 1
            }}
          >
            {isIdentifying ? '🔄 Updating...' : '🔄 Update User Context'}
          </button>
          <button
            onClick={handleRefresh}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Manual Refresh
          </button>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          <strong>Current User:</strong> {userKey} ({userName})
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Content Configuration</h2>
        <div style={{ 
          padding: '1rem', 
          background: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '8px' 
        }}>
          <h3>Current Content Config</h3>
          {currentConfig ? (
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
              {JSON.stringify(currentConfig, null, 2)}
            </pre>
          ) : (
            <p>No content configuration loaded</p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Content Display</h2>
        {contentLoading ? (
          <div>Loading content...</div>
        ) : content ? (
          <div>
            <h3>📄 Dynamic Content</h3>
            <ContentPreview content={content} />
          </div>
        ) : (
          <div style={{ padding: '1rem', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px' }}>
            <h3>❌ No Content Available</h3>
            <p>No content configuration found or content failed to load.</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Debug Information</h3>
        <div style={{ marginBottom: '1rem' }}>
          <h4>LaunchDarkly Configuration</h4>
          <ul>
            <li><strong>User Key:</strong> {userKey}</li>
            <li><strong>User Name:</strong> {userName}</li>
            <li><strong>Flag Name:</strong> content-config</li>
            <li><strong>Flag Type:</strong> JSON</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <h4>Content Status</h4>
          <ul>
            <li><strong>Content Loaded:</strong> {content ? '✅ Yes' : '❌ No'}</li>
            <li><strong>Content Loading:</strong> {contentLoading ? '🔄 Yes' : '❌ No'}</li>
            <li><strong>Config Available:</strong> {currentConfig ? '✅ Yes' : '❌ No'}</li>
            <li><strong>Identifying:</strong> {isIdentifying ? '🔄 Yes' : '❌ No'}</li>
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