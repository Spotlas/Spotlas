document.addEventListener("DOMContentLoaded", () => {
    // Akkordeon-Funktionalität
    document.querySelectorAll(".accordion-title").forEach(item => {
        item.addEventListener("click", () => {
            const parent = item.parentElement;
            parent.classList.toggle("active");
        });
    });

    // Neue Frage hinzufügen
    const questionInput = document.querySelector(".ask-question input");
    const questionButton = document.querySelector(".ask-question button");
    const accordion = document.querySelector(".accordion");

    questionButton.addEventListener("click", () => {
        const questionText = questionInput.value.trim();
        if (questionText !== "") {
            const newQuestion = document.createElement("div");
            newQuestion.classList.add("accordion-item");
            newQuestion.innerHTML = `
                <div class="accordion-title">${questionText} <span>+</span></div>
                <div class="accordion-content">Antwort folgt...</div>
            `;
            accordion.appendChild(newQuestion);

            // Eventlistener für neue Fragen aktivieren
            newQuestion.querySelector(".accordion-title").addEventListener("click", () => {
                newQuestion.classList.toggle("active");
            });

            questionInput.value = "";
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.sidebar a').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});
