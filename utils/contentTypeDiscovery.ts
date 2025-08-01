/**
 * Utility function to discover the correct content type for a given entry ID in Contentstack
 * 
 * This function uses the Contentstack Delivery API to:
 * 1. Fetch all content type UIDs
 * 2. Iterate through each content type, attempting to fetch the entry by ID
 * 3. Return the UID of the content type if successful, or null if no match is found
 */

export async function findContentTypeForEntry(entryId: string, {
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
 * Enhanced version that also returns additional metadata about the content type
 */
export async function findContentTypeWithMetadata(entryId: string, {
  apiKey,
  deliveryToken,
  environment
}: {
  apiKey: string;
  deliveryToken: string;
  environment: string;
}): Promise<{
  contentType: string | null;
  metadata?: {
    title: string;
    description?: string;
    uid: string;
  };
} | null> {
  const contentType = await findContentTypeForEntry(entryId, {
    apiKey,
    deliveryToken,
    environment
  });

  if (!contentType) {
    return { contentType: null };
  }

  try {
    // Fetch metadata about the content type
    const baseUrl = 'https://cdn.contentstack.io/v3';
    const headers = {
      api_key: apiKey,
      access_token: deliveryToken,
      'Content-Type': 'application/json'
    };

    const metadataRes = await fetch(`${baseUrl}/content_types/${contentType}?environment=${environment}`, { headers });
    
    if (metadataRes.ok) {
      const metadata = await metadataRes.json();
      return {
        contentType,
        metadata: {
          title: metadata.content_type.title,
          description: metadata.content_type.description,
          uid: metadata.content_type.uid
        }
      };
    }
  } catch (error) {
    console.error('⚠️ Failed to fetch content type metadata:', error);
  }

  return { contentType };
}

/**
 * Batch discovery for multiple entry IDs
 */
export async function findContentTypesForEntries(entryIds: string[], {
  apiKey,
  deliveryToken,
  environment
}: {
  apiKey: string;
  deliveryToken: string;
  environment: string;
}): Promise<Record<string, string | null>> {
  const results: Record<string, string | null> = {};
  
  console.log(`🔍 Discovering content types for ${entryIds.length} entries...`);
  
  for (const entryId of entryIds) {
    console.log(`\n📋 Processing entry: ${entryId}`);
    const contentType = await findContentTypeForEntry(entryId, {
      apiKey,
      deliveryToken,
      environment
    });
    
    results[entryId] = contentType;
  }
  
  console.log('\n📊 Discovery Results:');
  Object.entries(results).forEach(([entryId, contentType]) => {
    console.log(`  ${entryId}: ${contentType || '❌ Not found'}`);
  });
  
  return results;
} 