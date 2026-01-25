import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  DeviceOrientationData,
  DeviceOrientationEventWithRequestPermission,
} from '../domain/deviceOrientation'

export type UseDeviceOrientation = {
  orientation: DeviceOrientationData | null
  handleRequestDeviceOrientationPermission: () => void
}

export const useDeviceOrientation = (): UseDeviceOrientation => {
  const [orientation, setOrientation] = useState<DeviceOrientationData | null>(null)
  const isListeningRef = useRef(false)

  const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    })
  }, [])

  const startListening = useCallback(() => {
    if (isListeningRef.current) return
    window.addEventListener('deviceorientation', handleDeviceOrientation)
    isListeningRef.current = true
  }, [handleDeviceOrientation])

  const handleRequestDeviceOrientationPermission = useCallback(() => {
    const DeviceOrientationEvent = window.DeviceOrientationEvent as unknown as DeviceOrientationEventWithRequestPermission
    if (
      DeviceOrientationEvent &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      DeviceOrientationEvent.requestPermission()
        .then((permissionState) => {
          if (permissionState === 'granted') {
            startListening()
          } else {
            window.alert('Device orientation permission denied')
          }
        })
        .catch(console.error)
    } else {
      startListening()
    }
  }, [startListening])

  useEffect(() => {
    return () => {
      if (!isListeningRef.current) return
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
      isListeningRef.current = false
    }
  }, [handleDeviceOrientation])

  return {
    orientation,
    handleRequestDeviceOrientationPermission,
  }
}
