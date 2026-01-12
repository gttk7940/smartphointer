import type { FC } from 'react'
import type { RoundedDeviceOrientationData } from '../domain/type'

type InformationAreaProps = {
  orientation: RoundedDeviceOrientationData
}

export const InformationArea: FC<InformationAreaProps> = ({
  orientation,
}) => {
  return (
    <ul>
      <li>
        orientation
        <ul>
          <li>alpha: {orientation.alpha}</li>
          <li>beta: {orientation.beta}</li>
          <li>gamma: {orientation.gamma}</li>
        </ul>
      </li>
    </ul>
  )
}
