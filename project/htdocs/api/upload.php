<?php
require './mariaDB.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Felder aus dem JSON auslesen
    $name             = trim($data['name']);
    $description      = trim($data['description']);
    $category_id      = intval($data['category_id']);
    $latitude         = floatval($data['latitude']);
    $longitude        = floatval($data['longitude']);
    $address          = trim($data['address']);
    $price_range      = trim($data['price_range']);
    $opening_hours    = trim($data['opening_hours']);
    $season           = trim($data['season']);
    $accessibility    = isset($data['accessibility']) && $data['accessibility'] ? 1 : 0;
    $website_url      = trim($data['website_url']);
    $special_features = trim($data['special_features']);
    $created_by       = intval($data['created_by']);
    $status_id        = isset($data['status_id']) ? intval($data['status_id']) : 1;

    $stmt = $conn->prepare("
        INSERT INTO Locations
          (name, description, category_id, latitude, longitude, address,
           price_range, opening_hours, season, accessibility,
           website_url, special_features, created_by, status_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        "ssiddssssissii",
        $name,
        $description,
        $category_id,
        $latitude,
        $longitude,
        $address,
        $price_range,
        $opening_hours,
        $season,
        $accessibility,
        $website_url,
        $special_features,
        $created_by,
        $status_id
    );

    if ($stmt->execute()) {
        echo json_encode(["code" => 200, "message" => "Location successfully added"]);
    } else {
        echo json_encode(["code" => 500, "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["code" => 405, "message" => "Method not allowed"]);
}

$conn->close();
?>
