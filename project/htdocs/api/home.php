<?php
require './mariaDB.php';

header('Content-Type: application/json');

$locations = [];

// Falls per GET ein bestimmter Parameter gesetzt ist, wird nur dieser Query ausgeführt.
// Suche per ID:
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = intval($_GET['id']);
    $sql = "SELECT * FROM Locations WHERE id = $id";
}

// Suche per Name:
elseif (isset($_GET['search']) && !empty($_GET['search'])) {
    $search = $conn->real_escape_string($_GET['search']);
    $sql = "SELECT * FROM Locations WHERE lower(name) LIKE '%$search%'";
}

// Suche per Kategorie:
elseif (isset($_GET['category']) && !empty($_GET['category'])) {
    $category = $conn->real_escape_string($_GET['category']);
    $sql = "SELECT L.* FROM Locations L JOIN Categories C ON L.category_id = C.id WHERE C.name = '$category'";
}

// Standard: Alle Locations abrufen
else {
    $sql = "SELECT * FROM Locations";
}

// Falls eine Abfrage definiert wurde, ausführen
if (isset($sql)) {
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $locations[] = $row;
        }
    }
}

// Falls nach Profilbild gesucht wird
if (isset($_GET['profile_picture']) && is_numeric($_GET['profile_picture'])) {
    $userId = intval($_GET['profile_picture']);
    $sql = "SELECT profile_picture_url FROM Users WHERE id = $userId";
    $result = $conn->query($sql);
    $profile_picture = null;
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $profile_picture = $row['profile_picture_url'];
    }
    echo json_encode(["code" => 200, "profile_picture" => $profile_picture]);
    $conn->close();
    exit();
}

// JSON-Antwort senden (nur einmal!)
echo json_encode(["code" => 200, "locations" => $locations]);

$conn->close();
exit();
