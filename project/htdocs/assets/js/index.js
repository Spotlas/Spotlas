/**
 * data on sidebar with marker click interaction
 */

// config map
let config = {
  minZoom: 3,
  maxZoom: 50,
  zoomControl: false
};
const zoom = 7;
const zoompoint = 10;
const lat = 47.6965;
const lng = 13.3458;
let points = []; // Array für die Orte

function fetchAllLocations() {
  fetch('./api/home.php')
    .then(response => response.json())
    .then(data => {
      console.log('API Antwort:', data); // Sieh dir die API-Daten an

      // Überprüfe, ob 'locations' vorhanden ist und die Struktur stimmt
      if (data.locations && Array.isArray(data.locations)) {
        // Erstelle das points Array
        points = data.locations.map(location => {
          // Überprüfen, ob die notwendigen Felder vorhanden sind
          if (location.latitude && location.longitude) {
            return {
              id: location.id || 0,
              lat: location.latitude,
              lng: location.longitude,
              name: location.name ,
              image: location.image ,
              description: location.description ,
            };
          }
          return null; // Falls kein gültiger Ort, gebe null zurück
        }).filter(location => location !== null); // Entferne null-Werte

        console.log('Gefundene Orte:', points);

        // Karte mit den abgerufenen Markern füllen
        addMarkersToMap(points);
      } else {
        console.error('Keine gültigen Orte gefunden.');
      }
    })
    .catch(error => {
      console.error('Error fetching all locations:', error);
    });
}

const map = L.map("map", config).setView([lat, lng],zoom);

L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, USGS, NOAA',
  }
).addTo(map);

const sidebar = document.getElementById("homepage_karte_sidebar");
let selectedMarker = null;

function openSidebarWithContent(content) {
  sidebar.innerHTML = content;
  sidebar.classList.add("open");
}
function addMarkersToMap(points) {
  const fg = L.featureGroup().addTo(map);

  points.forEach((point) => {
    const customIcon = L.icon({
      iconUrl: '../../assets/images/icons/marker2.png', // Pfad zum eigenen Marker-Bild
      iconSize: [32, 32], // Größe des Icons
      iconAnchor: [16, 32], // Position des Icons relativ zum Standort
      popupAnchor: [0, -32] // Wo sich das Popup öffnet
    });
    
    const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(fg);
    
    
    // Füge die id als benutzerdefiniertes Attribut hinzu
    marker.markerId = point.id;

    marker.on("click", () => {
      selectedMarker = marker;
      openSidebarWithContent(`
        <img id="img_saveButton" src="./assets/images/testPic/save.png" alt="${point.name}" style="width:8%; max-height:150px; object-fit:cover; padding-bottom: 2%;">
        <a href="./pages/fullscreen_startseite/fullscreen.html?id=${point.id}"><img id="img_großButton" src="./assets/images/testPic/grosmachen.png" alt="${point.name}" style="width:8%; max-height:150px; object-fit:cover; padding-left: 80%; padding-bottom: 2%;"></a>
        <img id="img_big" src="${point.image}" alt="${point.name}" style="width:100%; max-height:150px; object-fit:cover;">
        
        <img id="img_point" src="${point.image}" alt="${point.name}" style="width:10%; max-height:150px; object-fit:cover;">
        <img id="img_point" src="${point.image}" alt="${point.name}" style="width:10%; max-height:150px; object-fit:cover;">
        <img id="img_point" src="${point.image}" alt="${point.name}" style="width:10%; max-height:150px; object-fit:cover;">
        
        <img src="./assets/images/testPic/bewertung.png" alt="${point.name}" style="width:40%; max-height:150px; object-fit:cover; padding-left: 25.4%;">
        <div id="parent_grid" >
        <h3 id="header_point">${point.name}</h3>
        <img src="./assets/images/testPic/sorte.png" alt="${point.name}" style="width:50%; max-height:150px; object-fit:cover; padding-left: 50.4%;">
        </div>
        <p id="beschreibung">${point.description}</p>
        <p><strong>|</strong> ${point.lat}, ${point.lng} </p>
        <br>
      
        <a id="button_comments_link" href="./pages/fullscreen_startseite/fullscreen.html?id=${point.id}"><div id="button_comments"><p>show Comments</p></div></a>
      `);
    });
  });

  listMarkers(points);
}


function listMarkers(points) {
  if (selectedMarker) return; // Zeige nur die Namen, wenn kein Marker aktiv ist
  sidebar.innerHTML = "<h3>Orte im aktuellen Kartenausschnitt:</h3><br>";
  
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker && map.getBounds().contains(layer.getLatLng())) {
      const el = document.createElement("div");
      el.className = "sidebar-el";

      // Benutze die markerId, um den Punkt zu finden
      const point = points.find(p => p.id === layer.markerId);
      el.textContent = point ? point.name : "Unbekannter Ort"; // Sicherstellen, dass der Name gefunden wird

      el.onclick = () => {
        map.setView(layer.getLatLng(), zoompoint);
        layer.openPopup();
      };

      sidebar.appendChild(el);
    }
  });
}



map.on("moveend", () => {
  listMarkers(points);
});
map.on("popupclose", () => {
  selectedMarker = null;
  listMarkers(points);
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
