/**
 * Notification WebSocket Server
 * Server สำหรับจำลองการส่งแจ้งเตือนแบบ Real-time
 * 
 * วิธีใช้:
 * 1. รัน server: npx tsx server/websocket/notification.server.ts
 * 2. หรือใช้: node --loader ts-node/esm server/websocket/notification.server.ts
 */
import { WebSocketServer, WebSocket } from 'ws'
import { generateMockNotification } from '../../app/data/mock/notification.mock'
import type { NotificationWebSocketMessage } from '../../app/types/notification.type'

const PORT = process.env.WS_PORT || 3001

// สร้าง WebSocket Server
const wss = new WebSocketServer({ port: Number(PORT) })

console.log(`🔔 Notification WebSocket Server running on ws://localhost:${PORT}/ws/notifications`)

// เก็บรายการ clients ที่เชื่อมต่อ
const clients = new Map<string, WebSocket>()

// จัดการการเชื่อมต่อ
wss.on('connection', (ws: WebSocket, req) => {
  // ดึง userId จาก query string
  const url = new URL(req.url || '', `http://${req.headers.host}`)
  const userId = url.searchParams.get('userId') || `user-${Date.now()}`
  
  console.log(`✅ Client connected: ${userId}`)
  clients.set(userId, ws)

  // ส่งข้อความต้อนรับ
  const welcomeMessage: NotificationWebSocketMessage = {
    type: 'notification',
    data: {
      id: 'welcome',
      type: 'system',
      title: 'notifications.systemUpdate',
      message: 'Connected to notification service',
      priority: 'low',
      status: 'unread',
      createdAt: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  }
  ws.send(JSON.stringify(welcomeMessage))

  // จัดการข้อความที่ได้รับจาก client
  ws.on('message', (data: Buffer) => {
    try {
      const message: NotificationWebSocketMessage = JSON.parse(data.toString())
      console.log(`📨 Message from ${userId}:`, message.type)

      // จัดการตามประเภทข้อความ
      switch (message.type) {
        case 'markAsRead':
          broadcastToUser(userId, {
            type: 'markAsRead',
            data: message.data,
            timestamp: new Date().toISOString()
          })
          break

        case 'markAllAsRead':
          broadcastToUser(userId, {
            type: 'markAllAsRead',
            data: [],
            timestamp: new Date().toISOString()
          })
          break

        case 'delete':
          broadcastToUser(userId, {
            type: 'delete',
            data: message.data,
            timestamp: new Date().toISOString()
          })
          break
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error)
    }
  })

  // จัดการการตัดการเชื่อมต่อ
  ws.on('close', () => {
    console.log(`❌ Client disconnected: ${userId}`)
    clients.delete(userId)
  })

  // จัดการข้อผิดพลาด
  ws.on('error', (error) => {
    console.error(`❌ Error for ${userId}:`, error)
  })
})

// ฟังก์ชันส่งข้อความไปยัง user ที่ระบุ
function broadcastToUser(userId: string, message: NotificationWebSocketMessage) {
  const client = clients.get(userId)
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message))
  }
}

// ฟังก์ชันส่งข้อความไปยังทุกคน
function broadcastToAll(message: NotificationWebSocketMessage) {
  clients.forEach((client, userId) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

// จำลองการส่งแจ้งเตือนแบบสุ่มทุก 30 วินาที
setInterval(() => {
  const notification = generateMockNotification()
  const message: NotificationWebSocketMessage = {
    type: 'notification',
    data: notification,
    timestamp: new Date().toISOString()
  }

  // ส่งไปยังทุกคน
  broadcastToAll(message)
  console.log(`🔔 Broadcasted notification: ${notification.title}`)
}, 30000)

// จัดการการปิด server
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down WebSocket server...')
  wss.close(() => {
    console.log('✅ WebSocket server closed')
    process.exit(0)
  })
})

// Export สำหรับใช้ในโปรเจคอื่น
export { wss, broadcastToUser, broadcastToAll }
