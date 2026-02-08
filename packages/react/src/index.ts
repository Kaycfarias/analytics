/**
 * @analytics/react - React integration for Analytics SDK
 *
 * @example
 * ```tsx
 * import { AnalyticsProvider, useAnalytics, TrackClick } from '@analytics/react';
 *
 * function App() {
 *   return (
 *     <AnalyticsProvider config={{ apiUrl: 'https://api.example.com/events' }}>
 *       <MyApp />
 *     </AnalyticsProvider>
 *   );
 * }
 *
 * function MyApp() {
 *   const analytics = useAnalytics();
 *
 *   return (
 *     <TrackClick eventName="signup_clicked" properties={{ source: 'homepage' }}>
 *       <button>Sign Up</button>
 *     </TrackClick>
 *   );
 * }
 * ```
 */

export { AnalyticsProvider, useAnalytics } from "./AnalyticsProvider";
export { usePageview, useTrackEvent, useIdentify } from "./hooks";
export { TrackClick, TrackView } from "./components";

// Re-export types from SDK
export type {
  AnalyticsConfig,
  EventProperties,
  UserTraits,
  EventContext,
} from "@analytics/sdk";
