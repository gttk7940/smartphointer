import type { FC } from 'react'
import { PointerArea } from './PointerArea';
import { InformationArea } from './InformationArea';
import { useDeviceMotion } from '../hooks/useDeviceMotion';
import { useRoundedDeviceMotionData } from '../hooks/useRoundedDeviceMotionData';

export const MobileWindow: FC = () => {
  const {
    acceleration: originalAcceleration,
    accelerationIncludingGravity: originalAccelerationIncludingGravity,
    rotationRate: originalRotationRate,
    interval: originalInterval,
    handleRequestDeviceMotionPermission,
  } = useDeviceMotion()

  const {
    acceleration,
    accelerationIncludingGravity,
    rotationRate,
    interval,
  } = useRoundedDeviceMotionData({
    acceleration: originalAcceleration,
    accelerationIncludingGravity: originalAccelerationIncludingGravity,
    rotationRate: originalRotationRate,
    interval: originalInterval,
  })

  return (
    <>
      <PointerArea />
      <InformationArea
        acceleration={acceleration}
        accelerationIncludingGravity={accelerationIncludingGravity}
        rotationRate={rotationRate}
        interval={interval}
      />
      <button onClick={handleRequestDeviceMotionPermission}>
        DeviceMotionEvent.requestPermission()
      </button>
    </>
  )
}
