import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { STORIES, ME, type Post, type Story } from '../data/mock'
import { ZingooMark } from '../components/Logo'

const REACTIONS = ['❤️', '💖', '🥹', '✨', '🌸', '😍', '🔥']

export default function FeedPage() {
  const [stories, setStories] = useState<Story[]>(STORIES)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStory, setActiveStory] = useState<Story | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const formattedPosts: Post[] = result.posts.map((p: any) => ({
            id: p.id,

            user: {
              id: p.profiles?.id || p.user_id,
              username: p.profiles?.username || 'zingoo_user',
              name: p.profiles?.display_name || 'Zingoo User',
              avatar:
                p.profiles?.avatar_url ||
                'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=160&h=160&fit=crop&auto=format',
              bio: p.profiles?.bio || '',
              followers: 0,
              following: 0,
              posts: 0,
              verified: false,
            },

            images:
              p.post_media?.length > 0
                ? [...p.post_media]
                    .sort(
                      (a: any, b: any) =>
                        (a.display_order || 0) -
                        (b.display_order || 0)
                    )
                    .map((m: any) => m.public_url)
                : [],

            caption: p.caption || '',
            hashtags: extractHashtags(p.caption || ''),
            likes: 0,
            comments: [],
            createdAt: formatTime(p.created_at),
            liked: false,
            saved: false,
          }))

          setPosts(formattedPosts)
        }
      })
      .catch(error => {
        console.error('Failed to load posts:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // LIKE
  const toggleLike = (id: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id !== id) return post

        const newLiked = !post.liked

        return {
          ...post,
          liked: newLiked,
          likes: newLiked
            ? post.likes + 1
            : Math.max(0, post.likes - 1),
        }
      })
    )
  }

  // SAVE
  const toggleSave = (id: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id
          ? {
              ...post,
              saved: !post.saved,
            }
          : post
      )
    )
  }

  // STORY
  const openStory = (story: Story) => {
    setActiveStory(story)

    setStories(prev =>
      prev.map(storyItem =>
        storyItem.id === story.id
          ? {
              ...storyItem,
              seen: true,
            }
          : storyItem
      )
    )
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#faf5ff',
      }}
    >
      {/* TOP BAR */}

      <div
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(250,245,255,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(233,213,255,0.5)',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between px-4 py-3"
          style={{
            width: '100%',
            maxWidth: '630px',
          }}
        >
          <div className="flex items-center gap-2">
            <ZingooMark size={28} />

            <span
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: '1.3rem',
                letterSpacing: '-0.02em',
                background:
                  'linear-gradient(135deg, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Zingoo
            </span>
          </div>

          <div className="flex items-center gap-5">
            {/* Activity */}

            <button
              type="button"
              onClick={() => navigate('/app/activity')}
              style={{ color: '#a855f7' }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Messages */}

            <button
              type="button"
              onClick={() => navigate('/app/messages')}
              style={{
                color: '#a855f7',
                position: 'relative',
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 014 11.5a8.5 8.5 0 1117 0z"
                />
              </svg>

              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                style={{
                  background:
                    'linear-gradient(135deg,#a855f7,#ec4899)',
                  fontSize: '9px',
                  fontWeight: 800,
                }}
              >
                16
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN FEED */}

      <main
        className="mx-auto"
        style={{
          width: '100%',
          maxWidth: '630px',
        }}
      >
        {/* STORIES */}

        <div
          className="flex gap-4 px-4 py-4 overflow-x-auto"
          style={{
            scrollbarWidth: 'none',
          }}
        >
          {/* YOUR STORY */}

          {stories.length > 0 && (
            <div
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
              onClick={() => openStory(stories[0])}
            >
              <div className="relative">
                <div
                  className={
                    stories[0].seen
                      ? 'story-ring-seen'
                      : 'story-ring'
                  }
                >
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden"
                    style={{
                      background: '#e9d5ff',
                    }}
                  >
                    <img
                      src={ME.avatar}
                      alt="Your story"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div
                  className="absolute bottom-0 right-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg,#a855f7,#ec4899)',
                    border: '2px solid white',
                  }}
                >
                  <span
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 900,
                    }}
                  >
                    +
                  </span>
                </div>
              </div>

              <span
                style={{
                  color: '#6b7280',
                  fontWeight: 700,
                  fontSize: '10px',
                }}
              >
                Your story
              </span>
            </div>
          )}

          {/* OTHER STORIES */}

          {stories.slice(1).map(story => (
            <div
              key={story.id}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
              onClick={() => openStory(story)}
            >
              <div
                className={
                  story.seen
                    ? 'story-ring-seen'
                    : 'story-ring'
                }
              >
                <div
                  className="w-14 h-14 rounded-full overflow-hidden"
                  style={{
                    background: '#e9d5ff',
                  }}
                >
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <span
                className="truncate"
                style={{
                  color: '#6b7280',
                  fontWeight: 700,
                  fontSize: '10px',
                  maxWidth: '56px',
                }}
              >
                {story.user.username.split('.')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* POSTS */}

        <div className="pb-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div
                className="w-8 h-8 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin"
              />
            </div>
          ) : posts.length === 0 ? (
            <div
              className="text-center py-16 px-6"
              style={{
                color: '#9ca3af',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                }}
              >
                No posts yet
              </p>

              <p
                className="mt-1"
                style={{
                  fontSize: '13px',
                }}
              >
                Create your first Zingoo post ✨
              </p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onSave={toggleSave}
              />
            ))
          )}
        </div>
      </main>

      {/* STORY VIEWER */}

      {activeStory && (
        <StoryViewer
          story={activeStory}
          onClose={() => setActiveStory(null)}
        />
      )}
    </div>
  )
}

/* ------------------------------------------------ */
/* POST CARD */
/* ------------------------------------------------ */

function PostCard({
  post,
  onLike,
  onSave,
}: {
  post: Post
  onLike: (id: string) => void
  onSave: (id: string) => void
}) {
  const [imgIdx, setImgIdx] = useState(0)
  const [showReactions, setShowReactions] = useState(false)
  const [chosenReaction, setChosenReaction] =
    useState<string | null>(null)
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    onLike(post.id)

    // Clear custom reaction when normal like is clicked
    setChosenReaction(null)
  }

  const handleReaction = (reaction: string) => {
    setChosenReaction(reaction)
    setShowReactions(false)

    if (!post.liked) {
      onLike(post.id)
    }
  }

  const handleDoubleTap = () => {
    if (!post.liked) {
      onLike(post.id)
      setChosenReaction(null)
    }
  }

  return (
    <article
      className="mb-4"
      style={{
        background: 'white',
        overflow: 'hidden',
        borderTop: '1px solid rgba(233,213,255,0.4)',
        borderBottom: '1px solid rgba(233,213,255,0.4)',
      }}
    >
      {/* HEADER */}

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="story-ring"
            style={{
              padding: '2px',
            }}
          >
            <img
              src={post.user.avatar}
              alt={post.user.username}
              className="w-9 h-9 rounded-full object-cover block"
            />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span
                className="text-sm"
                style={{
                  fontWeight: 800,
                  color: '#1a1a2e',
                }}
              >
                {post.user.username}
              </span>

              {post.user.verified && (
                <span
                  style={{
                    color: '#a855f7',
                    fontSize: '12px',
                  }}
                >
                  ✓
                </span>
              )}
            </div>

            <p
              className="text-xs"
              style={{
                color: '#9ca3af',
                fontWeight: 600,
              }}
            >
              {post.createdAt} ago
            </p>
          </div>
        </div>

        <button
          type="button"
          style={{
            color: '#9ca3af',
            fontSize: '20px',
          }}
        >
          •••
        </button>
      </div>

      {/* IMAGE */}

      {post.images.length > 0 && (
        <div
          className="relative cursor-pointer"
          style={{
            width: '100%',
            aspectRatio: '1 / 1',
            background: '#f3e8ff',
          }}
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={post.images[imgIdx]}
            alt={post.caption}
            className="w-full h-full object-cover"
          />

          {/* CAROUSEL DOTS */}

          {post.images.length > 1 && (
            <div
              className="absolute bottom-3 left-1/2 flex gap-1.5"
              style={{
                transform: 'translateX(-50%)',
              }}
            >
              {post.images.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={e => {
                    e.stopPropagation()
                    setImgIdx(index)
                  }}
                  style={{
                    width: imgIdx === index ? 14 : 6,
                    height: 6,
                    borderRadius: 99,
                    background:
                      imgIdx === index
                        ? '#a855f7'
                        : 'rgba(255,255,255,0.8)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACTIONS */}

      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">

            {/* LIKE */}

            <div className="relative">
              {showReactions && (
                <div
                  className="absolute bottom-10 left-0 flex gap-1 px-3 py-2 rounded-2xl z-20"
                  style={{
                    background: 'white',
                    boxShadow:
                      '0 8px 30px rgba(0,0,0,0.15)',
                  }}
                >
                  {REACTIONS.map(reaction => (
                    <button
                      type="button"
                      key={reaction}
                      className="text-xl hover:scale-125 transition-transform"
                      onClick={() =>
                        handleReaction(reaction)
                      }
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              )}

              {/* FIXED LIKE BUTTON */}

              <button
                type="button"
                onClick={handleLike}
                onContextMenu={e => {
                  e.preventDefault()
                  setShowReactions(prev => !prev)
                }}
                className="flex items-center justify-center transition-all duration-200 active:scale-90"
                style={{
                  color: post.liked
                    ? '#ec4899'
                    : '#9ca3af',
                  cursor: 'pointer',
                }}
                aria-label={
                  post.liked
                    ? 'Unlike post'
                    : 'Like post'
                }
              >
                {chosenReaction ? (
                  <span className="text-2xl">
                    {chosenReaction}
                  </span>
                ) : (
                  <svg
                    className="w-7 h-7"
                    fill={
                      post.liked
                        ? '#ec4899'
                        : 'none'
                    }
                    stroke={
                      post.liked
                        ? '#ec4899'
                        : 'currentColor'
                    }
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* COMMENT */}

            <button
              type="button"
              onClick={() =>
                setShowComments(!showComments)
              }
              style={{
                color: '#9ca3af',
              }}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 3.582-8 8-8s9 3.582 9 8z"
                />
              </svg>
            </button>

            {/* SHARE */}

            <button
              type="button"
              style={{
                color: '#9ca3af',
              }}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>

          {/* SAVE */}

          <button
            type="button"
            onClick={() => onSave(post.id)}
            style={{
              color: post.saved
                ? '#a855f7'
                : '#9ca3af',
            }}
          >
            <svg
              className="w-7 h-7"
              fill={
                post.saved
                  ? 'currentColor'
                  : 'none'
              }
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>

        {/* LIKES */}

        <p
          className="text-sm mt-2"
          style={{
            fontWeight: 800,
            color: '#1a1a2e',
          }}
        >
          {post.likes.toLocaleString()} likes
        </p>

        {/* CAPTION */}

        <p
          className="text-sm mt-1 leading-relaxed"
          style={{
            color: '#374151',
          }}
        >
          <span
            style={{
              fontWeight: 800,
              color: '#1a1a2e',
            }}
          >
            {post.user.username}
          </span>{' '}
          {post.caption}
        </p>

        {/* HASHTAGS */}

        {post.hashtags.length > 0 && (
          <p className="text-sm mt-1">
            {post.hashtags.map(tag => (
              <span
                key={tag}
                className="mr-2"
                style={{
                  color: '#a855f7',
                  fontWeight: 700,
                }}
              >
                {tag}
              </span>
            ))}
          </p>
        )}

        {/* COMMENTS */}

        {post.comments.length > 0 && (
          <button
            type="button"
            onClick={() =>
              setShowComments(!showComments)
            }
            className="mt-2 text-xs"
            style={{
              color: '#9ca3af',
              fontWeight: 600,
            }}
          >
            {showComments
              ? 'Hide comments'
              : `View all ${post.comments.length} comments`}
          </button>
        )}

        {showComments && (
          <div className="mt-3 flex flex-col gap-3">
            {post.comments.map(comment => (
              <div
                key={comment.id}
                className="flex gap-2"
              >
                <img
                  src={comment.user.avatar}
                  alt={comment.user.username}
                  className="w-6 h-6 rounded-full object-cover"
                />

                <p className="text-sm">
                  <strong>
                    {comment.user.username}
                  </strong>{' '}
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* TIME */}

        <p
          className="mt-2 text-xs"
          style={{
            color: '#d1d5db',
            fontWeight: 600,
          }}
        >
          {post.createdAt} ago
        </p>
      </div>
    </article>
  )
}

/* ------------------------------------------------ */
/* STORY VIEWER */
/* ------------------------------------------------ */

function StoryViewer({
  story,
  onClose,
}: {
  story: Story
  onClose: () => void
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          onClose()
          return 100
        }

        return prev + 1
      })
    }, 40)

    return () => clearInterval(interval)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: '#000',
      }}
      onClick={onClose}
    >
      {/* PROGRESS */}

      <div
        className="absolute top-3 left-3 right-3 h-1 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.3)',
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: 'white',
            width: `${progress}%`,
          }}
        />
      </div>

      {/* IMAGE */}

      <img
        src={story.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* HEADER */}

      <div
        className="absolute top-7 left-4 right-4 flex items-center justify-between"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <img
            src={story.user.avatar}
            alt={story.user.username}
            className="w-8 h-8 rounded-full object-cover"
          />

          <span
            className="text-white text-sm"
            style={{
              fontWeight: 800,
            }}
          >
            {story.user.username}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-white text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------ */

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[a-zA-Z0-9_]+/g)

  return matches || []
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()

  const diff = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  )

  if (diff < 60) {
    return `${Math.max(0, diff)}s`
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m`
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h`
  }

  return `${Math.floor(diff / 86400)}d`
}