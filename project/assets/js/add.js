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

// Funktion zum Aktualisieren des Fortschritts
function updateProgress(action) {
    if (action === 'more' && progress < 100) {
        progress += step;
        slide = 2;
    } else if (action === 'back' && progress > 0) {
        progress -= step;
        slide = 1;
    }

    if(slide === 1) {   
        section1.style.display = 'block';
        section2.style.display = 'none';
    }else if(slide === 2) {
        section1.style.display = 'none';
        section2.style.display = 'block';
    }

    // Animation und Textaktualisierung
    progressBar.style.height = `${progress}%`;
    progressBar.innerText = `${progress}%`;

    // Text aktualisieren (z.B. 1/2, 2/2, etc.)
    progressText.innerText = `${(progress / 50)} / 2`;  // Dies zeigt 1/2, 2/2 etc. basierend auf Fortschritt
}
