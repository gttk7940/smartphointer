export type DeviceMotionData = {
  acceleration: DeviceMotionEventAcceleration | null
  accelerationIncludingGravity: DeviceMotionEventAcceleration | null
  rotationRate: DeviceMotionEventRotationRate | null
  interval: number
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
}

export type DeviceMotionEventWithRequestPermission = DeviceMotionEvent & {
  requestPermission?: () => Promise<PermissionState>
}
