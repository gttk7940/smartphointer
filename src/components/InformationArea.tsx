import type { FC } from 'react'
import type { DeviceMotionData } from '../domain/type'

type InformationAreaProps = DeviceMotionData

export const InformationArea: FC<InformationAreaProps> = ({
  acceleration,
  accelerationIncludingGravity,
  rotationRate,
  interval,
  orientation,
}) => {
  return (
    <ul>
      <li>
        acceleration
        <ul>
          <li>x: {acceleration?.x}</li>
          <li>y: {acceleration?.y}</li>
          <li>z: {acceleration?.z}</li>
        </ul>
      </li>
      <li>
        accelerationIncludingGravity
        <ul>
          <li>x: {accelerationIncludingGravity?.x}</li>
          <li>y: {accelerationIncludingGravity?.y}</li>
          <li>z: {accelerationIncludingGravity?.z}</li>
        </ul>
      </li>
      <li>
        rotationRate
        <ul>
          <li>alpha: {rotationRate?.alpha}</li>
          <li>beta: {rotationRate?.beta}</li>
          <li>gamma: {rotationRate?.gamma}</li>
        </ul>
      </li>
      <li>
        orientation
        <ul>
          <li>alpha: {orientation?.alpha}</li>
          <li>beta: {orientation?.beta}</li>
          <li>gamma: {orientation?.gamma}</li>
        </ul>
      </li>
      <li>interval: {interval}</li>
    </ul>
  )
}
