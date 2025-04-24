<?php
require './mariaDB.php';

header('Content-Type: application/json');

$locations = [];

// Falls per GET ein bestimmter Parameter gesetzt ist, wird nur dieser Query ausgeführt.
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = intval($_GET['id']);
    $stmt = $conn->prepare("SELECT * FROM Locations WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
}
elseif (isset($_GET['search']) && !empty($_GET['search'])) {
    $search = mb_strtolower(trim($_GET['search']));
    $like = "%{$search}%";
    $stmt = $conn->prepare("SELECT * FROM Locations WHERE LOWER(name) LIKE ?");
    $stmt->bind_param("s", $like);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
}
elseif (isset($_GET['category']) && !empty($_GET['category'])) {
    $category = trim($_GET['category']);
    $stmt = $conn->prepare("
        SELECT L.* 
        FROM Locations L 
        JOIN Categories C ON L.category_id = C.id 
        WHERE C.name = ?
    ");
    $stmt->bind_param("s", $category);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
}
else {
    // Standard: Alle Locations abrufen
    $result = $conn->query("SELECT * FROM Locations");
}

// Falls eine Abfrage definiert wurde, ausführen und Locations sammeln
if (isset($result) && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $locations[] = $row;
    }
}

// Falls nach Profilbild gesucht wird
if (isset($_GET['profile_picture']) && is_numeric($_GET['profile_picture'])) {
    $userId = intval($_GET['profile_picture']);
    $stmt = $conn->prepare("SELECT profile_picture_url FROM Users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    $profile_picture = $row['profile_picture_url'] ?? null;
    echo json_encode(["code" => 200, "profile_picture" => $profile_picture]);
    $conn->close();
    exit();
}

// JSON-Antwort senden
echo json_encode(["code" => 200, "locations" => $locations]);

$conn->close();
exit();
?>
