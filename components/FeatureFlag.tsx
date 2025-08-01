import React from 'react';
import { useLaunchDarkly } from './LaunchDarklyProvider';

interface FeatureFlagProps {
  flagKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  defaultValue?: boolean;
}

export const FeatureFlag: React.FC<FeatureFlagProps> = ({ 
  flagKey, 
  children, 
  fallback = null,
  defaultValue = false 
}) => {
  const { flags, loading } = useLaunchDarkly();

  if (loading) {
    return <div>Loading feature flags...</div>;
  }

  const flagValue = flags[flagKey];
  const isEnabled = flagValue !== undefined ? flagValue : defaultValue;

  return isEnabled ? <>{children}</> : <>{fallback}</>;
};

export const useFeatureFlag = (flagKey: string, defaultValue: boolean = false) => {
  const { flags, loading } = useLaunchDarkly();
  
  if (loading) {
    return defaultValue;
  }

  const flagValue = flags[flagKey];
  return flagValue !== undefined ? flagValue : defaultValue;
}; 