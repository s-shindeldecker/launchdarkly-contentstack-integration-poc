/**
 * Test script for LaunchDarkly Contentstack Partner Integration
 */

const { handler } = require('./runtime-api');

// Mock configuration for testing
const testConfig = {
  apiKey: process.env.CONTENTSTACK_API_KEY || 'test-api-key',
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN || 'test-delivery-token',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'preview'
};

// Test cases
const testCases = [
  {
    name: 'Asset Test',
    input: {
      entryId: 'blt211dac063fd6e948',
      contentType: 'asset',
      preview: false
    }
  },
  {
    name: 'Page Entry Test',
    input: {
      entryId: 'blt0f6ddaddb7222b8d',
      contentType: 'page',
      preview: false
    }
  }
];

/**
 * Run a single test case
 */
async function runTest(testCase) {
  console.log(`\n🧪 Running test: ${testCase.name}`);
  console.log('📋 Input:', JSON.stringify(testCase.input, null, 2));
  
  try {
    const params = {
      config: testConfig,
      input: testCase.input
    };
    
    const result = await handler(params);
    
    if (result.success) {
      console.log('✅ Test passed');
      console.log('📄 Content ID:', result.content.id);
      console.log('📄 Content Type:', result.content.contentType);
      console.log('📄 Title:', result.content.title);
    } else {
      console.log('❌ Test failed');
      console.log('🚨 Error:', result.error);
    }
    
    return result.success;
  } catch (error) {
    console.log('💥 Test crashed');
    console.log('🚨 Error:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🚀 Starting LaunchDarkly Contentstack Integration Tests');
  console.log('=' .repeat(60));
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    const success = await runTest(testCase);
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Integration is working correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration and try again.');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runTest, runAllTests }; 