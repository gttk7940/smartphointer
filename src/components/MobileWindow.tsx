import type { FC } from 'react'
import { InformationArea } from './InformationArea';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { useRoundedDeviceOrientationData } from '../hooks/useRoundedDeviceOrientationData';

export const MobileWindow: FC = () => {
  const {
    orientation: originalOrientation,
    handleRequestDeviceOrientationPermission,
  } = useDeviceOrientation()

  const orientation = useRoundedDeviceOrientationData(originalOrientation)

  return (
    <>
      <InformationArea
        orientation={orientation}
      />
      <button onClick={handleRequestDeviceOrientationPermission}>
        DeviceOrientationEvent.requestPermission()
      </button>
    </>
  )
}
