/**
 * Analytics SDK - Event tracking para browser
 *
 * @example
 * ```typescript
 * import { Analytics } from '@analytics/sdk';
 *
 * const analytics = new Analytics({
 *   apiUrl: 'https://api.myapp.com/events'
 * });
 *
 * analytics.track('button_clicked', { button: 'signup' });
 * analytics.pageview();
 * analytics.identify('user123', { email: 'user@example.com' });
 * ```
 */

export { Analytics } from "./tracker";
export type {
  AnalyticsConfig,
  AnalyticsEvent,
  EventProperties,
  UserTraits,
  EventContext,
  SendResult,
} from "./types";
