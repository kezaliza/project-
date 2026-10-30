const uploadButton = document.querySelector("#arrival-upload-button");
const fileInput = document.querySelector("#arrival-file-input");
const arrivalGrid = document.querySelector("#arrival-grid");
const uploadStatus = document.querySelector("#arrival-upload-status");

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
    uploadStatus.textContent = `${imageFiles.length} image${imageFiles.length === 1 ? "" : "s"} added to this gallery preview.`;
    fileInput.value = "";
});
