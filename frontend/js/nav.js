(() => {
    const nav = document.querySelector(".nav-links");
    if (!nav) return;

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {
        user = null;
    }

    const file = window.location.pathname.split("/").pop() || "index.html";
    const isAdminPage = file === "admin-dashboard.html" || file.startsWith("admin-");

    if (isAdminPage && (!user || user.role !== "admin")) {
        window.location.href = "login.html";
        return;
    }

    const link = (href, label, className = "") =>
        `<a href="${href}" class="${className} ${file === href ? "active" : ""}">${label}</a>`;

    if (user?.role === "admin") {
        nav.innerHTML = [
            link("admin-dashboard.html", "Dashboard"),
            link("admin-events.html", "Events"),
            link("admin-bookings.html", "Bookings"),
            link("admin-users.html", "Users"),
            link("admin-categories.html", "Categories"),
            `<a href="#" id="logoutBtn" class="nav-logout">Logout</a>`
        ].join("");
    } else if (user) {
        nav.innerHTML = [
            link("index.html", "Home"),
            link("events.html", "Events"),
            link("my-bookings.html", "My Bookings"),
            link("profile.html", "Profile"),
            `<a href="#" id="logoutBtn" class="nav-logout">Logout</a>`
        ].join("");
    } else {
        nav.innerHTML = [
            link("index.html", "Home"),
            link("events.html", "Events"),
            link("login.html", "Login"),
            link("register.html", "Get Started", "nav-register")
        ].join("");
    }

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });

    const menuButton = document.getElementById("mobile-nav-toggle");
    menuButton?.addEventListener("click", () => {
        const expanded = nav.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(expanded));
    });
})();
