import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Get the user ID from the query
    const { user_id } = req.query;

    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        post_media (*),
        profiles (*),
        post_likes (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch posts:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch posts",
        error: error.message,
      });
    }

    // Add liked information for the current user
    const posts = data.map((post) => {
      const likes = post.post_likes || [];

      const liked = user_id
        ? likes.some((like) => like.user_id === user_id)
        : false;

      return {
        ...post,
        liked,
        likes: likes.length,
      };
    });

    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Post route error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;