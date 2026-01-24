import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import type { RoundedDeviceOrientationData } from '../domain/type'

type InformationAreaProps = {
  orientation: RoundedDeviceOrientationData
}

export const InformationArea: FC<InformationAreaProps> = ({
  orientation,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    const { width, height } = canvas
    const padding = 20
    const plotWidth = width - padding * 2
    const plotHeight = height - padding * 2

    const xValue = Math.max(-180, Math.min(180, orientation.alpha))
    const yValue = Math.max(-180, Math.min(180, orientation.beta))

    const x = padding + ((xValue + 180) / 360) * plotWidth
    const y = padding + ((-yValue + 180) / 360) * plotHeight

    ctx.clearRect(0, 0, width, height)

    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1
    ctx.strokeRect(padding, padding, plotWidth, plotHeight)

    ctx.strokeStyle = '#cbd5f5'
    ctx.beginPath()
    ctx.moveTo(padding, padding + plotHeight / 2)
    ctx.lineTo(padding + plotWidth, padding + plotHeight / 2)
    ctx.moveTo(padding + plotWidth / 2, padding)
    ctx.lineTo(padding + plotWidth / 2, padding + plotHeight)
    ctx.stroke()

    ctx.fillStyle = '#2563eb'
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#0f172a'
    ctx.stroke()
  }, [orientation])

  return (
    <ul>
      <li>
        orientation
        <ul>
          <li>alpha: {orientation.alpha}</li>
          <li>beta: {orientation.beta}</li>
          <li>gamma: {orientation.gamma}</li>
        </ul>
      </li>
      <li>
        plot
        <div>
          <canvas
            ref={canvasRef}
            width={240}
            height={240}
            style={{ display: 'block', border: '1px solid #0f172a' }}
          />
        </div>
      </li>
    </ul>
  )
}
