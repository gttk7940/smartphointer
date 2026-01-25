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
    return <div>モニターで表示された URL からアクセスしてください。</div>
  }

  return <p>{isConnected ? '接続済み' : '接続中...'}</p>
}
