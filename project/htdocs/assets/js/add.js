let progressBar = document.getElementById("progress-bar");
let progressText = document.getElementById("info");

let section1 = document.getElementById("add_content_slide1");
let section2 = document.getElementById("add_content_slide2");

let progress = 50;
let step = 50; // Wie viel jedes Mal hinzugefügt wird (50% pro Schritt)
let slide = 1; // Aktuelle Folie

localStorage.clear();
sessionStorage.clear();
indexedDB.databases().then((dbs) => {
  dbs.forEach((db) => indexedDB.deleteDatabase(db.name));
});

progressBar.style.height = `${progress}%`;
progressBar.innerText = `${progress}%`;

// Text aktualisieren (z.B. 1/2, 2/2, etc.)
progressText.innerText = `${progress / 50} / 2`;

if (slide === 1) {
  section1.style.display = "grid";
  section2.style.display = "none";
  document.getElementById("add_back").style.cursor = "not-allowed";
  document.getElementById("add_back").style.opacity = "0.5";
  document.getElementById("add_back").style.pointerEvents = "none";
} else if (slide === 2) {
  section1.style.display = "none";
  section2.style.display = "grid";
  document.getElementById("add_back").style.cursor = "pointer";
  document.getElementById("add_back").style.opacity = "1";
  document.getElementById("add_back").style.pointerEvents = "auto";
}

if (progress / 50 === 2) {
  document.getElementById("add_finish").style.display = "inline";
}

window.onload = function () {
  const fileInput = document.getElementById("fileToUpload"); // Korrigierte ID
  const dropArea = document.getElementById("fileUpload"); // Korrigierte ID
  const imagePreview = document.getElementById("imagePreview");

  if (!dropArea) {
    console.error("dropArea nicht gefunden!");
    return;
  }

  // Klick auf Drop-Area öffnet File-Dialog
  dropArea.addEventListener("click", () => fileInput.click());

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = "#eee";
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.style.backgroundColor = "#f9f9f9";
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = "#f9f9f9";
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      handleFiles(files);
    }
  });

  fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

  function handleFiles(files) {
    if (!files || files.length === 0) return;
    
    const uploadedImages = [];
    const file = files[0]; // Nur das erste Bild verwenden
    
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgContainer = document.createElement("div");
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.width = "200px";
        img.style.height = "auto";

        // Speichere das Bild als Base64 in sessionStorage
        uploadedImages.push(e.target.result);
        sessionStorage.setItem("uploadedImages", JSON.stringify(uploadedImages));
        sessionStorage.setItem("selectedFile", e.target.result);
        
        // Update Label
        document.getElementById("uploadLabel").innerHTML = 
          `📁 Datei ausgewählt: <strong>${file.name}</strong>`;

        // Erstelle ein "X"-Element zum Entfernen
        const removeButton = document.createElement("span");
        removeButton.innerText = "X";
        removeButton.style.cursor = "pointer";
        removeButton.style.marginLeft = "5px";
        removeButton.style.color = "red";

        removeButton.addEventListener("click", () => {
          imgContainer.remove();
          sessionStorage.removeItem("uploadedImages");
          sessionStorage.removeItem("selectedFile");
          fileInput.value = "";
          document.getElementById("uploadLabel").innerHTML = 
            "📁 Bild auswählen oder hierher ziehen";
        });

        imgContainer.appendChild(img);
        imgContainer.appendChild(removeButton);
        imagePreview.innerHTML = ""; // Clear previous previews
        imagePreview.appendChild(imgContainer);
      };
      reader.readAsDataURL(file);
    }
  }
};

// Beispiel für die Bildverkleinerung (optional)
function resizeImage(imageSrc) {
  return new Promise((resolve) => {
    // Hier kannst du Logik hinzufügen, um das Bild zu verkleinern, wenn nötig.
    resolve(imageSrc); // Für dieses Beispiel wird das Bild nicht verändert
  });
}

function loadImagesFromSessionStorage() {
  const savedImages =
    JSON.parse(sessionStorage.getItem("uploadedImages")) || [];

  savedImages.forEach((imageSrc) => {
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    img.src = imageSrc;

    // Erstelle ein "X"-Element
    const removeButton = document.createElement("span");
    removeButton.innerText = "X";
    removeButton.style.cursor = "pointer";
    removeButton.style.marginLeft = "10px";
    removeButton.style.color = "red";

    // Event Listener zum Entfernen des Bildes
    removeButton.addEventListener("click", () => {
      let updatedImages = savedImages.filter((src) => src !== imageSrc);
      sessionStorage.setItem("uploadedImages", JSON.stringify(updatedImages));
      imgContainer.remove();
    });

    imgContainer.appendChild(img);
    imgContainer.appendChild(removeButton);
    document.getElementById("imagePreview").appendChild(imgContainer);
  });
}

// Funktion zum Aktualisieren des Fortschritts
function updateProgress(action) {
  if (action === "more" && progress < 100) {
    // Validate required fields before proceeding
    if (slide === 1) {
      // Reset any previous styling
      document.querySelectorAll("input").forEach((input) => {
        input.style.boxShadow = "2px 2px 10px -6px rgba(0,0,0,0.74)";
      });

      let isValid = true;

      // Check required fields
      const name = document.getElementById("name");
      const latitude = document.getElementById("latitude");
      const longitude = document.getElementById("longitude");
      const pics = document.getElementById("fileInput");

      if (!name.value.trim()) {
        name.style.boxShadow = "0 0 5px 2px rgba(255,0,0,0.5)";
        isValid = false;
      }

      if (!latitude.value.trim()) {
        latitude.style.boxShadow = "0 0 5px 2px rgba(255,0,0,0.5)";
        isValid = false;
      }

      if (!longitude.value.trim()) {
        longitude.style.boxShadow = "0 0 5px 2px rgba(255,0,0,0.5)";
        isValid = false;
      }

      if (!isValid) {
        alert("Please fill out all required fields highlighted in red!");
        return;
      }
    }

    progress += step;
    slide = 2;
  } else if (action === "back" && progress > 0) {
    progress -= step;
    slide = 1;
  } else if (action === "finish") {
    const placeName = document.getElementById("name").value;
    const placeCoordinatesB = document.getElementById("latitude").value;
    const placeCoordinatesL = document.getElementById("longitude").value;
    const placeAddress = document.getElementById("address").value;
    const placeDescription = document.getElementById("description").value;
    const placeCategory = document.getElementById("category").value;
    const placeOpeningHours = document.getElementById("opening_hours").value;
    const placeSeason = document.getElementById("season").value;
    const placePrice = document.getElementById("price_range").value;
    const placeAccessibility = document.getElementById("accessibility").value;
    const placeWebsite = document.getElementById("website_url").value;
    const placeSpecialFeatures =
      document.getElementById("special_features").value;

    const commentsCheckbox = document.getElementById("comments_input_checkbox");

    if (commentsCheckbox.checked) {
      placeComments = "Enabled";
    } else {
      placeComments = "No Comments";
    }

    sessionStorage.setItem("Comments", placeComments);

    // Daten in localStorage speichern
    sessionStorage.setItem("name", placeName);
    sessionStorage.setItem("latitude", placeCoordinatesB);
    sessionStorage.setItem("longitude", placeCoordinatesL);
    sessionStorage.setItem("Address", placeAddress);
    sessionStorage.setItem("Description", placeDescription);
    sessionStorage.setItem("Category", placeCategory);
    sessionStorage.setItem("Comments", placeComments);
    sessionStorage.setItem("OpeningHours", placeOpeningHours);
    sessionStorage.setItem("Season", placeSeason);
    sessionStorage.setItem("Price", placePrice);
    sessionStorage.setItem("Accessibility", placeAccessibility);
    sessionStorage.setItem("Website", placeWebsite);
    sessionStorage.setItem("SpecialFeatures", placeSpecialFeatures);

    loadFinishedSide();

    document.getElementById("placeName").innerHTML =
      sessionStorage.getItem("name");
    document.getElementById("latitude2").innerHTML =
      sessionStorage.getItem("latitude");
    document.getElementById("longitude2").innerHTML =
      sessionStorage.getItem("longitude");
    document.getElementById("placeAddress").innerHTML =
      sessionStorage.getItem("Address");
    document.getElementById("placeDescription").innerHTML =
      sessionStorage.getItem("Description");
    document.getElementById("placeCategory").innerHTML =
      sessionStorage.getItem("Category");
    document.getElementById("placeComments").innerHTML =
      sessionStorage.getItem("Comments");
    document.getElementById("placeOpeningHours").innerHTML =
      sessionStorage.getItem("OpeningHours");
    document.getElementById("placeSeason").innerHTML =
      sessionStorage.getItem("Season");
    document.getElementById("placePriceRange").innerHTML =
      sessionStorage.getItem("Price");
    document.getElementById("placeAccessibility").innerHTML =
      sessionStorage.getItem("Accessibility");
    document.getElementById(
      "placeWebsiteUrl"
    ).innerHTML = `<a href="https://${sessionStorage.getItem(
      "Website"
    )}" target="_blank">${sessionStorage.getItem("Website")}</a>`;
    document.getElementById("placeSpecialFeatures").innerHTML =
      sessionStorage.getItem("SpecialFeatures");
  }

  if (slide === 1) {
    section1.style.display = "grid";
    section2.style.display = "none";
    document.getElementById("add_back").style.cursor = "not-allowed";
    document.getElementById("add_back").style.opacity = "0.5";
    document.getElementById("add_back").style.pointerEvents = "none";
    document.getElementById("add_finish").style.display = "none";
    document.getElementById("add_continue").style.display = "inline";
  } else if (slide === 2) {
    section1.style.display = "none";
    section2.style.display = "grid";
    document.getElementById("add_back").style.cursor = "pointer";
    document.getElementById("add_back").style.opacity = "1";
    document.getElementById("add_back").style.pointerEvents = "auto";
    document.getElementById("add_continue").style.display = "none";
  }

  // Animation und Textaktualisierung
  progressBar.style.height = `${progress}%`;
  progressBar.innerText = `${progress}%`;

  // Text aktualisieren (z.B. 1/2, 2/2, etc.)
  progressText.innerText = `${progress / 50} / 2`; // Dies zeigt 1/2, 2/2 etc. basierend auf Fortschritt

  if (progress / 50 === 2) {
    document.getElementById("add_finish").style.display = "inline";
  }
}

function backHome() {
  window.location.href = "../../index.html"; // Zurück zur Startseite
}

function resizeImage(imageBase64, maxSize = 500) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageBase64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", 0.7)); // 0.7 = Qualität
    };
  });
}

function loadFinishedSide() {
  document.getElementById("main2_finish").style.display = "grid";
  document.querySelector("body").style.overflowY = "auto";
  document.getElementById("main").style.display = "none";

  loadAll();
}

function loadAll() {
  console.log("Loading images for confirmation");
  
  const imageContainer = document.getElementById("imageContainer");
  if (!imageContainer) {
    console.error("Element mit ID 'imageContainer' nicht gefunden.");
    return;
  }

  // Hole das ausgewählte Bild direkt vom Input
  const fileInput = document.getElementById("fileToUpload");
  
  if (!fileInput.files || fileInput.files.length === 0) {
    console.log("Keine Datei im Input gefunden.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    img.src = e.target.result;
    img.alt = file.name;
    img.style.width = "200px";
    img.style.height = "auto";
    
    imgContainer.appendChild(img);
    imageContainer.appendChild(imgContainer);
  };
  
  reader.readAsDataURL(file);
}

async function saveLocation() {
  // Sammle alle Felder
  const name = sessionStorage.getItem("name");
  const latitude = sessionStorage.getItem("latitude");
  const longitude = sessionStorage.getItem("longitude");
  const address = sessionStorage.getItem("Address");
  const description = sessionStorage.getItem("Description");
  const category = sessionStorage.getItem("Category");
  const opening_hours = sessionStorage.getItem("OpeningHours");
  const season = sessionStorage.getItem("Season");
  const price_range = sessionStorage.getItem("Price");
  
  // Accessibility als Integer (1 wenn vorhanden, sonst 0)
  const accessibilityText = sessionStorage.getItem("Accessibility") || '';
  const accessibility = accessibilityText.trim() !== '' ? 1 : 0;
  
  const website_url = sessionStorage.getItem("Website");
  const special_features = sessionStorage.getItem("SpecialFeatures");
  const comments = sessionStorage.getItem("Comments");
  const created_by = await getCurrentUserId();

  // Prüfe ob ein Bild ausgewählt wurde
  const fileInput = document.getElementById("fileToUpload");
  
  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Bitte wähle mindestens ein Bild aus!");
    return;
  }

  const file = fileInput.files[0];

  // FormData für multipart/form-data
  const formData = new FormData();
  formData.append("name", name);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append("address", address);
  formData.append("description", description);
  formData.append("category", category);
  formData.append("opening_hours", opening_hours);
  formData.append("season", season);
  formData.append("price_range", price_range);
  formData.append("accessibility", accessibility); // Integer-Wert
  formData.append("website_url", website_url);
  formData.append("special_features", special_features);
  formData.append("comments", comments === "Enabled" ? "1" : "0");
  formData.append("created_by", created_by);
  formData.append("fileToUpload", file);

  try {
    // Sende an das Backend
    const uploadResponse = await fetch("./add.php", {
      method: "POST",
      body: formData,
    });

    const responseText = await uploadResponse.text();
    console.log("Server response:", responseText);
    
    try {
      const data = JSON.parse(responseText);
      if (data.code === 200) {
        alert("Ort und Bild erfolgreich gespeichert!");
        sessionStorage.clear(); // Clear all session data
        window.location.href = "../../index.html";
      } else {
        alert("Fehler beim Hochladen: " + data.message);
      }
    } catch (e) {
      console.error("JSON Parse Error:", e);
      alert("Fehler beim Hochladen: Server-Antwort konnte nicht verarbeitet werden");
    }
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
    alert("Fehler beim Hochladen: " + error.message);
  }
}

function uploadNewLocation(locationData) {
  fetch("../../api/upload.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(locationData),
  })
    .then((response) => response.text()) // Zuerst den Rohtext der Antwort lesen
    .then((text) => {
      console.log("Server response:", text); // Logge den Rohtext
      try {
        const data = JSON.parse(text); // Versuche, den Text als JSON zu parsen
        console.log("New location uploaded:", data);
        if (data.code === 200) {
          console.log("Location uploaded successfully:", data.message);
          alert("Location uploaded successfully!");
          window.location.href = "../../index.html"; // Redirect to home page
        } else {
          console.error("Upload failed:", data.message);
          alert("Upload failed: " + data.message);
        }
      } catch (e) {
        console.error("Failed to parse JSON:", e);
      }
    })
    .catch((error) => console.error("Error uploading new location:", error));
}

function clickComments() {
  const comments = document.getElementById("comments_input_checkbox");
  console.log(comments.checked);
  return comments.checked;
}

async function getCategoryId(categoryName) {
  try {
    const response = await fetch(
      `../../api/getCategory.php?name=${encodeURIComponent(categoryName)}`
    );
    const data = await response.json();

    if (data.code === 200) {
      console.log(
        `Die ID der Kategorie "${categoryName}" ist: ${data.category_id}`
      );
      return data.category_id;
    } else {
      console.error(`Fehler: ${data.message}`);
      return null;
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Kategorie-ID:", error);
    return null;
  }
}

function handleSubmit(event) {
  event.preventDefault(); // verhindert normales Absenden
  const form = event.target;

  if (form.checkValidity()) {
    updateProgress("more");
  } else {
    form.reportValidity(); // zeigt automatisch HTML5-Fehler an
  }
}

const dropArea = document.getElementById("fileUpload");
const fileInput = document.getElementById("fileToUpload");
const label = document.getElementById("uploadLabel");

// Drag-Events verhindern Default-Verhalten
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, (e) => e.preventDefault());
  dropArea.addEventListener(eventName, (e) => e.stopPropagation());
});

// Visuelles Feedback
["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, () =>
    dropArea.classList.add("dragover")
  );
});
["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, () =>
    dropArea.classList.remove("dragover")
  );
});

// Datei einfügen per Drag & Drop
dropArea.addEventListener("drop", (e) => {
  const files = e.dataTransfer.files;
  if (files.length) {
    fileInput.files = files; // Datei dem Input zuweisen
    label.innerHTML = `📁 Datei ausgewählt: <strong>${files[0].name}</strong>`;
  }
});

// Datei-Auswahl aktualisieren, wenn über normalen Input gewählt
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    label.innerHTML = `📁 Datei ausgewählt: <strong>${fileInput.files[0].name}</strong>`;
  }
});

// On page load, check if user is logged in
document.addEventListener("DOMContentLoaded", async function () {
  // Redirect if not logged in
  if (!(await requireLogin())) {
    return; // The requireLogin function will handle the redirect
  }

  // Continue with page initialization
  // ...existing initialization code...
});
