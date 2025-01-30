/* eslint-disable no-undef */
/**
 * data on sidebar
 */

// config map
let config = {
    minZoom: 3,
    maxZoom: 30,
  };
  // magnification with which the map will start
  const zoom = 7;
  // co-ordinates
  const lat = 47.6965;
  const lng = 13.3458;
  
  // calling map
  const map = L.map("map", config).setView([lat, lng], zoom);
  
  // Used to load and display tile layers on the map
  // Most tile servers require attribution, which you can set under `Layer`
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  
  // --------------------------------------------------
  
  const sidebar = document.getElementById("homepage_karte_sidebar");
  
  function createSidebarElements(layer) {
    const el = `<div class="sidebar-el" data-marker="${layer._leaflet_id}">${layer
      .getLatLng()
      .toString()}</div>`;
  
    const temp = document.createElement("div");
    temp.innerHTML = el.trim();
    const htmlEl = temp.firstChild;
  
    L.DomEvent.on(htmlEl, "click", zoomToMarker);
    sidebar.insertAdjacentElement("beforeend", htmlEl);
  }
  
  function zoomToMarker(e) {
    const clickedEl = e.target;
    const markerId = clickedEl.getAttribute("data-marker");
    const marker = fg.getLayer(markerId);
    const getLatLong = marker.getLatLng();
  
    marker.bindPopup(getLatLong.toString()).openPopup();
  }
  
  // coordinate array points
  const points = [
    [48.20849, 16.37208], // Wien
    [47.2682, 11.39277],  // Innsbruck
    [47.80949, 13.05501], // Salzburg
    [46.62472, 14.30528], // Klagenfurt
    [48.30694, 14.28583], // Linz
  ];  
  
  const fg = L.featureGroup().addTo(map);
  
  points.forEach((point) => {
    const marker = L.marker(point).addTo(fg);
    const getLatLong = marker.getLatLng();
    marker.bindPopup(getLatLong.toString());
  });
  
  listMarkers();
  
  //Create Elements for markers in bound
  function listMarkers() {
    map.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        if (map.getBounds().contains(layer.getLatLng()) == true) {
          createSidebarElements(layer);
        }
      }
    });
  }
  
  //Event fired when user stopped dragging the map
  map.on('moveend', function (e) {
    sidebar.innerHTML = '';
    listMarkers();
  });

  L.DataDivIcon = L.DivIcon.extend({
    createIcon: function (oldIcon) {
      let divElement = L.DivIcon.prototype.createIcon.call(this, oldIcon);
  
      if (this.options.data) {
        for (let key in this.options.data) {
          divElement.dataset[key] = this.options.data[key];
        }
      }
      return divElement;
    },
  });
  
  L.dataDivIcon = (options) => new L.DataDivIcon(options);

  const myNewIcon = L.dataDivIcon({
    className: "leaflet-data-marker",
    html: '<svg viewBox="0 0 149 178"><path fill="red" stroke="#FFF" stroke-width="10" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/></svg>',
    iconSize: [30, 20],
    data: {
      firstExample: "First example",
      secondExample: "Second example",
    },
  });

  L.marker([52.22983, 21.011728], { icon: myNewIcon })
  .addTo(map)
  .bindPopup("Center Warsaw");