const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoryDescription = document.getElementById("categoryDescription");
const categoriesContainer = document.getElementById("categories-container");
const esc = value => Venuro.escapeHTML(value);
let categories = [];

function displayCategories(items) {
    categories = items || [];
    if (!categories.length) { categoriesContainer.innerHTML = `<div class="empty-state"><h3>No categories yet</h3><p>Create a category to organize your events.</p></div>`; return; }
    categoriesContainer.innerHTML = categories.map(category => `<article class="category-card"><h3>🏷️ ${esc(category.name)}</h3><p>${esc(category.description || "No description available.")}</p><div class="category-actions"><button class="edit-category-btn" data-id="${esc(category._id)}">Edit</button><button class="delete-category-btn" data-id="${esc(category._id)}">Delete</button></div></article>`).join("");
    categoriesContainer.querySelectorAll(".edit-category-btn").forEach(btn => btn.addEventListener("click", () => editCategory(btn.dataset.id)));
    categoriesContainer.querySelectorAll(".delete-category-btn").forEach(btn => btn.addEventListener("click", () => deleteCategory(btn.dataset.id)));
}

async function loadCategories() {
    categoriesContainer.innerHTML = `<div class="loading-state">Loading categories…</div>`;
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to load categories.");
        displayCategories(data.categories || data || []);
    } catch (error) { console.error(error); categoriesContainer.innerHTML = `<div class="error-state">${esc(error.message || "Unable to load categories.")}</div>`; }
}

categoryForm?.addEventListener("submit", async event => {
    event.preventDefault();
    const button = categoryForm.querySelector("button[type='submit']");
    button.disabled = true; button.textContent = "Adding…";
    try {
        const response = await fetch(`${API_URL}/categories`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${Venuro.getToken()}` }, body: JSON.stringify({ name: categoryName.value.trim(), description: categoryDescription.value.trim() }) });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to create category.");
        categoryForm.reset(); Venuro.showToast("Category created.", "success"); loadCategories();
    } catch (error) { console.error(error); Venuro.showToast(error.message || "Unable to create category.", "error"); }
    finally { button.disabled = false; button.textContent = "Add category"; }
});

async function deleteCategory(id) {
    if (!confirm("Delete this category?")) return;
    try {
        const response = await fetch(`${API_URL}/categories/${encodeURIComponent(id)}`, { method: "DELETE", headers: { Authorization: `Bearer ${Venuro.getToken()}` } });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to delete category.");
        Venuro.showToast("Category deleted.", "success"); loadCategories();
    } catch (error) { console.error(error); Venuro.showToast(error.message || "Unable to delete category.", "error"); }
}

async function editCategory(id) {
    const category = categories.find(item => item._id === id);
    if (!category) return;
    const name = prompt("Category name:", category.name);
    if (name === null) return;
    const description = prompt("Description:", category.description || "");
    if (description === null) return;
    if (!name.trim()) { Venuro.showToast("Category name cannot be empty.", "error"); return; }
    try {
        const response = await fetch(`${API_URL}/categories/${encodeURIComponent(id)}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${Venuro.getToken()}` }, body: JSON.stringify({ name: name.trim(), description: description.trim() }) });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Failed to update category.");
        Venuro.showToast("Category updated.", "success"); loadCategories();
    } catch (error) { console.error(error); Venuro.showToast(error.message || "Unable to update category.", "error"); }
}
loadCategories();
