import React, { useState } from 'react';
import { LaunchDarklyProvider, useLaunchDarkly } from '../components/LaunchDarklyProvider';
import { FeatureFlag, useFeatureFlag } from '../components/FeatureFlag';
import { createUserContext } from '../lib/launchdarkly';

const TestContent = () => {
  const [userKey, setUserKey] = useState('anonymous-user');
  const [userName, setUserName] = useState('Anonymous User');
  const [currentContext, setCurrentContext] = useState(createUserContext('anonymous-user'));

  const { identify, flags, loading, error } = useLaunchDarkly();
  const testFlag = useFeatureFlag('test-flag', false);

  const handleIdentify = () => {
    const newContext = createUserContext(userKey, userName);
    identify(newContext);
    setCurrentContext(newContext);
  };

  if (loading) {
    return <div>Loading LaunchDarkly...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>LaunchDarkly Integration Test</h1>
      
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
        <p><strong>Current Context:</strong> {JSON.stringify(currentContext, null, 2)}</p>
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
        <FeatureFlag flagKey="test-flag" defaultValue={false}>
          <div style={{ padding: '1rem', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px' }}>
            <h3>✅ Test Flag is ENABLED</h3>
            <p>This content is shown because the "test-flag" feature flag is enabled.</p>
          </div>
        </FeatureFlag>
        
        <div style={{ marginTop: '1rem' }}>
          <p><strong>test-flag value:</strong> {testFlag ? 'true' : 'false'}</p>
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
};

export default function TestLaunchDarkly() {
  return (
    <LaunchDarklyProvider>
      <TestContent />
    </LaunchDarklyProvider>
  );
} 