const moonIcon = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="20"
     height="20"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">

<path d="M12 3a6 6 0 1 0 9 9A9 9 0 1 1 12 3"/>

</svg>
`;

const sunIcon = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="20"
     height="20"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2"
     stroke-linecap="round"
     stroke-linejoin="round">

<circle cx="12" cy="12" r="5"/>

<line x1="12" y1="1" x2="12" y2="3"/>

<line x1="12" y1="21" x2="12" y2="23"/>

<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>

<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>

<line x1="1" y1="12" x2="3" y2="12"/>

<line x1="21" y1="12" x2="23" y2="12"/>

<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>

<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>

</svg>
`;

document.addEventListener("DOMContentLoaded", () => {

    const savedTheme =
        localStorage.getItem("theme") || "light";

    document.documentElement.setAttribute(
        "data-theme",
        savedTheme
    );

    document.body.insertAdjacentHTML(
        "afterbegin",
        `
        <button id="themeToggle" class="theme-button"></button>
        `
    );

    updateThemeIcon();

    document
        .getElementById("themeToggle")
        .addEventListener("click", toggleTheme);

});

function toggleTheme() {

    const current =
        document.documentElement.getAttribute("data-theme");

    const next =
        current === "dark"
            ? "light"
            : "dark";

    document.documentElement.setAttribute(
        "data-theme",
        next
    );

    localStorage.setItem(
        "theme",
        next
    );

    updateThemeIcon();

}

function updateThemeIcon() {

    const button =
        document.getElementById("themeToggle");

    const theme =
        document.documentElement.getAttribute("data-theme");

    button.innerHTML =
        theme === "dark"
            ? sunIcon
            : moonIcon;

}