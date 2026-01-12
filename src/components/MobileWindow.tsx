import type { FC } from 'react'
import { InformationArea } from './InformationArea';
import { useDeviceMotion } from '../hooks/useDeviceMotion';
import { useRoundedDeviceMotionData } from '../hooks/useRoundedDeviceMotionData';

export const MobileWindow: FC = () => {
  const {
    acceleration: originalAcceleration,
    accelerationIncludingGravity: originalAccelerationIncludingGravity,
    rotationRate: originalRotationRate,
    interval: originalInterval,
    orientation: originalOrientation,
    handleRequestDeviceMotionPermission,
  } = useDeviceMotion()

  const {
    acceleration,
    accelerationIncludingGravity,
    rotationRate,
    interval,
    orientation,
  } = useRoundedDeviceMotionData({
    acceleration: originalAcceleration,
    accelerationIncludingGravity: originalAccelerationIncludingGravity,
    rotationRate: originalRotationRate,
    interval: originalInterval,
    orientation: originalOrientation,
  })

  return (
    <>
      <InformationArea
        acceleration={acceleration}
        accelerationIncludingGravity={accelerationIncludingGravity}
        rotationRate={rotationRate}
        interval={interval}
        orientation={orientation}
      />
      <button onClick={handleRequestDeviceMotionPermission}>
        DeviceMotionEvent.requestPermission()
      </button>
    </>
  )
}
