'use client';

import { cloneElement, useEffect, type ReactElement, type MouseEvent } from 'react';
import { useAnalytics } from './AnalyticsProvider';
import type { EventProperties } from '@analytics/sdk';

export interface TrackClickProps {
  eventName: string;
  properties?: EventProperties;
  children: ReactElement;
}

/**
 * Wrapper para tracking de clicks
 * 
 * @example
 * ```tsx
 * <TrackClick eventName="cta_clicked" properties={{ location: 'hero' }}>
 *   <button>Sign Up</button>
 * </TrackClick>
 * ```
 */
export function TrackClick({ eventName, properties, children }: TrackClickProps) {
  const analytics = useAnalytics();

  const handleClick = (e: MouseEvent) => {
    analytics.track(eventName, properties);
    
    // Preserva onClick original se existir
    if (children.props.onClick) {
      children.props.onClick(e);
    }
  };

  return cloneElement(children, { onClick: handleClick });
}

export interface TrackViewProps {
  eventName: string;
  properties?: EventProperties;
  children: ReactElement;
}

/**
 * Wrapper para tracking de visualizações (mount)
 * 
 * @example
 * ```tsx
 * <TrackView eventName="modal_viewed" properties={{ type: 'signup' }}>
 *   <Modal>Content</Modal>
 * </TrackView>
 * ```
 */
export function TrackView({ eventName, properties, children }: TrackViewProps) {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.track(eventName, properties);
  }, [analytics, eventName, properties]);

  return children;
}
