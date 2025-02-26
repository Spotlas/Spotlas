let progressBar = document.getElementById('progress-bar');
let progressText = document.getElementById('info');

let section1 = document.getElementById('add_content_slide1');
let section2 = document.getElementById('add_content_slide2');

let progress = 50;
let step = 50; // Wie viel jedes Mal hinzugefügt wird (50% pro Schritt)
let slide = 1; // Aktuelle Folie

localStorage.clear();
sessionStorage.clear();
indexedDB.databases().then((dbs) => {
    dbs.forEach(db => indexedDB.deleteDatabase(db.name));
});


progressBar.style.height = `${progress}%`;
progressBar.innerText = `${progress}%`;

// Text aktualisieren (z.B. 1/2, 2/2, etc.)
progressText.innerText = `${(progress / 50)} / 2`; 

if(slide === 1) {   
    section1.style.display = 'grid';
    section2.style.display = 'none';
    document.getElementById('add_back').style.cursor = 'not-allowed'
    document.getElementById('add_back').style.opacity = '0.5';
    document.getElementById('add_back').style.pointerEvents = 'none';
    
}else if(slide === 2) {
    section1.style.display = 'none';
    section2.style.display = 'grid';
    document.getElementById('add_back').style.cursor = 'pointer'
    document.getElementById('add_back').style.opacity = '1';
    document.getElementById('add_back').style.pointerEvents = 'auto';

}

if(progress/50 === 2) {
    document.getElementById('add_finish').style.display = 'inline';
}


window.onload = function () {
    const fileInput = document.getElementById("fileInput");
    const dropArea = document.getElementById("drop-area");
    const imagePreview = document.getElementById("imagePreview");

    if (!dropArea) {
        console.error("dropArea nicht gefunden!");
        return;
    }

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
        handleFiles(e.dataTransfer);
    });

    fileInput.addEventListener("change", (e) => handleFiles(e.target));

    function handleFiles(event) {
        const files = event.files || event.target.files;
        const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || []; // Lade bestehende Bilder
    
        for (const file of files) {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imgContainer = document.createElement('div');
                    const img = document.createElement("img");
                
                    // Verwende createObjectURL statt Base64
                    const blob = new Blob([e.target.result], { type: "image/png" });
                    const imageUrl = URL.createObjectURL(blob);
                    img.src = imageUrl;
                
                    // Erstelle ein "X"-Element zum Entfernen
                    const removeButton = document.createElement('span');
                    removeButton.innerText = 'X';
                    removeButton.style.cursor = 'pointer';
                    removeButton.style.marginLeft = '5px';
                    removeButton.style.color = 'red';
                
                    removeButton.addEventListener('click', () => {
                        imgContainer.remove(); // Entferne die Vorschau
                        uploadedImages = uploadedImages.filter(url => url !== imageUrl); // Entferne das Bild aus dem Array
                        sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages)); // Speichere Änderungen
                    });
                
                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeButton);
                    imagePreview.appendChild(imgContainer);
                
                    uploadedImages.push(imageUrl); // Speichere nur die URL, nicht die Base64-Daten
                
                    try {
                        sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
                    } catch (e) {
                        if (e.name === 'QuotaExceededError') {
                            console.error("Speicherplatz ist voll! Bitte löschen Sie einige Bilder.");
                            alert("Speicherplatz ist voll! Bitte löschen Sie einige Bilder.");
                        }
                    }
                };
                reader.readAsArrayBuffer(file); // Lies das Bild als ArrayBuffer (statt Base64)
                
            }
        }
    }
}
    
    // Beispiel für die Bildverkleinerung (optional)
    function resizeImage(imageSrc) {
        return new Promise((resolve) => {
            // Hier kannst du Logik hinzufügen, um das Bild zu verkleinern, wenn nötig.
            resolve(imageSrc); // Für dieses Beispiel wird das Bild nicht verändert
        });
    }
    
    function loadImagesFromSessionStorage() {
        const savedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || [];
    
        savedImages.forEach(imageSrc => {
            const imgContainer = document.createElement('div');
            const img = document.createElement('img');
            img.src = imageSrc;
    
            // Erstelle ein "X"-Element
            const removeButton = document.createElement('span');
            removeButton.innerText = 'X';
            removeButton.style.cursor = 'pointer';
            removeButton.style.marginLeft = '10px';
            removeButton.style.color = 'red';
    
            // Event Listener zum Entfernen des Bildes
            removeButton.addEventListener('click', () => {
                let updatedImages = savedImages.filter(src => src !== imageSrc);
                sessionStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
                imgContainer.remove();
            });
    
            imgContainer.appendChild(img);
            imgContainer.appendChild(removeButton);
            document.getElementById('imagePreview').appendChild(imgContainer);
        });
    }
    


// Funktion zum Aktualisieren des Fortschritts
function updateProgress(action) {
    if (action === 'more' && progress < 100) {
        progress += step;
        slide = 2;
    } else if (action === 'back' && progress > 0) {
        progress -= step; 
        slide = 1;
    }else if(action === 'finish') {
        
            const placeName = document.getElementById('name').value;
            const placeCoordinatesB = document.getElementById('latitude').value;
            const placeCoordinatesL = document.getElementById('longitude').value;
            const placeAddress = document.getElementById('address').value;
            const placeDescription = document.getElementById('description').value;
            const placeCategory = document.getElementById('category').value;
            const placeOpeningHours = document.getElementById('opening_hours').value;
            const placeSeason = document.getElementById('season').value;
            const placePrice = document.getElementById('price_range').value;
            const placeAccessibility = document.getElementById('accessibility').value;
            const placeWebsite = document.getElementById('website_url').value;
            const placeSpecialFeatures = document.getElementById('special_features').value;

            const commentsCheckbox = document.getElementById('comments_input_checkbox');

            if (commentsCheckbox.checked) {
                placeComments = "Enabled";
            } else {
                placeComments = "No Comments";
            }

            sessionStorage.setItem('Comments', placeComments);

            
        
            // Daten in localStorage speichern
            sessionStorage.setItem('name', placeName);
            sessionStorage.setItem('latitude', placeCoordinatesB);
            sessionStorage.setItem('longitude', placeCoordinatesL);
            sessionStorage.setItem('Address', placeAddress);
            sessionStorage.setItem('Description', placeDescription);
            sessionStorage.setItem('Category', placeCategory);
            sessionStorage.setItem('Comments', placeComments);
            sessionStorage.setItem('OpeningHours', placeOpeningHours);
            sessionStorage.setItem('Season', placeSeason);
            sessionStorage.setItem('Price', placePrice);
            sessionStorage.setItem('Accessibility', placeAccessibility);
            sessionStorage.setItem('Website', placeWebsite);
            sessionStorage.setItem('SpecialFeatures', placeSpecialFeatures);
        

        loadFinishedSide()

        document.getElementById('placeName').innerHTML = sessionStorage.getItem('name');
            document.getElementById('latitude').innerHTML = sessionStorage.getItem('latitude');
            document.getElementById('longitude').innerHTML = sessionStorage.getItem('longitude');
            document.getElementById('placeAddress').innerHTML = sessionStorage.getItem('Address');
            document.getElementById('placeDescription').innerHTML = sessionStorage.getItem('Description');
            document.getElementById('placeCategory').innerHTML = sessionStorage.getItem('Category');
            document.getElementById('placeComments').innerHTML = sessionStorage.getItem('Comments');
            document.getElementById('placeOpeningHours').innerHTML = sessionStorage.getItem('OpeningHours');
            document.getElementById('placeSeason').innerHTML = sessionStorage.getItem('Season');
            document.getElementById('placePriceRange').innerHTML = sessionStorage.getItem('Price');
            document.getElementById('placeAccessibility').innerHTML = sessionStorage.getItem('Accessibility');
            document.getElementById('placeWebsiteUrl').innerHTML = `<a href="https://${sessionStorage.getItem('Website')}" target="_blank">${sessionStorage.getItem('Website')}</a>`;
            document.getElementById('placeSpecialFeatures').innerHTML = sessionStorage.getItem('SpecialFeatures');
        

    }

    if(slide === 1) {   
        section1.style.display = 'grid';
        section2.style.display = 'none';
        document.getElementById('add_back').style.cursor = 'not-allowed'
        document.getElementById('add_back').style.opacity = '0.5';
        document.getElementById('add_back').style.pointerEvents = 'none';
        document.getElementById('add_finish').style.display = 'none';
        
    }else if(slide === 2) {
        section1.style.display = 'none';
        section2.style.display = 'grid';
        document.getElementById('add_back').style.cursor = 'pointer'
        document.getElementById('add_back').style.opacity = '1';
        document.getElementById('add_back').style.pointerEvents = 'auto';
    
    }

    // Animation und Textaktualisierung
    progressBar.style.height = `${progress}%`;
    progressBar.innerText = `${progress}%`;

    // Text aktualisieren (z.B. 1/2, 2/2, etc.)
    progressText.innerText = `${(progress / 50)} / 2`;  // Dies zeigt 1/2, 2/2 etc. basierend auf Fortschritt

    if(progress/50 === 2) {
        document.getElementById('add_finish').style.display = 'inline';
    }
}


function backHome() {
    window.location.href = '../../index.html'; // Zurück zur Startseite
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
    document.getElementById('main2_finish').style.display = 'grid';
    document.getElementById('main').style.display = 'none';

  
    loadAll()
}

function loadAll(){
    console.log("Window loaded"); // Prüfen, ob das Skript läuft

    const imageContainer = document.getElementById('imageContainer');
    if (!imageContainer) {
        console.error("Element mit ID 'imageContainer' nicht gefunden.");
        return;
    }

    const uploadedImages = JSON.parse(sessionStorage.getItem('uploadedImages')) || [];
    
    if (uploadedImages.length === 0) {
        console.log("Keine gespeicherten Bilder im sessionStorage gefunden.");
        return;
    }

    uploadedImages.forEach((imageData, index) => {
        const imgContainer = document.createElement('div');

        const img = document.createElement('img');
        img.src = imageData; // Base64 oder URL
        img.alt = `Bild ${index + 1}`;
        img.style.width = '200px';
        img.style.height = 'auto';

        // Entfernen-Button erstellen
        const removeButton = document.createElement('span');
        removeButton.innerText = 'X';
        removeButton.style.cursor = 'pointer';
        removeButton.style.marginLeft = '10px';
        removeButton.style.color = 'red';
        
        removeButton.addEventListener('click', () => {
            uploadedImages.splice(index, 1); // Bild aus dem Array entfernen
            sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages)); // SessionStorage aktualisieren
            imgContainer.remove(); // Bild aus der Vorschau entfernen
        });

        imgContainer.appendChild(img);
        imgContainer.appendChild(removeButton);
        imageContainer.appendChild(imgContainer);
    });

}

function goToAdd() {
    window.location.href = './add.html';
}

function gotoHome() {
    window.location.href = '../../index.html';
}

function clickComments() {
    console.log('Checkbox clicked');
}