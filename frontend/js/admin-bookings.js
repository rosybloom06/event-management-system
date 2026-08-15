const bookingsContainer = document.getElementById("bookings-container");
const esc = value => Venuro.escapeHTML(value);

function displayBookings(bookings) {
    if (!bookings?.length) {
        bookingsContainer.innerHTML = `<div class="empty-state"><h3>No bookings found</h3><p>There are currently no event bookings.</p></div>`;
        return;
    }
    bookingsContainer.innerHTML = bookings.map(booking => {
        const user = booking.user || {};
        const event = booking.event || {};
        const status = booking.status || "pending";
        return `<article class="booking-card">
            <div class="event-meta"><span class="status ${esc(status)}">${esc(status)}</span></div>
            <h3>${esc(event.title || "Unknown event")}</h3>
            <p><strong>User:</strong> ${esc(user.name || user.email || "Unknown user")}</p>
            <p><strong>Email:</strong> ${esc(user.email || "No email")}</p>
            <p><strong>Event date:</strong> ${Venuro.formatDate(event.date)}</p>
            <p><strong>Booking ID:</strong> ${esc(booking._id)}</p>
            <div class="booking-actions">
                ${status === "pending" ? `<button class="approve-btn" data-id="${esc(booking._id)}" data-status="approved">Approve</button><button class="reject-btn" data-id="${esc(booking._id)}" data-status="rejected">Reject</button>` : `<span>No actions available</span>`}
            </div>
        </article>`;
    }).join("");
    bookingsContainer.querySelectorAll("[data-status]").forEach(button => button.addEventListener("click", () => updateBookingStatus(button.dataset.id, button.dataset.status)));
}

async function loadBookings() {
    const token = Venuro.getToken();
    if (!token) { window.location.href = "login.html"; return; }
    bookingsContainer.innerHTML = `<div class="loading-state">Loading bookings…</div>`;
    try {
        const response = await fetch(`${API_URL}/bookings/all`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to load bookings.");
        displayBookings(data.bookings || data || []);
    } catch (error) {
        console.error(error);
        bookingsContainer.innerHTML = `<div class="error-state">${esc(error.message || "Unable to load bookings.")}</div>`;
    }
}

async function updateBookingStatus(bookingId, status) {
    if (!confirm(`${status === "approved" ? "Approve" : "Reject"} this booking?`)) return;
    try {
        const response = await fetch(`${API_URL}/bookings/${encodeURIComponent(bookingId)}/status`, {
            method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${Venuro.getToken()}` }, body: JSON.stringify({ status })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to update booking.");
        Venuro.showToast(`Booking ${status}.`, "success"); await loadBookings();
    } catch (error) { console.error(error); Venuro.showToast(error.message || "Unable to update booking.", "error"); }
}
loadBookings();
