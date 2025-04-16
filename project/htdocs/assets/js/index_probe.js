/**
 * Daten auf Sidebar mit Marker-Interaktion
 */

// 🗺️ Map-Konfiguration
const config = {
    minZoom: 3,
    maxZoom: 50,
    zoomControl: false,
  };
  const zoom = 7;
  const zoompoint = 11;
  const lat = 47.6965;
  const lng = 13.3458;
  const map = L.map("map", config).setView([lat, lng], zoom);
  
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, USGS, NOAA',
    }
  ).addTo(map);
  
  // 🔧 Globale Variablen
  let selectedMarker = null;
  const sidebar = document.getElementById("homepage_karte_sidebar");
  const markersLayer = L.featureGroup().addTo(map); // Globaler Marker-Layer
  
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
        openSidebarWithContent(generateSidebarContent(point));
      });
    });
  
    listMarkers(points);
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
  
  // 📦 Daten laden
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
              rating: loc.rating || 0,
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
  
  function fetchLocationsByCategory(category) {
    fetch(`./api/home.php?category=${encodeURIComponent(category)}`)
      .then((res) => res.json())
      .then((data) => printToMap(data))
      .catch((err) => console.error("Fehler bei Kategorie-Abruf:", err));
  }
  
  // 🔁 Neue Daten auf Karte zeichnen
  function printToMap(data) {
    sidebar.innerHTML = "";
    markersLayer.clearLayers();
  
    const points = data.locations
      .map((loc) => ({
        id: loc.id || 0,
        lat: loc.latitude,
        lng: loc.longitude,
        name: loc.name,
        image: loc.image,
        description: loc.description,
        rating: loc.rating || 0,
      }))
      .filter((p) => p.lat && p.lng);
  
    addMarkersToMap(points);
  }
  
  // ⭐ Bewertung
  function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
  
    return (
      '<i class="fas fa-star"></i>'.repeat(fullStars) +
      (halfStar ? '<i class="fas fa-star-half-alt"></i>' : "") +
      '<i class="far fa-star"></i>'.repeat(emptyStars)
    );
  }
  
  // 📍 Sidebar öffnen
  function openSidebarWithContent(content) {
    sidebar.innerHTML = content;
    sidebar.classList.add("open");
  }
  
  // 🧱 Sidebar-Inhalt generieren
  function generateSidebarContent(point) {
    return `
      <div id="buttons" style="display: flex; justify-content: space-between; align-items: center;">
        <img id="img_saveButton" src="./assets/images/icons/bookmark_unsaved.svg" alt="bookmark_unsaved" style="width:10%; height:auto;">
        <a href="./pages/fullscreen_startseite/fullscreen.html?id=${point.id}">
          <img id="img_großButton" src="./assets/images/testPic/grosmachen.png" alt="${point.name}" style="width:8%; max-height:150px; object-fit:cover;">
        </a>
      </div>
  
      <img id="img_big" src="${point.image}" alt="${point.name}" style="width:100%; max-height:150px; object-fit:cover;">
  
      ${[1, 2, 3]
        .map(
          () => `<img id="img_point" src="${point.image}" alt="${point.name}" style="width:10%; max-height:150px; object-fit:cover;">`
        )
        .join("")}
  
      <div id="spot_rating">${generateStars(point.rating)}</div>          
      <div id="parent_grid">
        <h3 id="header_point">${point.name}</h3>
        <div class="info_box">
          <div class="info_box_item">
            <div class="info_box_item_icon"><i class="fas fa-tag"></i></div>
            <div class="info_box_item_text" id="name_category"></div>
          </div>
        </div>
      </div>
      <p id="beschreibung">${point.description}</p>
      <p><strong>|</strong> ${point.lat}, ${point.lng}</p><br>
      <a id="button_comments_link" href="./pages/fullscreen_startseite/fullscreen.html?id=${point.id}">
        <div id="button_comments"><p>show Comments</p></div>
      </a>
    `;
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
  
  // 🔄 Map Events
  map.on("moveend", () => listMarkers(points));
  map.on("popupclose", () => {
    selectedMarker = null;
    listMarkers(points);
  });
  
  // ▶️ Start
  fetchAllLocations(); 
  