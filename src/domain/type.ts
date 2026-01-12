export type DeviceOrientationData = {
  alpha: number | null
  beta: number | null
  gamma: number | null
}

export type DeviceMotionData = {
  acceleration: DeviceMotionEventAcceleration | null
  accelerationIncludingGravity: DeviceMotionEventAcceleration | null
  rotationRate: DeviceMotionEventRotationRate | null
  interval: number
  orientation: DeviceOrientationData | null
}

export type RoundedDeviceMotionData = {
  acceleration: {
    x: number
    y: number
    z: number
  }
  accelerationIncludingGravity: {
    x: number
    y: number
    z: number
  }
  rotationRate: {
    alpha: number
    beta: number
    gamma: number
  }
  interval: number
  orientation: {
    alpha: number
    beta: number
    gamma: number
  }
}

export type DeviceMotionEventWithRequestPermission = DeviceMotionEvent & {
  requestPermission?: () => Promise<PermissionState>
}

export type DeviceOrientationEventWithRequestPermission = DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>
}
