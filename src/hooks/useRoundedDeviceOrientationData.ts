import type { DeviceOrientationData, RoundedDeviceOrientationData } from '../domain/type'

export type UseRoundedDeviceOrientationData = RoundedDeviceOrientationData

export const useRoundedDeviceOrientationData = (
  orientation: DeviceOrientationData | null,
): UseRoundedDeviceOrientationData => {
  const roundOrZero = (data: number | null | undefined): number => {
    if (data === null || data === undefined) {
      return 0
    }
    // 小数第一位で四捨五入
    return Math.round(data)
  }

  return {
    alpha: roundOrZero(orientation?.alpha),
    beta: roundOrZero(orientation?.beta),
    gamma: roundOrZero(orientation?.gamma),
  }
}
