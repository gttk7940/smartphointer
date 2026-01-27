import { useEffect } from 'react'
import type { FC } from 'react'
import { useDeviceOrientation } from '../hooks/useDeviceOrientation'
import { useWebRtcDataChannel } from '../hooks/useWebRtcDataChannel'
import { useRoomId } from '../hooks/useRoomId'
import { getSignalingUrl } from '../domain/signaling'
import { usePointer } from '../hooks/usePointer'

export const Controller: FC = () => {
  const roomId = useRoomId()

  const {
    orientation: originalOrientation,
    handleRequestDeviceOrientationPermission,
  } = useDeviceOrientation()
  const { position, step, startCalibration, confirmTopLeft, confirmBottomRight } =
    usePointer(originalOrientation)

  const { send, isConnected } = useWebRtcDataChannel({
    roomId,
    isInitiator: false,
    signalingUrl: getSignalingUrl(),
  })

  useEffect(() => {
    if (!roomId || !isConnected || !position) return
    send(
      JSON.stringify({
        type: 'pointer',
        payload: position,
      }),
    )
  }, [isConnected, position, roomId, send])

  if (!roomId) {
    return (
      <div>
        <p>モニターで表示された QR コードをカメラで読み取って接続してください。</p>
        <p>スマホのカメラアプリを起動して QR を読み取ります。</p>
      </div>
    )
  }

  return (
    <div>
      <p>接続状態: {isConnected ? '接続済み' : '接続中...'}</p>
      <button onClick={handleRequestDeviceOrientationPermission}>
        センサの使用を許可
      </button>
      <button onClick={startCalibration}>位置を調整</button>
      {step === 'topLeft' && (
        <button onClick={confirmTopLeft}>左上端を指しています</button>
      )}
      {step === 'bottomRight' && (
        <button onClick={confirmBottomRight}>右下端を指しています</button>
      )}
    </div>
  )
}
