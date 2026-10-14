import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supabase from "./config/supabase.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/profiles", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);

app.get("/api/health", async (req, res) => {
  const { error } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);

  if (error) {
    return res.status(500).json({
      success: false,
      message: "Backend connected, but Supabase connection failed",
      error: error.message,
    });
  }

  res.json({
    success: true,
    message: "Zingoo Backend + Supabase are connected",
  });
});

app.listen(PORT, () => {
  console.log(`Zingoo Backend running on http://localhost:${PORT}`);
});