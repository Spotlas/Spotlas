<?php
require './mariaDB.php';

header('Content-Type: application/json');

$response = ["code" => 404, "data" => null];

if (isset($_GET['action'], $_GET['id']) && is_numeric($_GET['id'])) {
    $action = $_GET['action'];
    $id     = intval($_GET['id']);

    if ($action === 'details' && $_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get user ID if provided
        $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
        
        // Location
        $stmtLoc = $conn->prepare("SELECT * FROM Locations WHERE id = ?");
        $stmtLoc->bind_param("i", $id);
        $stmtLoc->execute();
        $resLoc = $stmtLoc->get_result();
        if ($resLoc->num_rows > 0) {
            $location = $resLoc->fetch_assoc();

            // Kommentare
            $comments = [];
            $stmtCom = $conn->prepare("SELECT * FROM Comments WHERE location_id = ?");
            $stmtCom->bind_param("i", $id);
            $stmtCom->execute();
            $resCom = $stmtCom->get_result();
            while ($row = $resCom->fetch_assoc()) {
                $comments[] = $row;
            }
            $stmtCom->close();

            // Bilder
            $images = [];
            $stmtImg = $conn->prepare("SELECT * FROM Images WHERE location_id = ?");
            $stmtImg->bind_param("i", $id);
            $stmtImg->execute();
            $resImg = $stmtImg->get_result();
            while ($row = $resImg->fetch_assoc()) {
                $images[] = $row;
            }
            $stmtImg->close();

            // Durchschnitts-Rating
            $averageRating = null;
            $stmtAvg = $conn->prepare("SELECT AVG(rating) AS avg_rating FROM Ratings WHERE location_id = ?");
            $stmtAvg->bind_param("i", $id);
            $stmtAvg->execute();
            $resAvg = $stmtAvg->get_result();
            if ($row = $resAvg->fetch_assoc()) {
                $averageRating = floatval($row['avg_rating']);
            }
            $stmtAvg->close();

            // Check if location is favorited by user
            $is_favorite = false;
            if ($user_id !== null) {
                $stmtFav = $conn->prepare("SELECT id FROM Favorites WHERE location_id = ? AND user_id = ?");
                $stmtFav->bind_param("ii", $id, $user_id);
                $stmtFav->execute();
                $resFav = $stmtFav->get_result();
                $is_favorite = $resFav->num_rows > 0;
                $stmtFav->close();
            }

            $response['code'] = 200;
            $response['data'] = [
                "location"       => $location,
                "comments"       => $comments,
                "images"         => $images,
                "average_rating" => $averageRating,
                "is_favorite"    => $is_favorite
            ];
        }
        $stmtLoc->close();
    }
    elseif ($action === 'rate' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $d       = json_decode(file_get_contents('php://input'), true);
        $user_id = intval($d['user_id'] ?? 0);
        $rating  = intval($d['rating']  ?? 0);

        // Check existing
        $stmtChk = $conn->prepare("SELECT id FROM Ratings WHERE location_id = ? AND user_id = ?");
        $stmtChk->bind_param("ii", $id, $user_id);
        $stmtChk->execute();
        $resChk = $stmtChk->get_result();

        if ($resChk->num_rows > 0) {
            // Update
            $stmtUpd = $conn->prepare("UPDATE Ratings SET rating = ? WHERE location_id = ? AND user_id = ?");
            $stmtUpd->bind_param("iii", $rating, $id, $user_id);
            if ($stmtUpd->execute()) {
                $response = ["code" => 200, "data" => ["message" => "Rating updated successfully"]];
            } else {
                $response = ["code" => 500, "data" => ["message" => "Error updating rating: " . $conn->error]];
            }
            $stmtUpd->close();
        } else {
            // Insert
            $stmtIns = $conn->prepare("INSERT INTO Ratings (location_id, user_id, rating) VALUES (?, ?, ?)");
            $stmtIns->bind_param("iii", $id, $user_id, $rating);
            if ($stmtIns->execute()) {
                $response = ["code" => 200, "data" => ["message" => "Rating added successfully"]];
            } else {
                $response = ["code" => 500, "data" => ["message" => "Error inserting rating: " . $conn->error]];
            }
            $stmtIns->close();
        }
        $stmtChk->close();
    }
    elseif ($action === 'favorite' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $d       = json_decode(file_get_contents('php://input'), true);
        $user_id = intval($d['user_id'] ?? 0);

        $stmtFav = $conn->prepare("INSERT INTO Favorites (location_id, user_id) VALUES (?, ?)");
        $stmtFav->bind_param("ii", $id, $user_id);
        if ($stmtFav->execute()) {
            $response = ["code" => 200, "data" => ["message" => "Location added to favorites"]];
        } else {
            $response = ["code" => 500, "data" => ["message" => "Error: " . $conn->error]];
        }
        $stmtFav->close();
    }
    elseif ($action === 'remove_favorite' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $d       = json_decode(file_get_contents('php://input'), true);
        $user_id = intval($d['user_id'] ?? 0);

        $stmtRem = $conn->prepare("DELETE FROM Favorites WHERE location_id = ? AND user_id = ?");
        $stmtRem->bind_param("ii", $id, $user_id);
        if ($stmtRem->execute()) {
            $response = ["code" => 200, "data" => ["message" => "Location removed from favorites"]];
        } else {
            $response = ["code" => 500, "data" => ["message" => "Error: " . $conn->error]];
        }
        $stmtRem->close();
    }
    elseif ($action === 'comment' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $d           = json_decode(file_get_contents('php://input'), true);
        $user_id     = intval($d['user_id'] ?? 0);
        $comment_txt = $d['comment_text'] ?? '';

        $stmtC = $conn->prepare("INSERT INTO Comments (location_id, user_id, comment_text) VALUES (?, ?, ?)");
        $stmtC->bind_param("iis", $id, $user_id, $comment_txt);
        if ($stmtC->execute()) {
            $response = ["code" => 200, "data" => ["message" => "Comment added successfully"]];
        } else {
            $response = ["code" => 500, "data" => ["message" => "Error inserting comment: " . $conn->error]];
        }
        $stmtC->close();
    }
}

echo json_encode($response);
$conn->close();
?>
