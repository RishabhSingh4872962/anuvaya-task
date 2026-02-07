export type ChatMessage = {
  id: string
  text: string
  time: string
  sender: 'me' | 'other'
  isRead?: boolean
}

