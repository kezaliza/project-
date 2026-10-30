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
    return "USB and charger";
}

function createProductCard(number) {
    const card = document.createElement("article");
    card.className = "product-card";
    const productCategory = getProductCategory(number);

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

    const shopLink = document.createElement("a");
    shopLink.className = "shop-button";
    shopLink.href = productHref;
    shopLink.textContent = "Shop now";

    bottom.append(shopLink);
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
        uploadStatus.textContent = `${imageFiles.length} image${imageFiles.length === 1 ? "" : "s"} added to this gallery preview.`;
        fileInput.value = "";
    });
}

function initializeHome() {
    const productGrid = document.querySelector(".product-grid");
    renderProducts(productGrid, 1, 20);

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

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

        if (label === "Shop" || label === "Shop now") {
            event.preventDefault();
            openCatalog();
        }
    });

    document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const emailInput = document.querySelector("#email");
        document.querySelector(".form-message").textContent = `Thanks for subscribing, ${emailInput.value}!`;
        event.target.reset();
    });
}

if (document.body.classList.contains("catalog-page")) {
    initializeCatalog();
} else {
    initializeHome();
}
