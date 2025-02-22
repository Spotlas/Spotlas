<?php
require './mariaDB.php';

header('Content-Type: application/json');

$response = array(
    "code" => 404,
    "data" => null
);

if (isset($_GET['action']) && isset($_GET['id']) && is_numeric($_GET['id'])) {
    $action = $_GET['action'];
    $id = intval($_GET['id']);
    
    // Detaillierte Location-Infos abrufen
    if ($action == 'details' && $_SERVER['REQUEST_METHOD'] == 'GET') {
        $sqlLocation = "SELECT * FROM Locations WHERE id = $id";
        $resultLocation = $conn->query($sqlLocation);
        if ($resultLocation && $resultLocation->num_rows > 0) {
            $location = $resultLocation->fetch_assoc();
            
            // Kommentare zur Location abrufen
            $comments = [];
            $sqlComments = "SELECT * FROM Comments WHERE location_id = $id";
            $resultComments = $conn->query($sqlComments);
            if ($resultComments && $resultComments->num_rows > 0) {
                while ($row = $resultComments->fetch_assoc()) {
                    $comments[] = $row;
                }
            }
            
            // Bilder zur Location abrufen
            $images = [];
            $sqlImages = "SELECT * FROM Images WHERE location_id = $id";
            $resultImages = $conn->query($sqlImages);
            if ($resultImages && $resultImages->num_rows > 0) {
                while ($row = $resultImages->fetch_assoc()) {
                    $images[] = $row;
                }
            }
            
            $response['code'] = 200;
            $response['data'] = array(
                "location" => $location,
                "comments" => $comments,
                "images" => $images
            );
        }
    }
    // Bewertung hinzufügen
    else if ($action == 'rate' && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        // Erwartet: user_id und rating im Request
        $user_id = intval($data['user_id']);
        $rating  = intval($data['rating']);
        $sqlRate = "INSERT INTO Ratings (location_id, user_id, rating) VALUES ($id, $user_id, $rating)";
        if ($conn->query($sqlRate) === TRUE) {
            $response['code'] = 200;
            $response['data'] = array("message" => "Rating added successfully");
        } else {
            $response['code'] = 500;
            $response['data'] = array("message" => "Error: " . $conn->error);
        }
    }
    // Location als Favorit markieren
    else if ($action == 'favorite' && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        // Erwartet: user_id im Request
        $user_id = intval($data['user_id']);
        $sqlFav = "INSERT INTO Favorites (location_id, user_id) VALUES ($id, $user_id)";
        if ($conn->query($sqlFav) === TRUE) {
            $response['code'] = 200;
            $response['data'] = array("message" => "Location added to favorites");
        } else {
            $response['code'] = 500;
            $response['data'] = array("message" => "Error: " . $conn->error);
        }
    }
}

echo json_encode($response);
$conn->close();
?>
