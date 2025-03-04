function getLogin() {
    document.getElementById('register').style.display = 'none';
    document.getElementById('login').style.display = 'grid';
}

function getRegister() {
    document.getElementById('register').style.display = 'grid';
    document.getElementById('login').style.display = 'none';
}

function register() {
    document.getElementById('registerPage2').style.display = 'grid';
    document.getElementById('register').style.display = 'none';
}

function registerPage2() {
    window.location.href = '../../index.html';
}