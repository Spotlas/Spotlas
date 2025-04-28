<?php
require_once '../../api/session.php';

// Require login or redirect
if (!is_logged_in()) {
    header('Location: ../../pages/login_register/login.html?redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit;
}

// Include the actual HTML page
include 'add.html';
?>
