/**
 * Simple test file for content type discovery utility
 * 
 * Usage: 
 * 1. Set your environment variables
 * 2. Run: npx ts-node utils/test-contentTypeDiscovery-simple.ts
 */

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
 * Simple content type discovery function for testing
 */
async function findContentTypeForEntry(entryId: string, {
  apiKey,
  deliveryToken,
  environment
}: {
  apiKey: string;
  deliveryToken: string;
  environment: string;
}): Promise<string | null> {
  const baseUrl = 'https://cdn.contentstack.io/v3';
  const headers = {
    api_key: apiKey,
    access_token: deliveryToken
  };

  try {
    console.log(`🔍 Discovering content type for entry: ${entryId}`);
    console.log(`🌍 Environment: ${environment}`);

    // Step 1: Fetch all content types
    console.log('📋 Fetching available content types...');
    const typesRes = await fetch(`${baseUrl}/content_types?environment=${environment}`, { 
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });

    if (!typesRes.ok) {
      console.error(`❌ Failed to fetch content types: HTTP ${typesRes.status}`);
      return null;
    }

    const typesData = await typesRes.json();
    const contentTypes = typesData.content_types?.map((ct: any) => ct.uid) || [];

    console.log(`📋 Found ${contentTypes.length} content types:`, contentTypes);

    if (contentTypes.length === 0) {
      console.log('⚠️ No content types found');
      return null;
    }

    // Step 2: Try fetching the entry using each content type
    for (const type of contentTypes) {
      console.log(`🔍 Testing content type: ${type}`);
      
      const entryUrl = `${baseUrl}/content_types/${type}/entries/${entryId}?environment=${environment}`;
      const res = await fetch(entryUrl, { 
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 200) {
        console.log(`✅ Found matching content type: ${type}`);
        return type;
      } else if (res.status === 404) {
        console.log(`❌ Entry not found in content type: ${type}`);
      } else {
        console.log(`⚠️ Unexpected response for ${type}: HTTP ${res.status}`);
      }
    }

    console.log('❌ No matching content type found for entry');
    return null;

  } catch (error) {
    console.error('💥 Error during content type discovery:', error);
    return null;
  }
}

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

module.exports = { runTests }; 