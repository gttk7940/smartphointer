import { useState } from 'react'
import type { DeviceMotionData, DeviceMotionEventWithRequestPermission } from '../domain/type'

export type UseDeviceMotion = DeviceMotionData & {
  handleRequestDeviceMotionPermission: () => void
}

export const useDeviceMotion = (): UseDeviceMotion => {
  const [deviceMotion, setDeviceMotion] = useState<DeviceMotionData>({
    acceleration: null,
    accelerationIncludingGravity: null,
    rotationRate: null,
    interval: 0,
  })

  const handleDeviceMotion = (event: DeviceMotionEvent) => {
    setDeviceMotion({
      acceleration: event.acceleration,
      accelerationIncludingGravity: event.accelerationIncludingGravity,
      rotationRate: event.rotationRate,
      interval: event.interval,
    })
  }

  const handleRequestDeviceMotionPermission = () => {
    const DeviceMotionEvent = window.DeviceMotionEvent as unknown as DeviceMotionEventWithRequestPermission
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
  }
  
  return {
    acceleration: deviceMotion.acceleration,
    accelerationIncludingGravity: deviceMotion.accelerationIncludingGravity,
    rotationRate: deviceMotion.rotationRate,
    interval: deviceMotion.interval,
    handleRequestDeviceMotionPermission: handleRequestDeviceMotionPermission,
  }
}
