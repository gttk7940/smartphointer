import { useEffect } from 'react'
import type { FC } from 'react'
import { useDeviceOrientation } from '../hooks/useDeviceOrientation'
import { useRoundedDeviceOrientationData } from '../hooks/useRoundedDeviceOrientationData'
import { useWebRtcDataChannel } from '../hooks/useWebRtcDataChannel'
import { useRoomId } from '../hooks/useRoomId'
import { getSignalingUrl } from '../domain/signaling'

export const Controller: FC = () => {
  const roomId = useRoomId()

  const {
    orientation: originalOrientation,
    handleRequestDeviceOrientationPermission,
  } = useDeviceOrientation()
  const orientation = useRoundedDeviceOrientationData(originalOrientation)

  const { send, isConnected } = useWebRtcDataChannel({
    roomId,
    isInitiator: false,
    signalingUrl: getSignalingUrl(),
  })

  useEffect(() => {
    if (!roomId || !isConnected || !originalOrientation) return
    send(
      JSON.stringify({
        type: 'orientation',
        payload: orientation,
      }),
    )
  }, [isConnected, originalOrientation, orientation, roomId, send])

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
    </div>
  )
}
