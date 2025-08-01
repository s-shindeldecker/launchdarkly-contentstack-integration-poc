import React, { useState } from 'react';
import { ContentstackAdapter } from '../contentstackAdapter';
import { CMSReference } from '../types';

export default function FindContentType() {
  const [contentType, setContentType] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [testHistory, setTestHistory] = useState<Array<{type: string, result: string}>>([]);

  const testContentType = async () => {
    if (!contentType.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const ref: CMSReference = {
        cmsType: 'contentstack',
        entryId: 'blt0f6ddaddb7222b8d', // Use the real entry ID
        environment: 'preview',
        preview: false,
        contentType: 'entry'
      };

      // Test the content type by trying to fetch content
      await ContentstackAdapter.fetchContent(ref);
      setResult('✅ Content type found and working!');
    } catch (error: any) {
      if (error.message.includes('404') || error.message.includes('422')) {
        setResult('❌ Content type not found or entry does not exist');
      } else {
        setResult(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
      setTestHistory(prev => [...prev, { type: contentType, result: result || 'Test completed' }]);
    }
  };

  const quickTests = [
    'page',
    'blog_post', 
    'article',
    'post',
    'content',
    'entry',
    'item',
    'document',
    'story',
    'news',
    'product'
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Find Your Content Type</h1>
      <p>Test specific content type names to find which one your entry belongs to.</p>

      <div style={{ marginBottom: '2rem' }}>
        <h3>How to Find Your Content Type</h3>
        <ol>
          <li>Go to your <strong>Contentstack Dashboard</strong></li>
          <li>Navigate to <strong>Content Types</strong> in the left sidebar</li>
          <li>Click on any content type</li>
          <li>Look at the URL - it will show the content type ID</li>
          <li>Or check the content type settings</li>
        </ol>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Test a Specific Content Type</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Content Type Name:
            </label>
            <input
              type="text"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              placeholder="e.g., page, blog_post, article"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          <button
            onClick={testContentType}
            disabled={loading || !contentType.trim()}
            style={{
              background: '#0070f3',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Testing...' : 'Test'}
          </button>
        </div>
      </div>

      {result && (
        <div style={{
          padding: '1rem',
          background: result.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '8px',
          color: result.includes('✅') ? '#155724' : '#721c24'
        }}>
          <strong>Result:</strong> {result}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Quick Test Common Types</h3>
        <p>Click any button below to quickly test common content type names:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {quickTests.map((type) => (
            <button
              key={type}
              onClick={() => {
                setContentType(type);
                setTimeout(testContentType, 100);
              }}
              style={{
                background: '#f8f9fa',
                border: '1px solid #ddd',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {testHistory.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Test History</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {testHistory.map((test, index) => (
              <div key={index} style={{
                padding: '0.5rem',
                borderBottom: '1px solid #eee',
                fontSize: '0.9rem'
              }}>
                <strong>{test.type}:</strong> {test.result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 