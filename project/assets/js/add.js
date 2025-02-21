let progressBar = document.getElementById('progress-bar');
let progressText = document.getElementById('info');

let section1 = document.getElementById('add_content_slide1');
let section2 = document.getElementById('add_content_slide2');

let progress = 50;
let step = 50; // Wie viel jedes Mal hinzugefügt wird (50% pro Schritt)
let slide = 1; // Aktuelle Folie

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
                    img.src = e.target.result;
    
                    // Erstelle ein "X"-Element
                    const removeButton = document.createElement('span');
                    removeButton.innerText = 'X';
                    removeButton.style.cursor = 'pointer';
                    removeButton.style.marginLeft = '5px';
                    removeButton.style.color = 'red'; // Farbe des "X"
                    
                    // Füge Event Listener zum Entfernen des Bildes hinzu
                    removeButton.addEventListener('click', () => {
                        // Bild aus dem Array entfernen
                        const index = uploadedImages.indexOf(e.target.result);
                        if (index > -1) {
                            uploadedImages.splice(index, 1); // Bild entfernen
                            sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages)); // Aktualisiere sessionStorage
                        }
                        imgContainer.remove(); // Bild aus der Vorschau entfernen
                    });
    
                    imgContainer.appendChild(img);
                    imgContainer.appendChild(removeButton);
                    imagePreview.appendChild(imgContainer);
                    
                    // Speichere das Bild im sessionStorage
                    uploadedImages.push(e.target.result); // Füge das Bild zum Array hinzu
                    sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages)); // Speichere das Array
                };
                reader.readAsDataURL(file);
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
    

function loadImageFromSessionStorage() {
    const savedImageSrc = sessionStorage.getItem('uploadedImage');
    if (savedImageSrc) {
        const imgContainer = document.createElement('div');
        const img = document.createElement('img');
        img.src = savedImageSrc;
        
        // Erstelle ein "X"-Element
        const removeButton = document.createElement('span');
        removeButton.innerText = 'X';
        removeButton.style.cursor = 'pointer';
        removeButton.style.marginLeft = '10px';
        removeButton.style.color = 'red'; // Farbe des "X"
        
        // Füge Event Listener zum Entfernen des Bildes hinzu
        removeButton.addEventListener('click', () => {
            sessionStorage.removeItem('uploadedImage');
            imgContainer.remove(); // Bild aus der Vorschau entfernen
        });

        imgContainer.appendChild(img);
        imgContainer.appendChild(removeButton);
        document.getElementById('imagePreview').appendChild(imgContainer);
    }
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
            const placeDescription = document.getElementById('description').value;
            const placeCategory = document.getElementById('category').value;
            
        
            // Daten in localStorage speichern
            sessionStorage.setItem('placeName', placeName);
            sessionStorage.setItem('latitude', placeCoordinatesB);
            sessionStorage.setItem('longitude', placeCoordinatesL);
            sessionStorage.setItem('placeDescription', placeDescription);
            sessionStorage.setItem('placeCategory', placeCategory);
            
        
            // Weiterleitung
            window.location.href = './finish.html';
      
        

        window.location.href = './finish.html'; 

    }

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
