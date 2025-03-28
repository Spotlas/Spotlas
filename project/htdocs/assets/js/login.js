// Helper function to display messages
function showMessage(containerId, message, type) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Message container with ID '${containerId}' not found`);
        alert(message); // Fallback to alert if container doesn't exist
        return;
    }
    
    // Keep messages concise
    if (message.length > 60) {
        message = message.substring(0, 57) + '...';
    }
    
    // Reset animation by removing and re-adding the class
    container.className = 'message-container';
    
    // Force browser to recognize the change
    void container.offsetWidth;
    
    container.textContent = message;
    container.className = 'message-container ' + type;
    
    // Automatically clear success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(-5px)';
            
            setTimeout(() => {
                container.textContent = '';
                container.className = 'message-container';
                container.style.opacity = '';
                container.style.transform = '';
            }, 300);
        }, 3000);
    }
}

// Clear all message containers
function clearMessages() {
    document.querySelectorAll('.message-container').forEach(container => {
        container.textContent = '';
        container.className = 'message-container';
    });
}

function getLogin() {
    clearMessages();
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'grid';
    document.getElementById('registerPage2').style.display = 'none';
}

function getRegister() {
    clearMessages();
    document.getElementById('register').style.display = 'grid';
    document.getElementById('login').style.display = 'none';
}

// Global variable to store user ID between registration stages
let registeredUserId = null;

function getRegisterPage2() {
    clearMessages();
    document.getElementById('register').style.display = 'none';
    document.getElementById('registerPage2').style.display = 'grid';
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('login_username').value;
    const password = document.getElementById('login_password').value;
    const button = event.target.querySelector('button');
    
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;

    fetch('../../api/login_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.code === 200) {
            showMessage('login-message', 'Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 1000);
        } else {
            showMessage('login-message', data.message, 'error');
        }
    })
    .catch(error => {
        showMessage('login-message', 'Error during login. Please try again later.', 'error');
    })
    .finally(() => {
        // Remove loading state
        button.classList.remove('loading');
        button.disabled = false;
    });
}

function register(event) {
    event.preventDefault();
    const email = document.getElementById('register_email').value;
    const password = document.getElementById('register_password').value;
    const password_repeat = document.getElementById('register_password_repeat').value;
    const button = event.target.querySelector('button');
    
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;

    if (password !== password_repeat) {
        showMessage('register-message', 'Passwords do not match', 'error');
        button.classList.remove('loading');
        button.disabled = false;
        return;
    }
    
    fetch('../../api/create_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            showMessage('register-message', 'Initial registration successful! Please complete your profile.', 'success');
            registeredUserId = data.user_id;
            setTimeout(() => {
                getRegisterPage2();
            }, 1000);
        } else {
            showMessage('register-message', data.message || 'Unknown error occurred', 'error');
        }
    })
    .catch(error => {
        showMessage('register-message', 'Error during registration. Please try again later.', 'error');
    })
    .finally(() => {
        // Remove loading state
        button.classList.remove('loading');
        button.disabled = false;
    });
}

function registerPage2(event) {
    event.preventDefault();
    
    if (!registeredUserId) {
        showMessage('register2-message', 'Registration error: User ID not found. Please start over.', 'error');
        setTimeout(() => {
            getLogin();
        }, 2000);
        return;
    }
    
    const firstname = document.getElementById('register_firstname').value;
    const lastname = document.getElementById('register_lastname').value;
    const phone = document.getElementById('register_phone').value;
    const username = document.getElementById('register_username').value;
    const birthday = document.getElementById('register_birthday').value;
    const button = event.target.querySelector('button');
    
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;
    
    fetch('../../api/create_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_id: registeredUserId,
            firstname, 
            lastname, 
            phone, 
            username, 
            birthday,
            description: "" 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            showMessage('register2-message', 'Registration completed successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 1500);
        } else {
            showMessage('register2-message', data.message || 'Unknown error occurred', 'error');
        }
    })
    .catch(error => {
        showMessage('register2-message', 'Error completing registration. Please try again later.', 'error');
    })
    .finally(() => {
        // Remove loading state
        button.classList.remove('loading');
        button.disabled = false;
    });
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registerForm').addEventListener('submit', register);
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('registerPage2Form').addEventListener('submit', registerPage2);
});