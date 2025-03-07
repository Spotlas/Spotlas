/* eslint-disable no-undef */
/**
 * data on sidebar with marker click interaction
 */

// config map
let config = {
  minZoom: 3,
  maxZoom: 30,
};
const zoom = 7;
const lat = 47.6965;
const lng = 13.3458;

const map = L.map("map", { ...config, zoomControl: false }).setView(
  [lat, lng],
  zoom
);

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

const points = [
  {
    lat: 48.20849,
    lng: 16.37208,
    name: "Wien",
    image: "./assets/images/testPic/1.png",
    description: "Die Hauptstadt von Österreich.",
  },
  {
    lat: 47.2682,
    lng: 11.39277,
    name: "Innsbruck",
    image: "./assets/images/testPic/2.png",
    description: "Bekannt für Wintersport.",
  },
  {
    lat: 47.80949,
    lng: 13.05501,
    name: "Salzburg",
    image: "./assets/images/testPic/3.png",
    description: "Geburtsstadt von Mozart.",
  },
  {
    lat: 46.62472,
    lng: 14.30528,
    name: "Klagenfurt",
    image: "./assets/images/testPic/4.png",
    description: "Hauptstadt von Kärnten.",
  },
  {
    lat: 48.30694,
    lng: 14.28583,
    name: "Linz",
    image: "./assets/images/testPic/5.png",
    description: "Kulturhauptstadt Europas 2009.",
  },
];

const fg = L.featureGroup().addTo(map);

points.forEach((point) => {
  const marker = L.marker([point.lat, point.lng]).addTo(fg);
  marker.on("click", () => {
    selectedMarker = marker;
    openSidebarWithContent(`
      <img id="img_saveButton" src="./assets/images/testPic/save.png" alt="${point.name}" style="width:8%; max-height:150px; object-fit:cover; padding-bottom: 2%;">
      <a href="./pages/fullscreen_startseite/fullscreen.html"><img id="img_großButton" src="./assets/images/testPic/grosmachen.png" alt="${point.name}" style="width:8%; max-height:150px; object-fit:cover; padding-left: 80%; padding-bottom: 2%;"></a>
      <img id="img_point" src="${point.image}" alt="${point.name}" style="width:100%; max-height:150px; object-fit:cover;">
      <h3 id="header_point">${point.name}</h3>
      <p>${point.description}</p>
      <p><strong>Koordinaten:</strong> ${point.lat}, ${point.lng}</p>
    `);
  });
});

listMarkers();

function listMarkers() {
  if (selectedMarker) return; // Zeige nur die Namen, wenn kein Marker aktiv ist
  sidebar.innerHTML = "<h3>Orte im aktuellen Kartenausschnitt:</h3><br>";
  map.eachLayer(function (layer) {
    if (
      layer instanceof L.Marker &&
      map.getBounds().contains(layer.getLatLng())
    ) {
      const el = document.createElement("div");
      el.className = "sidebar-el";
      el.textContent =
        points.find(
          (p) =>
            p.lat === layer.getLatLng().lat && p.lng === layer.getLatLng().lng
        )?.name || "Unbekannter Ort";
      el.onclick = () => {
        map.setView(layer.getLatLng(), zoom);
        layer.openPopup();
      };
      sidebar.appendChild(el);
    }
  });
}

map.on("moveend", listMarkers);
map.on("popupclose", () => {
  selectedMarker = null;
  listMarkers();
});

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
