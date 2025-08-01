import { handleFlagPreview } from './flagPreview';

// Mock configuration for testing
const mockConfig = {
  apiKey: process.env.CONTENTSTACK_API_KEY || 'test-api-key',
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN || 'test-delivery-token',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'preview'
};

// Test cases for flag preview
const testCases = [
  {
    name: 'Basic Entry Preview',
    variation: {
      entryId: 'blt0f6ddaddb7222b8d',
      contentType: 'entry',
      preview: false
    }
  },
  {
    name: 'Asset Preview',
    variation: {
      entryId: 'blt211dac063fd6e948',
      contentType: 'asset',
      preview: false
    }
  },
  {
    name: 'Preview Mode Entry',
    variation: {
      entryId: 'blt0f6ddaddb7222b8d',
      contentType: 'entry',
      preview: true
    }
  },
  {
    name: 'Missing EntryId',
    variation: {
      contentType: 'entry',
      preview: false
    }
  }
];

/**
 * Test the flag preview handler
 */
async function testFlagPreview() {
  console.log('🧪 Testing LaunchDarkly Flag Preview Handler');
  console.log('=' .repeat(60));

  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log('📄 Variation:', JSON.stringify(testCase.variation, null, 2));

    try {
      const mockRequest = {
        context: {
          config: mockConfig
        },
        body: {
          variation: {
            value: testCase.variation
          }
        }
      };

      const result = await handleFlagPreview(mockRequest as any);

      console.log('📊 Result Status:', result.status);
      
      if (result.status === 200) {
        console.log('✅ Preview generated successfully');
        const preview = result.body.preview;
        console.log('📄 Title:', preview.title);
        console.log('📄 Summary length:', preview.summary.length);
        console.log('📄 Has image:', !!preview.imageUrl);
        console.log('📄 Content type:', preview.contentType);
      } else {
        console.log('❌ Preview failed');
        console.log('🚨 Error:', result.body.error);
        console.log('📄 Detail:', result.body.detail);
      }

    } catch (error) {
      console.log('💥 Test crashed');
      console.log('🚨 Error:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Flag preview testing completed');
}

// Run tests if this file is executed directly
if (require.main === module) {
  testFlagPreview().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

export { testFlagPreview }; 