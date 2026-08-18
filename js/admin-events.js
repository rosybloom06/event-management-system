const text = (value) => Venuro.escapeHTML(value);

const eventsContainer = document.getElementById("events-container");
const eventForm = document.getElementById("event-form");
const eventFormSection = document.getElementById("event-form-section");
const formTitle = document.getElementById("form-title");
const categorySelect = document.getElementById("category");
let allEvents = [];
const esc = value => Venuro.escapeHTML(value);

function setFormVisible(visible) {
    eventFormSection.hidden = !visible;
    if (!visible) eventForm.reset();
}

function displayEvents(events) {
    if (!events?.length) {
        eventsContainer.innerHTML = `<div class="empty-state"><h3>No events yet</h3><p>Create your first event with the button above.</p></div>`;
        return;
    }
    eventsContainer.innerHTML = events.map(event => {
        const category = typeof event.category === "object" ? event.category?.name : event.category;
        const image = typeof event.image === "string" ? event.image.trim() : "";
        const visualStyle = image ? ` style="background-image:url('${esc(image)}')"` : "";
        return `<article class="event-card">
            <div class="event-visual ${image ? "has-image" : ""}"${visualStyle}><span class="event-visual-mark" aria-hidden="true">✦</span></div>
            <div class="event-meta">${category ? `<span class="meta-pill">${esc(category)}</span>` : ""}</div>
            <h3>${esc(event.title)}</h3>
            <p class="event-summary">${esc(event.description || "No description.")}</p>
            <p><strong>Date:</strong> ${Venuro.formatDate(event.date)}</p>
            ${event.time ? `<p><strong>Time:</strong> ${text(event.time)}</p>` : ""}
            <p><strong>Location:</strong> ${text(event.location || "Not specified")}</p>
            <p><strong>Price:</strong> ₹${Number(event.price || 0).toLocaleString("en-IN")}</p>
            <p><strong>Capacity:</strong> ${text(event.capacity)}</p>
            <div class="form-buttons event-action"><button type="button" class="edit-event" data-id="${esc(event._id)}">Edit</button><button type="button" class="delete-event delete-btn" data-id="${esc(event._id)}">Delete</button></div>
            </article>`;
    }).join("");
    eventsContainer.querySelectorAll(".edit-event").forEach(btn => btn.addEventListener("click", () => editEvent(btn.dataset.id)));
    eventsContainer.querySelectorAll(".delete-event").forEach(btn => btn.addEventListener("click", () => deleteEvent(btn.dataset.id)));
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
        eventsContainer.innerHTML = `<div class="error-state">${esc(error.message || "Unable to load events.")}</div>`;
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to load categories.");
        categorySelect.innerHTML = `<option value="">Select category</option>`;
        (data.categories || data || []).forEach(category => {
            const option = document.createElement("option"); option.value = category._id; option.textContent = category.name; categorySelect.appendChild(option);
        });
    } catch (error) { console.error(error); }
}

function showAddEventForm() {
    eventForm.reset(); document.getElementById("event-id").value = ""; formTitle.textContent = "Add event"; setFormVisible(true); window.scrollTo({ top: 0, behavior: "smooth" });
}
function hideEventForm() { setFormVisible(false); }

async function saveEvent(event) {

    const eventId =
        document.getElementById("event-id").value.trim();

    const title =
        document.getElementById("title").value.trim();

    const description =
        document.getElementById("description").value.trim();

    const date =
        document.getElementById("date").value;

    const time =
        document.getElementById("time").value;

    const location =
        document.getElementById("location").value.trim();

    const category =
        categorySelect.value;

    const capacity =
        Number(document.getElementById("capacity").value);

    const price =
        Number(document.getElementById("price").value);    

    const image =
        document.getElementById("image").value.trim();


    // ======================================
    // Validate required fields
    // ======================================

    if (!title) {
        Venuro.showToast("Event title is required.", "error");
        return;
    }

    if (!date) {
        Venuro.showToast("Event date is required.", "error");
        return;
    }

    if (!time) {
        Venuro.showToast("Event time is required.", "error");
        return;
    }

    if (!location) {
        Venuro.showToast("Event location is required.", "error");
        return;
    }

    if (!category) {
        Venuro.showToast("Please select a category.", "error");
        return;
    }

    if (!capacity || capacity <= 0) {
        Venuro.showToast(
            "Capacity must be greater than 0.",
            "error"
        );
        return;
    }

    if (price < 0) {
        Venuro.showToast(
            "Price cannot be negative.",
            "error"
        );
        return;
    }


    // ======================================
    // Create payload
    // ======================================

    const payload = {
        title,
        description,
        date,
        time,
        location,
        category,
        capacity,
        price,
        image
    };


    const button =
        eventForm.querySelector("button[type='submit']");

    button.disabled = true;
    button.textContent = "Saving…";


    try {

        const url =
            `${API_URL}/events${
                eventId
                    ? `/${encodeURIComponent(eventId)}`
                    : ""
            }`;


        // ======================================
        // Debug information
        // ======================================

        console.log(
            "========== SAVE EVENT =========="
        );

        console.log(
            "Mode:",
            eventId ? "UPDATE" : "CREATE"
        );

        console.log(
            "Event ID:",
            eventId
        );

        console.log(
            "Request URL:",
            url
        );

        console.log(
            "Payload:",
            payload
        );

        console.log(
            "Category:",
            category
        );

        console.log(
            "Time:",
            time
        );

        console.log(
            "Image URL:",
            image
        );

        console.log(
            "Token exists:",
            !!Venuro.getToken()
        );


        // ======================================
        // Send request
        // ======================================

        const response = await fetch(
            url,
            {
                method: eventId
                    ? "PUT"
                    : "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${Venuro.getToken()}`
                },

                body:
                    JSON.stringify(payload)
            }
        );


        // ======================================
        // Read server response
        // ======================================

        const rawResponse =
            await response.text();


        console.log(
            "Response status:",
            response.status
        );

        console.log(
            "Server response:",
            rawResponse
        );


        let data = {};

        try {

            data =
                JSON.parse(rawResponse);

        } catch {

            data = {
                message: rawResponse
            };
        }


        // ======================================
        // Handle server error
        // ======================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                `Server returned ${response.status}`
            );
        }


        // ======================================
        // Success
        // ======================================

        Venuro.showToast(
            eventId
                ? "Event updated successfully."
                : "Event created successfully.",
            "success"
        );


        hideEventForm();

        await loadEvents();


    } catch (error) {

        console.error(
            "SAVE EVENT ERROR:",
            error
        );

        Venuro.showToast(
            error.message ||
            "Unable to save event.",
            "error"
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "Save event";
    }
}

function editEvent(id) {
    const event = allEvents.find(item => item._id === id);

    if (!event) return;

    // Event ID
    document.getElementById("event-id").value = event._id;

    // Basic fields
    document.getElementById("title").value =
        event.title || "";

    document.getElementById("description").value =
        event.description || "";

    // Date
    document.getElementById("date").value =
        event.date
            ? event.date.substring(0, 10)
            : "";

    // Time
    document.getElementById("time").value =
        event.time || "";

    // Location
    document.getElementById("location").value =
        event.location || "";

    // Capacity
    document.getElementById("capacity").value =
        event.capacity ?? "";

    // Price
    document.getElementById("price").value =
        event.price ?? 0;    

    // Image URL
    document.getElementById("image").value =
        event.image || "";


    // ======================================
    // Category
    // ======================================

    let categoryId = "";

    if (event.category) {

        if (typeof event.category === "object") {
            categoryId = event.category._id || "";
        } else {
            categoryId = event.category;
        }
    }

    categorySelect.value = categoryId;


    // ======================================
    // If category value is a category name
    // instead of an ID, find matching option
    // ======================================

    if (!categorySelect.value && event.category) {

        const categoryName =
            typeof event.category === "object"
                ? event.category.name
                : event.category;

        const matchingOption =
            Array.from(categorySelect.options).find(
                option =>
                    option.textContent.trim().toLowerCase() ===
                    String(categoryName).trim().toLowerCase()
            );

        if (matchingOption) {
            categorySelect.value =
                matchingOption.value;
        }
    }


    // ======================================
    // Show form
    // ======================================

    formTitle.textContent = "Edit event";

    setFormVisible(true);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function deleteEvent(id) {
    if (!confirm("Delete this event? This action cannot be undone.")) return;
    try {
        const response = await fetch(`${API_URL}/events/${encodeURIComponent(id)}`, { method: "DELETE", headers: { Authorization: `Bearer ${Venuro.getToken()}` } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to delete event.");
        Venuro.showToast("Event deleted.", "success"); await loadEvents();
    } catch (error) { console.error(error); Venuro.showToast(error.message || "Unable to delete event.", "error"); }
}

document.getElementById("add-event-btn")?.addEventListener("click", showAddEventForm);
document.getElementById("cancel-event-btn")?.addEventListener("click", hideEventForm);
eventForm?.addEventListener("submit", event => { event.preventDefault(); saveEvent(event); });
async function initializePage() {
    await loadCategories();
    await loadEvents();
}

initializePage();
