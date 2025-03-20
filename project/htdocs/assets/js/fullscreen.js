document.querySelectorAll('.rating input').forEach((radio) => {
    radio.addEventListener('change', (e) => {
        document.querySelectorAll('.rating input').forEach((radio) => {
            radio.parentNode.classList.remove('checked');
        });
        e.target.parentNode.classList.add('checked');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get("id");
    if (pointId) {
      console.log("Geladene ID:", pointId);
        fetchLocationDetails(pointId);
    }
  });

// Holt detaillierte Informationen zu einer Location inkl. Kommentare und Bilder
function fetchLocationDetails(id) {
    fetch(`../../api/location.php?action=details&id=${id}`)
        .then(response => response.json())
        .then(data => {
            console.log('Location details:', data);

            const location = data.data.location;
            const rating = data.data.average_rating;

            // Update location details
            //const location = data.location;
            document.querySelector('#name_spot').innerHTML = location.name;
            document.querySelectorAll('.rating input').forEach(input => {
                if (parseInt(input.value) === rating) {
                    input.checked = true;
                }
            });
            document.querySelector('#description_spot').innerHTML = location.description;
            document.querySelector('#name_category').innerHTML = location.name + ', ' + location.category;
            document.querySelector('#website_url').innerHTML = location.website_url;
            document.querySelector('#openinghours').innerHTML = "Openinghours: " + location.opening_hours;
            

        })
        .catch(error => console.error('Error fetching location details:', error));
  }

/* document.addEventListener('DOMContentLoaded', () => {
    fetchLocationDetails(2);
}); */