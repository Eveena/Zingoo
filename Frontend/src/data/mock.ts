export interface User {
  id: string
  username: string
  name: string
  avatar: string
  bio: string
  followers: number
  following: number
  posts: number
  isFollowing?: boolean
  verified?: boolean
}

export interface Story {
  id: string
  user: User
  seen: boolean
  image: string
}

export interface Post {
  id: string
  user: User
  images: string[]
  caption: string
  hashtags: string[]
  likes: number
  comments: Comment[]
  createdAt: string
  liked?: boolean
  saved?: boolean
  reaction?: string
}

export interface Comment {
  id: string
  user: User
  text: string
  likes: number
  time: string
}

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'tag'
  user: User
  text: string
  time: string
  postThumb?: string
  read: boolean
}

export const ME: User = {
  id: 'me',
  username: 'nova.jpeg',
  name: 'Nova Kim',
  avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=160&h=160&fit=crop&auto=format',
  bio: 'capturing little things 📷 based in seoul ✨',
  followers: 1204,
  following: 318,
  posts: 47,
  verified: false,
}

export const USERS: User[] = [
  {
    id: 'u1',
    username: 'haru.shot',
    name: 'Haru Tanaka',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&auto=format',
    bio: 'film photography & quiet mornings',
    followers: 8420,
    following: 201,
    posts: 134,
    isFollowing: true,
    verified: true,
  },
  {
    id: 'u2',
    username: 'lena.frames',
    name: 'Lena Hoffmann',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&auto=format',
    bio: 'berlin / light chaser',
    followers: 3301,
    following: 410,
    posts: 89,
    isFollowing: false,
  },
  {
    id: 'u3',
    username: 'milo.arch',
    name: 'Milo Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&auto=format',
    bio: 'architecture & brutalism',
    followers: 12890,
    following: 560,
    posts: 220,
    isFollowing: false,
    verified: true,
  },
  {
    id: 'u4',
    username: 'sora.botanica',
    name: 'Sora Yuki',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&auto=format',
    bio: 'plants, tea, slow living',
    followers: 5670,
    following: 289,
    posts: 63,
    isFollowing: true,
  },
  {
    id: 'u5',
    username: 'remi.gold',
    name: 'Remi Adeyemi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&auto=format',
    bio: 'street photography, Lagos & London',
    followers: 21400,
    following: 730,
    posts: 310,
    isFollowing: false,
    verified: true,
  },
  {
    id: 'u6',
    username: 'yuki.studio',
    name: 'Yuki Maeda',
    avatar: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=160&h=160&fit=crop&auto=format',
    bio: 'graphic design & color theory',
    followers: 9120,
    following: 415,
    posts: 178,
    isFollowing: true,
  },
]

export const STORIES: Story[] = [
  { id: 's0', user: ME, seen: false, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=700&fit=crop&auto=format' },
  { id: 's1', user: USERS[0], seen: false, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop&auto=format' },
  { id: 's2', user: USERS[1], seen: false, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=700&fit=crop&auto=format' },
  { id: 's3', user: USERS[2], seen: true, image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=700&fit=crop&auto=format' },
  { id: 's4', user: USERS[3], seen: false, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=700&fit=crop&auto=format' },
  { id: 's5', user: USERS[4], seen: true, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=700&fit=crop&auto=format' },
  { id: 's6', user: USERS[5], seen: false, image: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=400&h=700&fit=crop&auto=format' },
]

export const FEED_POSTS: Post[] = [
  {
    id: 'p1',
    user: USERS[0],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=640&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640&h=640&fit=crop&auto=format',
    ],
    caption: 'morning fog on the mountain. nothing else needed.',
    hashtags: ['#landscape', '#fog', '#mornings'],
    likes: 1847,
    comments: [
      { id: 'c1', user: USERS[1], text: 'this is so dreamy', likes: 12, time: '1h' },
      { id: 'c2', user: USERS[3], text: 'where is this??', likes: 4, time: '2h' },
    ],
    createdAt: '2h',
  },
  {
    id: 'p2',
    user: USERS[1],
    images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640&h=640&fit=crop&auto=format'],
    caption: 'that hour right before everything goes quiet',
    hashtags: ['#goldenhour', '#sunset', '#berlin'],
    likes: 3212,
    comments: [
      { id: 'c3', user: USERS[2], text: 'golden hour always wins', likes: 8, time: '4h' },
    ],
    createdAt: '5h',
  },
  {
    id: 'p3',
    user: USERS[2],
    images: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=640&h=640&fit=crop&auto=format'],
    caption: 'tokyo at 2am has a different kind of energy',
    hashtags: ['#tokyo', '#nightphotography', '#urban'],
    likes: 5560,
    comments: [
      { id: 'c4', user: USERS[0], text: 'I need to go back', likes: 21, time: '7h' },
      { id: 'c5', user: USERS[4], text: 'incredible shot', likes: 15, time: '8h' },
    ],
    createdAt: '8h',
  },
  {
    id: 'p4',
    user: USERS[3],
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=640&h=640&fit=crop&auto=format'],
    caption: 'my little pothos got a new leaf. proud moment.',
    hashtags: ['#plantmom', '#pothos', '#slowliving'],
    likes: 912,
    comments: [
      { id: 'c6', user: USERS[1], text: 'congratulations to the both of you', likes: 3, time: '10h' },
    ],
    createdAt: '11h',
  },
  {
    id: 'p5',
    user: USERS[4],
    images: [
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=640&h=640&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=640&h=640&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=640&h=640&fit=crop&auto=format',
    ],
    caption: 'the city never really stops — three frames from last night',
    hashtags: ['#streetphotography', '#city', '#nightlife'],
    likes: 7230,
    comments: [
      { id: 'c7', user: USERS[5], text: 'motion blur done right', likes: 44, time: '22h' },
    ],
    createdAt: '1d',
  },
  {
    id: 'p6',
    user: USERS[5],
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=640&fit=crop&auto=format'],
    caption: 'new palette. obsessed with this rose + slate combo.',
    hashtags: ['#design', '#colorpalette', '#graphicdesign'],
    likes: 2108,
    comments: [
      { id: 'c8', user: USERS[0], text: 'can we get a tutorial??', likes: 7, time: '1d' },
    ],
    createdAt: '1d',
  },
]

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'like', user: USERS[0], text: 'liked your photo', time: '2m', postThumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop&auto=format', read: false },
  { id: 'n2', type: 'follow', user: USERS[1], text: 'started following you', time: '15m', read: false },
  { id: 'n3', type: 'comment', user: USERS[2], text: 'commented: "this is stunning wow"', time: '1h', postThumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop&auto=format', read: false },
  { id: 'n4', type: 'like', user: USERS[3], text: 'liked your photo', time: '2h', postThumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=80&h=80&fit=crop&auto=format', read: true },
  { id: 'n5', type: 'mention', user: USERS[4], text: 'mentioned you in a comment', time: '3h', postThumb: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=80&h=80&fit=crop&auto=format', read: true },
  { id: 'n6', type: 'follow', user: USERS[5], text: 'started following you', time: '5h', read: true },
  { id: 'n7', type: 'like', user: USERS[0], text: 'and 47 others liked your photo', time: '1d', postThumb: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&h=80&fit=crop&auto=format', read: true },
  { id: 'n8', type: 'comment', user: USERS[2], text: 'commented: "gorgeous composition"', time: '1d', postThumb: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=80&h=80&fit=crop&auto=format', read: true },
]

export const MY_POSTS = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=400&h=400&fit=crop&auto=format',
]

export const EXPLORE_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=420&fit=crop&auto=format', category: 'Photography', likes: 2841 },
  { src: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=300&h=300&fit=crop&auto=format', category: 'Food', likes: 1204 },
  { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=300&h=380&fit=crop&auto=format', category: 'Travel', likes: 5320 },
  { src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=340&fit=crop&auto=format', category: 'Lifestyle', likes: 987 },
  { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=460&fit=crop&auto=format', category: 'Photography', likes: 3301 },
  { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&auto=format', category: 'Art', likes: 712 },
  { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=380&fit=crop&auto=format', category: 'Travel', likes: 4450 },
  { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=300&fit=crop&auto=format', category: 'Lifestyle', likes: 2108 },
  { src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=300&h=420&fit=crop&auto=format', category: 'Photography', likes: 6230 },
  { src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=350&fit=crop&auto=format', category: 'Lifestyle', likes: 1890 },
]
