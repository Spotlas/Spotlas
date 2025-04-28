// Function to handle photo upload
function handlePhotoUpload() {
    const photoPreview = document.querySelector('.photo-preview');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.classList.add('uploaded-photo');
                
                // Clear placeholder
                photoPreview.innerHTML = '';
                photoPreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    };
    
    fileInput.click();
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Photo upload
    const photoPreview = document.querySelector('.photo-preview');
    if (photoPreview) {
        photoPreview.addEventListener('click', handlePhotoUpload);
    }
    
    // You can add more initialization code here
});

// Back button function (already in your global.js)
function backHome() {
    window.location.href = '../../index.html';
}