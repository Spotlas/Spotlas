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
