const eventsContainer = document.getElementById("events-container");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
let allEvents = [];

const text = (value) => Venuro.escapeHTML(value);

function eventCategoryName(event) {
    return typeof event.category === "object" ? event.category?.name : event.category;
}

function displayEvents(events) {
    if (!events?.length) {
        eventsContainer.innerHTML = `
            <div class="empty-state">
                <h3>No events found</h3>
                <p>Try another search term or clear the category filter.</p>
                <button class="secondary-btn" type="button" id="clear-filters">Clear filters</button>
            </div>`;
        document.getElementById("clear-filters")?.addEventListener("click", () => {
            searchInput.value = "";
            categoryFilter.value = "";
            displayEvents(allEvents);
        });
        return;
    }

    eventsContainer.innerHTML = events.map(event => {
        const category = eventCategoryName(event);
        const image = typeof event.image === "string" ? event.image.trim() : "";

const visualHTML = image
    ? `
        <div class="event-visual has-image">
            <img src="${text(image)}" alt="${text(event.title)}" loading="lazy">
            <span class="event-visual-mark" aria-hidden="true">✦</span>
        </div>
      `
    : `
        <div class="event-visual">
            <span class="event-visual-mark" aria-hidden="true">✦</span>
        </div>
      `;

return `
    <article class="event-card">

        ${visualHTML}

        <div class="event-meta">
            ${category ? `<span class="meta-pill">${text(category)}</span>` : ""}
            ${event.capacity ? `<span class="meta-pill">${text(event.capacity)} seats</span>` : ""}
        </div>
                <h3>${text(event.title)}</h3>
                <p class="event-summary">${text(event.description || "No description available.")}</p>
                <p><strong>Date:</strong> ${Venuro.formatDate(event.date)}</p>
                ${event.time ? `<p><strong>Time:</strong> ${text(event.time)}</p>` : ""}
                <p><strong>Location:</strong> ${text(event.location || "Not specified")}</p>
                <div class="event-action"><a href="event-details.html?id=${encodeURIComponent(event._id)}">View Details <span aria-hidden="true">→</span></a></div>
            </article>`;
    }).join("");
}

function filterEvents() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const filtered = allEvents.filter(event => {
        const haystack = `${event.title || ""} ${event.description || ""}`.toLowerCase();
        const eventCategory = typeof event.category === "object" ? event.category?._id : event.category;
        return haystack.includes(query) && (!category || eventCategory === category);
    });
    displayEvents(filtered);
}

async function loadEvents() {
    eventsContainer.innerHTML = `<div class="loading-state">Loading events…</div>`;
    try {
        const response = await fetch(`${API_URL}/events`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to load events.");
        allEvents = data.events || data || [];
        displayEvents(allEvents);
    } catch (error) {
        console.error(error);
        eventsContainer.innerHTML = `<div class="error-state">Unable to load events. Please try again later.</div>`;
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) return;
        (data.categories || data || []).forEach(category => {
            const option = document.createElement("option");
            option.value = category._id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    } catch (error) { console.error("Failed to load categories:", error); }
}

searchInput?.addEventListener("input", filterEvents);
categoryFilter?.addEventListener("change", filterEvents);
loadEvents();
loadCategories();
