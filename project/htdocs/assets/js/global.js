
function showDropdown() {
    const dropdown = document.getElementById("dropDown_menu");
    
    if (dropdown.style.display === "none" || dropdown.style.display === "") {
      dropdown.style.display = "block";
  
      // Event-Listener hinzufügen, um Dropdown zu schließen, wenn woanders geklickt wird
      document.addEventListener("click", closeDropdown);
    } else {
      dropdown.style.display = "none";
      document.removeEventListener("click", closeDropdown);
    }
  }
  
  function closeDropdown(event) {
    const dropdown = document.getElementById("dropDown_menu");
    const toggleImg = document.getElementById("toggleImg");
  
    // Prüfen, ob der Klick außerhalb des Dropdowns und des Icons erfolgt ist
    if (!dropdown.contains(event.target) && event.target !== toggleImg) {
      dropdown.style.display = "none";
      document.removeEventListener("click", closeDropdown);
    }
  }

  function backHome() {
    window.location.href = '../../index.html'; // Zurück zur Startseite
}