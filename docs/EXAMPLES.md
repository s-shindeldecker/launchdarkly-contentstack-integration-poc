# Usage Examples

Real-world examples and use cases for the LaunchDarkly Contentstack Integration.

## 🎯 Basic Examples

### Example 1: Simple Content Variation

**Scenario**: Show different welcome messages based on user type.

#### LaunchDarkly Flag Configuration

```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page"
}
```

#### React Component Usage

```jsx
import { useFeatureFlag } from './components/FeatureFlag';

function WelcomeMessage() {
  const contentFlag = useFeatureFlag('welcome-message');
  
  if (contentFlag?.title && contentFlag?.structuredData?.message) {
    return (
      <div className="welcome-message">
        <h1>{contentFlag.title}</h1>
        <p>{contentFlag.structuredData.message}</p>
      </div>
    );
  }
  
  return <DefaultWelcomeMessage />;
}
```

### Example 2: Asset Management

**Scenario**: Serve different hero images based on user segment.

#### LaunchDarkly Flag Configuration

```json
{
  "cmsType": "contentstack",
  "entryId": "blt211dac063fd6e948",
  "environment": "preview",
  "contentType": "asset"
}
```

#### React Component Usage

```jsx
function HeroImage() {
  const assetFlag = useFeatureFlag('hero-image');
  
  if (assetFlag?.structuredData?.url) {
    return (
      <img 
        src={assetFlag.structuredData.url} 
        alt={assetFlag.title || 'Hero Image'}
        width={assetFlag.dimensions?.width}
        height={assetFlag.dimensions?.height}
      />
    );
  }
  
  return <DefaultHeroImage />;
}
```

## 🎨 Advanced Examples

### Example 3: A/B Testing Content

**Scenario**: Test different content variations for conversion optimization.

#### Multiple Flag Variations

```json
// Variation 1: Control (default)
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page"
}

// Variation 2: Test A
{
  "cmsType": "contentstack",
  "entryId": "bltb637c1254dbf0131",
  "environment": "preview",
  "contentType": "page"
}

// Variation 3: Test B
{
  "cmsType": "contentstack",
  "entryId": "bltc8f9e2a1b3d4e5f6",
  "environment": "preview",
  "contentType": "page"
}
```

#### React Component with Analytics

```jsx
import { useFeatureFlag } from './components/FeatureFlag';
import { trackEvent } from './analytics';

function LandingPage() {
  const contentFlag = useFeatureFlag('landing-page-variation');
  
  useEffect(() => {
    if (contentFlag?.entryId) {
      trackEvent('content_variation_viewed', {
        variation: contentFlag.entryId,
        contentType: contentFlag.contentType
      });
    }
  }, [contentFlag]);
  
  if (contentFlag?.structuredData) {
    return (
      <div className="landing-page">
        <h1>{contentFlag.title}</h1>
        <div dangerouslySetInnerHTML={{ 
          __html: contentFlag.structuredData.content 
        }} />
        <CallToAction 
          text={contentFlag.structuredData.ctaText}
          url={contentFlag.structuredData.ctaUrl}
        />
      </div>
    );
  }
  
  return <DefaultLandingPage />;
}
```

### Example 4: Personalized Content

**Scenario**: Show personalized content based on user attributes.

#### User-Targeted Flag Configuration

```json
// Premium users
{
  "cmsType": "contentstack",
  "entryId": "bltpremium123456",
  "environment": "preview",
  "contentType": "page"
}

// New users
{
  "cmsType": "contentstack",
  "entryId": "bltnewuser789012",
  "environment": "preview",
  "contentType": "page"
}
```

#### React Component with User Context

```jsx
import { useLaunchDarkly } from './components/LaunchDarklyProvider';

function PersonalizedDashboard() {
  const { client } = useLaunchDarkly();
  const [userContext, setUserContext] = useState(null);
  
  const handleUserChange = async (userData) => {
    const context = {
      kind: 'user',
      key: userData.id,
      name: userData.name,
      email: userData.email,
      custom: {
        userType: userData.type,
        subscription: userData.subscription
      }
    };
    
    await client.identify(context);
    setUserContext(context);
  };
  
  const contentFlag = useFeatureFlag('personalized-dashboard');
  
  return (
    <div className="dashboard">
      <UserSelector onUserChange={handleUserChange} />
      
      {contentFlag?.structuredData && (
        <div className="dashboard-content">
          <h1>{contentFlag.title}</h1>
          <div className="widgets">
            {contentFlag.structuredData.widgets?.map(widget => (
              <Widget key={widget.id} {...widget} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Example 5: Preview Mode for Content Management

**Scenario**: Allow content editors to preview draft content.

#### Preview Flag Configuration

```json
{
  "cmsType": "contentstack",
  "entryId": "blt0f6ddaddb7222b8d",
  "environment": "preview",
  "contentType": "page",
  "preview": true
}
```

#### React Component with Preview Toggle

```jsx
function ContentPreview() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const contentFlag = useFeatureFlag('content-preview');
  
  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    // Update flag with preview mode
    client.setFlag('content-preview', {
      ...contentFlag,
      preview: !isPreviewMode
    });
  };
  
  return (
    <div className="content-preview">
      <div className="preview-controls">
        <button onClick={togglePreview}>
          {isPreviewMode ? 'Show Published' : 'Show Draft'}
        </button>
        {isPreviewMode && (
          <span className="preview-badge">Draft Mode</span>
        )}
      </div>
      
      {contentFlag?.structuredData && (
        <div className="content">
          <h1>{contentFlag.title}</h1>
          <div dangerouslySetInnerHTML={{ 
            __html: contentFlag.structuredData.content 
          }} />
        </div>
      )}
    </div>
  );
}
```

## 🔄 Dynamic Content Loading

### Example 6: Lazy Loading Content

**Scenario**: Load content only when needed for performance.

```jsx
import { useState, useEffect } from 'react';
import { useFeatureFlag } from './components/FeatureFlag';

function LazyContentLoader() {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState(null);
  const contentFlag = useFeatureFlag('lazy-content');
  
  useEffect(() => {
    if (isVisible && contentFlag?.entryId && !content) {
      // Load content when component becomes visible
      fetchContent(contentFlag).then(setContent);
    }
  }, [isVisible, contentFlag, content]);
  
  return (
    <div 
      className="lazy-content"
      onIntersection={() => setIsVisible(true)}
    >
      {content ? (
        <div className="loaded-content">
          <h2>{content.title}</h2>
          <p>{content.summary}</p>
        </div>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
}
```

### Example 7: Content Caching

**Scenario**: Cache content for better performance.

```jsx
import { useState, useEffect } from 'react';

const contentCache = new Map();

function CachedContent({ flagKey }) {
  const [content, setContent] = useState(null);
  const contentFlag = useFeatureFlag(flagKey);
  
  useEffect(() => {
    if (contentFlag?.entryId) {
      const cacheKey = `${contentFlag.entryId}-${contentFlag.environment}`;
      
      if (contentCache.has(cacheKey)) {
        setContent(contentCache.get(cacheKey));
      } else {
        fetchContent(contentFlag).then(fetchedContent => {
          contentCache.set(cacheKey, fetchedContent);
          setContent(fetchedContent);
        });
      }
    }
  }, [contentFlag]);
  
  if (!content) return <div>Loading...</div>;
  
  return (
    <div className="cached-content">
      <h1>{content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content.html }} />
    </div>
  );
}
```

## 🎯 Targeting Examples

### Example 8: Geographic Targeting

**Scenario**: Show different content based on user location.

```jsx
function GeographicContent() {
  const { client } = useLaunchDarkly();
  const contentFlag = useFeatureFlag('geographic-content');
  
  const setUserLocation = async (location) => {
    await client.identify({
      kind: 'user',
      key: 'user-123',
      custom: {
        country: location.country,
        region: location.region,
        city: location.city
      }
    });
  };
  
  return (
    <div className="geographic-content">
      <LocationSelector onLocationChange={setUserLocation} />
      
      {contentFlag?.structuredData && (
        <div className="localized-content">
          <h1>{contentFlag.title}</h1>
          <p>{contentFlag.structuredData.localizedMessage}</p>
        </div>
      )}
    </div>
  );
}
```

### Example 9: Time-Based Targeting

**Scenario**: Show different content based on time of day.

```jsx
function TimeBasedContent() {
  const { client } = useLaunchDarkly();
  const contentFlag = useFeatureFlag('time-based-content');
  
  useEffect(() => {
    const updateTimeContext = () => {
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay();
      
      client.identify({
        kind: 'user',
        key: 'user-123',
        custom: {
          hourOfDay: hour,
          dayOfWeek: dayOfWeek,
          isBusinessHours: hour >= 9 && hour <= 17,
          isWeekend: dayOfWeek === 0 || dayOfWeek === 6
        }
      });
    };
    
    updateTimeContext();
    const interval = setInterval(updateTimeContext, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [client]);
  
  return (
    <div className="time-based-content">
      {contentFlag?.structuredData && (
        <div className="time-sensitive-content">
          <h1>{contentFlag.title}</h1>
          <p>{contentFlag.structuredData.message}</p>
        </div>
      )}
    </div>
  );
}
```

## 🔧 Error Handling Examples

### Example 10: Graceful Fallbacks

**Scenario**: Handle content loading errors gracefully.

```jsx
function RobustContentLoader() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const contentFlag = useFeatureFlag('robust-content');
  
  const loadContent = async () => {
    if (!contentFlag?.entryId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const content = await fetchContent(contentFlag);
      setContent(content);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load content:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadContent();
  }, [contentFlag]);
  
  if (isLoading) return <div>Loading content...</div>;
  
  if (error) {
    return (
      <div className="error-fallback">
        <h2>Content Unavailable</h2>
        <p>We're having trouble loading this content.</p>
        <button onClick={loadContent}>Try Again</button>
      </div>
    );
  }
  
  if (!contentFlag?.structuredData) {
    return <DefaultContent />;
  }
  
  return (
    <div className="content">
      <h1>{contentFlag.title}</h1>
      <div dangerouslySetInnerHTML={{ 
        __html: contentFlag.structuredData.content 
      }} />
    </div>
  );
}
```

## 📊 Analytics Integration

### Example 11: Content Performance Tracking

**Scenario**: Track content performance and user engagement.

```jsx
function AnalyticsContent() {
  const contentFlag = useFeatureFlag('analytics-content');
  const { client } = useLaunchDarkly();
  
  const trackContentView = () => {
    if (contentFlag?.entryId) {
      client.track('content_viewed', {
        contentId: contentFlag.entryId,
        contentType: contentFlag.contentType,
        environment: contentFlag.environment
      });
    }
  };
  
  const trackContentInteraction = (interactionType) => {
    if (contentFlag?.entryId) {
      client.track('content_interaction', {
        contentId: contentFlag.entryId,
        interactionType,
        timestamp: new Date().toISOString()
      });
    }
  };
  
  useEffect(() => {
    trackContentView();
  }, [contentFlag]);
  
  return (
    <div className="analytics-content">
      {contentFlag?.structuredData && (
        <div className="content">
          <h1>{contentFlag.title}</h1>
          <p>{contentFlag.structuredData.description}</p>
          
          <div className="interactions">
            <button onClick={() => trackContentInteraction('like')}>
              👍 Like
            </button>
            <button onClick={() => trackContentInteraction('share')}>
              📤 Share
            </button>
            <button onClick={() => trackContentInteraction('bookmark')}>
              🔖 Bookmark
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🎉 Summary

These examples demonstrate the flexibility and power of the LaunchDarkly Contentstack Integration:

- ✅ **Simple content variations** for basic use cases
- ✅ **Asset management** for images and files
- ✅ **A/B testing** for conversion optimization
- ✅ **Personalization** based on user attributes
- ✅ **Preview mode** for content management
- ✅ **Performance optimization** with lazy loading and caching
- ✅ **Geographic and time-based targeting**
- ✅ **Error handling** with graceful fallbacks
- ✅ **Analytics integration** for tracking performance

## 📚 Next Steps

- **[API Reference](API.md)** - Understand the technical details
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Solve common issues
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to production

---

**Ready to implement?** Start with the [Quick Start Guide](QUICK_START.md) to get up and running quickly. 