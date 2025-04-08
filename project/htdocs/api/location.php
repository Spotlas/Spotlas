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

            // Durchschnittliches Rating berechnen
            $averageRating = null;
            $sqlAverageRating = "SELECT AVG(rating) AS avg_rating FROM Ratings WHERE location_id = $id";
            $resultAverageRating = $conn->query($sqlAverageRating);
            if ($resultAverageRating && $resultAverageRating->num_rows > 0) {
                $averageRatingRow = $resultAverageRating->fetch_assoc();
                $averageRating = floatval($averageRatingRow['avg_rating']);
            }
            
            $response['code'] = 200;
            $response['data'] = array(
                "location" => $location,
                "comments" => $comments,
                "images" => $images,
                "average_rating" => $averageRating
            );
        }
    }
    // Bewertung hinzufügen oder aktualisieren
    else if ($action == 'rate' && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $user_id = intval($data['user_id']);
        $rating  = intval($data['rating']);

        // Prüfen, ob der Nutzer bereits eine Bewertung für diese Location abgegeben hat
        $sqlCheck = "SELECT * FROM Ratings WHERE location_id = $id AND user_id = $user_id";
        $resultCheck = $conn->query($sqlCheck);

        if ($resultCheck && $resultCheck->num_rows > 0) {
            // Falls es bereits eine Bewertung gibt, update
            $sqlUpdate = "UPDATE Ratings SET rating = $rating WHERE location_id = $id AND user_id = $user_id";
            if ($conn->query($sqlUpdate) === TRUE) {
                $response['code'] = 200;
                $response['data'] = array("message" => "Rating updated successfully");
            } else {
                $response['code'] = 500;
                $response['data'] = array("message" => "Error updating rating: " . $conn->error);
            }
        } else {
            // Falls keine Bewertung existiert, insert
            $sqlInsert = "INSERT INTO Ratings (location_id, user_id, rating) VALUES ($id, $user_id, $rating)";
            if ($conn->query($sqlInsert) === TRUE) {
                $response['code'] = 200;
                $response['data'] = array("message" => "Rating added successfully");
            } else {
                $response['code'] = 500;
                $response['data'] = array("message" => "Error inserting rating: " . $conn->error);
            }
        }
}

    // Location als Favorit markieren
    else if ($action == 'favorite' && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
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

    // Location von Favoriten entfernen
    else if ($action == 'remove_favorite' && $_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        $user_id = intval($data['user_id']);
        
        $sqlRemoveFav = "DELETE FROM Favorites WHERE location_id = $id AND user_id = $user_id";
        if ($conn->query($sqlRemoveFav) === TRUE) {
            $response['code'] = 200;
            $response['data'] = array("message" => "Location removed from favorites");
        } else {
            $response['code'] = 500;
            $response['data'] = array("message" => "Error: " . $conn->error);
        }
    }
    
}

echo json_encode($response);
$conn->close();
?>
