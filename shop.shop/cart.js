const cartStorageKey = "ne-electronics-cart";
let cartItems = {};
let cartStorageAvailable = true;

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
    if (entries.some(([productId, quantity]) => !/^\d+$/.test(productId) || !Number.isInteger(quantity) || quantity < 1)) {
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
}

try {
    cartItems = readCart(localStorage.getItem(cartStorageKey));
} catch (error) {
    cartStorageAvailable = false;
    announceCartMessage("The saved cart could not be read. Cart changes will not be saved.");
}

updateCartBadge();

document.addEventListener("click", (event) => {
    const buyButton = event.target.closest("button.buy-button[data-product-id]");

    if (!buyButton) {
        return;
    }

    const productId = buyButton.dataset.productId;
    const productName = buyButton.closest(".product-card").querySelector("h3").textContent;
    cartItems[productId] = (cartItems[productId] || 0) + 1;

    if (cartStorageAvailable) {
        try {
            localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
        } catch (error) {
            cartStorageAvailable = false;
            announceCartMessage("This item was added, but the cart could not be saved in this browser.");
        }
    }

    updateCartBadge();

    if (cartStorageAvailable) {
        announceCartMessage(`${productName} added to cart. ${getCartItemCount()} item${getCartItemCount() === 1 ? "" : "s"} in cart.`);
    } else {
        announceCartMessage(`${productName} added to cart for this session, but the cart could not be saved.`);
    }
});

window.addEventListener("storage", (event) => {
    if (event.key !== cartStorageKey) {
        return;
    }

    try {
        cartItems = readCart(event.newValue);
        updateCartBadge();
    } catch (error) {
        announceCartMessage("The cart was updated in another tab, but its saved data could not be read.");
    }
});
