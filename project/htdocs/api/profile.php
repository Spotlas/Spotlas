<?php
require './mariaDB.php';

header('Content-Type: application/json');

$response = array(
    "code"    => 404,
    "profile" => null,
    "locations" => []
);

if (isset($_GET['userId']) && is_numeric($_GET['userId'])) {
    $userId = intval($_GET['userId']);
    
    // Profilinformationen aus der Users-Tabelle abrufen
    $sqlProfile = "SELECT * FROM Users WHERE id = $userId";
    $resultProfile = $conn->query($sqlProfile);
    if ($resultProfile && $resultProfile->num_rows > 0) {
        $response['profile'] = $resultProfile->fetch_assoc();
        $response['code'] = 200;
    }
    
    // Locations abrufen, die vom Nutzer erstellt wurden 
    $sqlLocations = "SELECT * FROM Locations WHERE created_by = $userId";
    $resultLocations = $conn->query($sqlLocations);
    if ($resultLocations && $resultLocations->num_rows > 0) {
        while ($row = $resultLocations->fetch_assoc()) {
            $response['locations'][] = $row;
        }
        $response['code'] = 200;
    }
}

else if (isset($_GET['action']) && $_GET['action'] === 'delete' 
             && isset($_GET['userId']) && is_numeric($_GET['userId'])
             && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $delId = intval($_GET['userId']);
        // Optional: cascade delete (Kommentare, Ratings, Favorites …) via FK-Constraints
        $sqlDel = "DELETE FROM Users WHERE id = $delId";
        if ($conn->query($sqlDel) === TRUE) {
            $response = [
                "code"    => 200,
                "message" => "Account deleted successfully"
            ];
        } else {
            $response = [
                "code"    => 500,
                "message" => "Error deleting account: " . $conn->error
            ];
        }
        echo json_encode($response);
        $conn->close();
        exit();
}

// Nutzerprofil per Username abrufen
else if (isset($_GET['username']) && !empty($_GET['username'])) {
    $uname = $conn->real_escape_string($_GET['username']);
    
    // Profilinformationen abrufen
    $sqlProfile = "SELECT * FROM Users WHERE username = ? LIMIT 1";
    $stmtProfile = $conn->prepare($sqlProfile);
    $stmtProfile->bind_param("s", $uname);
    $stmtProfile->execute();
    $resultProfile = $stmtProfile->get_result();
    
    if ($resultProfile && $resultProfile->num_rows > 0) {
        $user = $resultProfile->fetch_assoc();
        $response['profile'] = $user;
        $response['code'] = 200;
        // Locations des Nutzers abrufen
        $sqlLocations = "SELECT * FROM Locations WHERE created_by = ?";
        $stmtLoc = $conn->prepare($sqlLocations);
        $stmtLoc->bind_param("i", $user['id']);
        $stmtLoc->execute();
        $resultLoc = $stmtLoc->get_result();
        while ($row = $resultLoc->fetch_assoc()) {
            $response['locations'][] = $row;
        }
        $stmtLoc->close();
    } else {
        $response['message'] = 'User not found';
    }
    $stmtProfile->close();
    echo json_encode($response);
    $conn->close();
    exit();
}

echo json_encode($response);
$conn->close();
?>

