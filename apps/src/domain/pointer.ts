export type PointerPosition = {
  x: number
  y: number
}

export const pointerRange = 100

export const pointerCanvasSize = {
  width: pointerRange * 2,
  height: pointerRange * 2,
}

export const defaultPointerPosition: PointerPosition = {
  x: 0,
  y: 0,
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

export const mapToRange = (value: number, start: number, end: number) => {
  if (start === end) return 0
  const ratio = (value - start) / (end - start)
  const clampedRatio = clamp(ratio, 0, 1)
  return clamp((clampedRatio * 2 - 1) * pointerRange, -pointerRange, pointerRange)
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

export const toPointerPosition = (
  alpha: number,
  beta: number,
  calibration: PointerCalibration | null,
): PointerPosition => {
  if (calibration) {
    return {
      x: mapToRange(alpha, calibration.topLeft.alpha, calibration.bottomRight.alpha),
      y: -mapToRange(beta, calibration.topLeft.beta, calibration.bottomRight.beta),
    }
  }

  const toRange = (value: number) => clamp((value / 180) * pointerRange, -pointerRange, pointerRange)
  return {
    x: toRange(alpha),
    y: -toRange(beta),
  }
}
