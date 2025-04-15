/**
 * Daten auf Sidebar mit Marker-Interaktion
 */

// 🗺️ Map-Konfiguration
let config = {
  minZoom: 3,
  maxZoom: 50,
  zoomControl: false,
};
const zoom = 7;
const zoompoint = 11;
const lat = 47.6965;
const lng = 13.3458;
let points = [];
/*points = [
    {
      id: 1,
      lat: 47.8095,
      lng: 13.0550,
      name: "Salzburg Altstadt",
      image: "./assets/images/testPic/1.png",
      description: "Die historische Altstadt von Salzburg mit der Festung Hohensalzburg.",
    },
    {
      id: 2,
      lat: 47.4979,
      lng: 19.0402,
      name: "Budapest Zentrum",
      image: "./assets/images/testPic/2.png",
      description: "Das Herz von Budapest mit der Kettenbrücke und dem Parlament.",
    },
    {
      id: 3,
      lat: 48.2082,
      lng: 16.3738,
      name: "Wien Innenstadt",
      image: "./assets/images/testPic/3.png",
      description: "Kulturelles Zentrum Wiens mit Stephansdom und Museumsquartier.",
    }
  ];*/

const map = L.map("map", config).setView([lat, lng], zoom);
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, USGS, NOAA',
  }
).addTo(map);

const sidebar = document.getElementById("homepage_karte_sidebar");
let selectedMarker = null;
let markersLayer = L.featureGroup().addTo(map); // Globaler Marker-Layer

// 🎯 Marker hinzufügen
function addMarkersToMap(points) {
  markersLayer.clearLayers();

  points.forEach((point) => {
    const customIcon = L.icon({
      iconUrl: "../../assets/images/icons/marker2.png",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(
      markersLayer
    );
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
          <div id="parent_grid">
            <h3 id="header_point">${point.name}</h3>
            <img src="./assets/images/testPic/sorte.png" alt="${point.name}" style="width:50%; max-height:150px; object-fit:cover; padding-left: 50.4%;">
          </div>
          <p id="beschreibung">${point.description}</p>
          <p><strong>|</strong> ${point.lat}, ${point.lng}</p><br>
          <a id="button_comments_link" href="./pages/fullscreen_startseite/fullscreen.html?id=${point.id}"><div id="button_comments"><p>show Comments</p></div></a>
        `);
    });
  });

  listMarkers(points);
}

// 🧹 Alte Marker löschen
function clearMarkers() {
  markersLayer.clearLayers();
}

// 📋 Marker im sichtbaren Bereich auflisten
function listMarkers(points) {
  if (selectedMarker) return;

  sidebar.innerHTML = "<h3>Orte im aktuellen Kartenausschnitt:</h3><br>";

  map.eachLayer((layer) => {
    if (
      layer instanceof L.Marker &&
      map.getBounds().contains(layer.getLatLng())
    ) {
      const el = document.createElement("div");
      el.className = "sidebar-el";
      const point = points.find((p) => p.id === layer.markerId);
      el.textContent = point ? point.name : "Unbekannter Ort";

      el.onclick = () => {
        map.setView(layer.getLatLng(), zoompoint);
      };

      sidebar.appendChild(el);
    }
  });
}

// 📦 Alle Locations laden
function fetchAllLocations() {
  fetch("./api/home.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.locations && Array.isArray(data.locations)) {
        points = data.locations
          .map((loc) => ({
            id: loc.id || 0,
            lat: loc.latitude,
            lng: loc.longitude,
            name: loc.name,
            image: loc.image,
            description: loc.description,
          }))
          .filter((p) => p.lat && p.lng);

        addMarkersToMap(points);
      } else {
        console.error("Keine gültigen Orte gefunden.");
      }
    })
    .catch((error) => console.error("Fehler beim Laden der Orte:", error));
}

// 🔍 Suche & Filter
document
  .getElementById("homepage_filter_search")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const term = document
        .getElementById("homepage_filter_search_input")
        .value.trim();
      if (term) {
        searchLocationsByName(term);
      } else {
        alert("Bitte geben Sie einen Suchbegriff ein");
      }
    }
  });

function searchLocationsByName(searchTerm) {
  fetch(`./api/home.php?search=${encodeURIComponent(searchTerm)}`)
    .then((res) => res.json())
    .then((data) => printToMap(data))
    .catch((err) => console.error("Suche fehlgeschlagen:", err));
}

function fetchLocationsByCategory(category) {
  fetch(`./api/home.php?category=${encodeURIComponent(category)}`)
    .then((res) => res.json())
    .then((data) => printToMap(data))
    .catch((err) => console.error("Fehler bei Kategorie-Abruf:", err));
}

function getCategoryId(categoryName) {
  fetch(`./api/getCategory.php?name=${encodeURIComponent(categoryName)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.code === 200) {
        fetchLocationsByCategory(data.category_id);
      } else {
        console.error(data.message);
      }
    })
    .catch((err) => console.error("Fehler bei Kategorie-ID:", err));
}

// 🔁 Neue Daten auf Karte zeichnen
function printToMap(data) {
  sidebar.innerHTML = "";
  clearMarkers();

  const points = data.locations
    .map((loc) => ({
      id: loc.id || 0,
      lat: loc.latitude,
      lng: loc.longitude,
      name: loc.name,
      image: loc.image,
      description: loc.description,
    }))
    .filter((p) => p.lat && p.lng);

  addMarkersToMap(points);
  listMarkers(points);
}

// 📍 Sidebar öffnen
function openSidebarWithContent(content) {
  sidebar.innerHTML = content;
  sidebar.classList.add("open");
}

// ⬇️ Dropdown
function showDropdown() {
  const dropdown = document.getElementById("dropDown_menu");
  if (dropdown.style.display === "none" || dropdown.style.display === "") {
    dropdown.style.display = "block";
    document.addEventListener("click", closeDropdown);
  } else {
    dropdown.style.display = "none";
    document.removeEventListener("click", closeDropdown);
  }
}

function closeDropdown(event) {
  const dropdown = document.getElementById("dropDown_menu");
  const toggleImg = document.getElementById("toggleImg");
  if (!dropdown.contains(event.target) && event.target !== toggleImg) {
    dropdown.style.display = "none";
    document.removeEventListener("click", closeDropdown);
  }
}

// 🔄 Events
map.on("moveend", () => listMarkers(points));
map.on("popupclose", () => {
  selectedMarker = null;
  listMarkers(points);
});

// Start

//addMarkersToMap(points);
fetchAllLocations();
