import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import type { RoundedDeviceOrientationData } from '../domain/type'

type PointerCanvasProps = {
  orientation: RoundedDeviceOrientationData
}

// レーザーポインター表示用のキャンバス。
export const PointerCanvas: FC<PointerCanvasProps> = ({ orientation }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const padding = 12
    const plotWidth = width - padding * 2
    const plotHeight = height - padding * 2

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value))
    const xValue = clamp(orientation.alpha, -180, 180)
    const yValue = clamp(orientation.beta, -180, 180)

    const x = padding + ((xValue + 180) / 360) * plotWidth
    const y = padding + ((-yValue + 180) / 360) * plotHeight

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1)

    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()
  }, [orientation])

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        style={{ display: 'block' }}
      />
    </div>
  )
}
