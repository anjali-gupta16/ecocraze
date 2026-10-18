import { supabase } from './supabase';
import { saveLocalEvent } from './store';
import { safeUUID } from './uuid';
import type { EventType, TrackingEvent } from '../types';

// Generate or retrieve a persistent session ID
export function getSessionId(): string {
  let sid = sessionStorage.getItem('pc_session_id');
  if (!sid) {
    sid = safeUUID();
    sessionStorage.setItem('pc_session_id', sid);
  }
  return sid;
}

export async function trackEvent(
  type: EventType,
  metadata: Record<string, unknown> = {},
  userId?: string | null
) {
  const sessionId = getSessionId();
  const eventPayload: TrackingEvent = {
    id: safeUUID(),
    session_id: sessionId,
    user_id: userId || null,
    type,
    metadata: {
      ...metadata,
      url: window.location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
  };

  // Always save locally for offline admin analytics
  saveLocalEvent(eventPayload);

  // Trigger GA4 pageview if it's a page_view event
  if (type === 'page_view') {
    ga4PageView(window.location.pathname);
  }

  // Push to Supabase if configured
  try {
    const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasConfig) {
      await supabase.from('events').insert({
        id: eventPayload.id,
        session_id: eventPayload.session_id,
        user_id: eventPayload.user_id,
        type: eventPayload.type,
        metadata: eventPayload.metadata,
      });
    }
  } catch (e) {
    // Non-blocking
    console.debug('Supabase event tracking fallback:', e);
  }
}

// Optional GA4 integration
export function ga4PageView(path: string) {
  const gaId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (gaId && typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', gaId, { page_path: path });
  }
}
