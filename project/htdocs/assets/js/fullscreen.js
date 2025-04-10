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

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('comment_form').addEventListener('submit', writeAComment);
});

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get("id");
    if (pointId) {
      console.log("Geladene ID:", pointId);
        fetchLocationDetails(pointId);
    }
  });

  function writeAComment(event) {
    event.preventDefault();
    
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get("id");
    const userId = 3 // TODO: Get user ID from session
    const commentText = document.querySelector('#comment_input').value;

    const payload = { user_id: userId, comment_text: commentText };

    fetch(`../../api/add_comment.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId,
            comment_text: commentText,
            location_id: pointId
        })
    })    
        .then(response => response.json())
        .then(data => {
            console.log('Comment response:', data);
            if (data.code === 201) {
                document.querySelector('#comment_input').value = ""; // Clear the input field
                fetchLocationDetails(pointId); // Refresh comments
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => console.error('Error writing comment:', error));
  }

// Holt detaillierte Informationen zu einer Location inkl. Kommentare und Bilder
function fetchLocationDetails(id) {
    fetch(`../../api/location.php?action=details&id=${id}`)
        .then(response => response.json())
        .then(data => {
            console.log('Location details:', data);

            const location = data.data.location;
            const rating = data.data.average_rating;
            const comments = data.data.comments;

            // Füge Bewertungen hinzu
            generateStars(rating);

            // Aktualisiere die verschiedenen Felder
            document.querySelector('#name_spot').innerHTML = location.name;
            document.querySelector('#name_category').innerHTML = location.name + ', ' + (location.category_id || 'Keine Kategorie');
            document.querySelector('#website_url').innerHTML = location.website_url ? `<a href="${location.website_url}" target="_blank">${location.website_url}</a>` : 'Kein Link verfügbar';
            document.querySelector('#openinghours').innerHTML = "Openinghours: " + (location.opening_hours || 'Keine Angaben');
            document.querySelector('#address').innerHTML = location.address || 'Keine Adresse verfügbar';
            document.querySelector('#description_spot').innerHTML = location.description || 'Keine Beschreibung verfügbar';
            document.querySelector('#price_range').innerHTML = "Price Range: " + (location.price_range || 'Keine Angabe');
            document.querySelector('#season').innerHTML = "Season: " + (location.season || 'Keine Saisonangabe');
            document.querySelector('#special_features').innerHTML = location.special_features || 'Keine besonderen Merkmale';
            document.querySelector('#category_spot_name').innerHTML = location.category_id
            

            // Kommentare anzeigen
            let htmlCode = "";
            for (let i = 0; i < comments.length; i++) {
                htmlCode += `<div class="comment"><strong><a href="../profile/profile.html?userId=${comments[i].user_id}" >${comments[i].user_id}</a>:</strong> ${comments[i].comment_text}</div>`;
            }
            document.querySelector('#comments').innerHTML = htmlCode;
        })
        .catch(error => console.error('Error fetching location details:', error));
}

/* document.addEventListener('DOMContentLoaded', () => {
    fetchLocationDetails(2);
}); */

function rate(rating) {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get("id");
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


    document.addEventListener("DOMContentLoaded", () => {
        const bookmarkIcon = document.getElementById("bookmarkIcon");
        if (bookmarkIcon) {
            bookmarkIcon.addEventListener("click", function () {
                isSaved = !isSaved;
                const params = new URLSearchParams(window.location.search);
                const pointId = params.get("id");
                const userId = 3;
    
                if (isSaved) {
                    this.src = "../../assets/images/icons/bookmark-fill.svg";
                    favoriteLocation(pointId, userId);
                } else {
                    this.src = "../../assets/images/icons/bookmark_unsaved.svg";
                    removeFavoriteLocation(pointId, userId);
                }
            });
        } else {
            console.warn("Bookmark Icon nicht gefunden.");
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

