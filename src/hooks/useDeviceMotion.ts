import { useState } from 'react'
import type {
  DeviceMotionData,
  DeviceMotionEventWithRequestPermission,
  DeviceOrientationEventWithRequestPermission,
} from '../domain/type'

export type UseDeviceMotion = DeviceMotionData & {
  handleRequestDeviceMotionPermission: () => void
}

export const useDeviceMotion = (): UseDeviceMotion => {
  const [deviceMotion, setDeviceMotion] = useState<DeviceMotionData>({
    acceleration: null,
    accelerationIncludingGravity: null,
    rotationRate: null,
    interval: 0,
    orientation: null,
  })

  const handleDeviceMotion = (event: DeviceMotionEvent) => {
    setDeviceMotion(prev => ({
      ...prev,
      acceleration: event.acceleration,
      accelerationIncludingGravity: event.accelerationIncludingGravity,
      rotationRate: event.rotationRate,
      interval: event.interval,
    }))
  }

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    setDeviceMotion(prev => ({
      ...prev,
      orientation: {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      },
    }))
  }

  const handleRequestDeviceMotionPermission = () => {
    const DeviceMotionEvent = window.DeviceMotionEvent as unknown as DeviceMotionEventWithRequestPermission
    const DeviceOrientationEvent = window.DeviceOrientationEvent as unknown as DeviceOrientationEventWithRequestPermission
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      // iOS 13+ の Safari
      // 許可を取得
      DeviceMotionEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          // 許可を得られた場合、devicemotionをイベントリスナーに追加
          window.addEventListener('devicemotion', e => {
            // devicemotionのイベント処理
            handleDeviceMotion(e)
          })
        } else {
          // 許可を得られなかった場合の処理
          window.alert('Device motion permission denied')
        }
      })
      .catch(console.error) // https通信でない場合などで許可を取得できなかった場合
    } else {
      // 上記以外のブラウザ
      window.addEventListener('devicemotion', e => {
        // devicemotionのイベント処理
        handleDeviceMotion(e)
      })
    }

    if (
      DeviceOrientationEvent &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      // iOS 13+ の Safari
      // 許可を取得
      DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          // 許可を得られた場合、deviceorientationをイベントリスナーに追加
          window.addEventListener('deviceorientation', e => {
            // deviceorientationのイベント処理
            handleDeviceOrientation(e)
          })
        } else {
          // 許可を得られなかった場合の処理
          window.alert('Device orientation permission denied')
        }
      })
      .catch(console.error) // https通信でない場合などで許可を取得できなかった場合
    } else {
      // 上記以外のブラウザ
      window.addEventListener('deviceorientation', e => {
        // deviceorientationのイベント処理
        handleDeviceOrientation(e)
      })
    }
  }
  
  return {
    acceleration: deviceMotion.acceleration,
    accelerationIncludingGravity: deviceMotion.accelerationIncludingGravity,
    rotationRate: deviceMotion.rotationRate,
    interval: deviceMotion.interval,
    orientation: deviceMotion.orientation,
    handleRequestDeviceMotionPermission: handleRequestDeviceMotionPermission,
  }
}
