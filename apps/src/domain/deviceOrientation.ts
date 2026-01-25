export type DeviceOrientationData = {
  alpha: number | null
  beta: number | null
  gamma: number | null
}

export type DeviceOrientationEventWithRequestPermission = DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>
}
