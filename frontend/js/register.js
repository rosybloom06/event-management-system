const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");

registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = registerForm.querySelector("button[type='submit']");
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    button.disabled = true;
    button.textContent = "Creating account…";
    registerMessage.textContent = "";
    registerMessage.className = "";

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Registration failed.");

        registerMessage.textContent = "Account created. Redirecting to login…";
        registerMessage.className = "message-success";
        setTimeout(() => { window.location.href = "login.html"; }, 700);
    } catch (error) {
        console.error(error);
        registerMessage.textContent = error.message || "Unable to connect to server.";
        registerMessage.className = "message-error";
    } finally {
        button.disabled = false;
        button.textContent = "Create account";
    }
});
