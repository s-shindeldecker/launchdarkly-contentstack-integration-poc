/**
 * Simple test file for content type discovery utility
 * 
 * Usage: 
 * 1. Set your environment variables
 * 2. Run: npx ts-node utils/test-contentTypeDiscovery-simple.ts
 */

import { findContentTypeForEntry } from './contentTypeDiscovery';

// Test configuration - replace with your real credentials
const testConfig = {
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
    
    const contentType = await findContentTypeForEntry(entryId, testConfig);
    
    if (contentType) {
      console.log(`✅ Found content type: ${contentType}`);
    } else {
      console.log(`❌ No content type found`);
    }
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting Content Type Discovery Tests');
  console.log('=' .repeat(60));
  
  try {
    await testBasicDiscovery();
    
    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests }; 