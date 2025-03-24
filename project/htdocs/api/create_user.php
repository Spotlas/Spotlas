<?php
// Turn off error display
error_reporting(0);
ini_set('display_errors', 0);
ob_start();

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
    if (isset($data["email"]) && isset($data["password"])) {
        $email = $conn->real_escape_string(trim($data["email"]));
        $password = password_hash(trim($data["password"]), PASSWORD_BCRYPT);
        $temp_username = explode('@', $email)[0] . '_' . rand(1000, 9999);
        $temp_full_name = "New User";
        
        // Check username
        $check_stmt = $conn->prepare("SELECT id FROM Users WHERE username = ?");
        $check_stmt->bind_param("s", $temp_username);
        $check_stmt->execute();
        $check_stmt->store_result();
        
        if ($check_stmt->num_rows > 0) {
            $response["code"] = 409;
            $response["message"] = "Generated username already exists, please try again";
        } else {
            // Create user
            $stmt = $conn->prepare("INSERT INTO Users (username, password_hash, email, full_name, profile_picture_url, description) 
                   VALUES (?, ?, ?, ?, 'default.jpg', '')");
            $stmt->bind_param("ssss", $temp_username, $password, $email, $temp_full_name);
            
            if ($stmt->execute()) {
                $response["code"] = 200;
                $response["message"] = "User created successfully, please complete your profile";
                $response["user_id"] = $stmt->insert_id;
                $response["temp_username"] = $temp_username;
            } else {
                $response["code"] = 500;
                $response["message"] = "Could not create user. Please try again.";
            }
            $stmt->close();
        }
        $check_stmt->close();
    } 
    // Stage 2: Update user profile
    elseif (isset($data["user_id"]) && isset($data["username"])) {
        $user_id = $conn->real_escape_string(trim($data["user_id"]));
        $username = $conn->real_escape_string(trim($data["username"]));
        $full_name = $conn->real_escape_string(trim($data["firstname"] . " " . $data["lastname"]));
        $phone_number = $conn->real_escape_string(trim($data["phone"]));
        $profile_picture = isset($data["profile_picture"]) ? $conn->real_escape_string(trim($data["profile_picture"])) : "default.jpg";
        $description = isset($data["description"]) ? $conn->real_escape_string(trim($data["description"])) : "";
        
        // Check if username exists
        $check_stmt = $conn->prepare("SELECT id FROM Users WHERE username = ? AND id != ?");
        $check_stmt->bind_param("si", $username, $user_id);
        $check_stmt->execute();
        $check_stmt->store_result();
        
        if ($check_stmt->num_rows > 0) {
            $response["code"] = 409;
            $response["message"] = "Username already exists";
        } else {
            // Update user
            $stmt = $conn->prepare("UPDATE Users SET full_name = ?, username = ?, profile_picture_url = ?, phone_number = ?, description = ? WHERE id = ?");
            $stmt->bind_param("sssssi", $full_name, $username, $profile_picture, $phone_number, $description, $user_id);
            
            if ($stmt->execute()) {
                $response["code"] = 200;
                $response["message"] = "User profile updated successfully";
                $response["username"] = $username;
            } else {
                $response["code"] = 500;
                $response["message"] = "Could not update profile. Please try again.";
            }
            $stmt->close();
        }
        $check_stmt->close();
    } else {
        $response["message"] = "Missing required fields";
    }
}

// Clean output and send response
ob_end_clean();
echo json_encode($response);
exit;
?>
