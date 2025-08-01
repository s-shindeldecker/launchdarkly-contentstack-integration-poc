import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>LaunchDarkly Contentstack Integration</h1>
      <p>Welcome to the content integration scaffold.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Quick Links</h2>
        <ul>
          <li>
            <Link 
              href="/test-connection"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Test Contentstack Connection
            </Link>
          </li>
          <li>
            <Link 
              href="/debug-connection"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Debug Connection (Detailed)
            </Link>
          </li>
          <li>
            <Link 
              href="/environment-test"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Environment & Content Type Test
            </Link>
          </li>
          <li>
            <Link 
              href="/content-type-list"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → List All Content Types
            </Link>
          </li>
          <li>
            <Link 
              href="/content-type-discovery"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Discover Content Types
            </Link>
          </li>
          <li>
            <Link 
              href="/find-content-type"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Find Your Content Type
            </Link>
          </li>
          <li>
            <Link 
              href="/test-real-content"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Test Real Content (Entry ID: blt0f6ddaddb7222b8d)
            </Link>
          </li>
          <li>
            <Link 
              href="/test-assets"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Test Entries & Assets
            </Link>
          </li>
          <li>
            <Link 
              href="/content-helper"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Content Discovery Helper
            </Link>
          </li>
          <li>
            <Link 
              href="/dev-preview"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Development Preview Page
            </Link>
          </li>
          <li>
            <Link 
              href="/test-launchdarkly"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Test LaunchDarkly Integration
            </Link>
          </li>
          <li>
            <Link 
              href="/test-launchdarkly-simple"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Test LaunchDarkly Integration (Simple)
            </Link>
          </li>
          <li>
            <Link 
              href="/content-with-flags"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Content with Feature Flags
            </Link>
          </li>
          <li>
            <Link 
              href="/content-json-flags"
              style={{ color: '#0070f3', textDecoration: 'none' }}
            >
              → Content with JSON Flags (Dynamic)
            </Link>
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Next Steps</h3>
        <ol>
          <li>Test your connection at <code>/test-connection</code></li>
          <li>If that fails, use <code>/debug-connection</code> for detailed diagnostics</li>
          <li>Test environments and content types at <code>/environment-test</code></li>
          <li>List all content types at <code>/content-type-list</code></li>
          <li>Discover your content types at <code>/content-type-discovery</code></li>
          <li>Find your specific content type at <code>/find-content-type</code></li>
          <li>Test with real content at <code>/test-real-content</code></li>
          <li>Test entries and assets at <code>/test-assets</code></li>
          <li>Use the content discovery helper at <code>/content-helper</code></li>
          <li>Test LaunchDarkly integration at <code>/test-launchdarkly</code></li>
          <li>Configure your Contentstack credentials in <code>.env.local</code></li>
          <li>Update the content type in <code>contentstackAdapter.ts</code></li>
          <li>Run <code>npm run dev</code> to start the development server</li>
        </ol>
      </div>
    </div>
  );
} 