import { WebSocketServer, WebSocket } from 'ws'

const port = Number(process.env.PORT ?? 8080)

const rooms = new Map<string, Set<WebSocket>>()

const wss = new WebSocketServer({ port })

// roomId と接続の対応をメモリに保持
const getOrCreateRoomConnections = (roomId: string) => {
  const connections = rooms.get(roomId)
  if (connections !== undefined) return connections

  const created = new Set<WebSocket>()
  rooms.set(roomId, created)
  return created
}

// デバッグ用
const logRooms = () => {
  const summary = Array.from(rooms.entries()).map(([roomId, connections]) => ({
    roomId,
    count: connections.size,
  }))
  console.log({ rooms: summary })
}

// 同じルーム内の他の接続にメッセージを転送
const broadcast = (
  roomId: string,
  data: WebSocket.RawData,
  sender: WebSocket,
) => {
  const connections = rooms.get(roomId)
  if (connections === undefined) return

  const payload = data.toString()
  connections.forEach((connection) => {
    if (connection === sender || connection.readyState !== WebSocket.OPEN) {
      return
    }
    connection.send(payload)
  })
}

wss.on('connection', (ws, req) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  // ルーム識別のために room パラメータを必須化
  const roomId = url.searchParams.get('room')
  if (roomId === null || roomId === '') {
    ws.close(1008, 'missing room')
    return
  }

  const connections = getOrCreateRoomConnections(roomId)
  // 1 対 1 のみ許容
  if (connections.size >= 2) {
    ws.close(1008, 'room is full')
    return
  }

  connections.add(ws)
  logRooms()

  ws.on('message', (data) => {
    broadcast(roomId, data, ws)
  })

  const cleanup = () => {
    connections.delete(ws)
    if (connections.size === 0) {
      rooms.delete(roomId)
    }
    logRooms()
  }

  ws.on('close', cleanup)
  ws.on('error', cleanup)
})

console.log(`signaling server listening on ${port}`)
