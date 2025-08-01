import React, { useEffect, useState } from 'react';
// @ts-ignore
import * as contentstack from 'contentstack';

export default function ContentTypeList() {
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    discoverContentTypes();
  }, []);

  const discoverContentTypes = async () => {
    try {
      setLoading(true);
      
      const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
      const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
      const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'preview';

      if (!apiKey || !deliveryToken) {
        throw new Error('Missing Contentstack credentials');
      }

      const stack = contentstack.Stack({
        api_key: apiKey,
        delivery_token: deliveryToken,
        environment: environment
      });

      // Try to get content types using the Content Delivery API
      // Note: This might not work with delivery token, but worth trying
      try {
        const contentTypeQuery = stack.ContentType().Query();
        const result = await new Promise((resolve, reject) => {
          contentTypeQuery.toJSON().fetch()
            .then((data: any) => {
              console.log('Content types found:', data);
              resolve(data);
            })
            .catch((err: any) => {
              console.log('Could not fetch content types list:', err);
              resolve(null);
            });
        });

        if (result && result.content_types) {
          const types = result.content_types.map((ct: any) => ct.uid);
          setContentTypes(types);
        }
      } catch (err) {
        console.log('Error fetching content types list:', err);
      }

      // If we couldn't get the list, test with common patterns
      if (contentTypes.length === 0) {
        const commonPatterns = [
          'post', 'posts', 'blog', 'blog_post', 'blog_posts', 'article', 'articles',
          'page', 'pages', 'content', 'contents', 'entry', 'entries', 'item', 'items',
          'document', 'documents', 'story', 'stories', 'news', 'product', 'products',
          'landing_page', 'landing_pages', 'homepage', 'about', 'contact', 'faq',
          'testimonial', 'testimonials', 'team', 'member', 'members', 'service', 'services'
        ];

        const results: any = {};
        
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

        setTestResults(results);
      }
      
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

      const stack = contentstack.Stack({
        api_key: apiKey,
        delivery_token: deliveryToken,
        environment: environment
      });

      const entry = stack.ContentType(contentType).Entry('blt211dac063fd6e948');
      
      const result = await new Promise((resolve) => {
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
      <h1>Content Type Discovery</h1>
      <p>Finding all available content types in your Contentstack.</p>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '8px' }}>
        <h3>Manual Discovery Steps</h3>
        <ol>
          <li>Go to your <strong>Contentstack Dashboard</strong></li>
          <li>Navigate to <strong>Content Types</strong> in the left sidebar</li>
          <li>Look at the list of content types</li>
          <li>Note the exact names (they're case-sensitive)</li>
          <li>Click on any content type to see its details</li>
        </ol>
      </div>

      {loading && (
        <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px' }}>
          <p>Discovering content types...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px', color: '#721c24' }}>
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {contentTypes.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>Available Content Types</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {contentTypes.map((contentType) => (
              <div key={contentType} style={{ 
                padding: '1rem', 
                border: '1px solid #ddd', 
                borderRadius: '8px',
                background: '#d4edda'
              }}>
                <h4>{contentType}</h4>
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
              </div>
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
                background: (result as any).success ? '#d4edda' : '#f8d7da'
              }}>
                <h4>{contentType}</h4>
                <p>{(result as any).success ? 
                  `✅ Success - ${(result as any).fields?.length || 0} fields found` : 
                  `❌ ${(result as any).error}`
                }</p>
                {(result as any).success && (
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
                    View Details
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Next Steps</h3>
        <ol>
          <li>Check your Contentstack dashboard for actual content type names</li>
          <li>Look for any ✅ Success results above</li>
          <li>Click "Test This Content Type" on successful ones</li>
          <li>Update the content type in <code>contentstackAdapter.ts</code></li>
          <li>Try the test again at <code>/test-real-content</code></li>
        </ol>
      </div>
    </div>
  );
} 