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

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Initialize response
$response = ["code" => 400, "message" => "Invalid request"];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($data["username"]) && isset($data["password"])) {
        $username = $conn->real_escape_string(trim($data["username"]));
        
        // Get user data
        $stmt = $conn->prepare("SELECT id, username, password_hash, full_name FROM Users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Verify password
            if (password_verify(trim($data["password"]), $user["password_hash"])) {
                $response["code"] = 200;
                $response["message"] = "Login successful";
                $response["user_id"] = $user["id"];
                $response["username"] = $user["username"];
                $response["full_name"] = $user["full_name"];
            } else {
                $response["code"] = 401;
                $response["message"] = "Invalid username or password";
            }
        } else {
            $response["code"] = 401;
            $response["message"] = "Invalid username or password";
        }
        
        $stmt->close();
    } else {
        $response["message"] = "Username and password are required";
    }
}

// Clean any buffered output
ob_end_clean();

// Send JSON response
echo json_encode($response);
exit;
?>
