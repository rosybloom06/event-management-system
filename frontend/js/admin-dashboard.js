const token = Venuro.getToken();
const user = Venuro.getUser();
if (!token || user?.role !== "admin") {
    window.location.href = "login.html";
}

async function loadDashboard() {
    try {
        const eventsResponse = await fetch(`${API_URL}/events`);
        const eventsData = await eventsResponse.json().catch(() => ({}));
        if (eventsResponse.ok) document.getElementById("total-events").textContent = eventsData.count ?? eventsData.events?.length ?? 0;

        const bookingsResponse = await fetch(`${API_URL}/bookings/all`, { headers: { Authorization: `Bearer ${token}` } });
        const bookingsData = await bookingsResponse.json().catch(() => ({}));
        if (bookingsResponse.ok) document.getElementById("total-bookings").textContent = bookingsData.count ?? bookingsData.bookings?.length ?? 0;
    } catch (error) {
        console.error("Dashboard error:", error);
        document.getElementById("total-events").textContent = "—";
        document.getElementById("total-bookings").textContent = "—";
    }
}
loadDashboard();
