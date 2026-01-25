import { useMemo } from 'react'

type UseRoomIdOptions = {
  generateIfMissing?: boolean
}

export const useRoomId = ({ generateIfMissing = false }: UseRoomIdOptions = {}) => {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const roomId = params.get('room')
    if (roomId) return roomId
    if (!generateIfMissing) return null
    return crypto.randomUUID()
  }, [generateIfMissing])
}
