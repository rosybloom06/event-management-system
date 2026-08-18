const eventContainer = document.getElementById("event-container");

async function loadUpcomingEvents() {
    if (!eventContainer) return;
    try {
        const response = await fetch(`${API_URL}/events`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to load events.");
        const events = (data.events || data || []).slice(0, 3);
        if (!events.length) {
            eventContainer.innerHTML = `<div class="empty-state"><h3>No upcoming events</h3><p>Check back soon for new experiences.</p></div>`;
            return;
        }
        eventContainer.innerHTML = events.map(event => {
            const image = typeof event.image === "string" ? event.image.trim() : "";
            const visualStyle = image ? ` style="background-image:url('${Venuro.escapeHTML(image)}')"` : "";
            return `
            <article class="event-card">
                <div class="event-visual ${image ? "has-image" : ""}"${visualStyle}>
                    <span class="event-visual-mark" aria-hidden="true">✦</span>
                </div>
                <div class="event-meta"><span class="meta-pill">Upcoming</span></div>
                <h3>${Venuro.escapeHTML(event.title)}</h3>
                <p class="event-summary">${Venuro.escapeHTML(event.description || "No description available.")}</p>
                <p><strong>Date:</strong> ${Venuro.formatDate(event.date)}</p>
                <p><strong>Location:</strong> ${Venuro.escapeHTML(event.location || "Not specified")}</p>
                <div class="event-action"><a href="event-details.html?id=${encodeURIComponent(event._id)}">View Details <span aria-hidden="true">→</span></a></div>
            </article>`;
        }).join("");
    } catch (error) {
        console.error(error);
        eventContainer.innerHTML = `<div class="error-state">Unable to load upcoming events.</div>`;
    }
}
loadUpcomingEvents();
