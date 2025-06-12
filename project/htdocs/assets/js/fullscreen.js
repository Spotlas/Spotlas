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
        // Load gallery images - call the function immediately
        displayLocationImagesFullscreen(pointId);
    }
});

function writeAComment(event) {
    event.preventDefault();
    
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get("id");
    
    // Use the synchronous version first to avoid the immediate error
    let userId = getCurrentUserIdSync();
    
    // Then try the async version and handle properly
    getCurrentUserId().then(id => {
        if (id) {
            userId = id;
            submitComment(pointId, userId);
        } else {
            alert("You must be logged in to comment.");
            window.location.href = `../../pages/login_register/login.html?redirect=${encodeURIComponent(window.location.href)}`;
        }
    }).catch(error => {
        console.error("Error getting user ID:", error);
    });
}

// Helper function to actually submit the comment
function submitComment(pointId, userId) {
    const commentText = document.querySelector('#comment_input').value;
    
    if (!commentText.trim()) {
        alert("Please enter a comment");
        return;
    }

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
    // Get user ID to check favorite status
    const userId = getCurrentUserIdSync ? getCurrentUserIdSync() : null;
    
    fetch(`../../api/location.php?action=details&id=${id}${userId ? '&user_id='+userId : ''}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Prüfen und loggen des Inhalts für Debugging
            return response.text().then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error("JSON Parse error. Raw response:", text);
                    throw new Error("Invalid JSON response");
                }
            });
        })
        .then(data => {
            console.log('Location details:', data);
            
            if (!data || !data.data || !data.data.location) {
                console.error("Invalid data structure:", data);
                return;
            }

            const location = data.data.location;
            const rating = data.data.average_rating;
            const comments = data.data.comments || [];
            
            // Update favorite status and icon
            isSaved = data.data.is_favorite || false;
            updateBookmarkIcon();

            // Füge Bewertungen hinzu
            generateStars(rating);

            // Aktualisiere die verschiedenen Felder
            if (document.querySelector('#name_spot')) document.querySelector('#name_spot').innerHTML = location.name || '';
            if (document.querySelector('#name_category')) document.querySelector('#name_category').innerHTML = location.name + ', ' + (location.category_id || 'Keine Kategorie');
            if (document.querySelector('#website_url')) document.querySelector('#website_url').innerHTML = location.website_url ? `<a href="${location.website_url}" target="_blank">${location.website_url}</a>` : 'Kein Link verfügbar';
            if (document.querySelector('#openinghours')) document.querySelector('#openinghours').innerHTML = "Openinghours: " + (location.opening_hours || 'Keine Angaben');
            if (document.querySelector('#address')) document.querySelector('#address').innerHTML = location.address || 'Keine Adresse verfügbar';
            if (document.querySelector('#description_spot')) document.querySelector('#description_spot').innerHTML = location.description || 'Keine Beschreibung verfügbar';
            if (document.querySelector('#price_range')) document.querySelector('#price_range').innerHTML = "Price Range: " + (location.price_range || 'Keine Angabe');
            if (document.querySelector('#season')) document.querySelector('#season').innerHTML = "Season: " + (location.season || 'Keine Saisonangabe');
            if (document.querySelector('#special_features')) document.querySelector('#special_features').innerHTML = location.special_features || 'Keine besonderen Merkmale';
            fetchCategoryNameById(location.category_id); // Kategorie-Name abrufen
            

            // Kommentare anzeigen mit Fehlerbehandlung
            try {
                displayComments(comments);
            } catch (e) {
                console.error("Error displaying comments:", e);
                const commentsContainer = document.getElementById('comments');
                if (commentsContainer) {
                    commentsContainer.innerHTML = '<p class="error">Fehler beim Laden der Kommentare.</p>';
                }
            }
            
            // Zeige den Erstellernamen an - KORREKTE VERSION
            const creatorName = location.creator_username || 'Unbekannter Nutzer';
            
            // Standard-IDs und Klassen probieren
            const userDataName = document.getElementById('user_data_name');
            if (userDataName) {
                userDataName.textContent = creatorName;
            }
            
            // Falls Standard-ID nicht existiert, nach bestimmten Textmustern suchen
            if (!userDataName) {
                // Suche nach allen p-Tags, die "Created by" enthalten könnten
                const allParagraphs = document.querySelectorAll('p, span, div');
                
                for (let element of allParagraphs) {
                    if (element.textContent && element.textContent.includes('Created by')) {
                        // Suche nach dem nächsten benachbarten Element oder erstelle eines, wenn keines existiert
                        let creatorElement = element.nextElementSibling;
                        
                        if (!creatorElement) {
                            // Wir fügen ein neues Element hinzu, wenn keines existiert
                            creatorElement = document.createElement('span');
                            creatorElement.className = 'creator-name';
                            element.parentNode.insertBefore(creatorElement, element.nextSibling);
                        }
                        
                        // Setze den Benutzernamen
                        creatorElement.textContent = creatorName;
                        break;
                    }
                }
            }
        })
        .catch(error => {
            console.error('Error fetching location details:', error);
            // Benutzeroberfläche über Fehler informieren
            document.getElementById('comments').innerHTML = 
                '<p class="error">Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.</p>';
        });
}

// Funktion zum Anzeigen der Kommentare mit korrekten Spaltennamen
function displayComments(comments) {
  const commentsContainer = document.getElementById('comments');
  commentsContainer.innerHTML = '';

  if (!comments || comments.length === 0) {
    commentsContainer.innerHTML = '<p class="no-comments">Noch keine Kommentare vorhanden.</p>';
    return;
  }

  comments.forEach(comment => {
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    
    // Username anzeigen - aus der korrekten DB-Spalte
    const username = comment.username || 'Unbekannter Nutzer';
    
    commentElement.innerHTML = `
      <strong>${username}</strong>
      <p>${comment.comment_text}</p>
      <small>${formatDate(comment.creation_date)}</small>
    `;
    
    commentsContainer.appendChild(commentElement);
  });
}

// Funktion zum Formatieren des Datums
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Displays location images in fullscreen view
 * @param {number} locationId - The location ID
 */
function displayLocationImagesFullscreen(locationId) {
    const container = document.querySelector('.location-images');
    const mainImageContainer = document.querySelector('#mainImg');
    
    if (!container) {
        console.error('Gallery container not found');
        return;
    }

    container.innerHTML = '<div class="loading">Loading images...</div>';

    fetch(`../../api/images.php?location_id=${locationId}`)
        .then(response => response.json())
        .then(result => {
            console.log('Images API response:', result);
            const images = result.images;
            container.innerHTML = '';

            if (!Array.isArray(images) || images.length === 0) {
                container.innerHTML = '<div class="no-images">No images available.</div>';
                return;
            }

            // Replace placeholder with first image in main container
            if (mainImageContainer) {
                const mainImg = document.createElement('img');
                // Fix image path - use absolute path from htdocs root
                const imagePath = images[0].image_url || images[0].path || images[0].url;
                mainImg.src = imagePath.startsWith('/') ? `../../${imagePath}` : `../../${imagePath}`;
                mainImg.alt = images[0].alt || images[0].description || '';
                mainImg.className = 'main-image';
                mainImageContainer.innerHTML = '';
                mainImageContainer.appendChild(mainImg);
            }

            // Only show thumbnails if more than one image
            if (images.length > 1) {
                const thumbnailsDiv = document.createElement('div');
                thumbnailsDiv.className = 'thumbnails';

                images.forEach((img, idx) => {
                    const thumb = document.createElement('div');
                    thumb.className = 'thumbnail' + (idx === 0 ? ' active' : '');
                    const tImg = document.createElement('img');
                    // Fix image path - use absolute path from htdocs root
                    const imagePath = img.image_url || img.path || img.url;
                    tImg.src = imagePath.startsWith('/') ? `../../${imagePath}` : `../../${imagePath}`;
                    tImg.alt = img.alt || img.description || '';
                    thumb.appendChild(tImg);

                    thumb.addEventListener('click', () => {
                        if (mainImageContainer) {
                            const mainImg = mainImageContainer.querySelector('img');
                            if (mainImg) {
                                mainImg.src = tImg.src;
                                mainImg.alt = tImg.alt;
                            }
                        }
                        // Update active state
                        thumbnailsDiv.querySelectorAll('.thumbnail').forEach(th => th.classList.remove('active'));
                        thumb.classList.add('active');
                    });

                    thumbnailsDiv.appendChild(thumb);
                });

                container.appendChild(thumbnailsDiv);
            }
        })
        .catch(err => {
            console.error('Error loading images:', err);
            container.innerHTML = '<div class="error">Error loading images.</div>';
        });
}

// Helper function to update bookmark icon based on isSaved state
function updateBookmarkIcon() {
    const bookmarkIcon = document.getElementById("bookmarkIcon");
    if (bookmarkIcon) {
        bookmarkIcon.src = isSaved 
            ? "../../assets/images/icons/bookmark-fill.svg" 
            : "../../assets/images/icons/bookmark_unsaved.svg";
    }
}

function rate(rating) {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get("id");
    
    // Fallback mechanism if getCurrentUserIdSync is not defined
    let userId;
    if (typeof getCurrentUserIdSync === 'function') {
        userId = getCurrentUserIdSync();
    } else {
        userId = 1; // Default fallback
        console.warn("Session management not initialized, using default user ID");
    }
    
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
                // Fallback mechanism if getCurrentUserIdSync is not defined
                let userId;
                if (typeof getCurrentUserIdSync === 'function') {
                    userId = getCurrentUserIdSync();
                } else {
                    userId = 1; // Default fallback
                    console.warn("Session management not initialized, using default user ID");
                }
                
                isSaved = !isSaved;
                updateBookmarkIcon(); // Update icon immediately for better UX
                
                const params = new URLSearchParams(window.location.search);
                const pointId = params.get("id");
    
                if (isSaved) {
                    favoriteLocation(pointId, userId);
                } else {
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

// Kategorie-Name anhand der ID abrufen
function fetchCategoryNameById(categoryId) {
    fetch(`../../api/getCategory.php?id=${encodeURIComponent(categoryId)}`)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                console.log(`Der Name der Kategorie mit ID ${categoryId} ist: ${data.name}`);
                document.querySelector('#category_spot_name').innerHTML = data.name;
                let icon = chooseIcon(categoryId);
                document.querySelector('#category_spot_icon').innerHTML = `<img src="${icon}" alt="${data.name}" width="40px" class="category-icon">`;
            } else {
                console.error(`Fehler: ${data.message}`);
            }
        })
        .catch(error => console.error('Error fetching category name:', error));
}

function chooseIcon(CategoryID) {
    let icon = "";
    switch (CategoryID) {
        case 1:
            icon = "../../assets/images/icons/filter/Restaurants.svg";
            break;
        case 2:
            icon = "../../assets/images/icons/filter/Sehenswürdigkeiten.svg";
            break;
        case 3:
            icon = "../../assets/images/icons/filter/Natur.svg";
            break;
        case 4:
            icon = "../../assets/images/icons/filter/Museen.svg";
            break;
        case 5:
            icon = "../../assets/images/icons/filter/Hotels.svg";
            break;
    }
    return icon;
    
}