import type { DeviceOrientationData } from './deviceOrientation'

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

const toRoundedValue = (value: number | null | undefined) => {
  if (value === null || value === undefined) return null
  return Math.round(value)
}

export const toPointerPosition = (
  orientation: DeviceOrientationData | null,
): PointerPosition | null => {
  if (!orientation) return null
  const alpha = toRoundedValue(orientation.alpha)
  const beta = toRoundedValue(orientation.beta)
  if (alpha === null || beta === null) return null

  const toRange = (value: number) =>
    clamp(Math.round((value / 180) * pointerRange), -pointerRange, pointerRange)

  return {
    x: toRange(alpha),
    y: toRange(beta),
  }
}
