document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("http://localhost:4000/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  console.log(response)
  if (response.ok) {
    const result = await response.json();
    chrome.storage.local.set({ userToken: JSON.stringify(result) }).then(() => {
      console.log("User token stored successfully.");
      window.location.href = chrome.runtime.getURL("popup.html");
    });
  } else {
    alert("Login failed!");
  }
});
