const eventDetails = document.getElementById("event-details");
const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");
let currentEvent = null;

const text = (value) => Venuro.escapeHTML(value);

async function loadEvent() {
    if (!eventId) {
        eventDetails.innerHTML = `<div class="error-state">Event ID is missing.</div>`;
        return;
    }
    try {
        const response = await fetch(`${API_URL}/events/${encodeURIComponent(eventId)}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Event not found.");
        currentEvent = data.event;
        const category = typeof currentEvent.category === "object" ? currentEvent.category?.name : currentEvent.category;
        const image = typeof currentEvent.image === "string" ? currentEvent.image.trim() : "";
        const visualStyle = image ? ` style="background-image:url('${text(image)}')"` : "";
        eventDetails.innerHTML = `
            <article class="event-detail-card">
                <div class="event-detail-visual"${visualStyle}></div>
                <div class="event-meta">${category ? `<span class="meta-pill">${text(category)}</span>` : ""}</div>
                <h2>${text(currentEvent.title)}</h2>
                <p class="event-description">${text(currentEvent.description || "No description available.")}</p>
                <div class="event-info">
                    <p><strong>📅 Date</strong><br>${Venuro.formatDate(currentEvent.date)}</p>
                    ${currentEvent.time ? `<p><strong>🕒 Time</strong><br>${text(currentEvent.time)}</p>` : ""}
                    <p><strong>📍 Location</strong><br>${text(currentEvent.location || "Not specified")}</p>
                    ${currentEvent.capacity ? `<p><strong>👥 Capacity</strong><br>${text(currentEvent.capacity)} people</p>` : ""}
                    <p><strong>💰 Price</strong><br>₹${Number(currentEvent.price ?? 0).toLocaleString("en-IN")}</p>
                </div>
                <button class="btn" type="button" id="book-event-btn">Book this event</button>
                <p class="booking-feedback" id="booking-feedback" aria-live="polite"></p>
            </article>`;
        document.getElementById("book-event-btn")?.addEventListener("click", bookEvent);
    } catch (error) {
        console.error(error);
        eventDetails.innerHTML = `<div class="error-state">${text(error.message || "Unable to load event.")}</div>`;
    }
}

async function bookEvent() {
    const token = Venuro.getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    const button = document.getElementById("book-event-btn");
    const feedback = document.getElementById("booking-feedback");
    button.disabled = true;
    button.textContent = "Booking…";
    feedback.textContent = "";
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ eventId })
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to book event.");
        feedback.textContent = "Booking submitted successfully. You can track it in My Bookings.";
        feedback.className = "booking-feedback message-success";
        button.textContent = "Booking submitted";
    } catch (error) {
        console.error(error);
        feedback.textContent = error.message || "Unable to connect to the server.";
        feedback.className = "booking-feedback message-error";
        button.disabled = false;
        button.textContent = "Book this event";
    }
}

loadEvent();
