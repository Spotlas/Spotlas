<?php
require './mariaDB.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // JSON-Daten aus dem Request lesen
    $data = json_decode(file_get_contents('php://input'), true);

    // Beispielhaft: Felder aus dem JSON auslesen und escapen
    $name           = $conn->real_escape_string($data['name']);
    $description    = $conn->real_escape_string($data['description']);
    $category_id    = intval($data['category_id']);
    $latitude       = floatval($data['latitude']);
    $longitude      = floatval($data['longitude']);
    $address        = $conn->real_escape_string($data['address']);
    $price_range    = $conn->real_escape_string($data['price_range']);
    $opening_hours  = $conn->real_escape_string($data['opening_hours']);
    $season         = $conn->real_escape_string($data['season']);
    $accessibility  = (isset($data['accessibility']) && $data['accessibility'] == true) ? 1 : 0;
    $website_url    = $conn->real_escape_string($data['website_url']);
    $special_features = $conn->real_escape_string($data['special_features']);
    $created_by     = intval($data['created_by']);
    // Status-ID (hier ggf. default auf 1 setzen)
    $status_id      = isset($data['status_id']) ? intval($data['status_id']) : 1;

    $sql = "INSERT INTO Locations 
            (name, description, category_id, latitude, longitude, address, price_range, opening_hours, season, accessibility, website_url, special_features, created_by, status_id)
            VALUES 
            ('$name', '$description', $category_id, $latitude, $longitude, '$address', '$price_range', '$opening_hours', '$season', $accessibility, '$website_url', '$special_features', $created_by, $status_id)";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("code" => 200, "message" => "Location successfully added"));
    } else {
        echo json_encode(array("code" => 500, "message" => "Error: " . $conn->error));
    }
} else {
    echo json_encode(array("code" => 405, "message" => "Method not allowed"));
}

$conn->close();
?>


