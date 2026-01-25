import type { FC } from 'react'
import { useWebRtcDataChannel } from '../hooks/useWebRtcDataChannel'
import { useRoomId } from '../hooks/useRoomId'
import { getSignalingUrl } from '../domain/signaling'

export const Controller: FC = () => {
  const roomId = useRoomId()

  const { isConnected } = useWebRtcDataChannel({
    roomId,
    isInitiator: false,
    signalingUrl: getSignalingUrl(),
  })

  if (!roomId) {
    return <p>モニターで表示された QR コードをカメラで読み取って接続してください。</p>
  }

  return <p>接続状態: {isConnected ? '接続済み' : '接続中...'}</p>
}
