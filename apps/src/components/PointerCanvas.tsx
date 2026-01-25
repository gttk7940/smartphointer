import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import type { PointerPosition } from '../domain/pointer'
import { pointerCanvasSize, pointerRange } from '../domain/pointer'

type PointerCanvasProps = {
  position: PointerPosition
}

// レーザーポインター表示用のキャンバス。
export const PointerCanvas: FC<PointerCanvasProps> = ({ position }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const centerX = width / 2
    const centerY = height / 2

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 1
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1)

    const x = centerX + Math.max(-pointerRange, Math.min(pointerRange, position.x))
    const y = centerY - Math.max(-pointerRange, Math.min(pointerRange, position.y))

    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()
  }, [position])

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={pointerCanvasSize.width}
        height={pointerCanvasSize.height}
        style={{ display: 'block' }}
      />
    </div>
  )
}
