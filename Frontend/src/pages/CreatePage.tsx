import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabase'

const FILTERS = [
  'None',
  'Warm',
  'Cool',
  'Fade',
  'Vivid',
  'Noir',
  'Bloom',
  'Dreamy',
]

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format',
]

type Step = 'pick' | 'edit' | 'caption'
type Audience = 'Everyone' | 'Friends' | 'Only me'

export default function CreatePage() {
  const [step, setStep] = useState<Step>('pick')
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [filter, setFilter] = useState('None')
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [audience, setAudience] = useState<Audience>('Everyone')

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  // --------------------------------------------------
  // Select image from computer
  // --------------------------------------------------

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10 MB.')
      return
    }

    setError('')
    setSelectedFile(file)

    const previewUrl = URL.createObjectURL(file)
    setSelected(previewUrl)
  }

  // --------------------------------------------------
  // Select sample image
  // --------------------------------------------------

  const handleSampleSelect = (src: string) => {
    setError('')
    setSelectedFile(null)
    setSelected(src)
  }

  // --------------------------------------------------
  // Upload image to Supabase
  // --------------------------------------------------

  const uploadImage = async (): Promise<string | null> => {
    if (!selected) {
      setError('Please select an image first.')
      return null
    }

    // If user selected a sample image, download it first
    if (!selectedFile) {
      try {
        const response = await fetch(selected)

        if (!response.ok) {
          throw new Error('Could not download sample image.')
        }

        const blob = await response.blob()

        const extension =
          blob.type.split('/')[1] || 'jpg'

        const fileName = `${crypto.randomUUID()}.${extension}`

        const filePath = fileName

        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, blob, {
            contentType: blob.type,
            upsert: false,
          })

        if (uploadError) {
          throw uploadError
        }

        const { data } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath)

        return data.publicUrl
      } catch (err) {
        console.error(err)

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to upload image.'
        )

        return null
      }
    }

    // Upload actual computer file
    try {
      const extension =
        selectedFile.name.split('.').pop() || 'jpg'

      const fileName =
        `${crypto.randomUUID()}.${extension}`

      const filePath = fileName

      const { error: uploadError } = await supabase.storage
        .from('posts')
        .upload(filePath, selectedFile, {
          contentType: selectedFile.type,
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (err) {
      console.error(err)

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to upload image.'
      )

      return null
    }
  }

  // --------------------------------------------------
  // Publish post
  // --------------------------------------------------

  const publish = async () => {
    if (!selected) {
      setError('Please select an image first.')
      return
    }

    setError('')
    setUploading(true)

    try {
      // Check logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      if (!user) {
        setError('Please log in before creating a post.')
        setUploading(false)
        return
      }

      // Upload image
      const publicUrl = await uploadImage()

      if (!publicUrl) {
        setUploading(false)
        return
      }

      // Create post
      const { data: post, error: postError } =
        await supabase
          .from('posts')
          .insert({
            user_id: user.id,
            caption: caption.trim() || null,
            location: null,
            visibility:
              audience === 'Everyone'
                ? 'public'
                : audience === 'Friends'
                ? 'friends'
                : 'private',
            comments_enabled: true,
          })
          .select()
          .single()

      if (postError) {
        throw postError
      }

      // Create media record
      const { error: mediaError } = await supabase
        .from('post_media')
        .insert({
          post_id: post.id,
          user_id: user.id,
          media_type: 'image',
          public_url: publicUrl,
          storage_path: publicUrl.split('/').pop(),
          mime_type:
            selectedFile?.type || 'image/jpeg',
          display_order: 0,
        })

      if (mediaError) {
        throw mediaError
      }

      // Success
      navigate('/app/home')
    } catch (err) {
      console.error('CREATE POST ERROR:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while creating your post.'
      )
    } finally {
      setUploading(false)
    }
  }

  // --------------------------------------------------
  // Back button
  // --------------------------------------------------

  const goBack = () => {
    if (uploading) return

    if (step === 'pick') {
      navigate('/app/home')
    } else if (step === 'edit') {
      setStep('pick')
    } else {
      setStep('edit')
    }
  }

  return (
    <div
      className="max-w-[430px] mx-auto min-h-screen flex flex-col"
      style={{
        background: '#faf5ff',
      }}
    >
      {/* HEADER */}

      <div
        className="flex items-center justify-between px-4 py-3.5 glass sticky top-0 z-40"
        style={{
          borderBottom:
            '1px solid rgba(233,213,255,0.5)',
          background:
            'rgba(250,245,255,0.92)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <button
          onClick={goBack}
          disabled={uploading}
          style={{
            color: '#a855f7',
            opacity: uploading ? 0.5 : 1,
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h1
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: '1.1rem',
            color: '#1a1a2e',
          }}
        >
          {step === 'pick'
            ? 'New post'
            : step === 'edit'
            ? 'Edit photo'
            : 'Add details'}
        </h1>

        {/* NEXT / SHARE */}

        {step === 'pick' && selected && (
          <button
            onClick={() => setStep('edit')}
            style={gradientText}
          >
            Next
          </button>
        )}

        {step === 'edit' && (
          <button
            onClick={() => setStep('caption')}
            style={gradientText}
          >
            Next
          </button>
        )}

        {step === 'caption' && (
          <button
            onClick={publish}
            disabled={uploading}
            style={{
              ...gradientText,
              opacity: uploading ? 0.5 : 1,
            }}
          >
            {uploading ? 'Sharing...' : 'Share'}
          </button>
        )}
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="mx-4 mt-3 px-4 py-3 rounded-2xl text-sm"
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}

      {/* PICK STEP */}

      {step === 'pick' && (
        <div className="flex-1 px-4 py-4">

          {/* REAL UPLOAD */}

          <label
            className="flex flex-col items-center justify-center rounded-3xl mb-5 py-10 cursor-pointer transition-all duration-150"
            style={{
              background:
                'linear-gradient(135deg, #f3e8ff, #fce7f3)',
              border: '2px dashed #d8b4fe',
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
              style={{
                background:
                  'linear-gradient(135deg, #a855f7, #ec4899)',
              }}
            >
              <svg
                className="w-8 h-8"
                fill="white"
                viewBox="0 0 24 24"
              >
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <p
              style={{
                fontWeight: 800,
                color: '#7c3aed',
                fontSize: '0.95rem',
              }}
            >
              Upload photo
            </p>

            <p
              className="mt-1 text-xs"
              style={{
                color: '#c084fc',
                fontWeight: 600,
              }}
            >
              tap to browse your gallery
            </p>
          </label>

          {/* SELECTED PREVIEW */}

          {selected && (
            <div className="mb-5">
              <p
                className="text-xs mb-3"
                style={{
                  color: '#9ca3af',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Selected photo
              </p>

              <div
                className="relative aspect-square rounded-3xl overflow-hidden"
                style={{
                  background: '#f3e8ff',
                }}
              >
                <img
                  src={selected}
                  alt="Selected"
                  className="w-full h-full object-cover"
                />

                <div
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      'linear-gradient(135deg,#a855f7,#ec4899)',
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* SAMPLE GALLERY */}

          <p
            className="text-xs mb-3"
            style={{
              color: '#9ca3af',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Try a sample
          </p>

          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_IMAGES.map((src, i) => (
              <button
                key={i}
                onClick={() => handleSampleSelect(src)}
                className="aspect-square rounded-2xl overflow-hidden relative"
                style={{
                  background: '#f3e8ff',
                }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />

                {selected === src && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background:
                        'rgba(168,85,247,0.4)',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        background: 'white',
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* EDIT STEP */}

      {step === 'edit' && selected && (
        <div className="flex-1">

          <div
            className="aspect-square"
            style={{
              background: '#f3e8ff',
            }}
          >
            <img
              src={selected}
              alt=""
              className="w-full h-full object-cover"
              style={{
                filter: filterToCSS(filter),
              }}
            />
          </div>

          <div className="px-4 py-4">

            {/* TOOLS */}

            <div
              className="flex gap-4 overflow-x-auto pb-3 mb-4"
              style={{
                scrollbarWidth: 'none',
              }}
            >
              {[
                { icon: '✂️', label: 'Crop' },
                { icon: '🔄', label: 'Rotate' },
                { icon: '☀️', label: 'Brightness' },
                { icon: '🎨', label: 'Contrast' },
                { icon: '🌈', label: 'Saturation' },
                { icon: '✏️', label: 'Draw' },
                { icon: '🎭', label: 'Sticker' },
              ].map(tool => (
                <button
                  key={tool.label}
                  className="flex flex-col items-center gap-1 shrink-0"
                  type="button"
                >
                  <span className="text-2xl">
                    {tool.icon}
                  </span>

                  <span
                    className="text-xs"
                    style={{
                      color: '#9ca3af',
                      fontWeight: 700,
                    }}
                  >
                    {tool.label}
                  </span>
                </button>
              ))}
            </div>

            {/* FILTERS */}

            <p
              className="text-xs mb-3"
              style={{
                color: '#9ca3af',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Filters
            </p>

            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{
                scrollbarWidth: 'none',
              }}
            >
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="shrink-0 flex flex-col items-center gap-1.5"
                  type="button"
                >
                  <div
                    className="w-16 h-16 rounded-2xl overflow-hidden"
                    style={{
                      border:
                        filter === f
                          ? '2.5px solid #a855f7'
                          : '2px solid transparent',
                      background: '#e9d5ff',
                    }}
                  >
                    <img
                      src={selected}
                      alt={f}
                      className="w-full h-full object-cover"
                      style={{
                        filter: filterToCSS(f),
                      }}
                    />
                  </div>

                  <span
                    className="text-xs"
                    style={{
                      fontWeight:
                        filter === f ? 800 : 600,
                      color:
                        filter === f
                          ? '#a855f7'
                          : '#9ca3af',
                    }}
                  >
                    {f}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CAPTION STEP */}

      {step === 'caption' && selected && (
        <div className="flex-1 px-4 py-4">

          <div className="flex gap-3 mb-5">
            <img
              src={selected}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover"
              style={{
                filter: filterToCSS(filter),
                background: '#e9d5ff',
              }}
            />

            <div className="flex-1">
              <textarea
                value={caption}
                onChange={e =>
                  setCaption(e.target.value)
                }
                placeholder="Write a caption..."
                rows={4}
                className="w-full outline-none resize-none text-sm bg-transparent"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 600,
                  color: '#1a1a2e',
                  lineHeight: 1.5,
                }}
              />
            </div>
          </div>

          {/* OPTIONS */}

          <div
            className="flex flex-col gap-1 rounded-2xl overflow-hidden mb-4"
            style={{
              border: '1.5px solid #f3e8ff',
            }}
          >
            {[
              {
                icon: '🏷️',
                label: 'Tag people',
              },
              {
                icon: '📍',
                label: 'Add location',
              },
              {
                icon: '🎵',
                label: 'Add music',
              },
            ].map(item => (
              <button
                key={item.label}
                type="button"
                className="flex items-center justify-between px-4 py-3.5"
                style={{
                  background: 'white',
                }}
              >
                <span
                  className="text-sm flex items-center gap-3"
                >
                  <span>{item.icon}</span>

                  <span
                    style={{
                      fontWeight: 700,
                      color: '#374151',
                    }}
                  >
                    {item.label}
                  </span>
                </span>

                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>

          {/* HASHTAGS */}

          <div className="mb-4">
            <label
              className="text-xs mb-1.5 block"
              style={{
                color: '#9ca3af',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Hashtags
            </label>

            <input
              value={hashtags}
              onChange={e =>
                setHashtags(e.target.value)
              }
              placeholder="#photography #travel #life"
              className="w-full px-4 py-3 rounded-2xl outline-none text-sm"
              style={{
                background: 'white',
                border:
                  '1.5px solid #f3e8ff',
                fontFamily:
                  "'Nunito', sans-serif",
                fontWeight: 600,
                color: '#a855f7',
              }}
            />
          </div>

          {/* AUDIENCE */}

          <div>
            <label
              className="text-xs mb-2 block"
              style={{
                color: '#9ca3af',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Audience
            </label>

            <div className="flex gap-2">
              {(
                [
                  'Everyone',
                  'Friends',
                  'Only me',
                ] as Audience[]
              ).map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() =>
                    setAudience(a)
                  }
                  className="flex-1 py-2.5 rounded-2xl text-xs"
                  style={{
                    fontWeight: 800,
                    background:
                      audience === a
                        ? 'linear-gradient(135deg,#a855f7,#ec4899)'
                        : 'white',
                    color:
                      audience === a
                        ? 'white'
                        : '#9ca3af',
                    border:
                      audience === a
                        ? 'none'
                        : '1.5px solid #e9d5ff',
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* SHARE BUTTON */}

          <button
            onClick={publish}
            disabled={uploading}
            className="w-full mt-6 py-4 rounded-2xl text-white text-base"
            style={{
              background:
                'linear-gradient(135deg,#a855f7,#ec4899)',
              fontWeight: 800,
              boxShadow:
                '0 8px 24px rgba(168,85,247,0.35)',
              opacity: uploading ? 0.65 : 1,
            }}
          >
            {uploading
              ? '✨ Sharing your post...'
              : 'Share post'}
          </button>
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------
// Gradient text
// --------------------------------------------------

const gradientText: React.CSSProperties = {
  fontWeight: 800,
  fontSize: '0.9rem',
  background:
    'linear-gradient(135deg,#a855f7,#ec4899)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}

// --------------------------------------------------
// Filters
// --------------------------------------------------

function filterToCSS(f: string): string {
  const map: Record<string, string> = {
    None: 'none',
    Warm: 'sepia(0.3) saturate(1.2)',
    Cool: 'hue-rotate(30deg) saturate(0.9)',
    Fade: 'brightness(1.1) saturate(0.7) contrast(0.9)',
    Vivid: 'saturate(1.6) contrast(1.1)',
    Noir: 'grayscale(1) contrast(1.2)',
    Bloom: 'brightness(1.15) saturate(1.1) contrast(0.95)',
    Dreamy:
      'brightness(1.1) saturate(0.85) hue-rotate(15deg)',
  }

  return map[f] || 'none'
}