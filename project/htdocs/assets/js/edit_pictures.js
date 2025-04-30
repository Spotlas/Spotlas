// Back to profile function
function backToProfile() {
    window.location.href = '../profile/profile.html';
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Thumbnail click handler
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainPhoto = document.querySelector('.current-photo');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            thumb.classList.add('active');
            
            // Update main photo (even though it's the same image in this case)
            const imgSrc = thumb.getAttribute('data-img');
            mainPhoto.src = `../../assets/images/testPic/${imgSrc}`;
        });
    });
    
    // Form change handler
    const formInputs = document.querySelectorAll('.edit-form input');
    formInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            console.log(`${e.target.id} updated to: ${e.target.value}`);
            // Here you would save the changes
        });
    });
});