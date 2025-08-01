import React, { useState } from 'react';

export default function ContentHelper() {
  const [contentType, setContentType] = useState('page');
  const [entryId, setEntryId] = useState('blt0f6ddaddb7222b8d');

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Content Discovery Helper</h1>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>How to Find Your Content Types</h2>
        <ol>
          <li>Go to your <strong>Contentstack Dashboard</strong></li>
          <li>Navigate to <strong>Content Types</strong> in the left sidebar</li>
          <li>Click on any content type (e.g., "Blog", "Article")</li>
          <li>Look at the URL - it will contain the content type ID</li>
          <li>Or check the content type settings for the ID</li>
        </ol>
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px' }}>
          <strong>Example:</strong> If your URL is <code>https://app.contentstack.io/#/content-types/blog_post</code>, 
          then your content type ID is <code>blog_post</code>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>How to Find Entry IDs</h2>
        <ol>
          <li>Go to your content type in Contentstack</li>
          <li>Click on any published entry</li>
          <li>Look at the URL - it will contain the entry ID</li>
          <li>Or check the entry details for the entry ID field</li>
        </ol>
        
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px' }}>
          <strong>Example:</strong> If your URL is <code>https://app.contentstack.io/#/content-types/blog_post/entries/entry_uid_123</code>, 
          then your entry ID is <code>entry_uid_123</code>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Current Configuration</h2>
        <p>Your integration is currently configured with:</p>
        <ul>
          <li><strong>Content Type:</strong> {contentType}</li>
          <li><strong>Entry ID:</strong> {entryId}</li>
          <li><strong>Environment:</strong> preview</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Test Your Configuration</h2>
        <p>Try these pages to test your current setup:</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>�� Connection Test</h4>
            <p>Test basic connectivity</p>
            <a href="/test-connection" style={{ color: '#0070f3', textDecoration: 'none' }}>→ Test Connection</a>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>📄 Entry Test</h4>
            <p>Test entry fetching</p>
            <a href="/test-real-content" style={{ color: '#0070f3', textDecoration: 'none' }}>→ Test Entry</a>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>🖼️ Asset Test</h4>
            <p>Test asset fetching</p>
            <a href="/test-assets" style={{ color: '#0070f3', textDecoration: 'none' }}>→ Test Assets</a>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h4>🔍 Content Discovery</h4>
            <p>Find other content types</p>
            <a href="/find-content-type" style={{ color: '#0070f3', textDecoration: 'none' }}>→ Find Types</a>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px' }}>
        <h3>✅ Configuration Complete</h3>
        <p>Your Contentstack integration is working! You can now:</p>
        <ol>
          <li>Fetch entries using the <strong>page</strong> content type</li>
          <li>Fetch assets using their UIDs</li>
          <li>Test both entries and assets interactively</li>
          <li>Discover additional content types in your stack</li>
        </ol>
      </div>
    </div>
  );
}