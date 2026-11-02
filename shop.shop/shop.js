const firstProductImages = {
    1: "1%20-%20Copy.jpg",
    2: "2%20-%20Copy.jpg",
    3: "3%20-%20Copy.jpg",
    4: "4%20-%20Copy.jpg",
    5: "5%20-%20Copy.jpg"
};

function getProductCategory(number) {
    if (number <= 5 || (number >= 21 && number <= 25)) return "Phone cover";
    if (number <= 10) return "Power bank";
    if (number <= 15) return "Phone holder";
    if (number <= 20) return "Bluetooth";
    if (number <= 30) return "Camera lens";
    if (number <= 35) return "Earphones";
    return "USB & charger";
}

function getCategoryKey(category) {
    return category.toLowerCase().replaceAll(" ", "-").replace("&", "and");
}

function createProductCard(number) {
    const card = document.createElement("article");
    card.className = "product-card";
    const productCategory = getProductCategory(number);
    card.dataset.category = getCategoryKey(productCategory);

    const productHref = document.body.classList.contains("catalog-page") ? "shop.html#contact" : "#contact";

    const imageLink = document.createElement("a");
    imageLink.className = "product-image";
    imageLink.href = productHref;

    const productImage = document.createElement("img");
    productImage.src = `../public/${firstProductImages[number] || `${number}.jpg`}`;
    productImage.alt = `${productCategory} ${number}`;
    imageLink.append(productImage);

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = productCategory;

    const name = document.createElement("h3");
    name.textContent = `${productCategory} ${number}`;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const buyButton = document.createElement("button");
    buyButton.className = "shop-button buy-button";
    buyButton.type = "button";
    buyButton.dataset.productId = String(number);
    buyButton.textContent = "Buy";

    bottom.append(buyButton);
    info.append(category, name, bottom);
    card.append(imageLink, info);

    return card;
}

function renderProducts(grid, start, end) {
    const productFragment = document.createDocumentFragment();

    for (let number = start; number <= end; number += 1) {
        productFragment.append(createProductCard(number));
    }

    grid.replaceChildren(productFragment);
}

function openCatalog() {
    window.location.assign(new URL("product.html", window.location.href).href);
}

function initializeCatalog() {
    document.title = "All Products | NE-electronics";
    const productGrid = document.querySelector(".catalog-page .product-grid");
    renderProducts(productGrid, 1, 40);

    const categoryFilters = document.querySelector(".product-categories");
    const filterStatus = document.querySelector("#product-filter-status");

    categoryFilters.addEventListener("click", (event) => {
        const selectedFilter = event.target.closest("button[data-category]");

        if (!selectedFilter) {
            return;
        }

        const selectedCategory = selectedFilter.dataset.category;
        const visibleCount = Array.from(productGrid.children).filter((card) => {
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
            ? "Showing all products."
            : `Showing ${visibleCount} ${selectedFilter.textContent} product${visibleCount === 1 ? "" : "s"}.`;
    });

    const uploadButton = document.querySelector("#product-upload-button");
    const fileInput = document.querySelector("#product-file-input");
    const uploadStatus = document.querySelector("#product-upload-status");

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

        const addedCards = imageFiles.map((file) => {
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

        productGrid.append(...addedCards);
        const activeFilter = categoryFilters.querySelector(".category-filter.is-active");
        if (activeFilter && activeFilter.dataset.category !== "all") {
            addedCards.forEach((card) => { card.hidden = true; });
        }
        uploadStatus.textContent = `${imageFiles.length} image${imageFiles.length === 1 ? "" : "s"} added to this gallery preview.`;
        fileInput.value = "";
    });
}

function initializeHome() {
    const productGrid = document.querySelector(".product-grid");
    renderProducts(productGrid, 1, 20);

    const categoryMenuToggle = document.querySelector(".category-menu-toggle");
    const categoryMenu = document.querySelector("#category-menu");
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    function setCategoryMenuOpen(isOpen) {
        categoryMenuToggle.setAttribute("aria-expanded", String(isOpen));
        categoryMenu.hidden = !isOpen;
    }

    categoryMenuToggle.addEventListener("click", () => {
        setCategoryMenuOpen(categoryMenuToggle.getAttribute("aria-expanded") !== "true");
    });

    categoryMenu.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            setCategoryMenuOpen(false);
        }
    });

    document.addEventListener("click", (event) => {
        if (!categoryMenu.hidden && !event.target.closest(".category-menu, .category-menu-toggle")) {
            setCategoryMenuOpen(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !categoryMenu.hidden) {
            setCategoryMenuOpen(false);
            categoryMenuToggle.focus();
        }
    });

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            menuToggle.setAttribute("aria-expanded", "false");
            navigation.classList.remove("is-open");
        }
    });

    document.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (!link) {
            return;
        }

        const label = link.textContent.replace("→", "").trim();

        if (label === "Shop" || label === "Shop now" || label === "Buy") {
            event.preventDefault();
            openCatalog();
        }
    });

    document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const emailInput = form.querySelector("#email");
        const subject = "Please contact me";
        const body = `Hello,\n\nPlease contact me with updates and offers.\n\nMy email address: ${emailInput.value}`;
        const mailtoUrl = `mailto:kezaliza379@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        form.querySelector(".form-message").textContent = "Opening your email app to send your message.";
        window.location.href = mailtoUrl;
    });
}

if (document.body.classList.contains("catalog-page")) {
    initializeCatalog();
} else {
    initializeHome();
}
