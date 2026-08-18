/* Venuro shared frontend helpers. Backend API contracts remain unchanged. */
const API_URL = window.VENURO_API_URL || "https://venuro-backend.onrender.com/api";

window.Venuro = {
    API_URL,
    getToken: () => localStorage.getItem("token"),
    getUser: () => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    },
    clearSession: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
    escapeHTML: (value) => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;"),
    formatDate: (value) => {
        if (!value) return "Date not available";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Date not available";
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    },
    showToast: (message, type = "info") => {
        let toast = document.getElementById("venuro-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "venuro-toast";
            toast.setAttribute("role", "status");
            document.body.appendChild(toast);
        }
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        requestAnimationFrame(() => toast.classList.add("is-visible"));
        clearTimeout(window.__venuroToastTimer);
        window.__venuroToastTimer = setTimeout(() => {
            toast.classList.remove("is-visible");
        }, 3200);
    }
};
