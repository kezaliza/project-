const categories = {
    "phone-cover": { name: "Phone cover", numbers: [1, 2, 3, 4, 5, 21, 22, 23, 24, 25] },
    "power-bank": { name: "Power bank", numbers: [6, 7, 8, 9, 10] },
    "phone-holder": { name: "Phone holder", numbers: [11, 12, 13, 14, 15] },
    bluetooth: { name: "Bluetooth", numbers: [16, 17, 18, 19, 20] },
    "camera-lens": { name: "Camera lens", numbers: [26, 27, 28, 29, 30] },
    earphones: { name: "Earphones", numbers: [31, 32, 33, 34, 35] },
    "usb-and-charger": { name: "USB & charger", numbers: [36, 37, 38, 39, 40] },
    antblock: { name: "Antblock", numbers: [41, 42, 43, 44, 45] },
    "smart-watch": { name: "Smart watch", numbers: [46, 47, 48, 49, 50] }
};

const firstProductImages = {
    1: "1%20-%20Copy.jpg",
    2: "2%20-%20Copy.jpg",
    3: "3%20-%20Copy.jpg",
    4: "4%20-%20Copy.jpg",
    5: "5%20-%20Copy.jpg"
};

function createCategoryProduct(category, number) {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.productId = String(number);

    const imageLink = document.createElement("a");
    imageLink.className = "product-image";
    imageLink.href = "shop.html#contact";

    const image = document.createElement("img");
    image.src = `../public/${firstProductImages[number] || `${number}.jpg`}`;
    image.alt = `${category.name} ${number}`;
    imageLink.append(image);

    const info = document.createElement("div");
    info.className = "product-info";

    const categoryName = document.createElement("p");
    categoryName.className = "product-category";
    categoryName.textContent = category.name;

    const productName = document.createElement("h3");
    productName.textContent = `${category.name} ${number}`;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = getProductPrice(number);

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const buyButton = document.createElement("button");
    buyButton.className = "shop-button buy-button";
    buyButton.type = "button";
    buyButton.dataset.productId = String(number);
    buyButton.dataset.checkoutDirect = "true";
    buyButton.textContent = "Buy now";

    const saveButton = document.createElement("button");
    saveButton.className = "save-button";
    saveButton.type = "button";
    saveButton.dataset.productId = String(number);
    saveButton.setAttribute("aria-label", `Save ${category.name} ${number} to wishlist`);
    saveButton.textContent = "♡ Save";

    actions.append(buyButton, saveButton);
    bottom.append(price, actions);
    info.append(categoryName, productName, bottom);
    card.append(imageLink, info);
    return card;
}

const selectedCategory = new URLSearchParams(window.location.search).get("category");
const category = categories[selectedCategory];
const title = document.querySelector("#category-title");
const description = document.querySelector("#category-description");
const productGrid = document.querySelector("#category-product-grid");

if (!category) {
    title.textContent = "Category not found";
    description.textContent = "Choose a category from the homepage to browse its products.";
    document.title = "Category Not Found | NE-electronics";
} else {
    title.textContent = category.name;
    description.textContent = `${category.numbers.length} products in this category.`;
    document.title = `${category.name} | NE-electronics`;
    productGrid.replaceChildren(...category.numbers.map((number) => createCategoryProduct(category, number)));
}
