import React, { useState, useEffect } from 'react';

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

  // Simulate LaunchDarkly flag evaluation
  // In a real app, this would come from useFlags() hook
  const simulateFlagEvaluation = () => {
    // This simulates the 'content-config' flag from LaunchDarkly
    // You can change this to test different variations
    const flagVariations = [
      {
        cmsType: 'contentstack',
        entryId: 'blt0f6ddaddb7222b8d',
        environment: 'preview'
      },
      {
        cmsType: 'contentstack',
        entryId: 'blt211dac063fd6e948',
        environment: 'preview',
        contentType: 'asset'
      }
    ];

    // Randomly select a variation (simulates LaunchDarkly targeting)
    const randomIndex = Math.floor(Math.random() * flagVariations.length);
    return flagVariations[randomIndex];
  };

  const fetchContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const cmsReference = simulateFlagEvaluation();
      
      const res = await fetch(PREVIEW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          variation: { value: cmsReference }
        })
      });

      const data = await res.json();

      if (res.ok) {
        setContent(data.preview);
        setLastUpdated(new Date());
      } else {
        setError(data.error || data.detail || 'Failed to fetch content');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh content every 30 seconds
  useEffect(() => {
    fetchContent();
    
    const interval = setInterval(fetchContent, 30000);
    return () => clearInterval(interval);
  }, []);

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
        
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={fetchContent}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium ${
              loading 
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
        
        {!content && !loading && !error && (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No content available from LaunchDarkly</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How to Test</h3>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Create a JSON flag named <code className="bg-blue-100 px-1 rounded">content-config</code> in LaunchDarkly</li>
          <li>2. Add CMSReference variations to the flag</li>
          <li>3. Target different users/environments</li>
          <li>4. Watch the content change automatically on this page</li>
          <li>5. Click "Refresh Content" to manually trigger updates</li>
        </ol>
      </div>
    </div>
  );
} 