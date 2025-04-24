<?php
// Turn off error display for production
error_reporting(0);
ini_set('display_errors', 0);
ob_start();

require './mariaDB.php';

// Set headers
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Initialize response
$response = ["code" => 400, "message" => "Invalid request"];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data from request body
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Check if all required fields are provided
    if (isset($data["location_id"]) && isset($data["user_id"]) && isset($data["comment_text"])) {
        // Sanitize input data
        $location_id = intval($data["location_id"]);
        $user_id = intval($data["user_id"]);
        $comment_text = $data["comment_text"];
        $status_id = isset($data["status_id"]) ? intval($data["status_id"]) : 1; // Default status: active
        
        // Verify that the location exists
        $location_check = $conn->prepare("SELECT id FROM Locations WHERE id = ?");
        $location_check->bind_param("i", $location_id);
        $location_check->execute();
        $location_result = $location_check->get_result();
        
        // Verify that the user exists
        $user_check = $conn->prepare("SELECT id FROM Users WHERE id = ?");
        $user_check->bind_param("i", $user_id);
        $user_check->execute();
        $user_result = $user_check->get_result();
        
        if ($location_result->num_rows === 0) {
            $response["code"] = 404;
            $response["message"] = "Location not found";
        } 
        elseif ($user_result->num_rows === 0) {
            $response["code"] = 404;
            $response["message"] = "User not found";
        } 
        else {
            // Insert comment into database
            $stmt = $conn->prepare("INSERT INTO Comments (location_id, user_id, comment_text, version, status_id) 
                                    VALUES (?, ?, ?, 1, ?)");
            $stmt->bind_param("iisi", $location_id, $user_id, $comment_text, $status_id);
            
            if ($stmt->execute()) {
                $comment_id = $stmt->insert_id;
                $response["code"] = 201;
                $response["message"] = "Comment added successfully";
                $response["comment_id"] = $comment_id;
                
                // Get the newly created comment with timestamps
                $new_comment = $conn->prepare("SELECT * FROM Comments WHERE id = ?");
                $new_comment->bind_param("i", $comment_id);
                $new_comment->execute();
                $comment_data = $new_comment->get_result()->fetch_assoc();
                
                $response["comment"] = $comment_data;
                $new_comment->close();
            } else {
                $response["code"] = 500;
                $response["message"] = "Failed to add comment";
            }
            
            $stmt->close();
        }
        
        $location_check->close();
        $user_check->close();
    } else {
        $response["code"] = 400;
        $response["message"] = "Missing required fields (location_id, user_id, comment_text)";
    }
}

// Clean any buffered output
ob_end_clean();

// Send JSON response
echo json_encode($response);
$conn->close();
?>
