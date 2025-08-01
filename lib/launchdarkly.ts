import { LDContext } from 'launchdarkly-react-client-sdk';

const clientSideID = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID;
const environment = process.env.NEXT_PUBLIC_LAUNCHDARKLY_ENVIRONMENT || 'production';

export const launchDarklyConfig = {
  clientSideID: clientSideID || 'placeholder-client-id',
  context: {
    kind: 'user',
    key: 'anonymous-user',
    name: 'Anonymous User',
  } as LDContext,
  options: {
    bootstrap: 'localStorage',
  },
};

export const createUserContext = (userKey: string, userName?: string): LDContext => ({
  kind: 'user',
  key: userKey,
  name: userName || 'Anonymous User',
});

export const createAnonymousContext = (): LDContext => ({
  kind: 'user',
  key: 'anonymous-user',
  name: 'Anonymous User',
});

// Helper function to check if LaunchDarkly is properly configured
export const isLaunchDarklyConfigured = (): boolean => {
  return !!(process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID);
}; 