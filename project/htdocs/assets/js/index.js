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

const map = L.map("map", config).setView([lat, lng], zoom);

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
    image: "wien.jpg",
    description: "Die Hauptstadt von Österreich.",
  },
  {
    lat: 47.2682,
    lng: 11.39277,
    name: "Innsbruck",
    image: "innsbruck.jpg",
    description: "Bekannt für Wintersport.",
  },
  {
    lat: 47.80949,
    lng: 13.05501,
    name: "Salzburg",
    image: "salzburg.jpg",
    description: "Geburtsstadt von Mozart.",
  },
  {
    lat: 46.62472,
    lng: 14.30528,
    name: "Klagenfurt",
    image: "klagenfurt.jpg",
    description: "Hauptstadt von Kärnten.",
  },
  {
    lat: 48.30694,
    lng: 14.28583,
    name: "Linz",
    image: "linz.jpg",
    description: "Kulturhauptstadt Europas 2009.",
  },
];

const fg = L.featureGroup().addTo(map);

points.forEach((point) => {
  const marker = L.marker([point.lat, point.lng]).addTo(fg);
  marker.on("click", () => {
    selectedMarker = marker;
    openSidebarWithContent(`
      <h3>${point.name}</h3>
      <img src="${point.image}" alt="${point.name}" style="width:100%; max-height:150px; object-fit:cover;">
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

document.addEventListener("DOMContentLoaded", function () {
  const toggleImg = document.getElementById("toggleImg");
  const dropdown = document.getElementById("dropDown_menu");

  function showDropdown(event) {
    event.stopPropagation(); // Verhindert das Schließen des Menüs beim Klicken auf den Button
    dropdown.classList.toggle("show"); // Toggle Dropdown Visibility

    // Wenn das Dropdown geöffnet wird, einen Event Listener für das Schließen bei Klick außerhalb hinzufügen
    if (dropdown.classList.contains("show")) {
      document.addEventListener("click", closeDropdown);
    } else {
      document.removeEventListener("click", closeDropdown);
    }
  }

  function closeDropdown(event) {
    // Wenn der Klick außerhalb des Menüs und des Buttons ist, Dropdown schließen
    if (!dropdown.contains(event.target) && event.target !== toggleImg) {
      dropdown.classList.remove("show");
      document.removeEventListener("click", closeDropdown); // Event Listener entfernen
    }
  }

  // Sicherstellen, dass der Event Listener auf dem toggleImg gesetzt wird
  if (toggleImg) {
    toggleImg.addEventListener("click", showDropdown);
  } else {
    console.error("Element mit ID 'toggleImg' nicht gefunden!");
  }
});

