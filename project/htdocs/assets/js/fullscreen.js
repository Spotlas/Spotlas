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
            const comments = data.data.comments;

            generateStars(rating);

            // Update location details
            //const location = data.location;
            document.querySelector('#name_spot').innerHTML = location.name;
            document.querySelector('#description_spot').innerHTML = location.description;
            document.querySelector('#name_category').innerHTML = location.name + ', ' + location.category;
            document.querySelector('#website_url').innerHTML = location.website_url;
            document.querySelector('#openinghours').innerHTML = "Openinghours: " + location.opening_hours;

            let htmlCode = "";

            for (let i = 0; i < comments.length; i++) {
                htmlCode = `<div class="comment"><strong>User ${comments[i].user_id}:</strong> ${comments[i].comment_text} </div>`
            }

            document.querySelector('#comments').innerHTML = htmlCode;

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
        const params = new URLSearchParams(window.location.search);
        const pointId = params.get("id");
        const userId = 3; // TODO: Get user ID from session

        if (isSaved) {
            this.src = "../../assets/images/icons/bookmark-fill.svg"; // Gespeichert-Bild
            favoriteLocation(pointId, userId);
        } else {
            this.src = "../../assets/images/icons/bookmark_unsaved.svg"; // Nicht gespeichert-Bild
            removeFavoriteLocation(pointId, userId);
        }
    });

    // Markiert eine Location als Favorit
    function favoriteLocation(id, userId) {
        const payload = { user_id: userId };
        fetch(`../../api/location.php?action=favorite&id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Favorite response:', data);
            })
            .catch(error => console.error('Error favoriting location:', error));
    }

// Entfernt eine Location aus den Favoriten
function removeFavoriteLocation(id, userId) {
    const payload = { user_id: userId };
    
    fetch(`../../api/location.php?action=remove_favorite&id=${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Remove favorite response:', data);
    })
    .catch(error => console.error('Error removing favorite location:', error));
}



