const express = require("express");
const { recommendations } = require("../controllers/recommendationController");
const { scrapeYouTubePlaylist } = require("../scrappers/youtubeScrapper");
const Playlist = require("../models/Playlist");
const router = express.Router();

router.post("/recommend", recommendations);
router.post("/scrape-playlist", async (req, res) => {
  const { playlistUrl, userId } = req.body;

  console.log("Received request data:");
  console.log(playlistUrl); // Log the playlist URL for debugging
  console.log("Recieved User ID");
  console.log(userId);
  if (!playlistUrl) {
    return res.status(400).json({ error: "Playlist URL is required" });
  }

  try {
    const videos = await scrapeYouTubePlaylist(playlistUrl, userId);
    res.json(videos);
  } catch (error) {
    console.error("Error scraping YouTube playlist:", error);
    res.status(500).json({ error: "Failed to scrape playlist" });
  }
});

router.get("/playlists/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("Recieving User ID in playlists/:userId");
  console.log(userId);
  try {
    const playlists = await Playlist.findAll({
      where: { userId: userId },
    });

    if (!playlists || playlists.length === 0) {
      return res
        .status(404)
        .json({ message: "No playlists found for this user" });
    }

    res.json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
