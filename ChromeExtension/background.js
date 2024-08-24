chrome.runtime.onInstalled.addListener(() => {
  console.log("Music Recommendation Assistant installed.");
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.clear(() => {
    console.log("Local storage cleared on extension install/reload.");
  });
});
