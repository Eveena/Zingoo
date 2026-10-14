import { type User, USERS, ME } from './mock'

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read'
export type MessageType = 'text' | 'image' | 'voice' | 'gif' | 'sticker' | 'video' | 'system'

export interface Reaction {
  emoji: string
  userIds: string[]
}

export interface Message {
  id: string
  senderId: string
  type: MessageType
  text?: string
  mediaUrl?: string
  duration?: number          // voice notes in seconds
  waveform?: number[]        // 0-1 amplitudes for waveform visualization
  timestamp: string          // display string e.g. "10:42 AM"
  status: MessageStatus
  reactions?: Reaction[]
  replyTo?: string           // message id being replied to
  replyPreview?: string      // text snippet of the replied message
  edited?: boolean
  starred?: boolean
  disappearing?: boolean
}

export interface Conversation {
  id: string
  type: 'dm' | 'group'
  participants: User[]
  groupName?: string
  groupAvatar?: string
  messages: Message[]
  pinned: boolean
  muted: boolean
  archived: boolean
  unreadCount: number
  online?: boolean
  lastSeen?: string
  isTyping?: boolean
  encryptionEnabled: boolean
  chatTheme: string           // gradient key
  wallpaper?: string
}

// Waveform helpers
const wave = (n: number) => Array.from({ length: n }, () => 0.2 + Math.random() * 0.8)

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    type: 'dm',
    participants: [ME, USERS[0]],
    pinned: true,
    muted: false,
    archived: false,
    unreadCount: 3,
    online: true,
    encryptionEnabled: true,
    chatTheme: 'purple',
    messages: [
      { id: 'm1',  senderId: USERS[0].id, type: 'text', text: 'hey! did you see that fog on the mountain this morning? 😍', timestamp: 'Yesterday', status: 'read' },
      { id: 'm2',  senderId: ME.id,       type: 'text', text: 'omg yes I was literally up there!! it was so dreamy', timestamp: 'Yesterday', status: 'read' },
      { id: 'm3',  senderId: ME.id,       type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&auto=format', timestamp: 'Yesterday', status: 'read' },
      { id: 'm4',  senderId: USERS[0].id, type: 'text', text: 'WAIT this is stunning. you should post this!!!', timestamp: 'Yesterday', status: 'read', reactions: [{ emoji: '🔥', userIds: [ME.id] }, { emoji: '😍', userIds: [USERS[0].id] }] },
      { id: 'm5',  senderId: ME.id,       type: 'voice', duration: 14, waveform: wave(40), timestamp: '09:12 AM', status: 'read' },
      { id: 'm6',  senderId: USERS[0].id, type: 'text', text: 'haha ok ok I will tonight 😭', timestamp: '09:14 AM', status: 'read' },
      { id: 'm7',  senderId: USERS[0].id, type: 'text', text: 'also are you free this weekend?', timestamp: '09:14 AM', status: 'read' },
      { id: 'm8',  senderId: ME.id,       type: 'text', text: 'yes!! what are you thinking 🤩', timestamp: '09:16 AM', status: 'read' },
      { id: 'm9',  senderId: USERS[0].id, type: 'text', text: 'there\'s a night market in hongdae, thought it would be fun', timestamp: '10:02 AM', status: 'read' },
      { id: 'm10', senderId: USERS[0].id, type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=500&fit=crop&auto=format', timestamp: '10:02 AM', status: 'read' },
      { id: 'm11', senderId: ME.id,       type: 'text', text: 'ok this looks amazing let\'s go!!', timestamp: '10:05 AM', status: 'read', replyTo: 'm9', replyPreview: 'there\'s a night market in hongdae...' },
      { id: 'm12', senderId: USERS[0].id, type: 'text', text: 'yesss 🥳🥳', timestamp: '10:06 AM', status: 'delivered' },
      { id: 'm13', senderId: USERS[0].id, type: 'text', text: 'I\'ll send you the details later!', timestamp: '10:06 AM', status: 'delivered' },
      { id: 'm14', senderId: USERS[0].id, type: 'text', text: 'also check out this photo I edited today', timestamp: '11:30 AM', status: 'sent' },
    ],
  },
  {
    id: 'c2',
    type: 'group',
    participants: [ME, USERS[1], USERS[3], USERS[5]],
    groupName: 'photo gang 📸',
    groupAvatar: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&h=200&fit=crop&auto=format',
    pinned: true,
    muted: false,
    archived: false,
    unreadCount: 12,
    online: true,
    encryptionEnabled: true,
    chatTheme: 'pink',
    messages: [
      { id: 'g1', senderId: USERS[1].id, type: 'text', text: 'so when is the next shoot??', timestamp: '2d ago', status: 'read' },
      { id: 'g2', senderId: USERS[3].id, type: 'text', text: 'I\'m free next Saturday!', timestamp: '2d ago', status: 'read' },
      { id: 'g3', senderId: ME.id,       type: 'text', text: 'same! let\'s do golden hour at the park 🌅', timestamp: '2d ago', status: 'read' },
      { id: 'g4', senderId: USERS[5].id, type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&auto=format', timestamp: 'Yesterday', status: 'read' },
      { id: 'g5', senderId: USERS[5].id, type: 'text', text: 'new edit ✨ what do you all think?', timestamp: 'Yesterday', status: 'read', reactions: [{ emoji: '🔥', userIds: [ME.id, USERS[1].id] }, { emoji: '😍', userIds: [USERS[3].id] }] },
      { id: 'g6', senderId: USERS[1].id, type: 'text', text: 'this is INCREDIBLE omg', timestamp: 'Yesterday', status: 'read' },
      { id: 'g7', senderId: USERS[3].id, type: 'text', text: 'yuki is so talented 💜', timestamp: 'Yesterday', status: 'read' },
      { id: 'g8', senderId: USERS[1].id, type: 'text', text: 'also reminder about saturday!', timestamp: '08:30 AM', status: 'read' },
      { id: 'g9', senderId: USERS[3].id, type: 'voice', duration: 8, waveform: wave(32), timestamp: '08:45 AM', status: 'delivered' },
      { id: 'g10', senderId: USERS[5].id, type: 'text', text: 'I\'ll bring my new lens 👀', timestamp: '09:00 AM', status: 'sent' },
    ],
  },
  {
    id: 'c3',
    type: 'dm',
    participants: [ME, USERS[2]],
    pinned: false,
    muted: false,
    archived: false,
    unreadCount: 1,
    online: false,
    lastSeen: '2h ago',
    encryptionEnabled: true,
    chatTheme: 'blue',
    messages: [
      { id: 'mc1', senderId: USERS[2].id, type: 'text', text: 'hey your tokyo edit was 🔥🔥', timestamp: 'Yesterday', status: 'read' },
      { id: 'mc2', senderId: ME.id,       type: 'text', text: 'thank you!! milo your architecture shots always blow my mind', timestamp: 'Yesterday', status: 'read' },
      { id: 'mc3', senderId: USERS[2].id, type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&h=500&fit=crop&auto=format', timestamp: '10:30 AM', status: 'read' },
      { id: 'mc4', senderId: USERS[2].id, type: 'text', text: 'new one from last night 🌃', timestamp: '10:30 AM', status: 'sent' },
    ],
  },
  {
    id: 'c4',
    type: 'dm',
    participants: [ME, USERS[3]],
    pinned: false,
    muted: true,
    archived: false,
    unreadCount: 0,
    online: true,
    encryptionEnabled: true,
    chatTheme: 'mint',
    isTyping: false,
    messages: [
      { id: 'sc1', senderId: USERS[3].id, type: 'text', text: 'my pothos finally got a second leaf!!', timestamp: '3d ago', status: 'read' },
      { id: 'sc2', senderId: ME.id,       type: 'text', text: 'omg congratulations to the both of you 🌱', timestamp: '3d ago', status: 'read', reactions: [{ emoji: '😂', userIds: [USERS[3].id] }] },
      { id: 'sc3', senderId: USERS[3].id, type: 'text', text: 'haha right!! she\'s growing so fast', timestamp: '3d ago', status: 'read' },
    ],
  },
  {
    id: 'c5',
    type: 'dm',
    participants: [ME, USERS[4]],
    pinned: false,
    muted: false,
    archived: false,
    unreadCount: 0,
    online: false,
    lastSeen: '5h ago',
    encryptionEnabled: true,
    chatTheme: 'peach',
    messages: [
      { id: 'rc1', senderId: USERS[4].id, type: 'text', text: 'your work is inspiring fr 🙏', timestamp: '1w ago', status: 'read' },
      { id: 'rc2', senderId: ME.id,       type: 'text', text: 'coming from you that means so much!!', timestamp: '1w ago', status: 'read' },
      { id: 'rc3', senderId: USERS[4].id, type: 'voice', duration: 22, waveform: wave(50), timestamp: '1w ago', status: 'read' },
    ],
  },
  {
    id: 'c6',
    type: 'dm',
    participants: [ME, USERS[5]],
    pinned: false,
    muted: false,
    archived: false,
    unreadCount: 0,
    online: true,
    encryptionEnabled: true,
    chatTheme: 'purple',
    messages: [
      { id: 'yc1', senderId: USERS[5].id, type: 'text', text: 'loved the palette you used in today\'s post!', timestamp: '6h ago', status: 'read' },
      { id: 'yc2', senderId: ME.id,       type: 'text', text: 'thank you!! I\'ve been experimenting a lot lately', timestamp: '5h ago', status: 'read' },
    ],
  },
]

export const CHAT_THEMES: Record<string, { from: string; to: string; name: string }> = {
  purple: { from: '#a855f7', to: '#ec4899', name: 'Zingoo' },
  pink:   { from: '#ec4899', to: '#f97316', name: 'Sunset' },
  blue:   { from: '#3b82f6', to: '#06b6d4', name: 'Ocean' },
  mint:   { from: '#10b981', to: '#06b6d4', name: 'Mint' },
  peach:  { from: '#f97316', to: '#f59e0b', name: 'Peach' },
  night:  { from: '#6366f1', to: '#8b5cf6', name: 'Night' },
}

export const STICKER_PACKS = [
  { id: 's1', emoji: '🐱', label: 'cat' },
  { id: 's2', emoji: '🐰', label: 'bunny' },
  { id: 's3', emoji: '🌸', label: 'flower' },
  { id: 's4', emoji: '✨', label: 'sparkle' },
  { id: 's5', emoji: '💜', label: 'heart' },
  { id: 's6', emoji: '🌈', label: 'rainbow' },
  { id: 's7', emoji: '🦋', label: 'butterfly' },
  { id: 's8', emoji: '⭐', label: 'star' },
  { id: 's9', emoji: '🍭', label: 'candy' },
  { id: 's10', emoji: '🎀', label: 'bow' },
  { id: 's11', emoji: '☁️', label: 'cloud' },
  { id: 's12', emoji: '🌙', label: 'moon' },
]
