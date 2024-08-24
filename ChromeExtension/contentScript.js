window.addEventListener("message", (event) => {
  // Check if the message is the one we expect
  if (event.source === window && event.data.type === "SET_TOKEN") {
    const token = event.data.token;

    if (token) {
      // Store the token in Chrome's local storage
      chrome.storage.local.set({ userToken: JSON.stringify(token) }, () => {
        console.log("User token stored successfully.");

        // Retrieve the token to confirm it was stored
        chrome.storage.local.get(["userToken"], function (result) {
          console.log("Retrieved User Token:", result.userToken);
        });
      });
    } else {
      console.warn("No token provided in the message.");
    }
  }
});
chrome.storage.local.clear(function () {
  const error = chrome.runtime.lastError;
  if (error) {
    console.error("Error clearing local storage:", error);
  } else {
    console.log("All local storage data cleared.");
  }
});
