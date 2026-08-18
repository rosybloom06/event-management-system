const usersContainer = document.getElementById("users-container");
const esc = value => Venuro.escapeHTML(value);

function displayUsers(users) {
    if (!users?.length) { usersContainer.innerHTML = `<div class="empty-state"><h3>No registered users</h3><p>No user accounts were returned by the server.</p></div>`; return; }
    usersContainer.innerHTML = users.map(user => {
        const isAdmin = user.role === "admin";
        return `<article class="user-card"><h3>${esc(user.name || "Unnamed user")}</h3><p><strong>Email:</strong> ${esc(user.email || "Not available")}</p><p><strong>Role:</strong><span class="role-badge">${esc(user.role || "user")}</span></p>${isAdmin ? `<p class="admin-label">🛡️ Administrator account</p>` : `<button class="delete-btn" data-user-id="${esc(user._id)}">Delete user</button>`}</article>`;
    }).join("");
    usersContainer.querySelectorAll("[data-user-id]").forEach(button => button.addEventListener("click", () => deleteUser(button.dataset.userId)));
}

async function loadUsers() {
    const token = Venuro.getToken();
    if (!token) { window.location.href = "login.html"; return; }
    usersContainer.innerHTML = `<div class="loading-state">Loading users…</div>`;
    try {
        const response = await fetch(`${API_URL}/auth/users`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to load users.");
        displayUsers(data.users || data || []);
    } catch (error) { console.error(error); usersContainer.innerHTML = `<div class="error-state">${esc(error.message || "Unable to load users.")}</div>`; }
}

async function deleteUser(userId) {
    if (!confirm("Delete this user account? This action cannot be undone.")) return;
    try {
        const response = await fetch(`${API_URL}/auth/users/${encodeURIComponent(userId)}`, { method: "DELETE", headers: { Authorization: `Bearer ${Venuro.getToken()}` } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to delete user.");
        Venuro.showToast("User deleted.", "success"); loadUsers();
    } catch (error) { console.error(error); Venuro.showToast(error.message || "Unable to delete user.", "error"); }
}
loadUsers();
