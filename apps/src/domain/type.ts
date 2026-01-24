export type DeviceOrientationData = {
  alpha: number | null
  beta: number | null
  gamma: number | null
}

export type RoundedDeviceOrientationData = {
  alpha: number
  beta: number
  gamma: number
}

export type DeviceOrientationEventWithRequestPermission = DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>
}
