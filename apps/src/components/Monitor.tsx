import { useCallback, useMemo, useState } from 'react'
import type { FC } from 'react'
import { QrCode, Text, VStack } from '@chakra-ui/react'
import { useWebRtcDataChannel } from '../hooks/useWebRtcDataChannel'
import { useRoomId } from '../hooks/useRoomId'
import { getSignalingUrl } from '../domain/signaling'
import { PointerCanvas } from './PointerCanvas'
import type { PointerPosition } from '../domain/pointer'
import { defaultPointerPosition } from '../domain/pointer'

export const Monitor: FC = () => {
  const roomId = useRoomId({ generateIfMissing: true })
  const [position, setPosition] = useState<PointerPosition>(defaultPointerPosition)

  const controllerUrl = useMemo(() => {
    if (!roomId) return null
    const url = new URL(window.location.href)
    url.searchParams.set('room', roomId)
    return url.toString()
  }, [roomId])

  const handleMessage = useCallback((raw: string) => {
    try {
      const message = JSON.parse(raw) as {
        type?: string
        payload?: PointerPosition
      }
      if (message.type === 'pointer' && message.payload) {
        setPosition(message.payload)
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  const { isConnected } = useWebRtcDataChannel({
    roomId,
    isInitiator: true,
    signalingUrl: getSignalingUrl(),
    onMessage: handleMessage,
  })

  return (
    <VStack p={5}>
      {!isConnected &&
        (controllerUrl ? (
          <>
            <Text>スマホのカメラで以下の接続用 QR コードを読み取ってください。</Text>
            <QrCode.Root value={controllerUrl} size="2xl">
              <QrCode.Frame>
                <QrCode.Pattern />
              </QrCode.Frame>
            </QrCode.Root>
          </>
        ) : (
          <Text>接続用 QR コードを準備中です。</Text>
        ))}
      <Text>接続状態: {isConnected ? '接続済み' : '接続待ち'}</Text>
      {isConnected && <PointerCanvas position={position} />}
    </VStack>
  )
}
