document.addEventListener("DOMContentLoaded", async function () {
  const result = await chrome.storage.local.get(["userToken"]);
  const userToken = result.userToken;

  if (!userToken) {
    alert("User not logged in. Please log in first.");
    return;
  }

  const user = JSON.parse(userToken); // Parse the stored user token to get user details
  const userId = user.id; // Extract the user ID
  const playlistContainer = document.getElementById("playlist-container");

  // Fetch playlists for the specified userId
  fetch(`http://localhost:4000/Recommend/playlists/${userId}`)
    .then((response) => response.json())
    .then((playlists) => {
      if (playlists.length === 0) {
        playlistContainer.innerHTML =
          "<p>No playlists found for this user.</p>";
        return;
      }

      playlists.forEach((playlist) => {
        const playlistElement = document.createElement("div");
        playlistElement.className = "playlist-item";
        playlistElement.innerHTML = `
            <h3>${playlist.playlistTitle}</h3>
            <p><a href="${playlist.playlistUrl}" target="_blank">${playlist.playlistUrl}</a></p>
          `;
        playlistContainer.appendChild(playlistElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching playlists:", error);
      playlistContainer.innerHTML = "<p>Error fetching playlists.</p>";
    });

  document.getElementById("backToPopupButton").addEventListener("click", () => {
    window.location.href = chrome.runtime.getURL("popup.html");
  });
});
