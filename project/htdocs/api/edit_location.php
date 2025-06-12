<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require './mariaDB.php';
session_start();

header('Content-Type: application/json');

$response = [
    "code" => 404,
    "message" => "Invalid request",
    "location" => null
];

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    $response = [
        "code" => 401,
        "message" => "Not authenticated"
    ];
    echo json_encode($response);
    exit;
}

$userId = $_SESSION['user_id'];

// GET: Load location data
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $locationId = intval($_GET['id']);
    
    try {
        $stmt = $conn->prepare("
            SELECT id, name, description, latitude, longitude, created_by, 
                   category_id, address, last_modified, status_id, price_range, 
                   opening_hours, season, accessibility, view_count, favorite_count,
                   website_url, special_features
            FROM Locations 
            WHERE id = ?
        ");
        $stmt->bind_param("i", $locationId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result && $result->num_rows > 0) {
            $location = $result->fetch_assoc();
            
            $response = [
                "code" => 200,
                "location" => $location
            ];
        } else {
            $response = [
                "code" => 404,
                "message" => "Location not found"
            ];
        }
        
        $stmt->close();
    } catch (Exception $e) {
        $response = [
            "code" => 500,
            "message" => "Database error: " . $e->getMessage()
        ];
    }
    
    echo json_encode($response);
    $conn->close();
    exit;
}

// POST: Update location
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        $response = [
            "code" => 400,
            "message" => "Invalid input data"
        ];
        echo json_encode($response);
        exit;
    }
    
    $locationId = intval($input['id']);
    
    try {
        // Check if user owns this location
        $checkStmt = $conn->prepare("SELECT created_by FROM Locations WHERE id = ?");
        $checkStmt->bind_param("i", $locationId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if (!$checkResult || $checkResult->num_rows === 0) {
            $response = [
                "code" => 404,
                "message" => "Location not found"
            ];
            echo json_encode($response);
            exit;
        }
        
        $locationData = $checkResult->fetch_assoc();
        if ($locationData['created_by'] != $userId) {
            $response = [
                "code" => 403,
                "message" => "Permission denied"
            ];
            echo json_encode($response);
            exit;
        }
        
        $checkStmt->close();
        
        // Update location
        $updateStmt = $conn->prepare("
            UPDATE Locations SET 
                name = ?, description = ?, address = ?, category_id = ?,
                price_range = ?, opening_hours = ?, season = ?, 
                website_url = ?, special_features = ?
            WHERE id = ? AND created_by = ?
        ");
        
        $categoryId = !empty($input['category_id']) ? intval($input['category_id']) : null;
        
        $updateStmt->bind_param("sssssssssii",
            $input['name'],
            $input['description'],
            $input['address'],
            $categoryId,
            $input['price_range'],
            $input['opening_hours'],
            $input['season'],
            $input['website_url'],
            $input['special_features'],
            $locationId,
            $userId
        );
        
        if ($updateStmt->execute()) {
            $response = [
                "code" => 200,
                "message" => "Location updated successfully"
            ];
        } else {
            $response = [
                "code" => 500,
                "message" => "Failed to update location"
            ];
        }
        
        $updateStmt->close();
    } catch (Exception $e) {
        $response = [
            "code" => 500,
            "message" => "Database error: " . $e->getMessage()
        ];
    }
    
    echo json_encode($response);
    $conn->close();
    exit;
}

// DELETE: Delete location
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        $response = [
            "code" => 400,
            "message" => "Invalid input data"
        ];
        echo json_encode($response);
        exit;
    }
    
    $locationId = intval($input['id']);
    
    try {
        // Check if user owns this location
        $checkStmt = $conn->prepare("SELECT created_by FROM Locations WHERE id = ?");
        $checkStmt->bind_param("i", $locationId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if (!$checkResult || $checkResult->num_rows === 0) {
            $response = [
                "code" => 404,
                "message" => "Location not found"
            ];
            echo json_encode($response);
            exit;
        }
        
        $locationData = $checkResult->fetch_assoc();
        if ($locationData['created_by'] !== $userId) {
            $response = [
                "code" => 403,
                "message" => "Permission denied"
            ];
            echo json_encode($response);
            exit;
        }
        
        $checkStmt->close();
        
        // Start transaction
        $conn->begin_transaction();
        
        // Delete related data first
        $deleteFavorites = $conn->prepare("DELETE FROM Favorites WHERE location_id = ?");
        $deleteFavorites->bind_param("i", $locationId);
        $deleteFavorites->execute();
        $deleteFavorites->close();
        
        $deleteComments = $conn->prepare("DELETE FROM Comments WHERE location_id = ?");
        $deleteComments->bind_param("i", $locationId);
        $deleteComments->execute();
        $deleteComments->close();
        
        $deleteRatings = $conn->prepare("DELETE FROM Ratings WHERE location_id = ?");
        $deleteRatings->bind_param("i", $locationId);
        $deleteRatings->execute();
        $deleteRatings->close();
        
        // Delete location
        $deleteLocation = $conn->prepare("DELETE FROM Locations WHERE id = ? AND created_by = ?");
        $deleteLocation->bind_param("ii", $locationId, $userId);
        
        if ($deleteLocation->execute()) {
            $conn->commit();
            $response = [
                "code" => 200,
                "message" => "Location deleted successfully"
            ];
        } else {
            $conn->rollback();
            $response = [
                "code" => 500,
                "message" => "Failed to delete location"
            ];
        }
        
        $deleteLocation->close();
    } catch (Exception $e) {
        $conn->rollback();
        $response = [
            "code" => 500,
            "message" => "Database error: " . $e->getMessage()
        ];
    }
    
    echo json_encode($response);
    $conn->close();
    exit;
}

echo json_encode($response);
$conn->close();
?>
