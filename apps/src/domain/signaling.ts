export const getSignalingUrl = (): string => {
  const isLocalhostUrl = window.location.href.includes('localhost')
  if (!isLocalhostUrl) {
    return import.meta.env.VITE_SIGNALING_URL ?? 'ws://localhost:8080'
  }

  return 'ws://localhost:8080'
}
