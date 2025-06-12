// Back to profile function
function backToProfile() {
    window.location.href = '../profile/profile.html';
}

let currentLocationId = null;
let currentUser = null;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Edit pictures page loaded');
    
    // Get location ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentLocationId = urlParams.get('id');
    
    console.log('Location ID from URL:', currentLocationId);
    
    if (!currentLocationId) {
        showError('Keine Location-ID gefunden');
        return;
    }
    
    // Check if user is logged in
    currentUser = await getCurrentUser();
    console.log('Current user:', currentUser);
    
    if (!currentUser) {
        console.log('No user found, redirecting to login');
        window.location.href = '../login_register/login.html';
        return;
    }
    
    // Load location data
    await loadLocationData();
    
    // Setup form submission
    const form = document.getElementById('editLocationForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

async function getCurrentUser() {
    try {
        const response = await fetch('../../api/session.php?action=get_user');
        const data = await response.json();
        console.log('Session response:', data);
        return data.logged_in ? data.user : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

async function loadLocationData() {
    try {
        console.log('Loading location data for ID:', currentLocationId);
        showLoading(true);
        
        const response = await fetch(`../../api/edit_location.php?id=${currentLocationId}`);
        console.log('Location fetch response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Location data:', data);
        
        if (data.code === 200 && data.location) {
            populateForm(data.location);
            
            // Check if user owns this location
            if (data.location.created_by != currentUser.id) {
                showError('Sie haben keine Berechtigung, diese Location zu bearbeiten');
                document.getElementById('editLocationForm').style.display = 'none';
                return;
            }
            
            // Show the form
            document.getElementById('editLocationForm').style.display = 'block';
            document.getElementById('loading-message').style.display = 'none';
        } else {
            showError(data.message || 'Location nicht gefunden');
        }
    } catch (error) {
        console.error('Error loading location:', error);
        showError('Fehler beim Laden der Location-Daten: ' + error.message);
    } finally {
        showLoading(false);
    }
}

function populateForm(location) {
    console.log('Populating form with:', location);
    
    document.getElementById('locationName').value = location.name || '';
    document.getElementById('locationDescription').value = location.description || '';
    document.getElementById('locationAddress').value = location.address || '';
    document.getElementById('locationLatitude').value = location.latitude || '';
    document.getElementById('locationLongitude').value = location.longitude || '';
    document.getElementById('locationCategory').value = location.category_id || '';
    document.getElementById('locationPriceRange').value = location.price_range || '';
    document.getElementById('locationOpeningHours').value = location.opening_hours || '';
    document.getElementById('locationSeason').value = location.season || '';
    document.getElementById('locationWebsite').value = location.website_url || '';
    document.getElementById('locationFeatures').value = location.special_features || '';
}

async function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    const formData = new FormData(event.target);
    const locationData = Object.fromEntries(formData.entries());
    
    // Format website URL if provided
    if (locationData.website_url && locationData.website_url.trim()) {
        const website = locationData.website_url.trim();
        // Add https:// if no protocol is specified
        if (!website.startsWith('http://') && !website.startsWith('https://')) {
            locationData.website_url = 'https://' + website;
        }
    }
    
    console.log('Form data:', locationData);
    
    try {
        showLoading(true);
        
        const response = await fetch('../../api/edit_location.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: currentLocationId,
                ...locationData
            })
        });
        
        const data = await response.json();
        console.log('Update response:', data);
        
        if (data.code === 200) {
            showSuccess('Location erfolgreich aktualisiert!');
            setTimeout(() => {
                goBack();
            }, 1500);
        } else {
            showError(data.message || 'Fehler beim Speichern');
        }
    } catch (error) {
        console.error('Error updating location:', error);
        showError('Fehler beim Speichern der Änderungen');
    } finally {
        showLoading(false);
    }
}

async function deleteLocation() {
    if (!confirm('Sind Sie sicher, dass Sie diese Location löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')) {
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch('../../api/edit_location.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: currentLocationId
            })
        });
        
        const data = await response.json();
        
        if (data.code === 200) {
            showSuccess('Location erfolgreich gelöscht!');
            setTimeout(() => {
                goBack();
            }, 1500);
        } else {
            showError(data.message || 'Fehler beim Löschen');
        }
    } catch (error) {
        console.error('Error deleting location:', error);
        showError('Fehler beim Löschen der Location');
    } finally {
        showLoading(false);
    }
}

function goBack() {
    window.history.back();
}

function showLoading(loading) {
    const form = document.getElementById('editLocationForm');
    const loadingMsg = document.getElementById('loading-message');
    
    if (loading) {
        if (form) form.classList.add('loading');
        if (loadingMsg) loadingMsg.style.display = 'block';
    } else {
        if (form) form.classList.remove('loading');
        if (loadingMsg) loadingMsg.style.display = 'none';
    }
}

function showSuccess(message) {
    removeMessages();
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.querySelector('.edit-form');
    if (form) {
        form.prepend(successDiv);
    }
}

function showError(message) {
    removeMessages();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.querySelector('.edit-form') || document.querySelector('.container');
    if (form) {
        form.prepend(errorDiv);
    }
    
    // Also hide loading message
    const loadingMsg = document.getElementById('loading-message');
    if (loadingMsg) loadingMsg.style.display = 'none';
}

function removeMessages() {
    const existing = document.querySelectorAll('.success-message, .error-message');
    existing.forEach(el => el.remove());
}