// Globale Variablen
let currentUserId = null;
let currentView = 'created'; // 'created' oder 'favorites'
const baseURL = 'http://localhost//'; // Basis-URL für API-Anfragen

// Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", async () => {
  // User-ID aus der URL oder Session holen
  currentUserId = getCurrentUserId();

  const user = await getCurrentUser();
  if (!user) return; // Safety check

  document.getElementById('user_name').textContent = user.username
  
  // Event Listener für die Tabs
  document.getElementById('switches_erstellt').addEventListener('click', () => switchView('created'));
  document.getElementById('switches_favoriten').addEventListener('click', () => switchView('favorites'));
  
  // Standardansicht laden
  switchView('created');
});

// Funktionen
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
  document.querySelectorAll('.switch p').forEach(tab => {
    tab.classList.remove('active');
  });
  
  const activeTab = currentView === 'created' 
    ? document.getElementById('switches_erstellt')
    : document.getElementById('switches_favoriten');
  
  activeTab.classList.add('active');
}

async function loadCreatedImages() {
  try {
    const response = await fetch(`/api/profile.php?userId=${currentUserId}`);
    const data = await response.json();
    
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
    const response = await fetch(`./api/profile.php?userId=${currentUserId}&action=favorites`);
    const data = await response.json();
    
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
  container.innerHTML = '';
  
  images.forEach(image => {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper';
    
    const img = document.createElement('img');
    img.className = showEditLink ? 'images' : 'images_fav';
    img.src = image.image_url || '../../assets/images/default.jpg';
    img.alt = image.title || 'Bild';
    
    imageWrapper.appendChild(img);
    
    if (showEditLink) {
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      
      const header = document.createElement('h2');
      header.className = 'header';
      header.textContent = image.title || 'Unbekannt';
      
      const likes = document.createElement('p');
      likes.className = 'like';
      likes.textContent = `${image.likes || 0} ❤`;
      
      const editLink = document.createElement('a');
      editLink.className = 'edit-link';
      editLink.href = `../edit_pictures/edit_pictures.html?id=${image.id}`;
      editLink.textContent = 'Bearbeiten';
      
      overlay.appendChild(header);
      overlay.appendChild(likes);
      overlay.appendChild(editLink);
      imageWrapper.appendChild(overlay);
    }
    
    container.appendChild(imageWrapper);
  });
}

function showNoContentMessage(message) {
  const container = document.getElementById('bilder');
  container.innerHTML = `<p class="no-content-message">${message}</p>`;
}

function showErrorMessage(message) {
  const container = document.getElementById('bilder');
  container.innerHTML = `<p class="error-message">${message}</p>`;
}

function backHome() {
  window.location.href = "../../index.html";
}

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