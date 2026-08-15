const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = loginForm.querySelector("button[type='submit']");
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    button.disabled = true;
    button.textContent = "Signing in…";
    loginMessage.textContent = "";
    loginMessage.className = "";

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Login failed.");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        loginMessage.textContent = "Login successful. Redirecting…";
        loginMessage.className = "message-success";

        window.location.href = data.user?.role === "admin" ? "admin-dashboard.html" : "events.html";
    } catch (error) {
        console.error(error);
        loginMessage.textContent = error.message || "Unable to connect to server.";
        loginMessage.className = "message-error";
    } finally {
        button.disabled = false;
        button.textContent = "Login";
    }
});
