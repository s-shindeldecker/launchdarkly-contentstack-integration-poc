# Utility Functions for LaunchDarkly CMS Integration

This directory contains utility functions to support the LaunchDarkly CMS integration.

## Files

- `contentTypeDiscovery.ts` - Content type discovery utilities
- `index.ts` - Export barrel for easy importing
- `test-contentTypeDiscovery.ts` - Test file for content type discovery

## Content Type Discovery

### `findContentTypeForEntry`

Discovers the correct content type for a given entry ID in Contentstack.

```typescript
import { findContentTypeForEntry } from './utils/contentTypeDiscovery';

const contentType = await findContentTypeForEntry('blt0f6ddaddb7222b8d', {
  apiKey: 'your-api-key',
  deliveryToken: 'your-delivery-token',
  environment: 'preview'
});

if (contentType) {
  console.log(`Found content type: ${contentType}`);
} else {
  console.log('No matching content type found');
}
```

### `findContentTypeWithMetadata`

Enhanced version that also returns metadata about the content type.

```typescript
import { findContentTypeWithMetadata } from './utils/contentTypeDiscovery';

const result = await findContentTypeWithMetadata('blt0f6ddaddb7222b8d', {
  apiKey: 'your-api-key',
  deliveryToken: 'your-delivery-token',
  environment: 'preview'
});

if (result?.contentType) {
  console.log(`Content type: ${result.contentType}`);
  if (result.metadata) {
    console.log(`Title: ${result.metadata.title}`);
    console.log(`Description: ${result.metadata.description}`);
  }
}
```

### `findContentTypesForEntries`

Batch discovery for multiple entry IDs.

```typescript
import { findContentTypesForEntries } from './utils/contentTypeDiscovery';

const entryIds = ['blt0f6ddaddb7222b8d', 'blt211dac063fd6e948'];
const results = await findContentTypesForEntries(entryIds, {
  apiKey: 'your-api-key',
  deliveryToken: 'your-delivery-token',
  environment: 'preview'
});

// results = {
//   'blt0f6ddaddb7222b8d': 'page',
//   'blt211dac063fd6e948': null
// }
```

## How It Works

1. **Fetch Content Types**: Uses the Contentstack Delivery API to get all available content type UIDs
2. **Test Each Type**: Attempts to fetch the entry using each content type
3. **Return Match**: Returns the first content type that successfully finds the entry
4. **Handle Errors**: Returns `null` if no matching content type is found

## Usage Examples

### Basic Discovery

```typescript
const contentType = await findContentTypeForEntry('blt0f6ddaddb7222b8d', config);
// Returns: 'page' or null
```

### With Error Handling

```typescript
try {
  const contentType = await findContentTypeForEntry(entryId, config);
  if (contentType) {
    console.log(`Entry belongs to content type: ${contentType}`);
  } else {
    console.log('Entry not found in any content type');
  }
} catch (error) {
  console.error('Discovery failed:', error);
}
```

### Integration with Runtime API

```typescript
// Use discovered content type in flag preview
const contentType = await findContentTypeForEntry(entryId, config);
if (contentType) {
  const variation: CMSReference = {
    cmsType: 'contentstack',
    entryId,
    environment: 'preview',
    contentType
  };
  // Use in flag preview...
}
```

## Testing

Run the test file to verify the utility works with your Contentstack setup:

```bash
# Set environment variables
export CONTENTSTACK_API_KEY="your-api-key"
export CONTENTSTACK_DELIVERY_TOKEN="your-delivery-token"
export CONTENTSTACK_ENVIRONMENT="preview"

# Run tests
npx ts-node utils/test-contentTypeDiscovery.ts
```

## Error Handling

The utility handles various error scenarios:

- **Invalid credentials**: Returns `null`
- **Network errors**: Returns `null`
- **No content types**: Returns `null`
- **Entry not found**: Returns `null`
- **API rate limits**: Logs warning and continues

## Performance Considerations

- **Sequential testing**: Tests content types one by one (could be optimized with parallel requests)
- **Caching**: Consider caching results for frequently accessed entries
- **Rate limiting**: Respects Contentstack API rate limits
- **Timeout**: Consider adding request timeouts for large content type lists 