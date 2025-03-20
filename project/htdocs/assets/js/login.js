function getLogin() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'grid';
    document.getElementById('registerPage2').style.display = 'none';
}

function getRegister() {
    document.getElementById('register').style.display = 'grid';
    document.getElementById('login').style.display = 'none';
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById('login_username').value;
    const password = document.getElementById('login_password').value;

    fetch('../../db/login_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            alert('Login successful');
            window.location.href = '../../index.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
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

    fetch('../../db/create_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            alert('Registration successful');
            getRegisterPage2();
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function registerPage2(event) {
    event.preventDefault();
    const firstname = document.getElementById('register_firstname').value;
    const lastname = document.getElementById('register_lastname').value;
    const phone = document.getElementById('register_phone').value;
    const username = document.getElementById('register_username').value;
    const birthday = document.getElementById('register_birthday').value;

    fetch('../../db/create_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, phone, username, birthday })
    })
    .then(response => response.json())
    .then(data => {
        if (data.code === 200) {
            alert('Registration completed');
            window.location.href = '../../index.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}