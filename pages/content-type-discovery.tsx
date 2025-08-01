import { useState } from 'react';
import contentstack from 'contentstack';

export default function ContentTypeDiscovery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  const discoverContentTypes = async () => {
    setLoading(true);
    setError(null);
    setTestResults({});

    try {
      const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
      const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
      const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'staging';

      if (!apiKey || !deliveryToken) {
        throw new Error('Missing Contentstack environment variables. Please check NEXT_PUBLIC_CONTENTSTACK_API_KEY and NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN.');
      }

      const stack = contentstack.Stack({
        api_key: apiKey,
        delivery_token: deliveryToken,
        environment: environment
      });

      // Common content type names to test
      const commonTypes = [
        'page',
        'article',
        'blog_post',
        'post',
        'content',
        'entry',
        'item',
        'product',
        'service',
        'about',
        'home',
        'landing_page',
        'banner',
        'hero',
        'section',
        'component',
        'block',
        'widget',
        'form',
        'contact'
      ];

      const results: Record<string, string> = {};

      for (const contentType of commonTypes) {
        try {
          const entry = stack.ContentType(contentType).Entry('blt211dac063fd6e948');
          
          await new Promise((resolve, reject) => {
            entry.fetch()
              .then((data: any) => {
                results[contentType] = `✅ Found! Entry has ${Object.keys(data.toJSON()).length} fields`;
                resolve(data);
              })
              .catch((err: any) => {
                results[contentType] = `❌ Not found: ${err?.message || 'Unknown error'}`;
                resolve(null);
              });
          });
        } catch (err: any) {
          results[contentType] = `❌ Error: ${err?.message || 'Unknown error'}`;
        }
      }

      setTestResults(results);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while discovering content types');
    } finally {
      setLoading(false);
    }
  };

  const testSpecificContentType = async (contentType: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
      const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
      const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'staging';

      if (!apiKey || !deliveryToken) {
        throw new Error('Missing Contentstack environment variables');
      }

      const stack = contentstack.Stack({
        api_key: apiKey,
        delivery_token: deliveryToken,
        environment: environment
      });

      const entry = stack.ContentType(contentType).Entry('blt211dac063fd6e948');
      
      const result = await new Promise((resolve, reject) => {
        entry.fetch()
          .then((data: any) => {
            resolve({
              success: true,
              data: data.toJSON(),
              fields: Object.keys(data.toJSON())
            });
          })
          .catch((err: any) => {
            resolve({
              success: false,
              error: err?.message || err?.toString() || 'Unknown error'
            });
          });
      });

      return result;
    } catch (err: any) {
      return { 
        success: false, 
        error: err?.message || err?.toString() || 'Unknown error' 
      };
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1>Content Type Discovery</h1>
      <p>This page will test common content type names to find which one your entry belongs to.</p>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '8px' }}>
        <h3>How to Find Your Content Type</h3>
        <ol>
          <li>Go to your Contentstack Dashboard</li>
          <li>Navigate to <strong>Content Types</strong></li>
          <li>Click on any content type</li>
          <li>Look at the URL - it will show the content type ID</li>
          <li>Or check the content type settings</li>
        </ol>
      </div>

      {loading && (
        <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px' }}>
          <p>Testing common content types...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px', color: '#721c24' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && Object.keys(testResults).length > 0 && (
        <div>
          <h3>Test Results</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {Object.entries(testResults).map(([contentType, result]) => (
              <div key={contentType} style={{ 
                padding: '1rem', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                background: result.includes('✅') ? '#d4edda' : '#f8d7da'
              }}>
                <h4>{contentType}</h4>
                <p>{result}</p>
                {result.includes('✅') && (
                  <button 
                    onClick={async () => {
                      const testResult = await testSpecificContentType(contentType);
                      alert(JSON.stringify(testResult, null, 2));
                    }}
                    style={{ 
                      background: '#0070f3', 
                      color: 'white', 
                      border: 'none', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Test This Content Type
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={discoverContentTypes}
        disabled={loading}
        style={{ 
          background: '#0070f3', 
          color: 'white', 
          border: 'none', 
          padding: '1rem 2rem', 
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem',
          marginTop: '1rem'
        }}
      >
        {loading ? 'Discovering...' : 'Start Content Type Discovery'}
      </button>
    </div>
  );
} 