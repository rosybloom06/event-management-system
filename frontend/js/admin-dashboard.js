const token = Venuro.getToken();
const user = Venuro.getUser();

if (!token || user?.role !== "admin") {
    window.location.href = "login.html";
}

async function loadDashboard() {
    try {
        // -------------------------
        // TOTAL EVENTS
        // -------------------------
        const eventsResponse = await fetch(`${API_URL}/events`);
        const eventsData = await eventsResponse.json().catch(() => ({}));

        if (eventsResponse.ok) {
            const totalEvents =
                eventsData.count ??
                eventsData.events?.length ??
                0;

            document.getElementById("total-events").textContent = totalEvents;
        }

        // -------------------------
        // BOOKINGS
        // -------------------------
        const bookingsResponse = await fetch(
            `${API_URL}/bookings/all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const bookingsData = await bookingsResponse.json().catch(() => ({}));

        console.log("Bookings response:", bookingsData);

        if (!bookingsResponse.ok) {
            console.error(
                "Failed to load bookings:",
                bookingsResponse.status,
                bookingsData
            );

            document.getElementById("total-bookings").textContent = "—";
            document.getElementById("pending-bookings").textContent = "—";
            return;
        }

        // Get bookings array
        const bookings = Array.isArray(bookingsData)
            ? bookingsData
            : bookingsData.bookings ?? [];

        // Total bookings
        const totalBookings =
            bookingsData.count ?? bookings.length;

        document.getElementById("total-bookings").textContent =
            totalBookings;

        // Pending bookings
        const pendingBookings = bookings.filter(booking => {
            const status = String(booking.status || "")
                .trim()
                .toLowerCase();

            return status === "pending";
        }).length;

        document.getElementById("pending-bookings").textContent =
            pendingBookings;

        console.log("Total bookings:", totalBookings);
        console.log("Pending bookings:", pendingBookings);

    } catch (error) {
        console.error("Dashboard error:", error);

        document.getElementById("total-events").textContent = "—";
        document.getElementById("total-bookings").textContent = "—";
        document.getElementById("pending-bookings").textContent = "—";
    }
}

loadDashboard();