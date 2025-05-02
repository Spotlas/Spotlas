<?php
// Turn off error display
error_reporting(0);
ini_set('display_errors', 0);
ob_start();

// Start session
session_start();

require './mariaDB.php';

// Set headers
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Initialize response
$response = ["code" => 400, "message" => "Invalid request"];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!empty($data["username"]) && !empty($data["password"])) {
        // Trim inputs
        $username = trim($data["username"]);
        $password = trim($data["password"]);

        // Prepare and execute SELECT
        $stmt = $conn->prepare("
            SELECT *
            FROM Users 
            WHERE username = ?
            LIMIT 1
        ");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $result->num_rows === 1) {
            $user = $result->fetch_assoc();

            // Verify password
            if (password_verify($password, $user["password_hash"])) {
                // Store user data in session
                $_SESSION['user_id'] = $user["id"];
                $_SESSION['username'] = $user["username"];
                $_SESSION['full_name'] = $user["full_name"];
                $_SESSION['creation_date'] = $user["creation_date"];
                $_SESSION['profile_picture_url'] = $user["profile_picture_url"] ?? null;

                // Update last login time
                $update = $conn->prepare("UPDATE Users SET last_login = NOW() WHERE id = ?");
                $update->bind_param("i", $user["id"]);
                $update->execute();
                $update->close();

                $response = [
                    "code"      => 200,
                    "message"   => "Login successful",
                    "user_id"   => $user["id"],
                    "username"  => $user["username"],
                    "full_name" => $user["full_name"]
                ];
            } else {
                $response = [
                    "code"    => 401,
                    "message" => "Invalid username or password"
                ];
            }
        } else {
            $response = [
                "code"    => 401,
                "message" => "Invalid username or password"
            ];
        }

        $stmt->close();
    } else {
        $response = [
            "code"    => 400,
            "message" => "Username and password are required"
        ];
    }
}

// Clean any buffered output
ob_end_clean();

// Send JSON response
echo json_encode($response);
exit;
