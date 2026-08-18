const profileContainer = document.getElementById("profile-container");

async function loadProfile() {
    const token = Venuro.getToken();
    if (!token) { window.location.href = "login.html"; return; }
    try {
        const response = await fetch(`${API_URL}/auth/profile`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to load profile.");
        const user = data.user;
        const initials = (user?.name || "U").trim().split(/\s+/).slice(0,2).map(part => part[0]).join("").toUpperCase();
        profileContainer.innerHTML = `<section class="profile-card">
            <div class="profile-heading"><div class="profile-avatar">${Venuro.escapeHTML(initials)}</div><div><h2>${Venuro.escapeHTML(user?.name || "User")}</h2><span class="role-badge">${Venuro.escapeHTML(user?.role || "user")}</span></div></div>
            <div class="profile-row"><span>Email</span><strong>${Venuro.escapeHTML(user?.email || "Not available")}</strong></div>
            <div class="profile-row"><span>Role</span><strong>${Venuro.escapeHTML(user?.role || "User")}</strong></div>
        </section>`;
    } catch (error) {
        console.error(error);
        profileContainer.innerHTML = `<div class="error-state">${Venuro.escapeHTML(error.message || "Unable to load profile.")}</div>`;
    }
}
loadProfile();
