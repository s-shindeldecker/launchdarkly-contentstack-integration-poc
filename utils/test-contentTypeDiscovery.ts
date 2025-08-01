/**
 * Test file for content type discovery utility
 * 
 * Usage: 
 * 1. Set your environment variables
 * 2. Run: npx ts-node utils/test-contentTypeDiscovery.ts
 */

const { 
  findContentTypeForEntry, 
  findContentTypeWithMetadata, 
  findContentTypesForEntries 
} = require('./contentTypeDiscovery');

// Test configuration - replace with your real credentials
const config = {
  apiKey: process.env.CONTENTSTACK_API_KEY || 'your-api-key',
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN || 'your-delivery-token',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'preview'
};

// Test entry IDs
const testEntryIds = [
  'blt0f6ddaddb7222b8d',  // Your real entry ID
  'blt211dac063fd6e948',   // Asset ID
  'invalid-entry-id'        // Should return null
];

/**
 * Test basic content type discovery
 */
async function testBasicDiscovery() {
  console.log('🧪 Testing basic content type discovery...');
  console.log('=' .repeat(60));
  
  for (const entryId of testEntryIds) {
    console.log(`\n📋 Testing entry: ${entryId}`);
    
    const contentType = await findContentTypeForEntry(entryId, config);
    
    if (contentType) {
      console.log(`✅ Found content type: ${contentType}`);
    } else {
      console.log(`❌ No content type found`);
    }
  }
}

/**
 * Test content type discovery with metadata
 */
async function testDiscoveryWithMetadata() {
  console.log('\n🧪 Testing content type discovery with metadata...');
  console.log('=' .repeat(60));
  
  const entryId = testEntryIds[0]; // Use first entry
  console.log(`📋 Testing entry: ${entryId}`);
  
  const result = await findContentTypeWithMetadata(entryId, config);
  
  if (result?.contentType) {
    console.log(`✅ Found content type: ${result.contentType}`);
    if (result.metadata) {
      console.log(`📄 Metadata:`);
      console.log(`  Title: ${result.metadata.title}`);
      console.log(`  Description: ${result.metadata.description || 'N/A'}`);
      console.log(`  UID: ${result.metadata.uid}`);
    }
  } else {
    console.log(`❌ No content type found`);
  }
}

/**
 * Test batch discovery
 */
async function testBatchDiscovery() {
  console.log('\n🧪 Testing batch content type discovery...');
  console.log('=' .repeat(60));
  
  const results = await findContentTypesForEntries(testEntryIds, config);
  
  console.log('\n📊 Final Results:');
  Object.entries(results).forEach(([entryId, contentType]) => {
    const status = contentType ? `✅ ${contentType}` : '❌ Not found';
    console.log(`  ${entryId}: ${status}`);
  });
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting Content Type Discovery Tests');
  console.log('=' .repeat(60));
  
  try {
    await testBasicDiscovery();
    await testDiscoveryWithMetadata();
    await testBatchDiscovery();
    
    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests }; 