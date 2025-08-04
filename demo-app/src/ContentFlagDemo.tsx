import React, { useState, useEffect } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

type PreviewContent = {
  title?: string;
  summary?: string;
  imageUrl?: string;
  html?: string;
  structuredData?: any;
};

const PREVIEW_ENDPOINT = 'https://launchdarkly-contentstack-integrati-flax.vercel.app/api/flagPreview';

export default function ContentFlagDemo() {
  const [content, setContent] = useState<PreviewContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Use real LaunchDarkly flags
  const flags = useFlags();
  const contentConfig = flags['content-config'];

  const fetchContent = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if we have a valid CMSReference from LaunchDarkly
      if (!contentConfig || typeof contentConfig !== 'object') {
        setError('No valid content-config flag found in LaunchDarkly. Please create a JSON flag named "content-config" with CMSReference variations.');
        setLoading(false);
        return;
      }

      // Validate that it's a proper CMSReference
      if (!contentConfig.cmsType || !contentConfig.entryId || !contentConfig.environment) {
        setError('Invalid CMSReference in LaunchDarkly flag. Expected: { cmsType: "contentstack", entryId: "...", environment: "..." }');
        setLoading(false);
        return;
      }

      console.log('🎯 Fetching content from LaunchDarkly flag:', contentConfig);
      
      const res = await fetch(PREVIEW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          variation: { value: contentConfig }
        })
      });

      const data = await res.json();

      if (res.ok) {
        setContent(data.preview);
        setLastUpdated(new Date());
        console.log('✅ Content loaded successfully:', data.preview);
      } else {
        setError(data.error || data.detail || 'Failed to fetch content');
        console.error('❌ API Error:', data);
      }
    } catch (e: any) {
      setError(e.message);
      console.error('💥 Network Error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh content when flag changes or every 30 seconds
  useEffect(() => {
    if (contentConfig) {
      fetchContent();
    }
    
    const interval = setInterval(() => {
      if (contentConfig) {
        fetchContent();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [contentConfig]); // Re-run when flag changes

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📄 Content Flag Demo
        </h2>
        <p className="text-gray-600 mb-4">
          This page displays content from the <code className="bg-gray-100 px-2 py-1 rounded">content-config</code> feature flag.
          Changes in LaunchDarkly will automatically update the content below.
        </p>
        
        {/* Flag Status */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">LaunchDarkly Flag Status</h3>
          {contentConfig ? (
            <div className="text-sm">
              <p className="text-green-600">✅ Flag found: <code className="bg-green-100 px-1 rounded">content-config</code></p>
              <p className="text-gray-600">Entry ID: {contentConfig.entryId}</p>
              <p className="text-gray-600">Content Type: {contentConfig.contentType || 'auto-discover'}</p>
            </div>
          ) : (
            <div className="text-sm">
              <p className="text-red-600">❌ Flag not found: <code className="bg-red-100 px-1 rounded">content-config</code></p>
              <p className="text-gray-600">Please create this flag in LaunchDarkly with JSON variations</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={fetchContent}
            disabled={loading || !contentConfig}
            className={`px-4 py-2 rounded-lg font-medium ${
              loading || !contentConfig
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? '🔄 Loading...' : '🔄 Refresh Content'}
          </button>
          
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Content Display */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content from LaunchDarkly...</p>
          </div>
        )}
        
        {error && (
          <div className="p-6">
            <div className="flex items-center text-red-600 mb-2">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Error Loading Content</span>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {content && !loading && (
          <div className="p-6">
            {/* Hero Image */}
            {content.imageUrl && (
              <div className="mb-4">
                <img
                  src={content.imageUrl}
                  alt={content.title || 'Content image'}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            
            {/* Content Details */}
            <div className="space-y-4">
              {content.title && (
                <h3 className="text-2xl font-bold text-gray-800">
                  {content.title}
                </h3>
              )}
              
              {content.summary && (
                <p className="text-gray-600 leading-relaxed text-lg">
                  {content.summary}
                </p>
              )}
              
              {content.html && (
                <div className="prose prose-lg max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: content.html }}
                  />
                </div>
              )}
              
              {/* Modular Blocks */}
              {content.structuredData?.blocks?.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    📦 Content Blocks ({content.structuredData.blocks.length})
                  </h4>
                  <div className="space-y-4">
                    {content.structuredData.blocks.map((block: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start gap-4">
                          {block.block?.image?.url && (
                            <img 
                              src={block.block.image.url} 
                              alt={block.block.title || 'Block image'} 
                              className="w-20 h-20 object-cover rounded flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h5 className="text-lg font-semibold text-gray-800 mb-2">
                              {block.block?.title}
                            </h5>
                            {block.block?.copy && (
                              <div 
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: block.block.copy }} 
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {!content && !loading && !error && !contentConfig && (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No LaunchDarkly flag found</p>
            <p className="text-sm">Create a JSON flag named "content-config" in LaunchDarkly</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How to Test</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Create a JSON flag named <code className="bg-blue-100 px-1 rounded">content-config</code> in LaunchDarkly</li>
          <li>2. Add CMSReference variations like: <code className="bg-blue-100 px-1 rounded">{"{ \"cmsType\": \"contentstack\", \"entryId\": \"blt0f6ddaddb7222b8d\", \"environment\": \"preview\" }"}</code></li>
          <li>3. Target different users/environments</li>
          <li>4. Watch the content change automatically on this page</li>
          <li>5. Click "Refresh Content" to manually trigger updates</li>
        </ol>
      </div>
    </div>
  );
} 