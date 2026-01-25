import { useMemo } from 'react'
import type { FC } from 'react'
import { useWebRtcDataChannel } from '../hooks/useWebRtcDataChannel'
import { useRoomId } from '../hooks/useRoomId'
import { getSignalingUrl } from '../domain/signaling'

export const Monitor: FC = () => {
  const roomId = useRoomId({ generateIfMissing: true })

  const controllerUrl = useMemo(() => {
    if (!roomId) return null
    const url = new URL(window.location.href)
    url.searchParams.set('room', roomId)
    return url.toString()
  }, [roomId])

  const { isConnected } = useWebRtcDataChannel({
    roomId,
    isInitiator: true,
    signalingUrl: getSignalingUrl(),
  })

  return (
    <>
      <p>スマホで以下の URL を開いて接続してください。</p>
      {controllerUrl ? (
        <p>
          <a href={controllerUrl}>{controllerUrl}</a>
        </p>
      ) : (
        <p>接続用 URL を準備中です。</p>
      )}
      <p>{isConnected ? '接続済み' : '接続待ち'}</p>
    </>
  )
}
