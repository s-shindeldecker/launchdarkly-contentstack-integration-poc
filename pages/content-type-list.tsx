import { useState } from 'react';
import contentstack from 'contentstack';

interface TestResult {
  success: boolean;
  data?: any;
  fields?: string[];
  error?: string;
}

export default function ContentTypeList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});

  const discoverContentTypes = async () => {
    setLoading(true);
    setError(null);
    setContentTypes([]);
    setTestResults({});

    try {
      const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
      const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
      const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'preview';

      if (!apiKey || !deliveryToken) {
        throw new Error('Missing Contentstack environment variables. Please check NEXT_PUBLIC_CONTENTSTACK_API_KEY and NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN.');
      }

      const stack = contentstack.Stack({
        api_key: apiKey,
        delivery_token: deliveryToken,
        environment: environment
      });

      // Test with common patterns since Content Delivery API might not support listing content types
      const commonPatterns = [
        'post', 'posts', 'blog', 'blog_post', 'blog_posts', 'article', 'articles',
        'page', 'pages', 'content', 'contents', 'entry', 'entries', 'item', 'items',
        'document', 'documents', 'story', 'stories', 'news', 'product', 'products',
        'landing_page', 'landing_pages', 'homepage', 'about', 'contact', 'faq',
        'testimonial', 'testimonials', 'team', 'member', 'members', 'service', 'services'
      ];

      const results: Record<string, TestResult> = {};
      const foundTypes: string[] = [];
      
      for (const contentType of commonPatterns) {
        try {
          const entry = stack.ContentType(contentType).Entry('blt211dac063fd6e948');
          await new Promise((resolve) => {
            entry.fetch()
              .then((data: any) => {
                results[contentType] = {
                  success: true,
                  data: data.toJSON(),
                  fields: Object.keys(data.toJSON())
                };
                foundTypes.push(contentType);
                resolve(null);
              })
              .catch((err: any) => {
                const errorStr = err?.toString() || 'Unknown error';
                if (errorStr.includes('422')) {
                  results[contentType] = { success: false, error: 'Content type not found' };
                } else if (errorStr.includes('404')) {
                  results[contentType] = { success: false, error: 'Entry not found' };
                } else {
                  results[contentType] = { success: false, error: errorStr };
                }
                resolve(null);
              });
          });
        } catch (err: any) {
          results[contentType] = { 
            success: false, 
            error: err?.message || 'Unknown error' 
          };
        }
      }

      setContentTypes(foundTypes);
      setTestResults(results);
      
    } catch (err: any) {
      setError(err?.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testSpecificContentType = async (contentType: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
      const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
      const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'preview';

      if (!apiKey || !deliveryToken) {
        throw new Error('Missing Contentstack environment variables');
      }

      const stack = contentstack.Stack({
        api_key: apiKey,
        delivery_token: deliveryToken,
        environment: environment
      });

      const entry = stack.ContentType(contentType).Entry('blt211dac063fd6e948');
      
      const result = await new Promise<TestResult>((resolve) => {
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Content Type List</h1>
      <p>This page will test common content type patterns to find which ones exist in your Contentstack stack.</p>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '8px' }}>
        <h3>How This Works</h3>
        <ol>
          <li>Tests common content type names against your stack</li>
          <li>Shows which content types exist and which don't</li>
          <li>For existing content types, shows the fields available</li>
          <li>Helps you identify the correct content type for your entries</li>
        </ol>
      </div>

      {loading && (
        <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px' }}>
          <p>Testing content types...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px', color: '#721c24' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {!loading && contentTypes.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Found Content Types ({contentTypes.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {contentTypes.map((type) => (
              <span key={type} style={{ 
                background: '#d4edda', 
                color: '#155724', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}>
                {type}
              </span>
            ))}
          </div>
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
                background: result.success ? '#d4edda' : '#f8d7da'
              }}>
                <h4>{contentType}</h4>
                {result.success ? (
                  <div>
                    <p style={{ color: '#155724' }}>✅ Content type exists</p>
                    <p><strong>Fields:</strong> {result.fields?.length || 0}</p>
                    {result.fields && (
                      <details>
                        <summary>View Fields</summary>
                        <ul style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                          {result.fields.map((field: string) => (
                            <li key={field}>{field}</li>
                          ))}
                        </ul>
                      </details>
                    )}
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
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                      }}
                    >
                      Test This Content Type
                    </button>
                  </div>
                ) : (
                  <p style={{ color: '#721c24' }}>❌ {result.error}</p>
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
        {loading ? 'Testing...' : 'Start Content Type Discovery'}
      </button>
    </div>
  );
} 