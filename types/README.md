# Shared TypeScript Types for LaunchDarkly CMS Integration

This directory contains shared TypeScript types for integrating CMS systems with LaunchDarkly content flags.

## Files

- `cms.ts` - Core types for CMS integration
- `index.ts` - Export barrel for easy importing
- `example.ts` - Usage examples and patterns

## Core Types

### `CMSReference`

Represents the value stored in a LaunchDarkly content flag variation.

```typescript
type CMSReference = {
  cmsType: 'contentstack';
  entryId: string;
  environment: string;
  preview?: boolean;
  contentType?: 'entry' | 'asset';
};
```

**Usage in LaunchDarkly:**
```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "preview": false,
  "contentType": "entry"
}
```

### `PreviewContent`

Represents the result returned to LaunchDarkly's preview UI.

```typescript
interface PreviewContent {
  title?: string;
  summary?: string;
  imageUrl?: string;
  html?: string;
  structuredData?: Record<string, any>;
  
  // Asset-specific fields
  assetType?: 'image' | 'file' | 'video' | 'audio';
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  mimeType?: string;
  dimensions?: {
    width?: number;
    height?: number;
  };
}
```

## Usage

### Importing Types

```typescript
import { CMSReference, PreviewContent } from './types/cms';
// or
import { CMSReference, PreviewContent } from './types';
```

### Creating Flag Variations

```typescript
const contentVariation: CMSReference = {
  cmsType: 'contentstack',
  entryId: 'blt0f6ddaddb7222b8d',
  environment: 'preview',
  contentType: 'entry'
};

const assetVariation: CMSReference = {
  cmsType: 'contentstack',
  entryId: 'blt211dac063fd6e948',
  environment: 'preview',
  contentType: 'asset'
};
```

### Runtime API Implementation

```typescript
async function handleFlagPreview(variation: CMSReference): Promise<PreviewContent> {
  // Fetch content from CMS
  const content = await fetchFromCMS(variation);
  
  // Return formatted preview
  return {
    title: content.title,
    summary: content.summary,
    imageUrl: content.image?.url,
    structuredData: content
  };
}
```

## Integration with LaunchDarkly

1. **Flag Variation**: Store `CMSReference` as JSON in LaunchDarkly flag
2. **Runtime API**: Use `CMSReference` to fetch content from CMS
3. **Preview UI**: Return `PreviewContent` to LaunchDarkly for display

## Extending for Other CMS Systems

To support additional CMS systems, extend the `cmsType` union:

```typescript
type CMSReference = {
  cmsType: 'contentstack' | 'wordpress' | 'sanity';
  // ... other fields
};
``` 