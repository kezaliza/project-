const cartStorageKey = "ne-electronics-cart";
const wishlistStorageKey = "ne-electronics-wishlist";
const cartProductImageFiles = {
    1: "1%20-%20Copy.jpg",
    2: "2%20-%20Copy.jpg",
    3: "3%20-%20Copy.jpg",
    4: "4%20-%20Copy.jpg",
    5: "5%20-%20Copy.jpg"
};
const cartCategories = [
    { name: "Phone cover", numbers: [1, 2, 3, 4, 5, 21, 22, 23, 24, 25] },
    { name: "Power bank", numbers: [6, 7, 8, 9, 10] },
    { name: "Phone holder", numbers: [11, 12, 13, 14, 15] },
    { name: "Bluetooth", numbers: [16, 17, 18, 19, 20] },
    { name: "Camera lens", numbers: [26, 27, 28, 29, 30] },
    { name: "Earphones", numbers: [31, 32, 33, 34, 35] },
    { name: "USB & charger", numbers: [36, 37, 38, 39, 40] },
    { name: "Antblock", numbers: [41, 42, 43, 44, 45] },
    { name: "Smart watch", numbers: [46, 47, 48, 49, 50] }
];
let cartItems = {};
let cartStorageAvailable = true;
let wishlistItems = [];
let wishlistStorageAvailable = true;
const cartContents = document.querySelector("#cart-items");
const cartSummary = document.querySelector("#cart-summary");
const wishlistContents = document.querySelector("#wishlist-items");

const cartAnnouncement = document.createElement("p");
cartAnnouncement.className = "sr-only";
cartAnnouncement.setAttribute("role", "status");
cartAnnouncement.setAttribute("aria-live", "polite");
document.body.append(cartAnnouncement);

function announceCartMessage(message) {
    cartAnnouncement.textContent = message;
}

function readCart(value) {
    if (!value) {
        return {};
    }

    const parsedCart = JSON.parse(value);
    if (!parsedCart || typeof parsedCart !== "object" || Array.isArray(parsedCart)) {
        throw new Error("Saved cart data is not valid.");
    }

    const entries = Object.entries(parsedCart);
    if (entries.some(([productId, quantity]) => !/^\d+$/.test(productId) || Number(productId) < 1 || Number(productId) > 50 || !Number.isInteger(quantity) || quantity < 1)) {
        throw new Error("Saved cart data is not valid.");
    }

    return Object.fromEntries(entries);
}

function getCartItemCount() {
    return Object.values(cartItems).reduce((total, quantity) => total + quantity, 0);
}

function updateCartBadge() {
    const itemCount = getCartItemCount();

    document.querySelectorAll(".cart-count").forEach((badge) => {
        badge.textContent = String(itemCount);
    });

    document.querySelectorAll(".cart-link").forEach((link) => {
        link.setAttribute("aria-label", `Shopping cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`);
    });

    updateWishlistBadge();
}

function readWishlist(value) {
    if (!value) {
        return [];
    }

    const parsedWishlist = JSON.parse(value);
    if (!Array.isArray(parsedWishlist) || parsedWishlist.some((productId) => !Number.isInteger(productId) || productId < 1 || productId > 50)) {
        throw new Error("Saved wishlist data is not valid.");
    }

    return [...new Set(parsedWishlist)];
}

function updateWishlistBadge() {
    document.querySelectorAll(".wishlist-count").forEach((badge) => {
        badge.textContent = String(wishlistItems.length);
    });

    document.querySelectorAll(".wishlist-link").forEach((link) => {
        link.setAttribute("aria-label", `Wishlist, ${wishlistItems.length} saved product${wishlistItems.length === 1 ? "" : "s"}`);
    });

    document.querySelectorAll(".save-button[data-product-id]").forEach((button) => {
        const isSaved = wishlistItems.includes(Number(button.dataset.productId));
        const productName = button.closest(".product-card").querySelector("h3, h2").textContent;
        button.classList.toggle("is-saved", isSaved);
        button.setAttribute("aria-pressed", String(isSaved));
        button.setAttribute("aria-label", `${isSaved ? "Remove" : "Save"} ${productName} ${isSaved ? "from" : "to"} wishlist`);
        button.textContent = isSaved ? "♥ Saved" : "♡ Save";
    });
}

function saveWishlist() {
    if (!wishlistStorageAvailable) {
        return;
    }

    try {
        localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlistItems));
    } catch (error) {
        wishlistStorageAvailable = false;
        announceCartMessage("Your wishlist changed for this session, but could not be saved in this browser.");
    }
}

function getCartProductCategory(productId) {
    const category = cartCategories.find((item) => item.numbers.includes(productId));
    if (!category) {
        throw new RangeError(`No category is defined for product ${productId}.`);
    }

    return category.name;
}

function saveCart() {
    if (!cartStorageAvailable) {
        return;
    }

    try {
        localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
    } catch (error) {
        cartStorageAvailable = false;
        announceCartMessage("Your cart was updated for this session, but could not be saved in this browser.");
    }
}

function createCartItem(productId, quantity) {
    const category = getCartProductCategory(productId);
    const item = document.createElement("article");
    item.className = "cart-item";
    item.dataset.productId = String(productId);

    const imageLink = document.createElement("a");
    imageLink.className = "product-image cart-item-image";
    imageLink.href = "shop.html#contact";

    const image = document.createElement("img");
    image.src = `../public/${cartProductImageFiles[productId] || `${productId}.jpg`}`;
    image.alt = `${category} ${productId}`;
    imageLink.append(image);

    const details = document.createElement("div");
    details.className = "cart-item-details";

    const categoryLabel = document.createElement("p");
    categoryLabel.className = "product-category";
    categoryLabel.textContent = category;

    const name = document.createElement("h2");
    name.textContent = `${category} ${productId}`;

    const unitPrice = document.createElement("p");
    unitPrice.className = "cart-item-unit-price";
    unitPrice.textContent = `${getProductPrice(productId)} each`;

    const quantityControls = document.createElement("div");
    quantityControls.className = "cart-quantity-controls";
    quantityControls.setAttribute("aria-label", `Quantity for ${category} ${productId}`);

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.dataset.cartAction = "decrease";
    decreaseButton.setAttribute("aria-label", `Remove one ${category} ${productId}`);
    decreaseButton.textContent = "−";

    const quantityLabel = document.createElement("span");
    quantityLabel.className = "cart-item-quantity";
    quantityLabel.textContent = String(quantity);
    quantityLabel.setAttribute("aria-label", `${quantity} in cart`);

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.dataset.cartAction = "increase";
    increaseButton.setAttribute("aria-label", `Add one ${category} ${productId}`);
    increaseButton.textContent = "+";

    quantityControls.append(decreaseButton, quantityLabel, increaseButton);

    const removeButton = document.createElement("button");
    removeButton.className = "cart-remove-button";
    removeButton.type = "button";
    removeButton.dataset.cartAction = "remove";
    removeButton.textContent = "Remove";

    const subtotal = document.createElement("p");
    subtotal.className = "cart-item-subtotal";
    subtotal.textContent = `$${Number(getProductPrice(productId).slice(1)) * quantity}`;

    details.append(categoryLabel, name, unitPrice, quantityControls, removeButton);
    item.append(imageLink, details, subtotal);
    return item;
}

function renderCartPage() {
    if (!cartContents || !cartSummary) {
        return;
    }

    const entries = Object.entries(cartItems);
    if (entries.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty-message";
        emptyMessage.textContent = "Your cart is empty.";
        cartContents.replaceChildren(emptyMessage);
        cartSummary.textContent = "";
        return;
    }

    const items = entries.map(([productId, quantity]) => createCartItem(Number(productId), quantity));
    const total = entries.reduce((sum, [productId, quantity]) => {
        return sum + Number(getProductPrice(Number(productId)).slice(1)) * quantity;
    }, 0);
    const totalLabel = document.createElement("p");
    totalLabel.className = "cart-total";
    totalLabel.textContent = `Total: $${total}`;
    cartContents.replaceChildren(...items);
    cartSummary.replaceChildren(totalLabel);
}

function createWishlistItem(productId) {
    const category = getCartProductCategory(productId);
    const item = document.createElement("article");
    item.className = "product-card wishlist-item";
    item.dataset.productId = String(productId);

    const imageLink = document.createElement("a");
    imageLink.className = "product-image";
    imageLink.href = "shop.html#shop";

    const image = document.createElement("img");
    image.src = `../public/${cartProductImageFiles[productId] || `${productId}.jpg`}`;
    image.alt = `${category} ${productId}`;
    imageLink.append(image);

    const info = document.createElement("div");
    info.className = "product-info";

    const categoryLabel = document.createElement("p");
    categoryLabel.className = "product-category";
    categoryLabel.textContent = category;

    const name = document.createElement("h2");
    name.textContent = `${category} ${productId}`;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = getProductPrice(productId);

    const actions = document.createElement("div");
    actions.className = "wishlist-item-actions";

    const buyButton = document.createElement("button");
    buyButton.className = "shop-button buy-button";
    buyButton.type = "button";
    buyButton.dataset.productId = String(productId);
    buyButton.textContent = "Buy now";

    const removeButton = document.createElement("button");
    removeButton.className = "save-button is-saved";
    removeButton.type = "button";
    removeButton.dataset.productId = String(productId);
    removeButton.dataset.wishlistAction = "remove";
    removeButton.setAttribute("aria-label", `Remove ${category} ${productId} from wishlist`);
    removeButton.setAttribute("aria-pressed", "true");
    removeButton.textContent = "♥ Saved";

    actions.append(buyButton, removeButton);
    info.append(categoryLabel, name, price, actions);
    item.append(imageLink, info);
    return item;
}

function renderWishlistPage() {
    if (!wishlistContents) {
        return;
    }

    if (wishlistItems.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "wishlist-empty-message";
        emptyMessage.textContent = "Your wishlist is empty. Save products you love and find them here.";
        wishlistContents.replaceChildren(emptyMessage);
        return;
    }

    wishlistContents.replaceChildren(...wishlistItems.map(createWishlistItem));
}

try {
    cartItems = readCart(localStorage.getItem(cartStorageKey));
} catch (error) {
    cartStorageAvailable = false;
    announceCartMessage("The saved cart could not be read. Cart changes will not be saved.");
}

updateCartBadge();
renderCartPage();

try {
    wishlistItems = readWishlist(localStorage.getItem(wishlistStorageKey));
} catch (error) {
    wishlistStorageAvailable = false;
    announceCartMessage("The saved wishlist could not be read. Wishlist changes will not be saved.");
}

updateWishlistBadge();
renderWishlistPage();

document.addEventListener("click", (event) => {
    const saveButton = event.target.closest("button.save-button[data-product-id]");
    if (saveButton) {
        const productId = Number(saveButton.dataset.productId);
        if (!Number.isInteger(productId) || productId < 1 || productId > 50) {
            throw new RangeError(`Cannot save invalid product ${saveButton.dataset.productId} to the wishlist.`);
        }

        if (wishlistItems.includes(productId)) {
            wishlistItems = wishlistItems.filter((savedProductId) => savedProductId !== productId);
            announceCartMessage(`${saveButton.closest(".product-card").querySelector("h3, h2").textContent} removed from your wishlist.`);
        } else {
            wishlistItems.push(productId);
            announceCartMessage(`${saveButton.closest(".product-card").querySelector("h3, h2").textContent} saved to your wishlist.`);
        }

        saveWishlist();
        updateWishlistBadge();
        renderWishlistPage();
        return;
    }

    const buyButton = event.target.closest("button.buy-button[data-product-id]");

    if (buyButton) {
        const productId = buyButton.dataset.productId;
        const productName = buyButton.closest(".product-card").querySelector("h3").textContent;
        cartItems[productId] = (cartItems[productId] || 0) + 1;
        saveCart();
        updateCartBadge();
        renderCartPage();
        const storageMessage = cartStorageAvailable ? "" : " The cart could not be saved in this browser.";
        announceCartMessage(`${productName} added to cart. ${getCartItemCount()} item${getCartItemCount() === 1 ? "" : "s"} in cart.${storageMessage}`);
        window.location.assign("cart.html");
        return;
    }

    const cartActionButton = event.target.closest("button[data-cart-action]");
    const cartItem = cartActionButton && cartActionButton.closest(".cart-item[data-product-id]");

    if (!cartActionButton || !cartItem) {
        return;
    }

    const productId = cartItem.dataset.productId;
    const productName = cartItem.querySelector("h2").textContent;

    if (cartActionButton.dataset.cartAction === "remove" || (cartActionButton.dataset.cartAction === "decrease" && cartItems[productId] === 1)) {
        delete cartItems[productId];
        announceCartMessage(`${productName} removed from your cart.`);
    } else if (cartActionButton.dataset.cartAction === "decrease") {
        cartItems[productId] -= 1;
        announceCartMessage(`Quantity of ${productName} decreased to ${cartItems[productId]}.`);
    } else if (cartActionButton.dataset.cartAction === "increase") {
        cartItems[productId] += 1;
        announceCartMessage(`Quantity of ${productName} increased to ${cartItems[productId]}.`);
    } else {
        return;
    }

    saveCart();
    updateCartBadge();
    renderCartPage();
});

window.addEventListener("storage", (event) => {
    if (event.key === cartStorageKey) {
        try {
            cartItems = readCart(event.newValue);
            updateCartBadge();
            renderCartPage();
        } catch (error) {
            announceCartMessage("The cart was updated in another tab, but its saved data could not be read.");
        }
    } else if (event.key === wishlistStorageKey) {
        try {
            wishlistItems = readWishlist(event.newValue);
            updateWishlistBadge();
            renderWishlistPage();
        } catch (error) {
            announceCartMessage("The wishlist was updated in another tab, but its saved data could not be read.");
        }
    }
});
