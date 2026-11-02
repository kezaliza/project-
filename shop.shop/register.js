const registrationForm = document.querySelector("#register-form");
const registrationPassword = document.querySelector("#register-password");
const registrationPasswordConfirmation = document.querySelector("#register-confirm-password");
const registrationStatus = document.querySelector("#register-status");

function validatePasswordMatch() {
    registrationPasswordConfirmation.setCustomValidity(
        registrationPasswordConfirmation.value && registrationPasswordConfirmation.value !== registrationPassword.value
            ? "Passwords do not match."
            : ""
    );
}

registrationPassword.addEventListener("input", validatePasswordMatch);
registrationPasswordConfirmation.addEventListener("input", validatePasswordMatch);

registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validatePasswordMatch();

    if (!registrationForm.reportValidity()) {
        return;
    }

    registrationPassword.value = "";
    registrationPasswordConfirmation.value = "";
    registrationStatus.textContent = "Preview complete. No account was created and your information was not saved or sent. Connect a secure authentication service to enable registration.";
});
