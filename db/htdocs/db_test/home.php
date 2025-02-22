<?php
require './mariaDB.php';

header('Content-Type: application/json');

$locations = [];

// Falls per GET ein bestimmter Parameter gesetzt ist, wird der jeweilige Query ausgeführt.
// Suche per ID:
if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = intval($_GET['id']);
    $sql = "SELECT * FROM Locations WHERE id = $id";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $locations[] = $row;
        }
    }
    echo json_encode(array("code" => 200, "locations" => $locations));
    $conn->close();
    exit();
}

// Suche per Name:
if (isset($_GET['search']) && !empty($_GET['search'])) {
    $search = $conn->real_escape_string($_GET['search']);
    $sql = "SELECT * FROM Locations WHERE name LIKE '%$search%'";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $locations[] = $row;
        }
    }
    echo json_encode(array("code" => 200, "locations" => $locations));
    $conn->close();
    exit();
}

// Suche per Kategorie (hier wird angenommen, dass als Parameter der Kategoriename übergeben wird):
if (isset($_GET['category']) && !empty($_GET['category'])) {
    $category = $conn->real_escape_string($_GET['category']);
    $sql = "SELECT L.* FROM Locations L JOIN Categories C ON L.category_id = C.id WHERE C.name = '$category'";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $locations[] = $row;
        }
    }
    echo json_encode(array("code" => 200, "locations" => $locations));
    $conn->close();
    exit();
}

// Profilbild abrufen (Parameter: profile_picture als userId)
if (isset($_GET['profile_picture']) && is_numeric($_GET['profile_picture'])) {
    $userId = intval($_GET['profile_picture']);
    $sql = "SELECT profile_picture_url FROM Users WHERE id = $userId";
    $result = $conn->query($sql);
    $profile_picture = null;
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $profile_picture = $row['profile_picture_url'];
    }
    echo json_encode(array("code" => 200, "profile_picture" => $profile_picture));
    $conn->close();
    exit();
}

// Standard: Alle Locations abrufen (z.B. für die Karte)
$sql = "SELECT * FROM Locations";
$result = $conn->query($sql);
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $locations[] = $row;
    }
}
echo json_encode(array("code" => 200, "locations" => $locations));

$conn->close();
?>
