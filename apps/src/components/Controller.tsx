import { useEffect } from 'react'
import type { FC } from 'react'
import { Button, Center, Text, VStack } from '@chakra-ui/react'
import { useDeviceOrientation } from '../hooks/useDeviceOrientation'
import { useWebRtcDataChannel } from '../hooks/useWebRtcDataChannel'
import { useRoomId } from '../hooks/useRoomId'
import { getSignalingUrl } from '../domain/signaling'
import { usePointer } from '../hooks/usePointer'

export const Controller: FC = () => {
  const roomId = useRoomId()
  const { orientation, handleRequestDeviceOrientationPermission } =
    useDeviceOrientation()
  const { position, step, startCalibration, confirmTopLeft, confirmBottomRight } =
    usePointer(orientation)
  const { send, isConnected } = useWebRtcDataChannel({
    roomId,
    isInitiator: false,
    signalingUrl: getSignalingUrl(),
  })

  useEffect(() => {
    if (!roomId || !isConnected || !position) return
    send(JSON.stringify({ type: 'pointer', payload: position }))
  }, [isConnected, position, roomId, send])

  if (!roomId) {
    return (
      <VStack p={5}>
        <Text>モニターで表示された QR コードをカメラで読み取って接続してください。</Text>
        <Text>スマホのカメラアプリを起動して QR を読み取ります。</Text>
      </VStack>
    )
  }

  const action = {
    idle: { label: '位置を調整', onClick: startCalibration },
    topLeft: { label: '左上端を指しています', onClick: confirmTopLeft },
    bottomRight: { label: '右下端を指しています', onClick: confirmBottomRight },
  }[step]

  return (
    <VStack minH="100vh" p={5}>
      <Text>接続状態: {isConnected ? '接続済み' : '接続中...'}</Text>
      <Button onClick={handleRequestDeviceOrientationPermission}>
        センサの使用を許可
      </Button>
      <Center flex="1">
        <Button
          w="75vw"
          h="75vw"
          fontSize="xl"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      </Center>
    </VStack>
  )
}
