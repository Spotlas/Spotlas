<?php
require_once '../../api/session.php';

// Prüfe, ob der Benutzer eingeloggt ist, sonst weiterleiten
if (!is_logged_in()) {
    header('Location: ../../pages/login_register/login.html?redirect=' . urlencode($_SERVER['REQUEST_URI']));
    exit;
}

// Wenn das Formular abgeschickt wurde (POST), verarbeite die Daten
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once '../../api/mariaDB.php';

    // Felder auslesen
    $name = $_POST['name'] ?? '';
    $latitude = $_POST['latitude'] ?? '';
    $longitude = $_POST['longitude'] ?? '';
    $address = $_POST['address'] ?? '';
    $description = $_POST['description'] ?? '';
    $category = $_POST['category'] ?? '';
    $opening_hours = $_POST['opening_hours'] ?? '';
    $season = $_POST['season'] ?? '';
    $price_range = $_POST['price_range'] ?? '';
    $accessibility = $_POST['accessibility'] ?? '';
    $website_url = $_POST['website_url'] ?? '';
    $special_features = $_POST['special_features'] ?? '';
    $comments = isset($_POST['comments']) ? 1 : 0;
    $created_by = $_SESSION['user_id'] ?? null;

    // Bild-Upload
    $image_url = null;
    if (isset($_FILES['fileToUpload']) && $_FILES['fileToUpload']['error'] === UPLOAD_ERR_OK) {
        $targetDir = "../../upload/";
        $uniqueName = uniqid() . "_" . basename($_FILES["fileToUpload"]["name"]);
        $targetFile = $targetDir . $uniqueName;
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFile)) {
            $image_url = "uploads/" . $uniqueName;
        }
    }

    $category_name = $category;
    $cat_stmt = $conn->prepare("SELECT id FROM Categories WHERE name = ?");
    $cat_stmt->bind_param("s", $category_name);
    $cat_stmt->execute();

    $category_id = null;  // Zielvariable
    $cat_stmt->bind_result($category_id);
    $cat_stmt->fetch();
    $cat_stmt->close();


    // Location speichern
    $stmt = $conn->prepare("INSERT INTO Locations (name, latitude, longitude, address, description, category_id, opening_hours, season, price_range, accessibility, website_url, special_features, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sddsssssssssi", $name, $latitude, $longitude, $address, $description, $category_id, $opening_hours, $season, $price_range, $accessibility, $website_url, $special_features, $created_by);
    if ($stmt->execute()) {
        $locationId = $conn->insert_id;
        $stmt->close();

        // Bildpfad in Images-Tabelle speichern
        if ($image_url) {
            $stmtImg = $conn->prepare("INSERT INTO Images (location_id, image_url, description) VALUES (?, ?, ?)");
            $imgDesc = "Main image";
            $stmtImg->bind_param("iss", $locationId, $image_url, $imgDesc);
            $stmtImg->execute();
            $stmtImg->close();
        }

        // Erfolgreich gespeichert, weiterleiten
        header('Location: ../../index.html?success=1');
        exit;
    } else {
        $error = "Fehler beim Speichern: " . $stmt->error;
        $stmt->close();
    }
}

// HTML anzeigen (inkl. Fehlerausgabe, falls vorhanden)
include 'add.html';
if (isset($error)) {
    echo "<script>alert('" . addslashes($error) . "');</script>";
}
