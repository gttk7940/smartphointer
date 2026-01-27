import { useCallback, useMemo, useState } from 'react'
import type { DeviceOrientationData } from '../domain/deviceOrientation'
import {
  type PointerCalibration,
  type PointerPosition,
  toPointerPosition,
} from '../domain/pointer'

type CalibrationPoint = {
  alpha: number
  beta: number
}

type CalibrationStep = 'idle' | 'topLeft' | 'bottomRight'

const toPointerPositionFromOrientation = (
  orientation: DeviceOrientationData | null,
  calibration: PointerCalibration | null,
): PointerPosition | null => {
  if (!orientation) return null
  const alpha = orientation.alpha
  const beta = orientation.beta
  if (alpha === null || alpha === undefined) return null
  if (beta === null || beta === undefined) return null
  return toPointerPosition(alpha, beta, calibration)
}

export const usePointer = (orientation: DeviceOrientationData | null) => {
  const [calibration, setCalibration] = useState<PointerCalibration | null>(null)
  const [step, setStep] = useState<CalibrationStep>('idle')
  const [topLeft, setTopLeft] = useState<CalibrationPoint | null>(null)

  const startCalibration = useCallback(() => {
    setCalibration(null)
    setTopLeft(null)
    setStep('topLeft')
  }, [])

  const confirmTopLeft = useCallback(() => {
    if (!orientation) return
    const alpha = orientation.alpha
    const beta = orientation.beta
    if (alpha === null || alpha === undefined) return
    if (beta === null || beta === undefined) return
    setTopLeft({ alpha, beta })
    setStep('bottomRight')
  }, [orientation])

  const confirmBottomRight = useCallback(() => {
    if (!orientation || !topLeft) return
    const alpha = orientation.alpha
    const beta = orientation.beta
    if (alpha === null || alpha === undefined) return
    if (beta === null || beta === undefined) return
    setCalibration({ topLeft, bottomRight: { alpha, beta } })
    setStep('idle')
  }, [orientation, topLeft])

  const position = useMemo(
    () => toPointerPositionFromOrientation(orientation, calibration),
    [orientation, calibration],
  )

  return {
    position,
    step,
    startCalibration,
    confirmTopLeft,
    confirmBottomRight,
  }
}
