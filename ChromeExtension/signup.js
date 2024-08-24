document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const response = await fetch("http://localhost:4000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const result = await response.json();

        chrome.storage.local.set({ userToken: JSON.stringify(result) }).then(() => {
            console.log("User token stored successfully.");
            window.location.href = chrome.runtime.getURL("popup.html");
          });
    } else {
        alert("Signup failed!");
    }
});
