/**
 * Test runner for LaunchDarkly Contentstack integration
 * 
 * Usage:
 * 1. Set environment variables in .env.local
 * 2. Run: node test/run-tests.js
 */

const { runAllTests } = require('./flagPreview.test.js');

console.log('🚀 LaunchDarkly Contentstack Integration Test Runner');
console.log('=' .repeat(60));

// Check environment variables
const requiredEnvVars = [
  'CONTENTSTACK_API_KEY',
  'CONTENTSTACK_DELIVERY_TOKEN', 
  'CONTENTSTACK_ENVIRONMENT'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease set these in your .env.local file');
  process.exit(1);
}

console.log('✅ Environment variables configured');
console.log('📋 API Key:', process.env.CONTENTSTACK_API_KEY ? '✅ Set' : '❌ Missing');
console.log('📋 Delivery Token:', process.env.CONTENTSTACK_DELIVERY_TOKEN ? '✅ Set' : '❌ Missing');
console.log('📋 Environment:', process.env.CONTENTSTACK_ENVIRONMENT || '❌ Missing');

console.log('\n🧪 Starting comprehensive test suite...\n');

// Run the test suite
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
}); 