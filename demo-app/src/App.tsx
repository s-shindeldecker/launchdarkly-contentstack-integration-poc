import React, { useState } from 'react';
import LDContentFlagDemo from './LDContentFlagDemo';
import ContentFlagDemo from './ContentFlagDemo';

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

type ContentstackConfig = {
  apiKey: string;
  deliveryToken: string;
  environment: string;
};

const PREVIEW_ENDPOINT = 'https://launchdarkly-contentstack-integrati-flax.vercel.app/api/flagPreview';

export default function App() {
  const [currentView, setCurrentView] = useState<'basic' | 'ld-editor' | 'content-flag'>('basic');
  const [variationJson, setVariationJson] = useState<string>(
    JSON.stringify({
      cmsType: 'contentstack',
      entryId: 'blt0f6ddaddb7222b8d',
      environment: 'preview'
    }, null, 2)
  );
  const [useLaunchDarklyConfig, setUseLaunchDarklyConfig] = useState(false);
  const [contentstackConfig, setContentstackConfig] = useState<ContentstackConfig>({
    apiKey: '',
    deliveryToken: '',
    environment: 'preview'
  });
  const [preview, setPreview] = useState<PreviewContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPreview = async () => {
    try {
      setError(null);
      setPreview(null);
      setLoading(true);
      
      const variation = JSON.parse(variationJson);

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
        setError(data.error || data.detail || 'Unknown error');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Shared navigation component
  const Navigation = () => (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-800">
        🚀 LaunchDarkly + Contentstack Flag Preview Demo
      </h1>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentView('basic')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            currentView === 'basic'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Basic Demo
        </button>
        <button
          onClick={() => setCurrentView('ld-editor')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            currentView === 'ld-editor'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          LaunchDarkly Editor
        </button>
        <button
          onClick={() => setCurrentView('content-flag')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            currentView === 'content-flag'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Content Flag Demo
        </button>
      </div>
    </div>
  );

  // Render different views
  if (currentView === 'ld-editor') {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Navigation />
          <LDContentFlagDemo />
        </div>
      </div>
    );
  }

  if (currentView === 'content-flag') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Navigation />
          <ContentFlagDemo />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Navigation />
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Configuration Mode</h2>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="configMode"
                checked={!useLaunchDarklyConfig}
                onChange={() => setUseLaunchDarklyConfig(false)}
                className="mr-2"
              />
              <span className="text-sm">Fallback Mode (Environment Variables)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="configMode"
                checked={useLaunchDarklyConfig}
                onChange={() => setUseLaunchDarklyConfig(true)}
                className="mr-2"
              />
              <span className="text-sm">LaunchDarkly Config Mode</span>
            </label>
          </div>
          
          {useLaunchDarklyConfig && (
            <div className="p-4 bg-yellow-50 rounded border">
              <h3 className="font-semibold text-sm mb-2">LaunchDarkly Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="API Key"
                  value={contentstackConfig.apiKey}
                  onChange={(e) => setContentstackConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  className="px-2 py-1 text-sm border rounded"
                />
                <input
                  type="text"
                  placeholder="Delivery Token"
                  value={contentstackConfig.deliveryToken}
                  onChange={(e) => setContentstackConfig(prev => ({ ...prev, deliveryToken: e.target.value }))}
                  className="px-2 py-1 text-sm border rounded"
                />
                <input
                  type="text"
                  placeholder="Environment"
                  value={contentstackConfig.environment}
                  onChange={(e) => setContentstackConfig(prev => ({ ...prev, environment: e.target.value }))}
                  className="px-2 py-1 text-sm border rounded"
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                This simulates how LaunchDarkly would pass configuration to your API
              </p>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">CMS Reference</h2>
          <p className="text-sm text-gray-600 mb-2">
            Edit the JSON below to test different content entries:
          </p>
          <textarea
            className="w-full border border-gray-300 p-3 font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={8}
            value={variationJson}
            onChange={(e) => setVariationJson(e.target.value)}
            placeholder="Paste your CMSReference JSON here..."
          />
        </div>

        <button
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          } text-white mb-6`}
          onClick={fetchPreview}
          disabled={loading}
        >
          {loading ? '🔄 Loading...' : '📡 Load Content Preview'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-2">❌</span>
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {preview && (
          <div className="border border-gray-200 rounded-lg shadow-md bg-white overflow-hidden">
            {/* Hero Image */}
            {preview.imageUrl && (
              <div className="relative">
                <img 
                  src={preview.imageUrl} 
                  alt={preview.title || 'Preview'} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
            )}
            
            <div className="p-6">
              {/* Title */}
              {preview.title && (
                <h2 className="text-2xl font-bold mb-3 text-gray-800">{preview.title}</h2>
              )}
              
              {/* Summary */}
              {preview.summary && (
                <p className="text-gray-600 mb-4 leading-relaxed">{preview.summary}</p>
              )}
              
              {/* HTML Content */}
              {preview.html && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Content</h3>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: preview.html }}
                  />
                </div>
              )}

              {/* Modular Blocks */}
              {preview.structuredData?.blocks?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    📦 Modular Blocks ({preview.structuredData.blocks.length})
                  </h3>
                  <div className="space-y-4">
                    {preview.structuredData.blocks.map((block: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start gap-4">
                          {block.block?.image?.url && (
                            <img 
                              src={block.block.image.url} 
                              alt={block.block.title || 'Block image'} 
                              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold mb-2 text-gray-800">
                              {block.block?.title}
                            </h4>
                            {block.block?.copy && (
                              <div 
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: block.block.copy }} 
                              />
                            )}
                            {block.block?.layout && (
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                                Layout: {block.block.layout}
                              </span>
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
                <summary className="cursor-pointer font-mono text-sm text-gray-600 hover:text-gray-800">
                  🔍 View Raw Preview Data
                </summary>
                <pre className="text-xs bg-gray-100 p-4 overflow-x-auto rounded-lg mt-2 border">
                  {JSON.stringify(preview.structuredData, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* Quick Test Buttons */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Quick Tests</h3>
          <div className="flex flex-wrap gap-2">
            <button
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              onClick={() => {
                setVariationJson(JSON.stringify({
                  cmsType: 'contentstack',
                  entryId: 'blt0f6ddaddb7222b8d',
                  environment: 'preview'
                }, null, 2));
              }}
            >
              Test Entry
            </button>
            <button
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              onClick={() => {
                setVariationJson(JSON.stringify({
                  cmsType: 'contentstack',
                  entryId: 'blt211dac063fd6e948',
                  environment: 'preview',
                  contentType: 'asset'
                }, null, 2));
              }}
            >
              Test Asset
            </button>
            <button
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              onClick={() => {
                setVariationJson(JSON.stringify({
                  cmsType: 'contentstack',
                  entryId: 'invalid-entry-id',
                  environment: 'preview'
                }, null, 2));
              }}
            >
              Test Error
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 