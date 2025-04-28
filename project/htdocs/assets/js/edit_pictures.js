// Back to profile function
function backToProfile() {
    window.location.href = '../profile/profile.html'; // Zurück zur Profilseite
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Hier können Sie später Bearbeitungsfunktionen hinzufügen
    console.log('Edit pictures page loaded');
    
    // Beispiel: Formular-Daten speichern
    const formInputs = document.querySelectorAll('.edit-form input, .edit-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            console.log(`${e.target.id} updated to: ${e.target.value}`);
            // Hier könnten Sie die Änderungen speichern
        });
    });
});