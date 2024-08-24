const asyncHandler = require("express-async-handler");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Recommendation = require("../models/Recommendation")
const recommendations = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const youTubeLinks = await getRecommendations(prompt);

  // Save each recommendation to the database
  for (const videoUrl of youTubeLinks) {
    await Recommendation.create({
      searchId: req.body.searchId || 0, // Assuming you have a searchId from the request, otherwise use a default value
      videoId: extractVideoId(videoUrl),
      videoTitle: await getVideoTitle(videoUrl), // Fetch the title using a helper function
      videoUrl: videoUrl,
    });
  }

  res.json(youTubeLinks);
});

function extractVideoId(url) {
  const videoIdMatch = url.match(/v=([a-zA-Z0-9_-]{11})/);
  return videoIdMatch ? videoIdMatch[1] : null;
}

async function getVideoTitle(url) {
  try {
    const videoId = extractVideoId(url);
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    return data.items[0].snippet.title || "Unknown Title";
  } catch (error) {
    console.error("Error fetching video title:", error.message);
    return "Unknown Title";
  }
}

async function getRecommendations(prompt) {
  const geminiResponse = await fetchGeminiAPI(prompt);
  const openAIResponse = await fetchOpenAIAPI(prompt);
  const simplifiedQuery = simplifyQuery(geminiResponse, openAIResponse);

  const youTubeLinks = await searchYouTube(simplifiedQuery);
  return youTubeLinks;
}

function simplifyQuery(geminiResponse, openAIResponse) {
  const geminiKeywords = extractKeywords(geminiResponse);
  const openAIKeywords = extractKeywords(openAIResponse);

  return `${geminiKeywords} ${openAIKeywords}`.trim();
}

function extractKeywords(text) {
  return text.split(" ").slice(0, 10).join(" ");
}

async function fetchGeminiAPI(prompt) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const fullPrompt = `You are a music playlist recommendation assistant. The user is looking for a playlist with multiple songs that match these preferences: ${prompt}. Please provide a list of at least 5 song titles with artists`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = await response.text();
    return text; // Returning the text response
  } catch (error) {
    console.error("Error fetching from Gemini API:", error.message);
    return "";
  }
}

async function fetchOpenAIAPI(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPEN_AI_KEY}`, // Ensure API key is correct
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant who suggests music playlists.",
          },
          {
            role: "user",
            content: `The user is looking for a playlist of songs that fit the following preferences: ${prompt}. Please suggest a playlist with at least 5 song titles and artists that match these preferences.`,
          },  
        ],
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim(); // Return the content of the assistant's message
  } catch (error) {
    console.error("Error fetching from OpenAI API:", error.message);
    return "";
  }
}

async function searchYouTube(simplifiedQuery) {
  try {
    const searchQuery = `${simplifiedQuery}`;
    console.log("Search Query:", searchQuery); // Log the combined search query for debugging
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        searchQuery
      )}&type=video&key=${process.env.YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items.map(
      (item) => `https://www.youtube.com/watch?v=${item.id.videoId}`
    );
  } catch (error) {
    console.error("Error searching YouTube:", error);
    return [];
  }
}

module.exports = { recommendations };
