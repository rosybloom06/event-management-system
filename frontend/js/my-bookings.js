const bookingsContainer = document.getElementById("bookings-container");

function renderBookings(bookings) {
    if (!bookings?.length) {
        bookingsContainer.innerHTML = `<div class="empty-bookings"><h3>No bookings yet</h3><p>You haven't reserved an event yet.</p><a href="events.html" class="btn">Explore events</a></div>`;
        return;
    }
    bookingsContainer.innerHTML = bookings.map(booking => {
        const event = booking.event || {};
        const status = booking.status || "pending";
        return `<article class="booking-card">
            <div class="event-meta"><span class="status ${Venuro.escapeHTML(status)}">${Venuro.escapeHTML(status)}</span></div>
            <h3>${Venuro.escapeHTML(event.title || "Event")}</h3>
            <p><strong>Date:</strong> ${Venuro.formatDate(event.date)}</p>
            <p><strong>Location:</strong> ${Venuro.escapeHTML(event.location || "Not specified")}</p>
            ${status === "pending" ? `<div class="booking-actions"><button class="cancel-btn" data-booking-id="${Venuro.escapeHTML(booking._id)}">Cancel booking</button></div>` : ""}
        </article>`;
    }).join("");
    bookingsContainer.querySelectorAll("[data-booking-id]").forEach(button => {
        button.addEventListener("click", () => cancelBooking(button.dataset.bookingId));
    });
}

async function loadMyBookings() {
    const token = Venuro.getToken();
    if (!token) { window.location.href = "login.html"; return; }
    bookingsContainer.innerHTML = `<div class="loading-state">Loading bookings…</div>`;
    try {
        const response = await fetch(`${API_URL}/bookings/my`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to load bookings.");
        renderBookings(data.bookings || data || []);
    } catch (error) {
        console.error(error);
        bookingsContainer.innerHTML = `<div class="error-state">${Venuro.escapeHTML(error.message || "Unable to load bookings.")}</div>`;
    }
}

async function cancelBooking(bookingId) {
    if (!confirm("Cancel this booking?")) return;
    const token = Venuro.getToken();
    try {
        const response = await fetch(`${API_URL}/bookings/${encodeURIComponent(bookingId)}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to cancel booking.");
        Venuro.showToast("Booking cancelled successfully.", "success");
        loadMyBookings();
    } catch (error) {
        console.error(error);
        Venuro.showToast(error.message || "Unable to cancel booking.", "error");
    }
}

loadMyBookings();
