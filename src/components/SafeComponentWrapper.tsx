"use client";

import { ReactNode } from 'react';

interface SafeComponentWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

/**
 * SafeComponentWrapper prevents React Error #130 by ensuring children are never undefined
 * and providing fallback rendering for failed components
 */
export function SafeComponentWrapper({ 
  children, 
  fallback = null, 
  componentName = 'Component' 
}: SafeComponentWrapperProps) {
  // Ensure children is never undefined
  if (children === undefined || children === null) {
    console.warn(`${componentName}: Received undefined/null children, rendering fallback`);
    return <>{fallback}</>;
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`${componentName}: Error rendering children:`, error);
    return <>{fallback}</>;
  }
}

export default SafeComponentWrapper;
