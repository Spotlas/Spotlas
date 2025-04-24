// Ruft alle Locations aus der API ab
function fetchAllLocations() {
    fetch('./api/home.php')
        .then(response => response.json())
        .then(data => {
            console.log('All locations:', data.locations);
        })
        .catch(error => console.error('Error fetching all locations:', error));
}

// Fetch damit die Locations auf der Karte angezeigt werden
function fetchAllLocations() {
    fetch('./api/home.php')
        .then(response => response.json())
        .then(data => {
            console.log('All locations für Map:', data.locations);
        })
        .catch(error => console.error('Error fetching all locations:', error));
}


// Ruft eine Location anhand der ID ab
function fetchLocationById(id) {
  fetch(`./api/home.php?id=${id}`)
      .then(response => response.json())
      .then(data => {
          console.log('Location by ID:', data);
      })
      .catch(error => console.error('Error fetching location by ID:', error));
}

// Sucht Locations anhand eines Namens
function searchLocationsByName(searchTerm) {
  fetch(`./api/home.php?search=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => {
          console.log('Search results:', data);
      })
      .catch(error => console.error('Error searching locations:', error));
}

// Ruft Locations anhand der Kategorie ab
function fetchLocationsByCategory(category) {
  fetch(`./api/home.php?category=${encodeURIComponent(category)}`)
      .then(response => response.json())
      .then(data => {
          console.log('Locations by category:', data);
      })
      .catch(error => console.error('Error fetching locations by category:', error));
}

// Holt alle Kommentare zu einer bestimmten Location
function fetchCommentsForLocation(locationId) {
    fetch(`./api/location.php?action=comments&id=${locationId}`)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                console.log('Kommentare:', data.comments);
            } else {
                console.error('Fehler beim Abrufen der Kommentare:', data.message);
            }
        })
        .catch(error => console.error('Fehler beim Fetchen der Kommentare:', error));
}


// Holt das Profilbild eines Nutzers (über die userId)
function fetchProfilePicture(userId) {
  fetch(`./api/home.php?profile_picture=${userId}`)
      .then(response => response.json())
      .then(data => {
          console.log('Profile picture:', data);
      })
      .catch(error => console.error('Error fetching profile picture:', error));
}

// Fügt per POST eine neue Location hinzu
function uploadNewLocation(locationData) {
  fetch('./api/upload.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
  })
      .then(response => response.json())
      .then(data => {
          console.log('New location uploaded:', data);
      })
      .catch(error => console.error('Error uploading new location:', error));
}

// Ruft das Profil eines Nutzers sowie dessen erstellte Locations ab
function fetchUserProfile(userId) {
  fetch(`./api/profile.php?userId=${userId}`)
      .then(response => response.json())
      .then(data => {
          console.log('User profile:', data);
      })
      .catch(error => console.error('Error fetching user profile:', error));
}

// Holt detaillierte Informationen zu einer Location inkl. Kommentare und Bilder
function fetchLocationDetails(id) {
  fetch(`./api/location.php?action=details&id=${id}`)
      .then(response => response.json())
      .then(data => {
          console.log('Location details:', data);
      })
      .catch(error => console.error('Error fetching location details:', error));
}

// Fügt eine Bewertung zu einer Location hinzu
function rateLocation(id, userId, rating) {
  const payload = { user_id: userId, rating: rating };
  fetch(`./api/location.php?action=rate&id=${id}`, {
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

// Markiert eine Location als Favorit
function favoriteLocation(id, userId) {
  const payload = { user_id: userId };
  fetch(`./api/location.php?action=favorite&id=${id}`, {
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
    
    fetch(`./api/location.php?action=remove_favorite&id=${id}`, {
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

// Fügt einen neuen Kommentar für eine Location hinzu
function postComment(locationId, userId, commentText) {
    const payload = {
        user_id: userId,
        comment_text: commentText
    };

    fetch(`./api/location.php?action=comment&id=${locationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            console.log('Comment response:', data.data.message);
        } else {
            console.error('Error posting comment:', data.data?.message || data.message);
        }
    })
    .catch(error => console.error('Fetch error:', error));
}


// Erstellen eines neuen Nutzers
function createUser(fullName, username, password, profilePicture, phoneNumber, description) {
  const payload = {
      full_name: fullName,
      username: username,
      password: password,
      profile_picture: profilePicture,
      phone_number: phoneNumber,
      description: description
  };

  fetch('./api/create_user.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
      console.log('User creation response:', data);
  })
  .catch(error => console.error('Error creating user:', error));
}

// Holt alle Profilinfos eines Nutzers anhand des Benutzernamens
function fetchUserByUsername(username) {
    fetch(`./api/profile.php?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200 && data.profile) {
                console.log(`Profil von ${username}:`, data.profile);
                console.log(`Erstellte Locations:`, data.locations);
            } else {
                console.error('Fehler beim Abrufen des Profils:', data.message || 'User nicht gefunden');
            }
        })
        .catch(error => console.error('Error fetching user by username:', error));
}

// Löscht den User-Account mit der gegebenen userId
function deleteUserAccount(userId) {
    fetch(`./api/profile.php?action=delete&userId=${userId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            console.log(data.message);
            // z.B. weiterleiten: window.location = '/goodbye.html';
        } else {
            console.error('Error deleting account:', data.message);
        }
    })
    .catch(error => console.error('Fetch error:', error));
}

// Kategorie-ID anhand des Namens abrufen
function getCategoryId(categoryName) {
    fetch(`getCategoryId.php?name=${encodeURIComponent(categoryName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                console.log(`Die ID der Kategorie "${categoryName}" ist: ${data.category_id}`);
            } else {
                console.error(`Fehler: ${data.message}`);
            }
        })
        .catch(error => console.error('Fehler beim Abrufen der Kategorie-ID:', error));
}

// Kategorie-Name anhand der ID abrufen
function fetchCategoryNameById(categoryId) {
    fetch(`./api/getCategory.php?id=${categoryId}`)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                console.log(`Der Name der Kategorie mit ID ${categoryId} ist: ${data.name}`);
            } else {
                console.error(`Fehler: ${data.message}`);
            }
        })
        .catch(error => console.error('Error fetching category name:', error));
}