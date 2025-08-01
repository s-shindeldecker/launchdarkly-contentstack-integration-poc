import React, { useEffect, useState } from 'react';
// @ts-ignore
import * as contentstack from 'contentstack';

export default function DebugConnection() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [step, setStep] = useState(0);

  useEffect(() => {
    runDebugTests();
  }, []);

  const runDebugTests = async () => {
    const info: any = {};
    
    // Step 1: Check environment variables
    setStep(1);
    info.envVars = {
      apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY ? 'Set' : 'Missing',
      deliveryToken: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN ? 'Set' : 'Missing',
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'staging',
      apiKeyLength: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY?.length || 0,
      deliveryTokenLength: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN?.length || 0
    };

    // Step 2: Test Contentstack SDK initialization
    setStep(2);
    try {
      const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
      const deliveryToken = process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN;
      const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || 'staging';

      info.sdkInit = {
        apiKey: apiKey ? 'Present' : 'Missing',
        deliveryToken: deliveryToken ? 'Present' : 'Missing',
        environment: environment
      };

      if (!apiKey || !deliveryToken) {
        throw new Error('Missing required credentials');
      }

      const stack = contentstack.Stack({
        api_key: apiKey,
        delivery_token: deliveryToken,
        environment: environment
      });

      info.stackCreated = 'Success';
      info.stackConfig = {
        api_key: apiKey.substring(0, 10) + '...',
        delivery_token: deliveryToken.substring(0, 10) + '...',
        environment: environment
      };

      // Step 3: Test content type access
      setStep(3);
      try {
        const contentType = stack.ContentType('test-content-type');
        info.contentTypeCreated = 'Success';
        
        // Step 4: Test entry creation
        setStep(4);
        const entry = contentType.Entry('test-entry-id');
        info.entryCreated = 'Success';

        // Step 5: Test fetch (this will likely fail, but we'll catch the error)
        setStep(5);
        try {
          await new Promise((resolve, reject) => {
            entry.fetch()
              .then((result: any) => {
                info.fetchSuccess = 'Unexpected success';
                resolve(result);
              })
              .catch((error: any) => {
                info.fetchError = {
                  message: error.message,
                  type: error.constructor.name,
                  stack: error.stack?.split('\n').slice(0, 3).join('\n')
                };
                resolve(null);
              });
          });
        } catch (fetchError: any) {
          info.fetchError = {
            message: fetchError.message,
            type: fetchError.constructor.name
          };
        }

      } catch (contentTypeError: any) {
        info.contentTypeError = {
          message: contentTypeError.message,
          type: contentTypeError.constructor.name
        };
      }

    } catch (sdkError: any) {
      info.sdkError = {
        message: sdkError.message,
        type: sdkError.constructor.name
      };
    }

    setDebugInfo(info);
    setStep(6);
  };

  const renderStep = (stepNumber: number, title: string, content: React.ReactNode) => (
    <div style={{ 
      marginBottom: '1rem', 
      padding: '1rem', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      background: step >= stepNumber ? '#f8f9fa' : '#fff'
    }}>
      <h4>Step {stepNumber}: {title}</h4>
      {content}
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h1>Contentstack Connection Debug</h1>
      
      {renderStep(1, 'Environment Variables', (
        <div>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
            {JSON.stringify(debugInfo.envVars, null, 2)}
          </pre>
        </div>
      ))}

      {renderStep(2, 'SDK Initialization', (
        <div>
          {debugInfo.sdkError ? (
            <div style={{ color: 'red' }}>
              <strong>Error:</strong> {debugInfo.sdkError.message}
            </div>
          ) : (
            <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
              {JSON.stringify(debugInfo.sdkInit, null, 2)}
            </pre>
          )}
        </div>
      ))}

      {renderStep(3, 'Content Type Creation', (
        <div>
          {debugInfo.contentTypeError ? (
            <div style={{ color: 'red' }}>
              <strong>Error:</strong> {debugInfo.contentTypeError.message}
            </div>
          ) : (
            <div style={{ color: 'green' }}>✅ Content type created successfully</div>
          )}
        </div>
      ))}

      {renderStep(4, 'Entry Creation', (
        <div>
          {debugInfo.entryCreated ? (
            <div style={{ color: 'green' }}>✅ Entry created successfully</div>
          ) : (
            <div style={{ color: 'red' }}>❌ Entry creation failed</div>
          )}
        </div>
      ))}

      {renderStep(5, 'Fetch Test', (
        <div>
          {debugInfo.fetchError ? (
            <div>
              <div style={{ color: 'orange' }}>
                <strong>Expected Error:</strong> {debugInfo.fetchError.message}
              </div>
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                This is expected since we're using test IDs. The important thing is that the API call was made.
              </div>
            </div>
          ) : debugInfo.fetchSuccess ? (
            <div style={{ color: 'green' }}>✅ Fetch successful (unexpected)</div>
          ) : (
            <div style={{ color: 'gray' }}>⏳ Testing...</div>
          )}
        </div>
      ))}

      {renderStep(6, 'Summary', (
        <div>
          <h4>Debug Results:</h4>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', maxHeight: '400px', overflow: 'auto' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      ))}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '8px' }}>
        <h3>What This Tells Us</h3>
        <ul>
          <li>If Step 1 fails: Environment variables aren't being read correctly</li>
          <li>If Step 2 fails: There's an issue with the Contentstack SDK or credentials</li>
          <li>If Step 3 fails: The content type ID might be wrong</li>
          <li>If Step 4 fails: There's an issue with the entry ID format</li>
          <li>If Step 5 shows an error: The API is working, we just need real IDs</li>
        </ul>
      </div>
    </div>
  );
} 