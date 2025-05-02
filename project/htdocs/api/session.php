<?php
if (session_status() === PHP_SESSION_NONE) {
    // Start the session if it hasn't been started
    session_start();
}

// Handle session-related requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'get_user') {
        // Return current session user information
        header('Content-Type: application/json');

        if (isset($_SESSION['user_id'])) {
            echo json_encode([
                'code' => 200,
                'logged_in' => true,
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'username' => $_SESSION['username'],
                    'full_name' => $_SESSION['full_name'],
                    'creation_date' => $_SESSION['creation_date'],
                    'profile_picture_url' => $_SESSION['profile_picture_url'],
                    'email' => $_SESSION['email'],
                    'description' => $_SESSION['description'] ?? '',
                    'gende' => $_SESSION['password_hash'] ?? ''
                ]
            ]);
        } else {
            echo json_encode([
                'code' => 401,
                'logged_in' => false,
                'message' => 'Not logged in'
            ]);
        }
        exit;
    }
}

// Handle logout request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['action']) && $_GET['action'] === 'logout') {
        // Clear all session data
        $_SESSION = [];

        // If it's desired to kill the session, also delete the session cookie
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params["path"],
                $params["domain"],
                $params["secure"],
                $params["httponly"]
            );
        }

        // Finally, destroy the session
        session_destroy();

        header('Content-Type: application/json');
        echo json_encode([
            'code' => 200,
            'message' => 'Logged out successfully'
        ]);
        exit;
    }
}

// Function to check if user is logged in
function is_logged_in()
{
    return isset($_SESSION['user_id']);
}

// Function to require login (redirect if not logged in)
function require_login($redirect = false)
{
    if (!is_logged_in()) {
        if ($redirect) {
            // Get the current URL
            $current_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

            // Redirect to login with the current URL as a parameter
            header("Location: /pages/login_register/login.html?redirect=" . urlencode($current_url));
            exit;
        }
        return false;
    }
    return true;
}
