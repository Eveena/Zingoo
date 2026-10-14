import express from 'express'
import supabase from '../config/supabase.js'

const router = express.Router()

// LIKE / UNLIKE A POST
router.post('/', async (req, res) => {
  try {
    const { post_id, user_id } = req.body

    // Check required fields
    if (!post_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'post_id and user_id are required',
      })
    }

    // Check if the user already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', post_id)
      .eq('user_id', user_id)
      .maybeSingle()

    if (checkError) {
      console.error('Check like error:', checkError)

      return res.status(500).json({
        success: false,
        message: checkError.message,
      })
    }

    // -----------------------------
    // UNLIKE
    // -----------------------------
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', post_id)
        .eq('user_id', user_id)

      if (deleteError) {
        console.error('Unlike error:', deleteError)

        return res.status(500).json({
          success: false,
          message: deleteError.message,
        })
      }

      return res.json({
        success: true,
        liked: false,
        message: 'Post unliked',
      })
    }

    // -----------------------------
    // LIKE
    // -----------------------------
    const { error: insertError } = await supabase
      .from('post_likes')
      .insert({
        post_id,
        user_id,
      })

    if (insertError) {
      console.error('Like insert error:', insertError)

      return res.status(500).json({
        success: false,
        message: insertError.message,
      })
    }

    return res.json({
      success: true,
      liked: true,
      message: 'Post liked',
    })
  } catch (error) {
    console.error('Like route error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

export default router