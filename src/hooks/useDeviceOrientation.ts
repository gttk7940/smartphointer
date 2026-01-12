import { useState } from 'react'
import type {
  DeviceOrientationData,
  DeviceOrientationEventWithRequestPermission,
} from '../domain/type'

export type UseDeviceOrientation = {
  orientation: DeviceOrientationData | null
  handleRequestDeviceOrientationPermission: () => void
}

export const useDeviceOrientation = (): UseDeviceOrientation => {
  const [orientation, setOrientation] = useState<DeviceOrientationData | null>(null)

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    })
  }

  const handleRequestDeviceOrientationPermission = () => {
    const DeviceOrientationEvent = window.DeviceOrientationEvent as unknown as DeviceOrientationEventWithRequestPermission
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
    orientation,
    handleRequestDeviceOrientationPermission: handleRequestDeviceOrientationPermission,
  }
}
