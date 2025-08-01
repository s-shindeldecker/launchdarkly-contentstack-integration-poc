import React, { useState, useEffect } from 'react';
import { initialize, LDContext } from 'launchdarkly-react-client-sdk';

export default function TestLaunchDarklySimple() {
  const [client, setClient] = useState<any>(null);
  const [flags, setFlags] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userKey, setUserKey] = useState('anonymous-user');
  const [userName, setUserName] = useState('Anonymous User');

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

        // Initialize LaunchDarkly client
        const ldClient = initialize(clientSideID, userContext, {
          bootstrap: 'localStorage',
        });

        // Wait for client to be ready with timeout
        await ldClient.waitForInitialization(10000);

        // Get initial flags
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

    // Cleanup on unmount
    return () => {
      if (client) {
        try {
          client.close();
        } catch (err) {
          console.error('Error closing LaunchDarkly client:', err);
        }
      }
    };
  }, []); // Only run once on mount

  const handleIdentify = async () => {
    if (!client) return;

    try {
      const newContext: LDContext = {
        kind: 'user',
        key: userKey,
        name: userName,
      };

      client.identify(newContext);
      
      // Get updated flags
      const allFlags = client.allFlags();
      setFlags(allFlags);
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>LaunchDarkly Integration Test (Simple)</h1>
      
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
        <h2>Feature Flags</h2>
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
          <h3>All Flags</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
            {JSON.stringify(flags, null, 2)}
          </pre>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Feature Flag Test</h2>
        {flags['test-flag'] ? (
          <div style={{ padding: '1rem', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px' }}>
            <h3>✅ Test Flag is ENABLED</h3>
            <p>This content is shown because the "test-flag" feature flag is enabled.</p>
          </div>
        ) : (
          <div style={{ padding: '1rem', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px' }}>
            <h3>❌ Test Flag is DISABLED</h3>
            <p>This content is shown because the "test-flag" feature flag is disabled.</p>
          </div>
        )}
        
        <div style={{ marginTop: '1rem' }}>
          <p><strong>test-flag value:</strong> {flags['test-flag'] ? 'true' : 'false'}</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '8px' }}>
        <h3>Next Steps</h3>
        <ol>
          <li>Create a feature flag called "test-flag" in your LaunchDarkly dashboard</li>
          <li>Set it to "on" for some users or environments</li>
          <li>Refresh this page to see the flag in action</li>
          <li>Try changing the user context to see different flag values</li>
        </ol>
      </div>
    </div>
  );
} 