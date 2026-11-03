const productDescriptions = {
    "Phone cover": "A protective phone cover that adds a comfortable grip and helps guard your device from everyday scratches and bumps. Check that the design fits your phone model.",
    "Power bank": "A portable power bank for topping up your phone when you are away from a wall outlet. Its compact design makes it handy for travel, work, and busy days.",
    "Phone holder": "A foldable phone stand that keeps your device upright for hands-free video calls, watching videos, or following directions at your desk.",
    Bluetooth: "A wireless Bluetooth audio accessory for listening to music and other audio without being tied to your device by a cable. Check compatibility with your phone.",
    "Camera lens": "A decorative camera-lens protector that adds a polished look around your phone's camera and helps protect the lens area from everyday scratches. Check your phone model for fit.",
    Earphones: "A compact audio accessory for listening to music, podcasts, and calls on the go. Check the connector and device compatibility before ordering.",
    "USB & charger": "A multi-connector charging cable for connecting compatible devices to a USB power source. Check that the connector matches your phone or accessory.",
    Antblock: "A screen protector designed to help shield your phone display from everyday scratches. Check your device model before ordering to ensure the screen protector fits.",
    "Smart watch": "A smart watch with a clear digital display and an adjustable wrist band, made to keep everyday time and activity information close at hand."
};

const productDescriptionDialog = document.createElement("dialog");
productDescriptionDialog.className = "product-description-dialog";
productDescriptionDialog.setAttribute("aria-labelledby", "product-description-title");
productDescriptionDialog.innerHTML = `
    <button class="product-description-close" type="button" aria-label="Close product description">&times;</button>
    <img class="product-description-image" alt="">
    <div class="product-description-copy">
        <p class="product-description-category"></p>
        <h2 id="product-description-title"></h2>
        <p class="product-description-price"></p>
        <p class="product-description-text"></p>
    </div>
`;
document.body.append(productDescriptionDialog);

const descriptionImage = productDescriptionDialog.querySelector(".product-description-image");
const descriptionCategory = productDescriptionDialog.querySelector(".product-description-category");
const descriptionTitle = productDescriptionDialog.querySelector("#product-description-title");
const descriptionPrice = productDescriptionDialog.querySelector(".product-description-price");
const descriptionText = productDescriptionDialog.querySelector(".product-description-text");
const descriptionCloseButton = productDescriptionDialog.querySelector(".product-description-close");
let descriptionTrigger;

document.addEventListener("click", (event) => {
    const imageLink = event.target.closest("a.product-image");
    const productCard = imageLink && imageLink.closest(".product-card");
    const productId = Number(productCard && productCard.dataset.productId);

    if (!imageLink || !Number.isInteger(productId) || productId < 1 || productId > 50) {
        return;
    }

    const category = productCard.querySelector(".product-category").textContent;
    const image = imageLink.querySelector("img");
    const name = productCard.querySelector("h3, h2").textContent;

    if (!productDescriptions[category]) {
        throw new Error(`No product description is defined for category "${category}".`);
    }

    event.preventDefault();
    descriptionTrigger = imageLink;
    descriptionImage.src = image.src;
    descriptionImage.alt = image.alt;
    descriptionCategory.textContent = category;
    descriptionTitle.textContent = name;
    descriptionPrice.textContent = getProductPrice(productId);
    descriptionText.textContent = productDescriptions[category];
    productDescriptionDialog.showModal();
    descriptionCloseButton.focus();
});

descriptionCloseButton.addEventListener("click", () => {
    productDescriptionDialog.close();
});

productDescriptionDialog.addEventListener("click", (event) => {
    if (event.target === productDescriptionDialog) {
        productDescriptionDialog.close();
    }
});

productDescriptionDialog.addEventListener("close", () => {
    if (descriptionTrigger && descriptionTrigger.isConnected) {
        descriptionTrigger.focus();
    }
});
