<?php
require_once './session.php';

// This endpoint is used to check if a user can access protected pages
header('Content-Type: application/json');

if (is_logged_in()) {
    echo json_encode([
        'code' => 200,
        'authenticated' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'full_name' => $_SESSION['full_name']
        ]
    ]);
} else {
    echo json_encode([
        'code' => 401,
        'authenticated' => false,
        'message' => 'Authentication required'
    ]);
}
