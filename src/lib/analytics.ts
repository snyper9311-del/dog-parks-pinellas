const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined

export function initGA4(): void {
  if (!GA_ID || typeof window === 'undefined') return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).dataLayer = (window as any).dataLayer || []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).gtag = function (...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).dataLayer.push(args)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).gtag('js', new Date())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).gtag('config', GA_ID)
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (window as any).gtag
  if (typeof gtag === 'function') {
    gtag('event', eventName, params)
  }
}
