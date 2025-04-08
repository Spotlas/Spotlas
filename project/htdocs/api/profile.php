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

echo json_encode($response);
$conn->close();
?>

