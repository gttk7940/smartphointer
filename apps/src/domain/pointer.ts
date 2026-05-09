export type PointerPosition = {
  x: number
  y: number
}

export const pointerRange = 100

export const defaultPointerPosition: PointerPosition = {
  x: 0,
  y: 0,
}

export type PointerCalibration = {
  topLeft: {
    alpha: number
    beta: number
  }
  bottomRight: {
    alpha: number
    beta: number
  }
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

// 角度差を (-180, 180] に正規化。alpha の 360→0 循環を吸収するために使う。
const wrapDelta = (delta: number) => (((delta % 360) + 540) % 360) - 180

const mapAngleToRange = (value: number, start: number, end: number) => {
  const span = wrapDelta(end - start)
  if (span === 0) return 0
  const ratio = clamp(wrapDelta(value - start) / span, 0, 1)
  return (ratio * 2 - 1) * pointerRange
}

export const toPointerPosition = (
  alpha: number,
  beta: number,
  calibration: PointerCalibration,
): PointerPosition => ({
  x: mapAngleToRange(alpha, calibration.topLeft.alpha, calibration.bottomRight.alpha),
  y: -mapAngleToRange(beta, calibration.topLeft.beta, calibration.bottomRight.beta),
})
