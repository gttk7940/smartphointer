import { useCallback, useEffect, useRef, useState } from 'react'

type SignalingMessage =
  | { type: 'ready' }
  | { type: 'offer'; payload: RTCSessionDescriptionInit }
  | { type: 'answer'; payload: RTCSessionDescriptionInit }
  | { type: 'candidate'; payload: RTCIceCandidateInit }

type UseWebRtcDataChannelOptions = {
  roomId: string | null
  isInitiator: boolean
  signalingUrl: string
  onMessage?: (data: string) => void
}

type UseWebRtcDataChannelResult = {
  send: (data: string) => void
  isConnected: boolean
}

const buildSignalingUrl = (signalingUrl: string, roomId: string) =>
  `${signalingUrl}?room=${encodeURIComponent(roomId)}`

const parseMessage = (data: unknown): SignalingMessage | null => {
  try {
    return JSON.parse(String(data)) as SignalingMessage
  } catch (error) {
    console.error(error)
    return null
  }
}

export const useWebRtcDataChannel = ({
  roomId,
  isInitiator,
  signalingUrl,
  onMessage,
}: UseWebRtcDataChannelOptions): UseWebRtcDataChannelResult => {
  const [isConnected, setIsConnected] = useState(false)
  const channelRef = useRef<RTCDataChannel | null>(null)

  const send = useCallback((data: string) => {
    const channel = channelRef.current
    if (channel?.readyState === 'open') {
      channel.send(data)
    }
  }, [])

  useEffect(() => {
    if (!roomId) {
      return
    }

    let offerStarted = false
    // SDP が届く前の ICE candidate を一時保持する。
    let pendingCandidates: RTCIceCandidateInit[] = []

    const ws = new WebSocket(buildSignalingUrl(signalingUrl, roomId))
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
    })

    const closeSignaling = () => {
      if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
        return
      }
      ws.close()
    }

    const sendSignal = (message: SignalingMessage) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message))
      }
    }

    const sendReady = () => {
      sendSignal({ type: 'ready' })
    }

    const setupDataChannel = (channel: RTCDataChannel) => {
      channelRef.current = channel

      channel.onopen = () => {
        setIsConnected(true)
        // P2P が確立したらシグナリングは不要なので閉じる。
        closeSignaling()
      }

      channel.onclose = () => {
        setIsConnected(false)
      }

      channel.onerror = () => {
        setIsConnected(false)
      }

      channel.onmessage = (event) => {
        onMessage?.(String(event.data))
      }
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({ type: 'candidate', payload: event.candidate.toJSON() })
      }
    }

    if (isInitiator) {
      setupDataChannel(pc.createDataChannel('signaling'))
    } else {
      pc.ondatachannel = (event) => {
        setupDataChannel(event.channel)
      }
    }

    const addIceCandidate = async (candidate: RTCIceCandidateInit) => {
      if (pc.remoteDescription) {
        await pc.addIceCandidate(candidate)
        return
      }
      pendingCandidates.push(candidate)
    }

    const flushPendingCandidates = async () => {
      if (pendingCandidates.length === 0) return
      const candidates = pendingCandidates
      pendingCandidates = []
      for (const candidate of candidates) {
        try {
          await pc.addIceCandidate(candidate)
        } catch (error) {
          console.error(error)
        }
      }
    }

    const startOffer = async () => {
      if (offerStarted) return
      offerStarted = true
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      sendSignal({ type: 'offer', payload: offer })
    }

    const handleSignal = async (message: SignalingMessage) => {
      switch (message.type) {
        case 'ready':
          if (isInitiator) {
            await startOffer()
          }
          return
        case 'offer': {
          if (isInitiator) return
          await pc.setRemoteDescription(message.payload)
          await flushPendingCandidates()
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          sendSignal({ type: 'answer', payload: answer })
          return
        }
        case 'answer':
          if (!isInitiator) return
          await pc.setRemoteDescription(message.payload)
          await flushPendingCandidates()
          return
        case 'candidate':
          await addIceCandidate(message.payload)
      }
    }

    ws.onopen = () => {
      sendReady()
    }

    ws.onmessage = async (event) => {
      const message = parseMessage(event.data)
      if (!message) return
      await handleSignal(message)
    }

    return () => {
      channelRef.current?.close()
      pc.close()
      ws.close()
      channelRef.current = null
    }
  }, [isInitiator, onMessage, roomId, signalingUrl])

  return { send, isConnected: roomId ? isConnected : false }
}
