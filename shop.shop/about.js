const aboutThemeKey = "ne-electronics-about-theme";
const themeToggle = document.getElementById("theme-toggle");
const aboutPage = document.body;

function setAboutTheme(isDark) {
    aboutPage.classList.toggle("is-dark", isDark);
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.querySelector("span").textContent = isDark ? "Light mode" : "Dark mode";
    document.querySelector('meta[name="theme-color"]').content = isDark ? "#6B7556" : "#FBEAD6";
}

try {
    setAboutTheme(localStorage.getItem(aboutThemeKey) === "dark");
} catch (error) {
    setAboutTheme(false);
    console.error("Could not load the saved About page theme.", error);
}

themeToggle.addEventListener("click", () => {
    const isDark = !aboutPage.classList.contains("is-dark");
    setAboutTheme(isDark);
    try {
        localStorage.setItem(aboutThemeKey, isDark ? "dark" : "light");
    } catch (error) {
        console.error("Could not save the About page theme.", error);
    }
});

const ideaForm = document.getElementById("idea-form");
const ideaInput = document.getElementById("customer-idea");
const ideaCount = document.getElementById("idea-count");
const ideaStatus = document.getElementById("idea-status");
const orderWhatsAppButton = document.getElementById("order-whatsapp");
const orderWhatsAppStatus = document.getElementById("order-whatsapp-status");
const whatsAppBaseUrl = document.querySelector("main").dataset.whatsappUrl;

function openWhatsAppMessage(message, statusElement) {
    try {
        const whatsappUrl = new URL(whatsAppBaseUrl);
        whatsappUrl.searchParams.set("text", message);
        const whatsappWindow = window.open(whatsappUrl.href, "_blank");
        if (!whatsappWindow) {
            statusElement.textContent = "WhatsApp could not be opened. Please allow pop-ups and try again.";
            return;
        }
        whatsappWindow.opener = null;
        statusElement.textContent = "WhatsApp opened. Choose a chat to send your message.";
    } catch (error) {
        statusElement.textContent = "The WhatsApp link is not valid. Please check the link in about.html.";
        console.error("Could not open the WhatsApp link.", error);
    }
}

ideaInput.addEventListener("input", () => {
    ideaCount.textContent = `${ideaInput.value.length} / 1200`;
    ideaStatus.textContent = "";
});

orderWhatsAppButton.addEventListener("click", () => {
    openWhatsAppMessage("Hello NE-electronics! I would like to ask about placing an order.", orderWhatsAppStatus);
});

ideaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const idea = ideaInput.value.trim();
    if (!idea) {
        ideaStatus.textContent = "Please enter your idea before sharing.";
        ideaInput.focus();
        return;
    }

    const message = `Hello NE-electronics! I have an idea to share:\n\n${idea}`;
    openWhatsAppMessage(message, ideaStatus);
});
