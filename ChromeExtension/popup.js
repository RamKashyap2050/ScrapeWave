window.onload = () => {
  chrome.storage.local.get("userToken", (result) => {
    const userToken = result.userToken;
    console.log("User token from extension storage:", userToken);

    const recommendButton = document.getElementById("recommendButton");
    const scrapeButton = document.getElementById("scrapeButton");
    const authMessage = document.getElementById("authMessage");
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");
    const logoutButton = document.getElementById("logoutButton");
    const userEmailDiv = document.getElementById("userEmail");
    const viewPlaylistsButton = document.getElementById("viewPlaylistsButton");
    if (userToken) {
      const user = JSON.parse(userToken);
      recommendButton.disabled = false;
      scrapeButton.disabled = false;
      authMessage.innerHTML = "Welcome back!";
      userEmailDiv.innerHTML = `Logged in as: ${user.email}`;
      loginButton.style.display = "none";
      signupButton.style.display = "none";
      viewPlaylistsButton.display = "block";
      logoutButton.style.display = "block";
    } else {
      authMessage.innerHTML = `<p>You are not logged in. Please log in or sign up.</p>`;
      loginButton.style.display = "block";
      signupButton.style.display = "block";
      viewPlaylistsButton.display = "none";
      logoutButton.style.display = "none";
      userEmailDiv.innerHTML = "";
    }

    loginButton.addEventListener("click", () => {
      window.location.href = chrome.runtime.getURL("login.html");
    });

    signupButton.addEventListener("click", () => {
      window.location.href = chrome.runtime.getURL("signup.html");
    });

    logoutButton.addEventListener("click", () => {
      chrome.storage.local.remove("userToken", () => {
        console.log("User logged out.");
        window.location.reload(); // Refresh the popup to reflect the logout state
      });
    });
    viewPlaylistsButton.addEventListener("click", () => {
      window.location.href = chrome.runtime.getURL("playlist.html");
    });
  });
};

// Existing recommendation and scraping logic
document
  .getElementById("recommendButton")
  .addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value;
    const resultsDiv = document.getElementById("results");

    if (!prompt) {
      alert("Please enter your music preferences.");
      return;
    }

    resultsDiv.innerHTML = "Loading recommendations..."; // Show loading indicator

    try {
      // Make a POST request to your backend
      const response = await fetch(
        "http://localhost:4000/Recommend/recommend",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      resultsDiv.innerHTML =
        "Failed to fetch recommendations. Please try again.";
    }
  });

function displayResults(links) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  if (!Array.isArray(links) || links.length === 0) {
    resultsDiv.innerText = "No recommendations found.";
  } else {
    links.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.url || link; // Check if link is an object with a 'url' property or a string
      a.target = "_blank";
      a.innerText = link.title || link.url || link; // Display title if available, otherwise URL or link itself
      resultsDiv.appendChild(a);
      resultsDiv.appendChild(document.createElement("br"));
    });
  }
}

// Event listener for scraping playlist
document.getElementById("scrapeButton").addEventListener("click", async () => {
  const playlistUrl = prompt("Enter the YouTube playlist URL:");
  const resultsDiv = document.getElementById("results");

  if (!playlistUrl) {
    alert("Please enter a valid playlist URL.");
    return;
  }

  resultsDiv.innerHTML = "Scraping playlist..."; // Show loading indicator

  try {
    const result = await chrome.storage.local.get(["userToken"]);
    const userToken = result.userToken;

    if (!userToken) {
      alert("User not logged in. Please log in first.");
      return;
    }

    const user = JSON.parse(userToken); // Parse the stored user token to get user details
    const userId = user.id; // Extract the user ID
    const response = await fetch(
      "http://localhost:4000/Recommend/scrape-playlist",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistUrl, userId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to scrape playlist");
    }

    const data = await response.json();
    console.log("Scraped Playlist Data:", data); // Log the scraped data for debugging
    displayResults(data.map((video) => video.url)); // Reuse the display function to show video URLs
  } catch (error) {
    console.error("Error scraping playlist:", error);
    resultsDiv.innerHTML = "Failed to scrape playlist. Please try again.";
  }
});
