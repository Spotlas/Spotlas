function getLogin() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'grid';
    document.getElementById('registerPage2').style.display = 'none';
}

function getRegister() {
    document.getElementById('register').style.display = 'grid';
    document.getElementById('login').style.display = 'none';
}

// Global variable to store user ID between registration stages
let registeredUserId = null;

function getRegisterPage2() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('registerPage2').style.display = 'grid';
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('login_username').value;
    const password = document.getElementById('login_password').value;

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
            alert('Login successful');
            window.location.href = '../../index.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        alert('Error during login. Please try again later.');
    });
}

function register(event) {
    event.preventDefault();
    const email = document.getElementById('register_email').value;
    const password = document.getElementById('register_password').value;
    const password_repeat = document.getElementById('register_password_repeat').value;

    if (password !== password_repeat) {
        alert('Passwords do not match');
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
            alert('Initial registration successful. Please complete your profile.');
            registeredUserId = data.user_id;
            getRegisterPage2();
        } else {
            alert(data.message || 'Unknown error occurred');
        }
    })
    .catch(error => {
        alert('Error during registration. Please try again later.');
    });
}

function registerPage2(event) {
    event.preventDefault();
    
    if (!registeredUserId) {
        alert('Registration error: User ID not found. Please start over.');
        getLogin();
        return;
    }
    
    const firstname = document.getElementById('register_firstname').value;
    const lastname = document.getElementById('register_lastname').value;
    const phone = document.getElementById('register_phone').value;
    const username = document.getElementById('register_username').value;
    const birthday = document.getElementById('register_birthday').value;
    
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
            alert('Registration completed successfully!');
            window.location.href = '../../index.html';
        } else {
            alert(data.message || 'Unknown error occurred');
        }
    })
    .catch(error => {
        alert('Error completing registration. Please try again later.');
    });
}

// Add event listener for the first form
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registerForm').addEventListener('submit', register);
});