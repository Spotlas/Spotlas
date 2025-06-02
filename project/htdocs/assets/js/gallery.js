/**
 * gallery.js - Funktionen für die Bildanzeige
 * Kompatibel mit der Debug-Version und dem normalen Betrieb
 */

// Bilder für eine Location anzeigen
function displayLocationImages(locationId, selector) {
    // Kann sowohl ein Selector-String oder ein Element sein
    const container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!container) {
        console.error('Container nicht gefunden:', selector);
        return;
    }

    // Lade-Animation anzeigen
    container.innerHTML = '<div class="loading">Bilder werden geladen...</div>';

    // Pfadanpassung je nach aktueller Seite
    const basePath = window.location.pathname.includes('/pages/') ? '../..' : '.';
    
    fetch(`${basePath}/api/images.php?location_id=${locationId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Netzwerkfehler: ' + response.status);
            }
            return response.text();
        })
        .then(text => {
            try {
                const data = JSON.parse(text);
                console.log('API Antwort für Location ' + locationId + ':', data);
                
                if (data.code === 200) {
                    if (data.images && data.images.length > 0) {
                        // Container leeren
                        container.innerHTML = '';
                        
                        // Hauptbild
                        const mainImage = document.createElement('div');
                        mainImage.className = 'main-image';
                        
                        const img = document.createElement('img');
                        img.src = `${basePath}/${data.images[0].image_url}`;
                        img.alt = data.images[0].description || 'Bild';
                        img.id = `main-image-${locationId}`;
                        
                        mainImage.appendChild(img);
                        container.appendChild(mainImage);
                        
                        // Thumbnails nur anzeigen, wenn mehr als ein Bild vorhanden
                        if (data.images.length > 1) {
                            const thumbsContainer = document.createElement('div');
                            thumbsContainer.className = 'thumbnails';
                            
                            data.images.forEach((image, index) => {
                                const thumb = document.createElement('div');
                                thumb.className = 'thumbnail' + (index === 0 ? ' active' : '');
                                
                                const thumbImg = document.createElement('img');
                                thumbImg.src = `${basePath}/${image.image_url}`;
                                thumbImg.alt = image.description || `Bild ${index + 1}`;
                                
                                thumb.appendChild(thumbImg);
                                thumbsContainer.appendChild(thumb);
                                
                                // Beim Klick auf ein Thumbnail das Hauptbild wechseln
                                thumb.addEventListener('click', () => {
                                    // Hauptbild wechseln
                                    document.getElementById(`main-image-${locationId}`).src = `${basePath}/${image.image_url}`;
                                    
                                    // Aktiven Thumbnail markieren
                                    thumbsContainer.querySelectorAll('.thumbnail').forEach(t => {
                                        t.classList.remove('active');
                                    });
                                    thumb.classList.add('active');
                                });
                            });
                            
                            container.appendChild(thumbsContainer);
                        }
                    } else {
                        container.innerHTML = '<div class="no-images">Keine Bilder gefunden</div>';
                    }
                } else {
                    container.innerHTML = `<div class="error">${data.message || 'Fehler beim Abrufen der Bilder'}</div>`;
                }
            } catch (e) {
                console.error('JSON Parse Error:', e, 'Response:', text);
                container.innerHTML = '<div class="error">Fehler bei der Verarbeitung der Antwort</div>';
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            container.innerHTML = `<div class="error">Netzwerkfehler: ${error.message}</div>`;
        });
}

// Hauptfunktion, die auf allen Seiten aufgerufen wird, um die Bilder anzuzeigen
function setupGalleries() {
    console.log('setupGalleries wird ausgeführt');
    
    // Auf der Startseite: Suche alle Location-Karten
    const locationCards = document.querySelectorAll('.location-card');
    if (locationCards.length > 0) {
        console.log(`${locationCards.length} Location-Karten gefunden`);
        locationCards.forEach(card => {
            const locationId = card.getAttribute('data-id');
            if (locationId) {
                // "Bilder anzeigen" Button hinzufügen
                const buttonContainer = card.querySelector('.card-actions') || card;
                
                // Prüfen, ob bereits ein Button existiert
                if (!card.querySelector('.show-images-btn')) {
                    const imageButton = document.createElement('button');
                    imageButton.textContent = 'Bilder anzeigen';
                    imageButton.className = 'show-images-btn';
                    
                    imageButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // Container für Bilder erstellen oder holen
                        let imagesContainer = card.querySelector('.location-images');
                        if (!imagesContainer) {
                            imagesContainer = document.createElement('div');
                            imagesContainer.className = 'location-images';
                            card.appendChild(imagesContainer);
                        }
                        
                        // Toggle Sichtbarkeit
                        if (imagesContainer.style.display === 'none' || imagesContainer.style.display === '') {
                            imagesContainer.style.display = 'block';
                            imageButton.textContent = 'Bilder ausblenden';
                            
                            // Nur laden, wenn noch keine Bilder geladen wurden
                            if (imagesContainer.children.length === 0) {
                                displayLocationImages(locationId, imagesContainer);
                            }
                        } else {
                            imagesContainer.style.display = 'none';
                            imageButton.textContent = 'Bilder anzeigen';
                        }
                    });
                    
                    buttonContainer.appendChild(imageButton);
                }
            }
        });
    }
    
    // Auf der Detailseite: Bilder direkt anzeigen
    const urlParams = new URLSearchParams(window.location.search);
    const locationId = urlParams.get('id');
    const locationDetailContainer = document.getElementById('location-detail-container');
    
    if (locationId && locationDetailContainer) {
        console.log('Location-Details für ID ' + locationId + ' laden');
        
        // Container für Bilder finden oder erstellen
        let imagesContainer = document.getElementById('location-images');
        if (!imagesContainer) {
            imagesContainer = document.createElement('div');
            imagesContainer.id = 'location-images';
            imagesContainer.className = 'location-images';
            locationDetailContainer.insertBefore(imagesContainer, locationDetailContainer.firstChild);
        }
        
        displayLocationImages(locationId, imagesContainer);
    }
}

// Debug-Funktionen für die Test-Seite
function testImagesApi() {
    const locationId = document.getElementById('location-id')?.value || 1;
    const resultArea = document.getElementById('result');
    
    if (!resultArea) return;
    
    resultArea.textContent = "Anfrage wird gesendet...";
    
    fetch(`./api/images.php?location_id=${locationId}`)
        .then(response => response.text())
        .then(text => {
            resultArea.textContent = text;
            console.log('Raw API Response:', text);
            
            try {
                const json = JSON.parse(text);
                console.log('Parsed JSON:', json);
            } catch (e) {
                console.error('Invalid JSON Response:', e);
            }
        })
        .catch(error => {
            resultArea.textContent = `Fehler: ${error.message}`;
            console.error('API Test Error:', error);
        });
}

// Zum Testen der Galerie im Debug-Modus
function testGallery() {
    const locationId = document.getElementById('gallery-location-id')?.value || 1;
    const container = document.getElementById('test-gallery');
    
    if (!container) return;
    
    container.innerHTML = '<div class="gallery-container"></div>';
    displayLocationImages(locationId, container.querySelector('.gallery-container'));
}

// Initialisiert die Galeriefunktionalität, wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Prüfen, ob wir auf der Debug-Seite sind
    if (document.getElementById('location-id') && document.getElementById('gallery-location-id')) {
        console.log('Debug-Seite für Bildergalerie geladen');
    } else {
        // Für normale Seiten: Galerien einrichten
        setupGalleries();
    }
});
