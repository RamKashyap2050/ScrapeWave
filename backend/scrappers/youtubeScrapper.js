const puppeteer = require("puppeteer");
const Playlist = require("../models/Playlist"); // Adjust the path as necessary

async function scrapeYouTubePlaylist(playlistURL, userId) {
  const browser = await puppeteer.launch({ headless: true });
  console.log(userId)
  const page = await browser.newPage();
  await page.goto(playlistURL, { waitUntil: "networkidle2" });

  const playlistInfo = [];

  // Scrape the currently playing video
  const currentVideo = await page.evaluate(() => {
    const videoElement = document.querySelector("ytd-player");
    if (videoElement) {
      const titleElement = videoElement.querySelector(".ytp-title-link");
      const title = titleElement?.innerText || "No title found";
      const url = titleElement?.href || window.location.href; // Fallback to the current page URL
      return { title, url };
    }
    return null;
  });

  if (currentVideo) {
    playlistInfo.push(currentVideo);
  }

  // Scrape the other videos in the playlist or recommendations
  const otherVideos = await page.evaluate(() => {
    let videos = [];
    const videoElements = document.querySelectorAll(
      "ytd-playlist-video-renderer, ytd-compact-video-renderer"
    );

    videoElements.forEach((video) => {
      const titleElement = video.querySelector("#video-title");
      const title = titleElement?.innerText || "No title found";
      const urlElement = video.querySelector("a#thumbnail"); // Adjusted to get the correct URL
      const url = urlElement?.href || "No URL found";
      videos.push({ title, url });
    });

    return videos;
  });

  playlistInfo.push(...otherVideos);
  console.log(playlistInfo);

  // Save the scraped data to the database
  for (const video of playlistInfo) {
    await Playlist.create({
      userId: userId,
      playlistTitle: video.title,
      playlistUrl: video.url,
    });
  }

  await browser.close();
  return playlistInfo;
}



module.exports = {
  scrapeYouTubePlaylist,
};
