<?php
header('Content-Type: application/json; charset=utf-8');
require_once("./mariaDB.php");  // Verwende mariaDB.php statt mysql.php für Konsistenz

// Default response
$response = [
    "code" => 404,
    "message" => "Unknown request",
    "images" => []
];

// Get images by location ID
if (isset($_GET['location_id'])) {
    $locationId = intval($_GET['location_id']);
    
    try {
        // Tabellennamen korrigieren: "Images" statt "images"
        $stmt = $conn->prepare("SELECT id, location_id, image_url, description, creation_date, status_id FROM Images WHERE location_id = ? ORDER BY creation_date DESC");
        $stmt->bind_param("i", $locationId);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $images = [];
            
            while ($row = $result->fetch_assoc()) {
                $images[] = [
                    "id" => $row['id'],
                    "location_id" => $row['location_id'],
                    "image_url" => $row['image_url'],
                    "description" => $row['description'],
                    "creation_date" => $row['creation_date'],
                    "status_id" => $row['status_id']
                ];
            }
            
            $response = [
                "code" => 200,
                "message" => count($images) > 0 ? "Images retrieved successfully" : "No images found for this location",
                "images" => $images
            ];
        } else {
            $response["code"] = 500;
            $response["message"] = "Error executing query: " . $stmt->error;
        }
        
        $stmt->close();
    } catch (Exception $e) {
        $response["code"] = 500;
        $response["message"] = "Database error: " . $e->getMessage();
    }
} 
// Get a specific image by ID
else if (isset($_GET['image_id'])) {
    $imageId = intval($_GET['image_id']);
    
    try {
        // Tabellennamen korrigieren: "Images" statt "images"
        $stmt = $conn->prepare("SELECT id, location_id, image_url, description, creation_date, status_id FROM Images WHERE id = ?");
        $stmt->bind_param("i", $imageId);
        
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            
            if ($row = $result->fetch_assoc()) {
                $response = [
                    "code" => 200,
                    "message" => "Image retrieved successfully",
                    "image" => [
                        "id" => $row['id'],
                        "location_id" => $row['location_id'],
                        "image_url" => $row['image_url'],
                        "description" => $row['description'],
                        "creation_date" => $row['creation_date'],
                        "status_id" => $row['status_id']
                    ]
                ];
            } else {
                $response["code"] = 404;
                $response["message"] = "Image not found";
            }
        } else {
            $response["code"] = 500;
            $response["message"] = "Error executing query: " . $stmt->error;
        }
        
        $stmt->close();
    } catch (Exception $e) {
        $response["code"] = 500;
        $response["message"] = "Database error: " . $e->getMessage();
    }
}

// Stellen Sie sicher, dass die Ausgabe ein gültiges JSON ist
echo json_encode($response);
exit;
?>
