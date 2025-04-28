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

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Initialize response
$response = ["code" => 400, "message" => "Invalid request"];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Stage 1: Create basic user
    if (isset($data["email"], $data["password"])) {
        $email           = trim($data["email"]);
        $password_hash   = password_hash(trim($data["password"]), PASSWORD_BCRYPT);
        $temp_username   = explode('@', $email)[0] . '_' . rand(1000, 9999);
        $temp_full_name  = "New User";
        $default_pic     = 'default.jpg';
        $default_desc    = '';

        // Check if email already exists
        $stmtEmail = $conn->prepare("SELECT id FROM Users WHERE email = ?");
        $stmtEmail->bind_param("s", $email);
        $stmtEmail->execute();
        $stmtEmail->store_result();

        if ($stmtEmail->num_rows > 0) {
            $response["code"]    = 409;
            $response["message"] = "Email address already in use";
        } else {
            // Check if generated username already exists
            $stmtCheck = $conn->prepare("SELECT id FROM Users WHERE username = ?");
            $stmtCheck->bind_param("s", $temp_username);
            $stmtCheck->execute();
            $stmtCheck->store_result();

            if ($stmtCheck->num_rows > 0) {
                $response["code"]    = 409;
                $response["message"] = "Generated username already exists, please try again";
            } else {
                // Insert new user
                $stmtIns = $conn->prepare("
                    INSERT INTO Users 
                      (username, password_hash, email, full_name, profile_picture_url, description)
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                $stmtIns->bind_param(
                    "ssssss",
                    $temp_username,
                    $password_hash,
                    $email,
                    $temp_full_name,
                    $default_pic,
                    $default_desc
                );

                if ($stmtIns->execute()) {
                    $userId = $stmtIns->insert_id;
                    
                    $response = [
                        "code"         => 200,
                        "message"      => "User created successfully, please complete your profile",
                        "user_id"      => $userId,
                        "temp_username"=> $temp_username
                    ];
                } else {
                    $response = [
                        "code"    => 500,
                        "message" => "Could not create user. Please try again."
                    ];
                }
                $stmtIns->close();
            }
            $stmtCheck->close();
        }
        $stmtEmail->close();
    }
    // Stage 2: Update user profile
    elseif (isset($data["user_id"], $data["username"])) {
        $user_id        = intval(trim($data["user_id"]));
        $username       = trim($data["username"]);
        $full_name      = trim(($data["firstname"] ?? '') . ' ' . ($data["lastname"] ?? ''));
        $phone_number   = trim($data["phone"] ?? '');
        $profile_pic    = isset($data["profile_picture"]) ? trim($data["profile_picture"]) : 'default.jpg';
        $description    = trim($data["description"] ?? '');

        // Check if username already taken by another user
        $stmtCheck = $conn->prepare("
            SELECT id FROM Users 
            WHERE username = ? AND id != ?
        ");
        $stmtCheck->bind_param("si", $username, $user_id);
        $stmtCheck->execute();
        $stmtCheck->store_result();

        if ($stmtCheck->num_rows > 0) {
            $response = [
                "code"    => 409,
                "message" => "Username already exists"
            ];
        } else {
            // Update user record
            $stmtUpd = $conn->prepare("
                UPDATE Users SET
                  full_name         = ?,
                  username          = ?,
                  profile_picture_url = ?,
                  phone_number      = ?,
                  description       = ?
                WHERE id = ?
            ");
            $stmtUpd->bind_param(
                "sssssi",
                $full_name,
                $username,
                $profile_pic,
                $phone_number,
                $description,
                $user_id
            );

            if ($stmtUpd->execute()) {
                // Set session after profile completion
                $_SESSION['user_id'] = $user_id;
                $_SESSION['username'] = $username;
                $_SESSION['full_name'] = $full_name;
                
                $response = [
                    "code"     => 200,
                    "message"  => "User profile updated successfully",
                    "username" => $username
                ];
            } else {
                $response = [
                    "code"    => 500,
                    "message" => "Could not update profile. Please try again."
                ];
            }
            $stmtUpd->close();
        }
        $stmtCheck->close();
    }
    else {
        $response["message"] = "Missing required fields";
    }
}

// Clean output and send response
ob_end_clean();
echo json_encode($response);
exit;
?>
