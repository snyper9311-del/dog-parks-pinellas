export function initGA4(): void {
  // Implementation in Phase 7
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window !== 'undefined' && typeof (window as Window & { gtag?: unknown }).gtag === 'function') {
    ;(window as unknown as { gtag: (event: string, name: string, params: Record<string, unknown>) => void }).gtag('event', eventName, params)
  }
}
