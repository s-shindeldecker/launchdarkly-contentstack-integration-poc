import React, { useState } from 'react';

type CMSReference = {
  cmsType: 'contentstack';
  entryId: string;
  environment: string;
  contentType?: string;
};

type PreviewContent = {
  title?: string;
  summary?: string;
  imageUrl?: string;
  html?: string;
  structuredData?: any;
};

const PREVIEW_ENDPOINT = 'https://launchdarkly-contentstack-integrati-flax.vercel.app/api/flagPreview';

const sampleVariations: { label: string; value: CMSReference }[] = [
  {
    label: 'Homepage Hero Content',
    value: {
      cmsType: 'contentstack',
      entryId: 'blt0f6ddaddb7222b8d',
      environment: 'preview'
    }
  },
  {
    label: 'Product Image Asset',
    value: {
      cmsType: 'contentstack',
      entryId: 'blt211dac063fd6e948',
      environment: 'preview',
      contentType: 'asset'
    }
  },
  {
    label: 'Marketing Banner',
    value: {
      cmsType: 'contentstack',
      entryId: 'blt0f6ddaddb7222b8d',
      environment: 'preview'
    }
  },
  {
    label: 'Error Test (Invalid Entry)',
    value: {
      cmsType: 'contentstack',
      entryId: 'invalid-entry-id',
      environment: 'preview'
    }
  }
];

export default function LDContentFlagDemo() {
  const [selected, setSelected] = useState<CMSReference | null>(null);
  const [preview, setPreview] = useState<PreviewContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useLaunchDarklyConfig, setUseLaunchDarklyConfig] = useState(false);
  const [contentstackConfig, setContentstackConfig] = useState({
    apiKey: '',
    deliveryToken: '',
    environment: 'preview'
  });

  const fetchPreview = async (variation: CMSReference) => {
    setLoading(true);
    setError(null);
    setPreview(null);
    setSelected(variation);

    try {
      // Prepare request payload
      const payload: any = {
        variation: { value: variation }
      };

      // Add LaunchDarkly configuration if enabled
      if (useLaunchDarklyConfig && contentstackConfig.apiKey && contentstackConfig.deliveryToken) {
        payload.config = {
          contentstack: contentstackConfig
        };
      }

      const res = await fetch(PREVIEW_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setPreview(data.preview);
      } else {
        setError(data.error || data.detail || 'Preview failed');
      }
    } catch (e: any) {
      setError(e.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🚀 LaunchDarkly Content Flag Editor
          </h1>
          <p className="text-gray-600">
            Simulate LaunchDarkly's flag targeting interface for Content flags
          </p>
        </div>

        {/* Configuration Toggle */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-700">Configuration Mode</h3>
              <p className="text-sm text-gray-600">Choose how to authenticate with Contentstack</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="configMode"
                  checked={!useLaunchDarklyConfig}
                  onChange={() => setUseLaunchDarklyConfig(false)}
                  className="mr-2"
                />
                <span className="text-sm">Environment Variables</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="configMode"
                  checked={useLaunchDarklyConfig}
                  onChange={() => setUseLaunchDarklyConfig(true)}
                  className="mr-2"
                />
                <span className="text-sm">LaunchDarkly Config</span>
              </label>
            </div>
          </div>
          
          {useLaunchDarklyConfig && (
            <div className="mt-4 p-3 bg-yellow-50 rounded border">
              <h4 className="font-semibold text-sm mb-2">Contentstack Credentials</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="API Key"
                  value={contentstackConfig.apiKey}
                  onChange={(e) => setContentstackConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  className="px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Delivery Token"
                  value={contentstackConfig.deliveryToken}
                  onChange={(e) => setContentstackConfig(prev => ({ ...prev, deliveryToken: e.target.value }))}
                  className="px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Environment"
                  value={contentstackConfig.environment}
                  onChange={(e) => setContentstackConfig(prev => ({ ...prev, environment: e.target.value }))}
                  className="px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flag Variations Panel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Flag Variations</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {sampleVariations.length} variations
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {sampleVariations.map((variation, index) => (
                <div
                  key={index}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                    selected === variation.value 
                      ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                      : ''
                  }`}
                  onClick={() => fetchPreview(variation.value)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-1">
                        {variation.label}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        Entry ID: {variation.value.entryId}
                        {variation.value.contentType && ` • Type: ${variation.value.contentType}`}
                      </div>
                      <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(variation.value, null, 2)}
                      </pre>
                    </div>
                    {selected === variation.value && (
                      <div className="ml-3 text-blue-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Content Preview</h2>
              {selected && (
                <span className="text-sm text-gray-500 bg-green-100 text-green-800 px-2 py-1 rounded">
                  Live Preview
                </span>
              )}
            </div>
            
            <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
              {loading && (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading content preview...</p>
                </div>
              )}
              
              {error && (
                <div className="p-6">
                  <div className="flex items-center text-red-600 mb-2">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Preview Error</span>
                  </div>
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {preview && !loading && (
                <div className="p-6">
                  {/* Hero Image */}
                  {preview.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={preview.imageUrl}
                        alt={preview.title || 'Content preview'}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Content Details */}
                  <div className="space-y-4">
                    {preview.title && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {preview.title}
                        </h3>
                      </div>
                    )}
                    
                    {preview.summary && (
                      <p className="text-gray-600 leading-relaxed">
                        {preview.summary}
                      </p>
                    )}
                    
                    {preview.html && (
                      <div className="prose prose-sm max-w-none">
                        <div
                          dangerouslySetInnerHTML={{ __html: preview.html }}
                        />
                      </div>
                    )}
                    
                    {/* Modular Blocks */}
                    {preview.structuredData?.blocks?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 mb-3">
                          📦 Modular Blocks ({preview.structuredData.blocks.length})
                        </h4>
                        <div className="space-y-3">
                          {preview.structuredData.blocks.map((block: any, index: number) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                              <div className="flex items-start gap-3">
                                {block.block?.image?.url && (
                                  <img 
                                    src={block.block.image.url} 
                                    alt={block.block.title || 'Block image'} 
                                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                                  />
                                )}
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-800 mb-1">
                                    {block.block?.title}
                                  </h5>
                                  {block.block?.copy && (
                                    <div 
                                      className="prose prose-xs max-w-none"
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
                    
                    {/* Raw Data */}
                    <details className="mt-6">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 font-mono">
                        🔍 View Raw Content Data
                      </summary>
                      <pre className="text-xs bg-gray-100 p-3 rounded-lg mt-2 overflow-x-auto border">
                        {JSON.stringify(preview.structuredData, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}
              
              {!preview && !loading && !error && (
                <div className="p-8 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Select a variation to preview content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 