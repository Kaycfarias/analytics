"use client";

import { useEffect } from "react";
import { useAnalytics } from "./AnalyticsProvider";
import type { EventProperties } from "@analytics/sdk";

/**
 * Hook para tracking automático de pageviews
 *
 * @example
 * ```tsx
 * function PageLayout() {
 *   usePageview(); // Trackeia ao montar
 *   return <div>Content</div>;
 * }
 * ```
 */
export function usePageview(properties?: EventProperties) {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.pageview(properties);
  }, [analytics, properties]);
}

/**
 * Hook para tracking com deps reativas
 *
 * @example
 * ```tsx
 * function Product({ id }) {
 *   useTrackEvent('product_viewed', { productId: id }, [id]);
 *   return <div>Product {id}</div>;
 * }
 * ```
 */
export function useTrackEvent(
  eventName: string,
  properties?: EventProperties,
  deps: any[] = [],
) {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.track(eventName, properties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analytics, eventName, ...deps]);
}

/**
 * Hook para identificar usuário quando deps mudarem
 *
 * @example
 * ```tsx
 * function App({ user }) {
 *   useIdentify(user?.id, { email: user?.email }, [user]);
 *   return <div>App</div>;
 * }
 * ```
 */
export function useIdentify(
  userId: string | undefined,
  traits?: Record<string, any>,
  deps: any[] = [],
) {
  const analytics = useAnalytics();

  useEffect(() => {
    if (userId) {
      analytics.identify(userId, traits);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analytics, userId, ...deps]);
}
