/**
 * Comprehensive test suite for LaunchDarkly Contentstack integration
 * 
 * Tests flag preview functionality with various scenarios:
 * - Valid asset and entry variations
 * - Invalid content types and entry IDs
 * - Missing configuration and fields
 * - Error handling and validation
 */

// Load environment variables
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// Import the flag preview handler
import { handleFlagPreview } from '../runtime/flagPreview';

// Test configuration
const config = {
  apiKey: process.env.CONTENTSTACK_API_KEY || 'test-api-key',
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN || 'test-delivery-token',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'preview'
};

/**
 * Helper function to log test results
 */
const logResult = (label: string, result: any) => {
  console.log(`\n${'='.repeat(20)} ${label} ${'='.repeat(20)}`);
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.body, null, 2));
  console.log(`${'='.repeat(60)}\n`);
};

/**
 * Helper function to validate test results
 */
const validateResult = (result: any, expectedStatus: number, expectedSuccess?: boolean) => {
  const statusMatch = result.status === expectedStatus;
  const successMatch = expectedSuccess === undefined || 
    (expectedSuccess ? result.body?.preview : !result.body?.preview);
  
  return {
    passed: statusMatch && successMatch,
    statusMatch,
    successMatch,
    result
  };
};

/**
 * Test: Valid Asset Variation
 */
async function testValidAsset() {
  console.log('🧪 Testing: Valid Asset Variation');
  
  const result = await handleFlagPreview({
    context: { config },
    body: {
      variation: {
        value: {
          cmsType: 'contentstack',
          entryId: 'blt211dac063fd6e948',
          environment: config.environment,
          contentType: 'asset'
        }
      }
    }
  });
  
  const validation = validateResult(result, 200, true);
  logResult('Valid Asset Test', result);
  
  if (validation.passed) {
    console.log('✅ Valid Asset Test: PASSED');
    console.log('📄 Asset Title:', result.body?.preview?.title);
    console.log('📄 Asset Type:', result.body?.preview?.assetType);
  } else {
    console.log('❌ Valid Asset Test: FAILED');
    console.log('Expected status 200, got:', result.status);
  }
  
  return validation.passed;
}

/**
 * Test: Valid Entry Variation
 */
async function testValidEntry() {
  console.log('🧪 Testing: Valid Entry Variation');
  
  const result = await handleFlagPreview({
    context: { config },
    body: {
      variation: {
        value: {
          cmsType: 'contentstack',
          entryId: 'blt0f6ddaddb7222b8d',
          environment: config.environment,
          contentType: 'page'
        }
      }
    }
  });
  
  const validation = validateResult(result, 200, true);
  logResult('Valid Entry Test', result);
  
  if (validation.passed) {
    console.log('✅ Valid Entry Test: PASSED');
    console.log('📄 Entry Title:', result.body?.preview?.title);
    console.log('📄 Content Type:', result.body?.preview?.contentType);
  } else {
    console.log('❌ Valid Entry Test: FAILED');
    console.log('Expected status 200, got:', result.status);
  }
  
  return validation.passed;
}

/**
 * Test: Invalid Entry ID
 */
async function testInvalidEntryId() {
  console.log('🧪 Testing: Invalid Entry ID');
  
  const result = await handleFlagPreview({
    context: { config },
    body: {
      variation: {
        value: {
          cmsType: 'contentstack',
          entryId: 'invalid-entry-id',
          environment: config.environment,
          contentType: 'page'
        }
      }
    }
  });
  
  const validation = validateResult(result, 404, false);
  logResult('Invalid Entry ID Test', result);
  
  if (validation.passed) {
    console.log('✅ Invalid Entry ID Test: PASSED');
    console.log('📄 Error:', result.body?.error);
  } else {
    console.log('❌ Invalid Entry ID Test: FAILED');
    console.log('Expected status 404, got:', result.status);
  }
  
  return validation.passed;
}

/**
 * Test: Invalid Content Type
 */
async function testInvalidContentType() {
  console.log('🧪 Testing: Invalid Content Type');
  
  const result = await handleFlagPreview({
    context: { config },
    body: {
      variation: {
        value: {
          cmsType: 'contentstack',
          entryId: 'blt0f6ddaddb7222b8d',
          environment: config.environment,
          contentType: 'nonexistent-type' as any // Type assertion for test
        }
      }
    }
  });
  
  const validation = validateResult(result, 422, false);
  logResult('Invalid Content Type Test', result);
  
  if (validation.passed) {
    console.log('✅ Invalid Content Type Test: PASSED');
    console.log('📄 Error:', result.body?.error);
  } else {
    console.log('❌ Invalid Content Type Test: FAILED');
    console.log('Expected status 422, got:', result.status);
  }
  
  return validation.passed;
}

/**
 * Test: Missing Entry ID
 */
async function testMissingEntryId() {
  console.log('🧪 Testing: Missing Entry ID');
  
  const result = await handleFlagPreview({
    context: { config },
    body: {
      variation: {
        value: {
          cmsType: 'contentstack',
          environment: config.environment,
          contentType: 'page'
          // Missing entryId
        } as any // Type assertion for test
      }
    }
  });
  
  const validation = validateResult(result, 400, false);
  logResult('Missing Entry ID Test', result);
  
  if (validation.passed) {
    console.log('✅ Missing Entry ID Test: PASSED');
    console.log('📄 Error:', result.body?.error);
  } else {
    console.log('❌ Missing Entry ID Test: FAILED');
    console.log('Expected status 400, got:', result.status);
  }
  
  return validation.passed;
}

/**
 * Test: Missing Configuration
 */
async function testMissingConfig() {
  console.log('🧪 Testing: Missing Configuration');
  
  const result = await handleFlagPreview({
    context: { 
      config: {
        apiKey: '',
        deliveryToken: '',
        environment: ''
      }
    },
    body: {
      variation: {
        value: {
          cmsType: 'contentstack',
          entryId: 'blt211dac063fd6e948',
          environment: config.environment,
          contentType: 'asset'
        }
      }
    }
  });
  
  const validation = validateResult(result, 400, false);
  logResult('Missing Config Test', result);
  
  if (validation.passed) {
    console.log('✅ Missing Config Test: PASSED');
    console.log('📄 Error:', result.body?.error);
  } else {
    console.log('❌ Missing Config Test: FAILED');
    console.log('Expected status 400, got:', result.status);
  }
  
  return validation.passed;
}

/**
 * Test: Malformed Variation
 */
async function testMalformedVariation() {
  console.log('🧪 Testing: Malformed Variation');
  
  const result = await handleFlagPreview({
    context: { config },
    body: {
      variation: {
        value: {
          // Missing required fields
          cmsType: 'contentstack'
        } as any // Type assertion for test
      }
    }
  });
  
  const validation = validateResult(result, 400, false);
  logResult('Malformed Variation Test', result);
  
  if (validation.passed) {
    console.log('✅ Malformed Variation Test: PASSED');
    console.log('📄 Error:', result.body?.error);
  } else {
    console.log('❌ Malformed Variation Test: FAILED');
    console.log('Expected status 400, got:', result.status);
  }
  
  return validation.passed;
}

/**
 * Test: Network Error Simulation
 */
async function testNetworkError() {
  console.log('🧪 Testing: Network Error Simulation');
  
  // Test with invalid API key to simulate network/auth error
  const result = await handleFlagPreview({
    context: { 
      config: {
        ...config,
        apiKey: 'invalid-api-key'
      }
    },
    body: {
      variation: {
        value: {
          cmsType: 'contentstack',
          entryId: 'blt0f6ddaddb7222b8d',
          environment: config.environment,
          contentType: 'page'
        }
      }
    }
  });
  
  const validation = validateResult(result, 500, false);
  logResult('Network Error Test', result);
  
  if (validation.passed) {
    console.log('✅ Network Error Test: PASSED');
    console.log('📄 Error:', result.body?.error);
  } else {
    console.log('❌ Network Error Test: FAILED');
    console.log('Expected status 500, got:', result.status);
  }
  
  return validation.passed;
}

/**
 * Main test runner
 */
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Flag Preview Test Suite');
  console.log('=' .repeat(60));
  
  const tests = [
    { name: 'Valid Asset', fn: testValidAsset },
    { name: 'Valid Entry', fn: testValidEntry },
    { name: 'Invalid Entry ID', fn: testInvalidEntryId },
    { name: 'Invalid Content Type', fn: testInvalidContentType },
    { name: 'Missing Entry ID', fn: testMissingEntryId },
    { name: 'Missing Configuration', fn: testMissingConfig },
    { name: 'Malformed Variation', fn: testMalformedVariation },
    { name: 'Network Error', fn: testNetworkError }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const success = await test.fn();
      if (success) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`💥 ${test.name} crashed:`, error);
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Final Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Integration is production-ready.');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some tests failed. Please review the results.');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testValidAsset,
  testValidEntry,
  testInvalidEntryId,
  testInvalidContentType,
  testMissingEntryId,
  testMissingConfig,
  testMalformedVariation,
  testNetworkError
}; 