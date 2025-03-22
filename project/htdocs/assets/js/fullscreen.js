document.querySelectorAll('.rating input').forEach((radio) => {
    radio.addEventListener('change', (e) => {
        document.querySelectorAll('.rating input').forEach((radio) => {
            radio.parentNode.classList.remove('checked');
        });
        e.target.parentNode.classList.add('checked');
    });
});

document.querySelectorAll('.ratings input').forEach((radio) => {
    radio.addEventListener('change', (e) => {
        document.querySelectorAll('.ratings input').forEach((radio) => {
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

            generateStars(rating);

            // Update location details
            //const location = data.location;
            document.querySelector('#name_spot').innerHTML = location.name;
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

function rate(rating) {
    const pointId = 1;
    const userId = 3 // TODO: Get user ID from session
    rateLocation(pointId, userId, rating);  
    
    // Update rating display
    fetchLocationDetails(pointId);
}

function rateLocation(id, userId, rating) {
    const payload = { user_id: userId, rating: rating };
    fetch(`../../api/location.php?action=rate&id=${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Rating response:', data);
        })
        .catch(error => console.error('Error rating location:', error));
  }

  function generateStars(rating) {
    let fullStars = Math.floor(rating); // Ganze Sterne
    let halfStar = rating % 1 >= 0.5 ? 1 : 0; // Halber Stern falls >= 0.5
    let emptyStars = 5 - fullStars - halfStar; // Leere Sterne berechnen
    
    let starHTML = "";

    for (let i = 0; i < fullStars; i++) {
        starHTML += '<i class="fa fa-star"></i>';
    }
    if (halfStar) {
        starHTML += '<i class="fa fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starHTML += '<i class="fa fa-star" style="color: lightgray;"></i>';
    }

    document.getElementById("spot_rating").innerHTML = starHTML;
}

    let isSaved = false;
    const bookmarkIcon = document.getElementById("bookmarkIcon");

    bookmarkIcon.addEventListener("click", function () {
        isSaved = !isSaved; // Umschalten des Zustands

        if (isSaved) {
            this.src = "../../assets/images/icons/bookmark-fill.svg"; // Gespeichert-Bild
        } else {
            this.src = "../../assets/images/icons/bookmark_unsaved.svg"; // Nicht gespeichert-Bild
        }
    });
