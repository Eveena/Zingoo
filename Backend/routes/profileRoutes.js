import express from "express";
import supabase from "../config/supabase.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    return res.status(404).json({
      success: false,
      message: "Profile not found",
      error: error.message,
    });
  }

  res.json({
    success: true,
    profile: data,
  });
});

export default router;