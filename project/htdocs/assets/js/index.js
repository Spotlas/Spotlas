/**
 * data on sidebar with marker click interaction
 */

// config map
let config = {
  minZoom: 3,
  maxZoom: 50,
  zoomControl: false,
};
const zoom = 7;
const zoompoint = 11;
const lat = 47.6965;
const lng = 13.3458;
let points = []; // Array für die Orte

const map = L.map("map", config).setView([lat, lng], zoom);
let markersLayer = L.featureGroup().addTo(map); // Layer für Marker - MOVED HERE
const sidebar = document.getElementById("homepage_karte_sidebar");
let selectedMarker = null;

L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, USGS, NOAA',
  }
).addTo(map);

function fetchAllLocations() {
  // Clear the map state first to prevent duplicate markers
  clearMarkers();
  sidebar.innerHTML = "";
  
  fetch("./api/home.php")
    .then((response) => response.json())
    .then((data) => {
      console.log("API Antwort:", data); // Sieh dir die API-Daten an

      // Überprüfe, ob 'locations' vorhanden ist und die Struktur stimmt
      if (data.locations && Array.isArray(data.locations)) {
        // Erstelle das points Array
        points = data.locations
          .map((location) => {
            // Überprüfen, ob die notwendigen Felder vorhanden sind
            if (location.latitude && location.longitude) {
              return {
                id: location.id || 0,
                lat: location.latitude,
                lng: location.longitude,
                name: location.name,
                image: location.image,
                description: location.description,
              };
            }
            return null; // Falls kein gültiger Ort, gebe null zurück
          })
          .filter((location) => location !== null); // Entferne null-Werte

        console.log("Gefundene Orte:", points);

        // Karte mit den abgerufenen Markern füllen
        addMarkersToMap(points);
      } else {
        console.error("Keine gültigen Orte gefunden.");
      }
    })
    .catch((error) => {
      console.error("Error fetching all locations:", error);
    });
}

function openSidebarWithContent(content) {
  // Add header with close button for mobile
  const headerContent = `
    <div class="sidebar-header">
      <h3 class="sidebar-title">Location Details</h3>
      <button class="sidebar-close" onclick="toggleSidebar()">
        <i class="fa fa-times"></i>
      </button>
    </div>
  `;
  
  sidebar.innerHTML = headerContent + content;
  sidebar.classList.add("open");
  sidebar.classList.remove("hidden");
}

// Function to toggle sidebar visibility on mobile
function toggleSidebar() {
  sidebar.classList.toggle("hidden");
}

// Function to show sidebar
function showSidebar() {
  sidebar.classList.remove("hidden");
}

// Function to hide sidebar
function hideSidebar() {
  sidebar.classList.add("hidden");
}

function addMarkersToMap(points) {
  points.forEach((point) => {
    const customIcon = L.icon({
      iconUrl: "../../assets/images/icons/marker2.png", // Pfad zum eigenen Marker-Bild
      iconSize: [32, 32], // Größe des Icons
      iconAnchor: [16, 32], // Position des Icons relativ zum Standort
      popupAnchor: [0, -32], // Wo sich das Popup öffnet
    });

    const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(
      markersLayer
    );

    // Füge die id als benutzerdefiniertes Attribut hinzu
    marker.markerId = point.id;

    marker.on("click", () => {
      selectedMarker = marker;
      openSidebarWithContent(`
        <div class="location-card">
          <!-- Main image with placeholder fallback -->
          <div class="main-image-container">
            <div class="placeholder">📍</div>
          </div>

          <!-- Action buttons positioned below image -->
          <div class="action-buttons">
            <img id="img_saveButton" src="./assets/images/icons/bookmark_unsaved.svg" alt="Save" class="action-button" data-location-id="${point.id}" data-is-saved="false">
            <a href="./pages/fullscreen_startseite/fullscreen.html?id=${point.id}" class="fullscreen-link">
              <img id="img_großButton" src="./assets/images/testPic/grosmachen.png" alt="Fullscreen" class="action-button">
            </a>
          </div>

          <!-- Gallery container -->
          <div class="location-images"></div>
          
          <!-- Category and rating info -->
          <div id="spot_infos">
            <div id="spot_category"></div>
            <div id="spot_rating"></div>
          </div>
          
          <!-- Location title -->
          <h3 id="header_point">${point.name}</h3>
          
          <!-- Description -->
          <p id="beschreibung">${point.description}</p>
          
          <!-- Coordinates -->
          <div class="coordinates">
            <i class="fa fa-map-marker-alt"></i>
            <span>${point.lat}, ${point.lng}</span>
          </div>
          
          <!-- Comments button -->
          <a id="button_comments_link" href="./pages/fullscreen_startseite/fullscreen.html?id=${point.id}">
            <div id="button_comments">
              <p>show Comments</p>
            </div>
          </a>
        </div>
      `);

      fetchLocationDetails(point.id);

      // Füge das nach openSidebarWithContent(...) ein
      displayLocationImages(point.id, '#homepage_karte_sidebar .location-images');
      
      // Add click event listener to the save button
      const saveButton = document.getElementById("img_saveButton");
      if (saveButton) {
        saveButton.addEventListener("click", function() {
          // Get the location ID
          const locationId = this.getAttribute("data-location-id");
          const isSaved = this.getAttribute("data-is-saved") === "true";
          
          // Get user ID from session - this will be null if not logged in
          getCurrentUserId().then(userId => {
            if (!userId) {
              // User is not logged in, redirect to login page
              const currentUrl = encodeURIComponent(window.location.href);
              window.location.href = `./pages/login_register/login.html?redirect=${currentUrl}`;
              return;
            }
            
            // User is logged in, proceed with saving/unsaving
            console.log("User ID for saving:", userId);
            
            if (!isSaved) {
              // Save the location
              this.src = "./assets/images/icons/bookmark-fill.svg";
              this.setAttribute("data-is-saved", "true");
              favoriteLocation(locationId, userId);
            } else {
              // Unsave the location
              this.src = "./assets/images/icons/bookmark_unsaved.svg";
              this.setAttribute("data-is-saved", "false");
              removeFavoriteLocation(locationId, userId);
            }
          }).catch(error => {
            console.error("Error getting user ID:", error);
            // Redirect to login if there's an error
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `./pages/login_register/login.html?redirect=${currentUrl}`;
          });
        });
      }
    });
  });
  
  listMarkers(points);
}

function listMarkers(points) {
  // Don't return early if selectedMarker exists - we always want to rebuild the list
  // when filters are applied
  
  const headerContent = `
    <div class="sidebar-header">
      <h3 class="sidebar-title">Locations</h3>
      <button class="sidebar-close" onclick="toggleSidebar()">
        <i class="fa fa-times"></i>
      </button>
    </div>
  `;
  
  sidebar.innerHTML = headerContent + "<h3>Orte im aktuellen Kartenausschnitt:</h3><br>";
  
  // Flag to track if we found markers in the current view
  let markersFound = false;

  map.eachLayer(function (layer) {
    if (
      layer instanceof L.Marker &&
      map.getBounds().contains(layer.getLatLng())
    ) {
      markersFound = true;
      const el = document.createElement("div");
      el.className = "sidebar-el";

      // Benutze die markerId, um den Punkt zu finden
      const point = points.find((p) => p.id === layer.markerId);
      el.textContent = point ? point.name : "Unbekannter Ort"; // Sicherstellen, dass der Name gefunden wird

      el.onclick = () => {
        map.setView(layer.getLatLng(), zoompoint);
        layer.fire('click');
      };

      sidebar.appendChild(el);
    }
  });
  
  // If no markers were found in the current view, show a message
  if (!markersFound) {
    const noResultsMsg = document.createElement("div");
    noResultsMsg.className = "no-results-message";
    noResultsMsg.textContent = "Keine Orte gefunden. Zoome heraus oder ändere den Filter.";
    sidebar.appendChild(noResultsMsg);
  }
  
  // Show sidebar on mobile when content is loaded
  showSidebar();
}

map.on("moveend", () => {
  listMarkers(points);
});
map.on("popupclose", () => {
  selectedMarker = null;
  listMarkers(points);
});

// Hide sidebar initially on mobile
window.addEventListener('load', () => {
  if (window.innerWidth <= 768) {
    hideSidebar();
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove("hidden");
  } else if (!selectedMarker) {
    hideSidebar();
  }
});

// Abrufen der Locations und Marker erstellen
fetchAllLocations();

/* Methoden ***************************************************** */

function showDropdown() {
  const dropdown = document.getElementById("dropDown_menu");

  if (dropdown.style.display === "none" || dropdown.style.display === "") {
    dropdown.style.display = "block";

    // Event-Listener hinzufügen, um Dropdown zu schließen, wenn woanders geklickt wird
    document.addEventListener("click", closeDropdown);
  } else {
    dropdown.style.display = "none";
    document.removeEventListener("click", closeDropdown);
  }
}

function closeDropdown(event) {
  const dropdown = document.getElementById("dropDown_menu");
  const toggleImg = document.getElementById("toggleImg");

  // Prüfen, ob der Klick außerhalb des Dropdowns und des Icons erfolgt ist
  if (!dropdown.contains(event.target) && event.target !== toggleImg) {
    dropdown.style.display = "none";
    document.removeEventListener("click", closeDropdown);
  }
}

document
  .getElementById("homepage_filter_search")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Verhindert das Absenden eines Formulars
      let searchTerm = document.getElementById(
        "homepage_filter_search_input"
      ).value;
      if (searchTerm != " ") {
        searchLocationsByName(searchTerm);
      } else {
        alert("Bitte geben Sie einen Suchbegriff ein");
      }
    }
  });

// Sucht Locations anhand eines Namens
function searchLocationsByName(searchTerm) {
  console.log(`searchLocationsByName aufgerufen mit: ${searchTerm}`);
  fetch(`./api/home.php?search=${encodeURIComponent(searchTerm)}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Search results:", data);

      printToMap(data);
    })
    .catch((error) => console.error("Error searching locations:", error));
}

// Ruft Locations anhand der Kategorie ab
function fetchLocationsByCategory(category) {
  console.log(`fetchLocationbyCategory aufgerufen mit: ${category}`);
  
  // Clear the map state first
  clearMarkers();
  sidebar.innerHTML = '<div class="loading">Lade Daten...</div>';
  showSidebar(); // Make sure sidebar is visible during loading
  
  fetch(`./api/home.php?category=${encodeURIComponent(category)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Locations by category:", data);
      
      if (!data.locations || data.locations.length === 0) {
        sidebar.innerHTML = `
          <div class="sidebar-header">
            <h3 class="sidebar-title">Kategorie: ${category}</h3>
            <button class="sidebar-close" onclick="toggleSidebar()">
              <i class="fa fa-times"></i>
            </button>
          </div>
          <div class="no-results-message">Keine Orte in dieser Kategorie gefunden.</div>
          <button class="clear-filter-btn" onclick="clearFilter()">Filter zurücksetzen</button>
        `;
        return;
      }
      
      printToMap(data);
    })
    .catch((error) => {
      console.error("Error fetching locations by category:", error);
      sidebar.innerHTML = `
        <div class="sidebar-header">
          <h3 class="sidebar-title">Fehler</h3>
          <button class="sidebar-close" onclick="toggleSidebar()">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="error-message">Fehler beim Laden der Daten.</div>
        <button class="clear-filter-btn" onclick="clearFilter()">Filter zurücksetzen</button>
      `;
    });
}

// Kategorie-ID anhand des Namens abrufen
function getCategoryId(categoryName) {
  console.log(`getCategoryId aufgerufen mit: ${categoryName}`);
  fetch(`./api/getCategory.php?name=${encodeURIComponent(categoryName)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 200) {
        console.log(
          `Die ID der Kategorie "${categoryName}" ist: ${data.category_id}`
        );
        fetchLocationsByCategory(data.category_id);
      } else {
        console.error(`Fehler: ${data.message}`);
      }
    })
    .catch((error) =>
      console.error("Fehler beim Abrufen der Kategorie-ID:", error)
    );
}

function printToMap(data) {
  // Clear everything properly
  clearMarkers();
  // Do NOT clear sidebar here, as we'll populate it after markers are added
  
  // Update the global points array
  points = data.locations
    .map((location) => {
      if (location.latitude && location.longitude) {
        return {
          id: location.id || 0,
          lat: location.latitude,
          lng: location.longitude,
          name: location.name,
          image: location.image,
          description: location.description,
        };
      }
      return null;
    })
    .filter((location) => location !== null);

  console.log("Filtered points:", points);
  
  // Remove old markers and create a new feature group
  if (markersLayer) {
    map.removeLayer(markersLayer);
  }
  markersLayer = L.featureGroup().addTo(map);
  
  addMarkersToMap(points);
  
  // If the markers layer is empty, show a message
  if (markersLayer.getLayers().length === 0) {
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <h3 class="sidebar-title">Keine Ergebnisse</h3>
        <button class="sidebar-close" onclick="toggleSidebar()">
          <i class="fa fa-times"></i>
        </button>
      </div>
      <div class="no-results-message">Keine passenden Orte gefunden.</div>
      <button class="clear-filter-btn" onclick="clearFilter()">Filter zurücksetzen</button>
    `;
    return; // Exit early if no markers
  }
  
  // Handle map view based on number of markers
  const markerCount = markersLayer.getLayers().length;
  try {
    // For multiple markers, fit bounds 
    // REMOVED special handling for single marker to prevent auto-zoom
    if (markerCount > 1) {
      map.fitBounds(markersLayer.getBounds(), { padding: [50, 50] });
    }
  } catch (e) {
    console.warn("Error adjusting map view:", e);
    // Fallback to original coordinates if something goes wrong
    map.setView([lat, lng], zoom);
  }
}

function clearMarkers() {
  if (markersLayer) {
    markersLayer.clearLayers();
    map.removeLayer(markersLayer);
  }
  markersLayer = L.featureGroup().addTo(map);
  selectedMarker = null; // Reset selected marker
}

// Add new function to clear filter and reset the map
function clearFilter() {
  console.log("Clearing filters and reloading all locations");
  
  // Reset any filter UI elements (like search inputs)
  const searchInput = document.getElementById("homepage_filter_search_input");
  if (searchInput) {
    searchInput.value = "";
  }
  
  // Show loading indicator in sidebar
  sidebar.innerHTML = '<div class="loading">Lade alle Orte...</div>';
  showSidebar();
  
  // Reset map view to initial state
  map.setView([lat, lng], zoom);
  
  // Ensure we reset all state
  selectedMarker = null;
  
  // Clear sidebar, markers, and fetch all locations again
  clearMarkers();
  fetchAllLocations();
}

function generateStars(rating) {
  console.log("Rating:", rating); // Debugging-Ausgabe  
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

async function generateCategory(categoryId) {
  console.log("Category ID:", categoryId); // Debugging-Ausgabe
  try {
    let cName = await fetchCategoryNameById(categoryId);
    console.log("Category Name:", cName); // Debugging-Ausgabe
    document.getElementById("spot_category").innerHTML = cName;
  } catch (error) {
    console.error("Error getting category name:", error);
    document.getElementById("spot_category").innerHTML = "Unknown Category";
  }
}

// Holt detaillierte Informationen zu einer Location inkl. Kommentare und Bilder
function fetchLocationDetails(id) {
  const userId = getCurrentUserIdSync();
  fetch(`./api/location.php?action=details&id=${id}&user_id=${userId}`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log('Location details:', data);
          generateStars(data.data.average_rating);
          generateCategory(data.data.location.category_id);
          
          // Check if location is in user's favorites
          const saveButton = document.getElementById("img_saveButton");
          if (saveButton) {
              if (data.data.is_favorite) {
                  saveButton.src = "./assets/images/icons/bookmark-fill.svg";
                  saveButton.setAttribute("data-is-saved", "true");
              } else {
                  saveButton.src = "./assets/images/icons/bookmark_unsaved.svg";
                  saveButton.setAttribute("data-is-saved", "false");
              }
          }
      })
      .catch(error => {
          console.error('Error fetching location details:', error);
      });
}

// Kategorie-Name anhand der ID abrufen
function fetchCategoryNameById(categoryId) {
  return fetch(`./api/getCategory.php?id=${categoryId}`)
      .then(response => response.json())
      .then(data => {
          if (data.code === 200) {
              console.log(`Der Name der Kategorie mit ID ${categoryId} ist: ${data.name}`);
              return data.name; // Rückgabe des Kategorie-Namens
          } else {
              console.error(`Fehler: ${data.message}`);
              return "Unknown Category";
          }
      })
      .catch(error => {
          console.error('Error fetching category name:', error);
          return "Error Loading Category";
      });
}

// Markiert eine Location als Favorit
function favoriteLocation(id, userId) {
  const payload = { user_id: userId };
  console.log(`Adding favorite for location ${id} by user ${userId}`);
  
  fetch(`./api/location.php?action=favorite&id=${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Favorite response:', data);
  })
  .catch(error => {
    console.error('Error favoriting location:', error);
    // Reset UI on error
    const saveButton = document.getElementById("img_saveButton");
    if (saveButton) {
      saveButton.src = "./assets/images/icons/bookmark_unsaved.svg";
      saveButton.setAttribute("data-is-saved", "false");
    }
  });
}

// Entfernt eine Location aus den Favoriten
function removeFavoriteLocation(id, userId) {
  const payload = { user_id: userId };
  console.log(`Removing favorite for location ${id} by user ${userId}`);

  fetch(`./api/location.php?action=remove_favorite&id=${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Remove favorite response:', data);
    })
    .catch(error => {
      console.error('Error removing favorite location:', error);
      // UI zurücksetzen, falls etwas schiefgeht
      const saveButton = document.getElementById('img_saveButton');
      if (saveButton) {
        saveButton.src = './assets/images/icons/bookmark-fill.svg';
        saveButton.setAttribute('data-is-saved', 'true');
      }
    });
}


 /**
 * Zeigt alle Bilder einer Location in einem Ziel-Container an.
 * @param {number} locationId - Die ID des Ortes.
 * @param {string} selector - CSS-Selector für das Ziel-Element (z.B. '.location-images').
 */
function displayLocationImages(locationId, selector) {
    const container = document.querySelector(selector);
    const mainImageContainer = document.querySelector('.main-image-container');
    
    if (!container) {
        console.error('Ziel-Container für Bilder nicht gefunden:', selector);
        return;
    }

    container.innerHTML = '<div class="loading">Lade Bilder...</div>';

    fetch(`./api/images.php?location_id=${locationId}`)
        .then(response => response.json())
        .then(result => {
            const images = result.images;
            container.innerHTML = '';

            if (!Array.isArray(images) || images.length === 0) {
                container.innerHTML = '<div class="no-images">Keine Bilder verfügbar.</div>';
                // Keep placeholder in main container
                return;
            }

            // Replace placeholder with first image in main container
            if (mainImageContainer) {
                const mainImg = document.createElement('img');
                mainImg.src = images[0].image_url || images[0].path || images[0].url;
                mainImg.alt = images[0].alt || '';
                mainImg.className = 'main-image';
                mainImageContainer.innerHTML = '';
                mainImageContainer.appendChild(mainImg);
            }

            // Only show thumbnails if more than one image
            if (images.length > 1) {
                // Thumbnail-Leiste
                const thumbnailsDiv = document.createElement('div');
                thumbnailsDiv.className = 'thumbnails';

                images.forEach((img, idx) => {
                    const thumb = document.createElement('div');
                    thumb.className = 'thumbnail' + (idx === 0 ? ' active' : '');
                    const tImg = document.createElement('img');
                    tImg.src = img.image_url || img.path || img.url;
                    tImg.alt = img.alt || '';
                    thumb.appendChild(tImg);

                    thumb.addEventListener('click', () => {
                        if (mainImageContainer) {
                            const mainImg = mainImageContainer.querySelector('img');
                            if (mainImg) {
                                mainImg.src = tImg.src;
                            }
                        }
                        // Aktive Klasse setzen
                        thumbnailsDiv.querySelectorAll('.thumbnail').forEach(th => th.classList.remove('active'));
                        thumb.classList.add('active');
                    });

                    thumbnailsDiv.appendChild(thumb);
                });

                container.appendChild(thumbnailsDiv);
            }
        })
        .catch(err => {
            console.error('Fehler beim Laden der Bilder:', err);
            container.innerHTML = '<div class="error">Fehler beim Laden der Bilder.</div>';
        });
}
