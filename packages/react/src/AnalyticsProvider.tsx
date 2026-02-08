"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { Analytics, type AnalyticsConfig } from "@analytics/sdk";

const AnalyticsContext = createContext<Analytics | null>(null);

export interface AnalyticsProviderProps {
  config: AnalyticsConfig;
  children: ReactNode;
}

/**
 * Provider para Analytics SDK
 *
 * @example
 * ```tsx
 * <AnalyticsProvider config={{ apiUrl: 'https://api.example.com/events' }}>
 *   <App />
 * </AnalyticsProvider>
 * ```
 */
export function AnalyticsProvider({
  config,
  children,
}: AnalyticsProviderProps) {
  const analytics = useMemo(
    () => new Analytics(config),
    [config.apiUrl], // Reinicializa apenas se apiUrl mudar
  );

  useEffect(() => {
    // Cleanup: flush eventos pendentes ao desmontar
    return () => {
      analytics.flush();
    };
  }, [analytics]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Hook para acessar instância do Analytics
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const analytics = useAnalytics();
 *
 *   const handleClick = () => {
 *     analytics.track('button_clicked', { label: 'signup' });
 *   };
 *
 *   return <button onClick={handleClick}>Sign Up</button>;
 * }
 * ```
 */
export function useAnalytics(): Analytics {
  const analytics = useContext(AnalyticsContext);

  if (!analytics) {
    throw new Error(
      "useAnalytics must be used within AnalyticsProvider. " +
        "Wrap your app with <AnalyticsProvider>.",
    );
  }

  return analytics;
}
