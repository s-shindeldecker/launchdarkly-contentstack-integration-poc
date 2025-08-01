import React, { useState } from 'react';
import { ContentstackAdapter } from '../contentstackAdapter';
import { ContentPreview } from '../components/ContentPreview';
import { CMSReference, PreviewContent } from '../types';

export default function TestAssets() {
  const [entryId, setEntryId] = useState('blt0f6ddaddb7222b8d');
  const [assetId, setAssetId] = useState('');
  const [entryContent, setEntryContent] = useState<PreviewContent | null>(null);
  const [assetContent, setAssetContent] = useState<PreviewContent | null>(null);
  const [loading, setLoading] = useState({ entry: false, asset: false });
  const [error, setError] = useState({ entry: null, asset: null });

  const testEntry = async () => {
    if (!entryId.trim()) return;

    try {
      setLoading(prev => ({ ...prev, entry: true }));
      setError(prev => ({ ...prev, entry: null }));
      setEntryContent(null);
      
      const entryRef: CMSReference = {
        cmsType: 'contentstack',
        entryId: entryId.trim(),
        environment: 'preview',
        preview: false,
        contentType: 'entry'
      };
      
      const entryResult = await ContentstackAdapter.fetchContent(entryRef);
      setEntryContent(entryResult);
    } catch (err: any) {
      console.error('Entry test failed:', err);
      setError(prev => ({ ...prev, entry: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, entry: false }));
    }
  };

  const testAsset = async () => {
    if (!assetId.trim()) return;

    try {
      setLoading(prev => ({ ...prev, asset: true }));
      setError(prev => ({ ...prev, asset: null }));
      setAssetContent(null);
      
      const assetRef: CMSReference = {
        cmsType: 'contentstack',
        entryId: assetId.trim(),
        environment: 'preview',
        preview: false,
        contentType: 'asset'
      };
      
      const assetResult = await ContentstackAdapter.fetchContent(assetRef);
      setAssetContent(assetResult);
    } catch (err: any) {
      console.error('Asset test failed:', err);
      setError(prev => ({ ...prev, asset: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, asset: false }));
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Contentstack Entries & Assets Test</h1>
      <p>Test both entry and asset fetching with your own IDs.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Entry Test */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
          <h2>Entry Test</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Entry ID:
            </label>
            <input
              type="text"
              value={entryId}
              onChange={(e) => setEntryId(e.target.value)}
              placeholder="Enter your entry ID (e.g., blt0f6ddaddb7222b8d)"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                marginBottom: '0.5rem'
              }}
            />
            <button
              onClick={testEntry}
              disabled={loading.entry || !entryId.trim()}
              style={{
                background: '#0070f3',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: loading.entry ? 'not-allowed' : 'pointer',
                opacity: loading.entry ? 0.6 : 1
              }}
            >
              {loading.entry ? 'Testing...' : 'Test Entry'}
            </button>
          </div>
          
          {loading.entry && (
            <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
              <p>Loading entry...</p>
            </div>
          )}
          
          {error.entry && (
            <div style={{ padding: '1rem', background: '#f8d7da', borderRadius: '8px', color: '#721c24' }}>
              <h3>Error</h3>
              <p>{error.entry}</p>
            </div>
          )}
          
          {entryContent && (
            <div>
              <h3>✅ Entry Content Retrieved!</h3>
              <ContentPreview content={entryContent} />
            </div>
          )}
        </div>

        {/* Asset Test */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
          <h2>Asset Test</h2>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Asset UID:
            </label>
            <input
              type="text"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              placeholder="Enter your asset UID (e.g., blt211dac063fd6e948)"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                marginBottom: '0.5rem'
              }}
            />
            <button
              onClick={testAsset}
              disabled={loading.asset || !assetId.trim()}
              style={{
                background: '#0070f3',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: loading.asset ? 'not-allowed' : 'pointer',
                opacity: loading.asset ? 0.6 : 1
              }}
            >
              {loading.asset ? 'Testing...' : 'Test Asset'}
            </button>
          </div>
          
          {loading.asset && (
            <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
              <p>Loading asset...</p>
            </div>
          )}
          
          {error.asset && (
            <div style={{ padding: '1rem', background: '#f8d7da', borderRadius: '8px', color: '#721c24' }}>
              <h3>Error</h3>
              <p>{error.asset}</p>
            </div>
          )}
          
          {assetContent && (
            <div>
              <h3>✅ Asset Content Retrieved!</h3>
              <ContentPreview content={assetContent} />
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '8px' }}>
        <h3>How to Find Your IDs</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4>📄 Entry IDs</h4>
            <ol>
              <li>Go to your <strong>Contentstack Dashboard</strong></li>
              <li>Navigate to <strong>Content</strong> in the left sidebar</li>
              <li>Click on your <strong>Page</strong> entry</li>
              <li>Look at the URL - it will show the entry ID</li>
              <li>Or check the entry details for the UID</li>
            </ol>
          </div>
          <div>
            <h4>🖼️ Asset UIDs</h4>
            <ol>
              <li>Go to your <strong>Contentstack Dashboard</strong></li>
              <li>Navigate to <strong>Assets</strong> in the left sidebar</li>
              <li>Click on any image or file</li>
              <li>Look at the URL - it will show the asset UID</li>
              <li>Or check the asset details for the UID</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 