/**
 * Test script for the flagPreview API route
 * Run this to test the API locally or on Vercel
 */

const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}/api/flagPreview`
  : 'http://localhost:3000/api/flagPreview';

async function testFlagPreview() {
  const testCases = [
    {
      name: 'Entry Test',
      payload: {
        variation: {
          value: {
            cmsType: 'contentstack',
            entryId: 'blt0f6ddaddb7222b8d',
            environment: 'preview',
            contentType: 'page'
          }
        }
      }
    },
    {
      name: 'Asset Test',
      payload: {
        variation: {
          value: {
            cmsType: 'contentstack',
            entryId: 'blt211dac063fd6e948',
            environment: 'preview',
            contentType: 'asset'
          }
        }
      }
    },
    {
      name: 'Auto-Discovery Test',
      payload: {
        variation: {
          value: {
            cmsType: 'contentstack',
            entryId: 'blt0f6ddaddb7222b8d',
            environment: 'preview'
            // contentType will be auto-discovered
          }
        }
      }
    }
  ];

  console.log('🧪 Testing flagPreview API...\n');

  for (const testCase of testCases) {
    console.log(`📋 Testing: ${testCase.name}`);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.payload)
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ ${testCase.name}: SUCCESS`);
        console.log(`   Title: ${data.preview?.title}`);
        console.log(`   Summary: ${data.preview?.summary?.substring(0, 50)}...`);
        console.log(`   Has Image: ${!!data.preview?.imageUrl}`);
      } else {
        console.log(`❌ ${testCase.name}: FAILED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${data.error}`);
        console.log(`   Detail: ${data.detail}`);
      }
    } catch (error) {
      console.log(`💥 ${testCase.name}: ERROR`);
      console.log(`   Error: ${error.message}`);
    }
    
    console.log('');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testFlagPreview().catch(console.error);
}

module.exports = { testFlagPreview }; 