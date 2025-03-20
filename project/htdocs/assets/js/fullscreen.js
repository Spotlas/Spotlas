document.querySelectorAll('.rating input').forEach((radio) => {
    radio.addEventListener('change', (e) => {
        document.querySelectorAll('.rating input').forEach((radio) => {
            radio.parentNode.classList.remove('checked');
        });
        e.target.parentNode.classList.add('checked');
    });
});

// Holt detaillierte Informationen zu einer Location inkl. Kommentare und Bilder
function fetchLocationDetails(id) {
    fetch(`../../api/location.php?action=details&id=${id}`)
        .then(response => response.text())
        .then(data => {
            console.log('Location details:', data);

            // Update location details
            //const location = data.location;
            document.querySelector('#name_spot').innerHTML = data.location.name;

        })
        .catch(error => console.error('Error fetching location details:', error));
  }

document.addEventListener('DOMContentLoaded', () => {
    fetchLocationDetails(2);
});