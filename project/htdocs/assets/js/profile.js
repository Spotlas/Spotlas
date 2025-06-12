// Globale Variablen
let currentUserId = null;
let currentView = 'created'; // 'created' oder 'favorites'
const baseURL = 'http://localhost//'; // Basis-URL für API-Anfragen

// Funktionen (vor der DOM-Initialisierung definieren)
function getCurrentUserId() {
  // Hier die Logik zur Ermittlung der aktuellen User-ID
  // Beispiel: Aus der URL holen oder aus dem Session Storage
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('userId') || 1; // Fallback auf 1 für Demo
}

function switchView(viewType) {
  currentView = viewType;
  updateActiveTab();
  
  if (viewType === 'created') {
    loadCreatedImages();
  } else {
    loadFavoriteImages();
  }
}

function updateActiveTab() {
  // Entferne 'active' Klasse von allen Tabs
  document.querySelectorAll('.switches').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Füge 'active' Klasse zum aktuellen Tab hinzu
  const activeTab = currentView === 'created' 
    ? document.getElementById('switches_erstellt')
    : document.getElementById('switches_favoriten');
  
  activeTab.classList.add('active');
}

async function loadCreatedImages() {
  try {
    console.log(`Loading created images for user: ${currentUserId}`);
    const url = `../../api/profile.php?userId=${currentUserId}`;
    console.log('Fetching from:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Created images response:', data);
    
    if (data.code !== 200) {
      showErrorMessage('Fehler beim Laden der Daten: ' + (data.message || 'Unbekannter Fehler'));
      return;
    }
    
    if (!data.locations || data.locations.length === 0) {
      showNoContentMessage('Du hast noch keine Bilder erstellt');
      return;
    }
    
    renderImages(data.locations, true);
  } catch (error) {
    console.error('Fehler beim Laden der erstellten Bilder:', error);
    showErrorMessage('Fehler beim Laden der Bilder');
  }
}

async function loadFavoriteImages() {
  try {
    console.log(`Loading favorite images for user: ${currentUserId}`);
    const url = `../../api/profile.php?userId=${currentUserId}&action=favorites`;
    console.log('Fetching from:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Favorites response:', data);
    
    if (data.code !== 200) {
      showErrorMessage('Fehler beim Laden der Favoriten: ' + (data.message || 'Unbekannter Fehler'));
      return;
    }
    
    if (!data.favorites || data.favorites.length === 0) {
      showNoContentMessage('Du hast noch keine Favoriten gespeichert');
      return;
    }
    
    renderImages(data.favorites, false);
  } catch (error) {
    console.error('Fehler beim Laden der Favoriten:', error);
    showErrorMessage('Fehler beim Laden der Favoriten');
  }
}

function renderImages(images, showEditLink) {
  const container = document.getElementById('bilder');
  
  if (!container) {
    console.error('Container "bilder" nicht gefunden');
    return;
  }
  
  container.innerHTML = '';
  
  console.log(`Rendering ${images.length} images, showEditLink: ${showEditLink}`);
  
  images.forEach((image, index) => {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper';
    
    // Add class for favorites to enable cursor pointer
    if (!showEditLink) {
      imageWrapper.classList.add('favorite-item');
    }
    
    const img = document.createElement('img');
    img.className = showEditLink ? 'images' : 'images_fav';
    
    // Set default image initially
    img.src = '../../assets/images/default.jpg';
    img.alt = image.title || image.name || 'Bild';
    
    img.onerror = function() {
      this.src = '../../assets/images/default.jpg';
    };
    
    imageWrapper.appendChild(img);
    
    // Load the first image for this location
    loadLocationImage(image.id, img);
    
    if (showEditLink) {
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      
      const header = document.createElement('h2');
      header.className = 'header';
      header.textContent = image.title || image.name || `Location #${image.id}`;
      
      const likes = document.createElement('p');
      likes.className = 'like';
      likes.textContent = `${image.favorite_count || 0} ❤`;
      
      const editLink = document.createElement('a');
      editLink.className = 'edit-link';
      editLink.href = `../edit_pictures/edit_pictures.html?id=${image.id}`;
      editLink.textContent = 'Bearbeiten';
      
      overlay.appendChild(header);
      overlay.appendChild(likes);
      overlay.appendChild(editLink);
      imageWrapper.appendChild(overlay);
    } else {
      const simpleOverlay = document.createElement('div');
      simpleOverlay.className = 'simple-overlay';
      
      const title = document.createElement('h3');
      title.className = 'favorite-title';
      title.textContent = image.title || image.name || `Favorit #${image.id}`;
      
      simpleOverlay.appendChild(title);
      imageWrapper.appendChild(simpleOverlay);
      
      // Make favorites clickable to view location details
      imageWrapper.addEventListener('click', () => {
        window.location.href = `../fullscreen_startseite/fullscreen.html?id=${image.id}`;
      });
    }
    
    container.appendChild(imageWrapper);
  });
  
  console.log(`Successfully rendered ${images.length} images`);
}

/**
 * Load the first image for a specific location and update the img element
 * @param {number} locationId - The location ID
 * @param {HTMLImageElement} imgElement - The img element to update
 */
function loadLocationImage(locationId, imgElement) {
  fetch(`../../api/images.php?location_id=${locationId}`)
    .then(response => response.json())
    .then(result => {
      console.log(`Images for location ${locationId}:`, result);
      
      if (result.code === 200 && result.images && result.images.length > 0) {
        // Get the first image
        const firstImage = result.images[0];
        const imagePath = firstImage.image_url;
        
        if (imagePath) {
          // Update the img src with the actual image
          imgElement.src = `../../${imagePath}`;
          console.log(`Updated image for location ${locationId}: ../../${imagePath}`);
        }
      } else {
        console.log(`No images found for location ${locationId}, keeping default image`);
      }
    })
    .catch(err => {
      console.error(`Error loading image for location ${locationId}:`, err);
      // Keep default image on error
    });
}

function showNoContentMessage(message) {
  const container = document.getElementById('bilder');
  if (container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px;">
        <div style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;">📸</div>
        <p class="no-content-message">${message}</p>
      </div>
    `;
  }
}

function showErrorMessage(message) {
  const container = document.getElementById('bilder');
  if (container) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px;">
        <div style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;">⚠️</div>
        <p class="error-message">${message}</p>
      </div>
    `;
  }
}

function backHome() {
  window.location.href = "../../index.html";
}

let currentUserCache = null;


async function getCurrentUser(forceRefresh = false) {
  if (currentUserCache && !forceRefresh) {
      return currentUserCache;
  }
  
  try {
      const response = await fetch('../../api/session.php?action=get_user');
      const data = await response.json();
      
      if (data.code === 200 && data.logged_in) {
          currentUserCache = data.user;
          currentUserId = data.user.id;
          return data.user;
      } else {
          currentUserCache = null;
          return null;
      }
  } catch (error) {
      console.error('Error fetching session data:', error);
      return null;
  }
}

// Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // User aus Session holen
    const user = await getCurrentUser();
    if (!user) {
      console.error('No user found in session');
      window.location.href = "../login_register/login.html";
      return;
    }

    // User ID setzen
    currentUserId = user.id;
    console.log('Current user ID:', currentUserId);

    document.getElementById('full_name').textContent = user.full_name;
    document.getElementById('username').textContent = user.username;
    document.getElementById('info_mini').textContent = "Beigetreten am " + user.creation_date;
    
    // Profilbild setzen
    const profilePic = document.getElementById('profilPic');
    if (user.profile_picture_url) {
      profilePic.src = '../../assets/images/' + user.profile_picture_url;
    } else {
      profilePic.src = '../../assets/images/default.jpg';
    }

    // Event Listener für die Tabs
    const erstelltTab = document.getElementById('switches_erstellt');
    const favoritenTab = document.getElementById('switches_favoriten');
    
    if (erstelltTab) {
      erstelltTab.addEventListener('click', () => {
        console.log('Switching to created view');
        switchView('created');
      });
    }

    if (favoritenTab) {
      favoritenTab.addEventListener('click', () => {
        console.log('Switching to favorites view');
        switchView('favorites');
      });
    }

    // Standardansicht laden
    switchView('created');
    
  } catch (error) {
    console.error('Error during initialization:', error);
    showErrorMessage('Fehler beim Laden des Profils');
  }
});