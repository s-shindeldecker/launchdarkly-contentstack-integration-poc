# Test Suite for LaunchDarkly Contentstack Integration

This directory contains comprehensive tests for the LaunchDarkly Contentstack integration to ensure production readiness.

## Files

- `flagPreview.test.ts` - Comprehensive test suite for flag preview functionality
- `run-tests.js` - Test runner script with environment validation

## Test Coverage

### ✅ Valid Scenarios
- **Valid Asset Variation** - Tests fetching asset content
- **Valid Entry Variation** - Tests fetching entry content with correct content type

### ❌ Error Scenarios
- **Invalid Entry ID** - Tests handling of non-existent entries
- **Invalid Content Type** - Tests handling of wrong content types
- **Missing Entry ID** - Tests validation of required fields
- **Missing Configuration** - Tests handling of missing credentials
- **Malformed Variation** - Tests validation of request structure
- **Network Error** - Tests handling of API/network failures

## Running Tests

### Prerequisites

1. **Environment Variables**: Set up your `.env.local` file:
   ```bash
   CONTENTSTACK_API_KEY=your_api_key
   CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
   CONTENTSTACK_ENVIRONMENT=preview
   ```

2. **Dependencies**: Install required packages:
   ```bash
   npm install dotenv
   ```

### Running the Test Suite

```bash
# Run the comprehensive test suite
node test/run-tests.js

# Or run individual tests
npx ts-node test/flagPreview.test.ts
```

### Expected Results

A successful test run should show:
```
🚀 Starting Comprehensive Flag Preview Test Suite
============================================================

🧪 Testing: Valid Asset Variation
✅ Valid Asset Test: PASSED

🧪 Testing: Valid Entry Variation  
✅ Valid Entry Test: PASSED

🧪 Testing: Invalid Entry ID
✅ Invalid Entry ID Test: PASSED

🧪 Testing: Invalid Content Type
✅ Invalid Content Type Test: PASSED

🧪 Testing: Missing Entry ID
✅ Missing Entry ID Test: PASSED

🧪 Testing: Missing Configuration
✅ Missing Config Test: PASSED

🧪 Testing: Malformed Variation
✅ Malformed Variation Test: PASSED

🧪 Testing: Network Error Simulation
✅ Network Error Test: PASSED

============================================================
📊 Final Test Results:
✅ Passed: 8
❌ Failed: 0
📈 Success Rate: 100.0%

🎉 All tests passed! Integration is production-ready.
```

## Test Details

### Valid Asset Test
- **Purpose**: Verify asset content can be fetched and previewed
- **Input**: Valid asset ID with `contentType: 'asset'`
- **Expected**: 200 status with preview data

### Valid Entry Test
- **Purpose**: Verify entry content can be fetched and previewed
- **Input**: Valid entry ID with `contentType: 'page'`
- **Expected**: 200 status with preview data

### Invalid Entry ID Test
- **Purpose**: Verify graceful handling of non-existent entries
- **Input**: Invalid entry ID
- **Expected**: 404 status with error message

### Invalid Content Type Test
- **Purpose**: Verify handling of wrong content types
- **Input**: Valid entry ID with wrong content type
- **Expected**: 422 status with error message

### Missing Entry ID Test
- **Purpose**: Verify validation of required fields
- **Input**: Variation missing `entryId`
- **Expected**: 400 status with validation error

### Missing Configuration Test
- **Purpose**: Verify handling of missing credentials
- **Input**: Empty configuration object
- **Expected**: 400 status with configuration error

### Malformed Variation Test
- **Purpose**: Verify validation of request structure
- **Input**: Incomplete variation object
- **Expected**: 400 status with structure error

### Network Error Test
- **Purpose**: Verify handling of API failures
- **Input**: Invalid API key
- **Expected**: 500 status with error details

## Runtime Validation

The flag preview handler includes comprehensive runtime validation:

### Request Structure Validation
- Checks for presence of `context` and `config`
- Validates `body.variation.value` exists

### Configuration Validation
- Ensures `apiKey`, `deliveryToken`, and `environment` are provided
- Validates all required fields are strings

### Variation Validation
- Checks for required fields: `cmsType`, `entryId`, `environment`
- Validates field types (strings)
- Ensures `cmsType` is 'contentstack'

### Error Responses
All validation failures return structured error responses:
```json
{
  "status": 400,
  "body": {
    "error": "Descriptive error message",
    "detail": "Additional error details"
  }
}
```

## Production Readiness

This test suite ensures:

1. **✅ Comprehensive Coverage** - All scenarios tested
2. **✅ Error Handling** - Graceful failure modes
3. **✅ Validation** - Input validation and sanitization
4. **✅ Logging** - Detailed logging for debugging
5. **✅ Type Safety** - TypeScript validation
6. **✅ Documentation** - Clear test descriptions

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```
   ❌ Missing required environment variables:
      - CONTENTSTACK_API_KEY
   ```
   **Solution**: Set up your `.env.local` file

2. **Network Errors**
   ```
   ❌ Network Error Test: FAILED
   Expected status 500, got: 412
   ```
   **Solution**: Check your Contentstack credentials

3. **Content Type Errors**
   ```
   ❌ Invalid Content Type Test: FAILED
   Expected status 422, got: 404
   ```
   **Solution**: Verify your content type names

### Debug Mode

For detailed debugging, check the console output for:
- Request/response logging
- Validation step details
- Error stack traces 