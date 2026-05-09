export const getSignalingUrl = (): string => {
  if (window.location.href.includes('localhost')) {
    return 'ws://localhost:8080'
  }
  return import.meta.env.VITE_SIGNALING_URL ?? 'ws://localhost:8080'
}
