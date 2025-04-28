<?php
// Start session if not already started
session_start();

// Set content type to JSON
header('Content-Type: application/json');

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'status' => 'success',
        'logged_in' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'] ?? '',
            'full_name' => $_SESSION['full_name'] ?? ''
        ]
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'logged_in' => false,
        'message' => 'Not logged in'
    ]);
}
?>
