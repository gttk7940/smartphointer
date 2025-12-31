import type { DeviceMotionData, RoundedDeviceMotionData } from '../domain/type'

export type UseRoundedDeviceMotionData = RoundedDeviceMotionData

export const useRoundedDeviceMotionData = ({
  acceleration,
  accelerationIncludingGravity,
  rotationRate,
  interval,
}:DeviceMotionData): UseRoundedDeviceMotionData => {
  const roundOrZero = (data: number | null | undefined): number => {
    if (data === null || data === undefined) {
      return 0
    }
    // 小数第一位で四捨五入
    return Math.round(data)
  }

  return {
    acceleration: {
      x: roundOrZero(acceleration?.x),
      y: roundOrZero(acceleration?.y),
      z: roundOrZero(acceleration?.z),
    },
    accelerationIncludingGravity: {
      x: roundOrZero(accelerationIncludingGravity?.x),
      y: roundOrZero(accelerationIncludingGravity?.y),
      z: roundOrZero(accelerationIncludingGravity?.z),
    },
    rotationRate: {
      alpha: roundOrZero(rotationRate?.alpha),
      beta: roundOrZero(rotationRate?.beta),
      gamma: roundOrZero(rotationRate?.gamma),
    },
    interval: roundOrZero(interval),
  }
}
