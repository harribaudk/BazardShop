export class MessageModel {
  constructor(data) {
    this.id = data.id
    this.senderId = data.sender_id
    this.receiverId = data.receiver_id
    this.content = data.content
    this.createdAt = data.created_at
  }
}

export class ConversationModel {
  constructor(data) {
    this.userId = data.id
    this.name = data.name
    this.email = data.email
    this.lastMessage = data.last_message || ''
    this.lastMessageAt = data.last_message_at || null
  }
}
