import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { LDClient, LDContext, initialize } from 'launchdarkly-react-client-sdk';
import { launchDarklyConfig, createAnonymousContext, isLaunchDarklyConfigured } from '../lib/launchdarkly';

interface LaunchDarklyContextType {
  client: LDClient | null;
  flags: Record<string, any>;
  loading: boolean;
  error: string | null;
  identify: (context: LDContext) => void;
  isConfigured: boolean;
}

const LaunchDarklyContext = createContext<LaunchDarklyContextType | undefined>(undefined);

export const useLaunchDarkly = () => {
  const context = useContext(LaunchDarklyContext);
  if (context === undefined) {
    throw new Error('useLaunchDarkly must be used within a LaunchDarklyProvider');
  }
  return context;
};

interface LaunchDarklyProviderProps {
  children: React.ReactNode;
  userContext?: LDContext;
}

export const LaunchDarklyProvider: React.FC<LaunchDarklyProviderProps> = ({ 
  children, 
  userContext = createAnonymousContext() 
}) => {
  const [client, setClient] = useState<LDClient | null>(null);
  const [flags, setFlags] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<LDClient | null>(null);
  const isInitializing = useRef(false);
  const isConfigured = isLaunchDarklyConfigured();

  useEffect(() => {
    // If LaunchDarkly is not configured, skip initialization
    if (!isConfigured) {
      setLoading(false);
      setError('LaunchDarkly is not configured. Please add NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID to your environment variables.');
      return;
    }

    // Prevent multiple initializations
    if (isInitializing.current || clientRef.current) {
      return;
    }

    const initClient = async () => {
      try {
        isInitializing.current = true;
        setLoading(true);
        setError(null);

        // Initialize LaunchDarkly client
        const ldClient = initialize(launchDarklyConfig.clientSideID, userContext, {
          bootstrap: 'localStorage',
        });

        // Wait for client to be ready with timeout
        await ldClient.waitForInitialization(10000); // 10 second timeout

        // Set up flag change listener
        ldClient.on('change', (changes) => {
          setFlags(prevFlags => ({
            ...prevFlags,
            ...changes,
          }));
        });

        // Get initial flags
        const allFlags = ldClient.allFlags();
        setFlags(allFlags);

        clientRef.current = ldClient;
        setClient(ldClient);
      } catch (err) {
        console.error('Failed to initialize LaunchDarkly client:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize LaunchDarkly');
      } finally {
        setLoading(false);
        isInitializing.current = false;
      }
    };

    initClient();

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        try {
          clientRef.current.close();
        } catch (err) {
          console.error('Error closing LaunchDarkly client:', err);
        }
        clientRef.current = null;
      }
      isInitializing.current = false;
    };
  }, [isConfigured]); // Add isConfigured to dependencies

  const identify = (context: LDContext) => {
    if (clientRef.current) {
      try {
        clientRef.current.identify(context);
      } catch (err) {
        console.error('Error identifying user:', err);
      }
    }
  };

  const value: LaunchDarklyContextType = {
    client: clientRef.current,
    flags,
    loading,
    error,
    identify,
    isConfigured,
  };

  return (
    <LaunchDarklyContext.Provider value={value}>
      {children}
    </LaunchDarklyContext.Provider>
  );
}; 