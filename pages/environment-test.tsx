import React, { useEffect, useState } from 'react';
// @ts-ignore
import * as contentstack from 'contentstack';

export default function EnvironmentTest() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testEnvironments();
  }, []);

  const testEnvironments = async () => {
    const environments = ['preview', 'staging', 'development', 'production'];
    const contentTypes = ['blog_post', 'article', 'page'];
    const results: any = {};

    for (const env of environments) {
      results[env] = {};
      
      for (const contentType of contentTypes) {
        try {
          const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
          const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;

          if (!apiKey || !deliveryToken) {
            results[env][contentType] = 'Missing credentials';
            continue;
          }

          const stack = contentstack.Stack({
            api_key: apiKey,
            delivery_token: deliveryToken,
            environment: env
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
                // Get detailed error information
                let errorDetails = {
                  message: 'Unknown error',
                  status: 'Unknown',
                  url: 'Unknown'
                };

                if (err && typeof err === 'object') {
                  if (err.message) errorDetails.message = err.message;
                  if (err.status) errorDetails.status = err.status;
                  if (err.url) errorDetails.url = err.url;
                  
                  // Try to extract more info from the error
                  if (err.toString) {
                    const errorStr = err.toString();
                    if (errorStr.includes('422')) errorDetails.status = '422';
                    if (errorStr.includes('404')) errorDetails.status = '404';
                    if (errorStr.includes('401')) errorDetails.status = '401';
                  }
                }

                resolve({
                  success: false,
                  error: errorDetails
                });
              });
          });

          results[env][contentType] = result;

        } catch (err: any) {
          results[env][contentType] = {
            success: false,
            error: {
              message: err?.message || 'Unknown error',
              status: 'Exception',
              url: 'N/A'
            }
          };
        }
      }
    }

    setResults(results);
    setLoading(false);
  };

  const renderResult = (result: any) => {
    if (typeof result === 'string') {
      return <span style={{ color: 'red' }}>{result}</span>;
    }

    if (result.success) {
      return (
        <div style={{ color: 'green' }}>
          ✅ Success - {result.fields?.length || 0} fields found
        </div>
      );
    } else {
      return (
        <div style={{ color: 'red' }}>
          ❌ {result.error.status || 'Error'}: {result.error.message}
        </div>
      );
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Environment & Content Type Test</h1>
      <p>Testing different environments and content types to find the right combination.</p>
      
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '8px' }}>
        <h3>What This Tests</h3>
        <ul>
          <li>Different environments: preview, staging, development, production</li>
          <li>Common content types: blog_post, article, page</li>
          <li>Your entry ID: blt211dac063fd6e948</li>
          <li>Detailed error information for debugging</li>
        </ul>
      </div>

      {loading && (
        <div style={{ padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px' }}>
          <p>Testing environments and content types...</p>
        </div>
      )}

      {!loading && Object.keys(results).length > 0 && (
        <div>
          <h3>Test Results</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Environment</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>blog_post</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>article</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd' }}>page</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(results).map(([env, contentTypes]) => (
                <tr key={env}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>
                    {env}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {renderResult((contentTypes as any).blog_post)}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {renderResult((contentTypes as any).article)}
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    {renderResult((contentTypes as any).page)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Next Steps</h3>
        <ol>
          <li>Look for any ✅ Success results</li>
          <li>If all show errors, check your Contentstack dashboard for:</li>
          <ul>
            <li>Available environments</li>
            <li>Content type names</li>
            <li>Entry ID validity</li>
          </ul>
          <li>Update the environment and content type in the adapter based on successful results</li>
        </ol>
      </div>
    </div>
  );
} 