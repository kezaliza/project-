const uploadButton = document.querySelector("#arrival-upload-button");
const fileInput = document.querySelector("#arrival-file-input");
const arrivalGrid = document.querySelector("#arrival-grid");
const uploadStatus = document.querySelector("#arrival-upload-status");
const categoryFilters = document.querySelector(".arrival-categories");
const filterStatus = document.querySelector("#arrival-filter-status");

function getArrivalCategoryKey(card) {
    return card.querySelector(".product-category").textContent.toLowerCase().replaceAll(" ", "-");
}

arrivalGrid.querySelectorAll(".product-card").forEach((card) => {
    card.dataset.category = getArrivalCategoryKey(card);

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = getProductPrice(Number(card.dataset.productId));
    card.querySelector(".product-info").append(price);
});

categoryFilters.addEventListener("click", (event) => {
    const selectedFilter = event.target.closest("button[data-category]");

    if (!selectedFilter) {
        return;
    }

    const selectedCategory = selectedFilter.dataset.category;
    const visibleCount = Array.from(arrivalGrid.children).filter((card) => {
        const isVisible = selectedCategory === "all" || card.dataset.category === selectedCategory;
        card.hidden = !isVisible;
        return isVisible;
    }).length;

    categoryFilters.querySelectorAll("button[data-category]").forEach((button) => {
        const isActive = button === selectedFilter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    filterStatus.textContent = selectedCategory === "all"
        ? "Showing all new arrivals."
        : `Showing ${visibleCount} ${selectedFilter.textContent} product${visibleCount === 1 ? "" : "s"}.`;
});

uploadButton.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    const selectedFiles = Array.from(fileInput.files || []);
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
        uploadStatus.textContent = selectedFiles.length
            ? "Please choose image files to add to the gallery."
            : "";
        fileInput.value = "";
        return;
    }

    const cards = imageFiles.map((file) => {
        const card = document.createElement("article");
        card.className = "product-card";
        card.dataset.category = "other";

        const imageLink = document.createElement("a");
        imageLink.className = "product-image";
        imageLink.href = "shop.html#contact";

        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        image.alt = file.name;
        imageLink.append(image);

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = "NE-electronics";

        const name = document.createElement("h3");
        name.textContent = file.name;

        info.append(category, name);
        card.append(imageLink, info);
        return card;
    });

    arrivalGrid.append(...cards);
    const activeFilter = categoryFilters.querySelector(".arrival-category-filter.is-active");
    if (activeFilter && activeFilter.dataset.category !== "all") {
        cards.forEach((card) => { card.hidden = true; });
    }
    uploadStatus.textContent = `${imageFiles.length} image${imageFiles.length === 1 ? "" : "s"} added to this gallery preview.`;
    fileInput.value = "";
});
