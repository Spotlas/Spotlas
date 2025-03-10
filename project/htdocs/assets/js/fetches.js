// Ruft eine Location anhand der ID ab
function fetchLocationById(id) {
    return fetch(`./api/home.php?id=${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Location by ID:', data);
        return data;
      })
      .catch(error => console.error('Error fetching location by ID:', error));
  }
  
  // Sucht Locations anhand eines Namens
  function searchLocationsByName(searchTerm) {
    return fetch(`./api/home.php?search=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Search results:', data);
        return data;
      })
      .catch(error => console.error('Error searching locations:', error));
  }
  
  // Ruft Locations anhand der Kategorie ab
  function fetchLocationsByCategory(category) {
    return fetch(`./api/home.php?category=${encodeURIComponent(category)}`)
      .then(response => response.json())
      .then(data => {
        console.log('Locations by category:', data);
        return data;
      })
      .catch(error => console.error('Error fetching locations by category:', error));
  }
  
  // Holt das Profilbild eines Nutzers (über die userId)
  function fetchProfilePicture(userId) {
    return fetch(`./api/home.php?profile_picture=${userId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Profile picture:', data);
        return data;
      })
      .catch(error => console.error('Error fetching profile picture:', error));
  }
  
  // Fügt per POST eine neue Location hinzu
  function uploadNewLocation(locationData) {
    return fetch('./api/upload.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(locationData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('New location uploaded:', data);
        return data;
      })
      .catch(error => console.error('Error uploading new location:', error));
  }