const formInputs = document.querySelectorAll(".floating-library-form .form-container .form-input");

const libraryIcon = document.querySelector(".floating-library-form .library-icon");

const formContainer = document.querySelector(".floating-library-form .form-container");

libraryIcon.addEventListener("click", () => {
    formContainer.classList.toggle("active");
});

formInputs.forEach(i => {
    i.addEventListener("focus", () => {
        i.previousElementSibling.classList.add("active");
    });
});

formInputs.forEach(i => {
    i.addEventListener("blur", () => {
        if (i.value == "") {
            i.previousElementSibling.classList.remove("active");
        }
    });
});