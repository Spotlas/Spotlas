/**
 * User Session Management Utility
 * This file contains functions to interact with PHP sessions
 */

// Cache for the current user data
let currentUserCache = null;

// For synchronous operations where we need a default user ID before the async call completes
let currentUserId = null;

// Get the current logged-in user data from PHP session
async function getCurrentUser(forceRefresh = false) {
    if (currentUserCache && !forceRefresh) {
        return currentUserCache;
    }
    
    try {
        const response = await fetch('../../api/session.php?action=get_user');
        const data = await response.json();
        
        if (data.code === 200 && data.logged_in) {
            currentUserCache = data.user;
            currentUserId = data.user.id;
            return data.user;
        } else {
            currentUserCache = null;
            return null;
        }
    } catch (error) {
        console.error('Error fetching session data:', error);
        return null;
    }
}

// Check if user is logged in
async function checkLoginStatus() {
    const user = await getCurrentUser();
    return user !== null;
}

// Get current user ID (async version)
async function getCurrentUserId() {
    // If we already have cached a user ID, return it immediately
    if (currentUserId !== null) {
        return currentUserId;
    }
    
    const user = await getCurrentUser();
    if (user) {
        currentUserId = user.id;
        return user.id;
    }
    return null;
}

// Synchronous version - returns cached ID or fallback
function getCurrentUserIdSync(fallback = 1) {
    return currentUserId !== null ? currentUserId : fallback;
}

// Log out the current user
function logoutUser() {
    fetch('../../api/logout.php')
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                // Clear local cache
                currentUserCache = null;
                currentUserId = null;
                
                // Redirect to login page
                window.location.href = '../../pages/login_register/login.html';
            } else {
                console.error('Logout failed:', data.message);
                alert('Logout failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('Error during logout. Please try again.');
        });
}

// Check authorization for protected pages
async function requireLogin() {
    const isLoggedIn = await checkLoginStatus();
    if (!isLoggedIn) {
        const currentUrl = encodeURIComponent(window.location.href);
        window.location.href = `../../pages/login_register/login.html?redirect=${currentUrl}`;
        return false;
    }
    return true;
}

// Initialize user interface based on login status
async function initUserInterface() {
    const user = await getCurrentUser();
    
    if (user) {
        // Cache the user ID for synchronous access
        currentUserId = user.id;
    }
    
    // Update UI elements that should reflect logged-in state
    const usernameDisplays = document.querySelectorAll('.user-username');
    const userFullNameDisplays = document.querySelectorAll('.user-fullname');
    const loggedInElements = document.querySelectorAll('.logged-in-only');
    const loggedOutElements = document.querySelectorAll('.logged-out-only');
    
    if (user) {
        // User is logged in
        usernameDisplays.forEach(el => el.textContent = user.username);
        userFullNameDisplays.forEach(el => el.textContent = user.full_name);
        
        loggedInElements.forEach(el => el.style.display = '');
        loggedOutElements.forEach(el => el.style.display = 'none');
    } else {
        // User is logged out
        loggedInElements.forEach(el => el.style.display = 'none');
        loggedOutElements.forEach(el => el.style.display = '');
    }
}

// Execute init function when DOM is loaded
document.addEventListener('DOMContentLoaded', initUserInterface);

// Immediate load of user data on script load
(function loadUserData() {
    fetch('../../api/current_user.php')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                currentUserCache = data.user;
                currentUserId = data.user.id;
                console.log('User session loaded:', currentUserCache);
            }
        })
        .catch(error => {
            console.error('Error loading user session:', error);
        });
})();
