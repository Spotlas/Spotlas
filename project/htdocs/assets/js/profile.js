function backHome() {
    window.location.href = '../../index.html'; // Zurück zur Startseite
}

function showLine(clickedPTag) {
    document.querySelectorAll("p").forEach(p => p.classList.remove("active"));
    clickedPTag.classList.add("active");
}