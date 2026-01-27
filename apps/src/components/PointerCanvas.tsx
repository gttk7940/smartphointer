import { useEffect, useRef } from 'react'
import type { FC } from 'react'
import type { PointerPosition } from '../domain/pointer'
import { pointerRange } from '../domain/pointer'

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

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    const xRatio = Math.max(-pointerRange, Math.min(pointerRange, position.x)) / pointerRange
    const yRatio = Math.max(-pointerRange, Math.min(pointerRange, position.y)) / pointerRange
    const x = ((xRatio + 1) / 2) * width
    const y = ((-yRatio + 1) / 2) * height

    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()
  }, [position])

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={Math.floor(window.innerHeight * 0.8)}
        style={{ display: 'block', width: '100vw', height: '80vh' }}
      />
    </div>
  )
}
