import { LDContext } from 'launchdarkly-react-client-sdk';

const clientSideID = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID;
const environment = process.env.NEXT_PUBLIC_LAUNCHDARKLY_ENVIRONMENT || 'production';

if (!clientSideID) {
  throw new Error('LaunchDarkly client ID is not configured. Please add NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID to your .env.local file.');
}

export const launchDarklyConfig = {
  clientSideID,
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